import { PrismaClient, BusType, SeatStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

const ROUTES: Array<{
  fromCity: string;
  toCity: string;
  distanceKm: number;
  durationMinutes: number;
}> = [
  { fromCity: "Dhaka", toCity: "Sylhet", distanceKm: 240, durationMinutes: 360 },
  { fromCity: "Dhaka", toCity: "Chittagong", distanceKm: 250, durationMinutes: 360 },
  { fromCity: "Dhaka", toCity: "Cox's Bazar", distanceKm: 400, durationMinutes: 600 },
  { fromCity: "Dhaka", toCity: "Rajshahi", distanceKm: 270, durationMinutes: 300 },
  { fromCity: "Dhaka", toCity: "Khulna", distanceKm: 310, durationMinutes: 420 },
  { fromCity: "Chittagong", toCity: "Cox's Bazar", distanceKm: 150, durationMinutes: 240 },
];

const BUSES: Array<{
  busNumber: string;
  operator: string;
  type: BusType;
  totalSeats: number;
  amenities: string[];
  rating: number;
}> = [
  {
    busNumber: "GL-1101",
    operator: "Green Line Paribahan",
    type: "AC",
    totalSeats: 41,
    amenities: ["ac", "wifi", "charging", "water", "tv"],
    rating: 4.7,
  },
  {
    busNumber: "SH-2201",
    operator: "Shohag Paribahan",
    type: "AC",
    totalSeats: 41,
    amenities: ["ac", "charging", "water", "snacks"],
    rating: 4.5,
  },
  {
    busNumber: "HQ-3301",
    operator: "Hanif Enterprise",
    type: "NON_AC",
    totalSeats: 41,
    amenities: ["charging", "water"],
    rating: 4.2,
  },
  {
    busNumber: "EN-4401",
    operator: "Ena Transport",
    type: "AC",
    totalSeats: 41,
    amenities: ["ac", "wifi", "charging", "water", "tracking"],
    rating: 4.6,
  },
  {
    busNumber: "DR-5501",
    operator: "Desh Travels",
    type: "SLEEPER",
    totalSeats: 33,
    amenities: ["ac", "wifi", "charging", "blanket", "water", "snacks"],
    rating: 4.8,
  },
  {
    busNumber: "RB-6601",
    operator: "Royal Coach",
    type: "AC",
    totalSeats: 41,
    amenities: ["ac", "wifi", "charging", "tv", "water"],
    rating: 4.4,
  },
];

function buildSeatList(totalSeats: number) {
  const rows = Math.floor((totalSeats - 5) / 4);
  const list: string[] = [];
  for (let r = 1; r <= rows; r++) {
    list.push(`A${r}`, `B${r}`, `C${r}`, `D${r}`);
  }
  list.push("LB1", "LB2", "LB3", "LB4", "LB5");
  return list;
}

async function main() {
  console.log("🌱 Seeding…");

  // wipe
  await prisma.seat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();

  // demo users
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("password123", 10);
  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@pothik.bd",
        password: adminHash,
        role: "ADMIN",
      },
      {
        name: "Demo User",
        email: "demo@pothik.bd",
        password: userHash,
        role: "USER",
        phone: "01700000000",
      },
    ],
  });

  // routes
  const routes = await Promise.all(
    ROUTES.map((r) => prisma.route.create({ data: r }))
  );

  // buses
  const buses = await Promise.all(
    BUSES.map((b) => prisma.bus.create({ data: b }))
  );

  // schedules: for each route, generate 4-6 buses per day for next 7 days
  const departureSlots = [
    { h: 7, m: 0 },
    { h: 9, m: 30 },
    { h: 14, m: 0 },
    { h: 18, m: 30 },
    { h: 21, m: 0 },
    { h: 23, m: 30 },
  ];

  for (const route of routes) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(new Date(), day);

      // pick 4-6 buses for this route+date
      const dailyBuses = [...buses]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4 + Math.floor(Math.random() * 3));

      for (let i = 0; i < dailyBuses.length; i++) {
        const bus = dailyBuses[i];
        const slot = departureSlots[i % departureSlots.length];
        const departure = setMinutes(setHours(date, slot.h), slot.m);
        const arrival = new Date(
          departure.getTime() + route.durationMinutes * 60 * 1000
        );
        const basePrice =
          200 + Math.round(route.distanceKm * 2.5) +
          (bus.type === "SLEEPER" ? 400 : bus.type === "AC" ? 200 : 0);

        const schedule = await prisma.schedule.create({
          data: {
            routeId: route.id,
            busId: bus.id,
            departureTime: departure,
            arrivalTime: arrival,
            price: basePrice,
            availableSeats: bus.totalSeats,
          },
        });

        // create seats
        const seatNumbers = buildSeatList(bus.totalSeats);
        // make some randomly booked
        const bookedCount = Math.floor(seatNumbers.length * 0.25);
        const bookedSet = new Set<string>();
        while (bookedSet.size < bookedCount) {
          bookedSet.add(
            seatNumbers[Math.floor(Math.random() * seatNumbers.length)]
          );
        }

        await prisma.seat.createMany({
          data: seatNumbers.map((sn) => ({
            scheduleId: schedule.id,
            seatNumber: sn,
            status: bookedSet.has(sn)
              ? ("BOOKED" as SeatStatus)
              : ("AVAILABLE" as SeatStatus),
          })),
        });

        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { availableSeats: bus.totalSeats - bookedSet.size },
        });
      }
    }
  }

  console.log("✅ Seed complete");
  console.log("👤 Admin: admin@pothik.bd / admin123");
  console.log("👤 User : demo@pothik.bd  / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
