import {
  PrismaClient,
  TourStatus,
  TourRegion,
  BusType,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

function dt(daysAhead: number, hour: number, minute = 0) {
  return setMinutes(setHours(addDays(new Date(), daysAhead), hour), minute);
}

async function main() {
  console.log("🌱 Seeding tour platform…");

  // wipe in order to respect FK
  await prisma.busAssignment.deleteMany();
  await prisma.tourBooking.deleteMany();
  await prisma.tourSpot.deleteMany();
  await prisma.pickupPoint.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Pothik Admin",
      email: "admin@pothik.bd",
      password: adminHash,
      role: "ADMIN",
      phone: "01700000001",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@pothik.bd",
      password: userHash,
      role: "USER",
      phone: "01700000002",
    },
  });

  // ── Bus fleet ─────────────────────────────────────────────
  await prisma.bus.createMany({
    data: [
      {
        busNumber: "PTK-101",
        operatorName: "Pothik Fleet",
        type: BusType.AC,
        totalSeats: 40,
        amenities: ["ac", "wifi", "charging", "water"],
        rating: 4.7,
      },
      {
        busNumber: "PTK-102",
        operatorName: "Pothik Fleet",
        type: BusType.AC,
        totalSeats: 36,
        amenities: ["ac", "charging", "water"],
        rating: 4.5,
      },
      {
        busNumber: "PTK-103",
        operatorName: "Pothik Fleet",
        type: BusType.MINIBUS,
        totalSeats: 22,
        amenities: ["ac", "water"],
        rating: 4.3,
      },
      {
        busNumber: "PTK-201",
        operatorName: "Pothik Fleet",
        type: BusType.SLEEPER,
        totalSeats: 30,
        amenities: ["ac", "wifi", "blanket", "snacks", "charging"],
        rating: 4.8,
      },
    ],
  });

  // ── Tour 1: Cox's Bazar Express (3-day multi-day) ─────────
  await prisma.tourPackage.create({
    data: {
      slug: "coxs-bazar-express",
      title: "Cox's Bazar Express",
      description:
        "Three days on Bangladesh's most iconic coast. Sea, sunset, fresh seafood and Marine Drive — all on one curated transport package. We handle the bus, you handle the memories.",
      highlights: [
        "AC bus from your nearest pickup",
        "All entry fees & sightseeing covered",
        "4 stops including Inani & Himchori",
        "Dedicated tour leader on board",
      ],
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
      ],
      region: TourRegion.COASTAL,
      destinationCity: "Cox's Bazar",
      durationDays: 3,
      departureDate: dt(10, 6, 0),
      returnDate: dt(12, 22, 0),
      adultPrice: 5500,
      childPrice: 3300,
      capacity: 40,
      minTravellers: 15,
      status: TourStatus.PUBLISHED,
      createdById: admin.id,
      spots: {
        create: [
          {
            name: "Sea Beach (sunset)",
            description: "Welcome arrival, golden hour at the world's longest natural beach.",
            image:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            dayNumber: 1,
            orderIndex: 0,
            startTime: "16:00",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Inani Beach",
            description: "Coral stones and turquoise water — the calmest beach in the country.",
            image:
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
            dayNumber: 2,
            orderIndex: 0,
            startTime: "09:00",
            stayMinutes: 180,
            entryFeeIncluded: true,
          },
          {
            name: "Himchori",
            description: "Hill-top viewpoint and waterfall, panoramic views of the bay.",
            dayNumber: 2,
            orderIndex: 1,
            startTime: "13:00",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Marine Drive",
            description: "The 80km coastal highway — one of the most scenic drives in Asia.",
            dayNumber: 2,
            orderIndex: 2,
            startTime: "16:00",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Maheshkhali Island",
            description: "Boat trip and the Adinath temple before heading home.",
            dayNumber: 3,
            orderIndex: 0,
            startTime: "09:00",
            stayMinutes: 180,
            entryFeeIncluded: true,
          },
        ],
      },
      pickupPoints: {
        create: [
          {
            name: "Gabtoli Bus Stand",
            city: "Dhaka",
            address: "Gabtoli, Mirpur",
            landmark: "Near Heritage counter",
            pickupTime: dt(10, 6, 0),
            returnTime: dt(12, 21, 30),
            orderIndex: 0,
          },
          {
            name: "Mohakhali Bus Terminal",
            city: "Dhaka",
            address: "Mohakhali",
            landmark: "Near Wireless gate",
            pickupTime: dt(10, 6, 30),
            returnTime: dt(12, 21, 0),
            orderIndex: 1,
          },
          {
            name: "Sayedabad Bus Counter",
            city: "Dhaka",
            address: "Sayedabad, Jatrabari",
            pickupTime: dt(10, 7, 0),
            returnTime: dt(12, 22, 30),
            orderIndex: 2,
          },
          {
            name: "Uttara Sector 7",
            city: "Dhaka",
            address: "Sector 7, Uttara",
            landmark: "Rajlokkhi complex",
            pickupTime: dt(10, 6, 15),
            returnTime: dt(12, 20, 30),
            orderIndex: 3,
          },
        ],
      },
    },
  });

  // ── Tour 2: Sajek Valley (3-day) ─────────────────────────
  await prisma.tourPackage.create({
    data: {
      slug: "sajek-valley-clouds",
      title: "Sajek Valley — Above the Clouds",
      description:
        "Wake up above the cloudline. Three days deep in the Chittagong Hill Tracts — Khagrachari waterfalls, the winding road to Sajek, and sunrise from Konglak hill.",
      highlights: [
        "AC bus to Khagrachari, then Chander Gari to Sajek",
        "Konglak hill sunrise included",
        "All sightseeing entry fees covered",
        "Guided by a local from the hills",
      ],
      coverImage:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=1600&q=80",
      ],
      region: TourRegion.HILL_TRACTS,
      destinationCity: "Sajek",
      durationDays: 3,
      departureDate: dt(15, 22, 0),
      returnDate: dt(17, 22, 0),
      adultPrice: 6800,
      childPrice: 4000,
      capacity: 30,
      minTravellers: 12,
      status: TourStatus.PUBLISHED,
      createdById: admin.id,
      spots: {
        create: [
          {
            name: "Alutila Cave",
            description: "Mysterious cave system on the way to Sajek.",
            dayNumber: 1,
            orderIndex: 0,
            startTime: "10:00",
            stayMinutes: 90,
            entryFeeIncluded: true,
          },
          {
            name: "Risang Waterfall",
            description: "Cool natural pool, perfect for a midday break.",
            dayNumber: 1,
            orderIndex: 1,
            startTime: "13:00",
            stayMinutes: 90,
            entryFeeIncluded: true,
          },
          {
            name: "Konglak Hill — sunrise",
            description: "The iconic 'above the clouds' viewpoint at dawn.",
            dayNumber: 2,
            orderIndex: 0,
            startTime: "05:00",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Ruilui Para village",
            description: "Walk the bamboo paths and meet the indigenous community.",
            dayNumber: 2,
            orderIndex: 1,
            startTime: "10:00",
            stayMinutes: 180,
            entryFeeIncluded: true,
          },
          {
            name: "Helipad sunset point",
            description: "Final sunset before the descent home.",
            dayNumber: 2,
            orderIndex: 2,
            startTime: "17:00",
            stayMinutes: 90,
            entryFeeIncluded: true,
          },
        ],
      },
      pickupPoints: {
        create: [
          {
            name: "Mohakhali Bus Terminal",
            city: "Dhaka",
            pickupTime: dt(15, 22, 0),
            returnTime: dt(17, 22, 0),
            orderIndex: 0,
          },
          {
            name: "Fakirapool Counter",
            city: "Dhaka",
            pickupTime: dt(15, 22, 30),
            returnTime: dt(17, 22, 30),
            orderIndex: 1,
          },
          {
            name: "Saidabad Express",
            city: "Dhaka",
            pickupTime: dt(15, 23, 0),
            returnTime: dt(17, 23, 0),
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // ── Tour 3: Sonargaon Day Trip ───────────────────────────
  await prisma.tourPackage.create({
    data: {
      slug: "sonargaon-heritage-day",
      title: "Sonargaon Heritage Day Trip",
      description:
        "A single curated day exploring the lost city of the Bengali sultans — Panam Nagar's haunting ruins, the Folk Art Museum, and a slow lunch on the banks of the Meghna.",
      highlights: [
        "Round-trip AC bus from Dhaka",
        "Panam Nagar walking tour with guide",
        "Folk Art & Crafts Museum entry",
        "Free time on the riverbank",
      ],
      coverImage:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
      ],
      region: TourRegion.HISTORIC,
      destinationCity: "Sonargaon",
      durationDays: 1,
      departureDate: dt(7, 7, 0),
      returnDate: dt(7, 21, 0),
      adultPrice: 1500,
      childPrice: 900,
      capacity: 30,
      minTravellers: 10,
      status: TourStatus.PUBLISHED,
      createdById: admin.id,
      spots: {
        create: [
          {
            name: "Panam Nagar",
            description: "Walk the ghost street of merchant mansions.",
            dayNumber: 1,
            orderIndex: 0,
            startTime: "10:00",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Folk Art & Crafts Museum",
            description: "Three centuries of Bengali everyday life.",
            dayNumber: 1,
            orderIndex: 1,
            startTime: "12:30",
            stayMinutes: 90,
            entryFeeIncluded: true,
          },
          {
            name: "Meghna Riverbank lunch",
            description: "Free time + curated lunch spot (food at your own cost).",
            dayNumber: 1,
            orderIndex: 2,
            startTime: "14:30",
            stayMinutes: 120,
            entryFeeIncluded: false,
          },
        ],
      },
      pickupPoints: {
        create: [
          {
            name: "Banani Office",
            city: "Dhaka",
            address: "Block B, Banani",
            landmark: "Pothik HQ",
            pickupTime: dt(7, 7, 0),
            returnTime: dt(7, 20, 30),
            orderIndex: 0,
          },
          {
            name: "Mohakhali Bus Terminal",
            city: "Dhaka",
            pickupTime: dt(7, 7, 20),
            returnTime: dt(7, 20, 50),
            orderIndex: 1,
          },
          {
            name: "Jatrabari Mor",
            city: "Dhaka",
            pickupTime: dt(7, 7, 45),
            returnTime: dt(7, 21, 15),
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // ── Tour 4: Sundarbans 2-day (multi-day Riverine) ────────
  await prisma.tourPackage.create({
    data: {
      slug: "sundarbans-mangrove-quest",
      title: "Sundarbans Mangrove Quest",
      description:
        "Two days on the largest mangrove forest on earth. Boat through the channels, watch for the elusive Bengal tiger, and stand where the river meets the Bay of Bengal.",
      highlights: [
        "AC bus to Khulna + boat for two days",
        "Forest department permit included",
        "Local naturalist guide on board",
        "Karamjal & Harbaria walking trails",
      ],
      coverImage:
        "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502780402662-acc01917cf95?auto=format&fit=crop&w=1600&q=80",
      ],
      region: TourRegion.RIVERINE,
      destinationCity: "Khulna",
      durationDays: 2,
      departureDate: dt(20, 22, 30),
      returnDate: dt(22, 22, 0),
      adultPrice: 4800,
      childPrice: 2900,
      capacity: 28,
      minTravellers: 12,
      status: TourStatus.PUBLISHED,
      createdById: admin.id,
      spots: {
        create: [
          {
            name: "Karamjal Wildlife Centre",
            description: "Crocodile breeding centre, deer enclosure, mangrove walk.",
            dayNumber: 1,
            orderIndex: 0,
            startTime: "08:00",
            stayMinutes: 180,
            entryFeeIncluded: true,
          },
          {
            name: "Harbaria forest trail",
            description: "Watchtower walk through pristine mangrove.",
            dayNumber: 1,
            orderIndex: 1,
            startTime: "13:00",
            stayMinutes: 180,
            entryFeeIncluded: true,
          },
          {
            name: "Kotka beach",
            description: "Where the forest meets the Bay of Bengal.",
            dayNumber: 2,
            orderIndex: 0,
            startTime: "07:00",
            stayMinutes: 240,
            entryFeeIncluded: true,
          },
        ],
      },
      pickupPoints: {
        create: [
          {
            name: "Gabtoli Bus Stand",
            city: "Dhaka",
            pickupTime: dt(20, 22, 30),
            returnTime: dt(22, 21, 30),
            orderIndex: 0,
          },
          {
            name: "Mohakhali Bus Terminal",
            city: "Dhaka",
            pickupTime: dt(20, 23, 0),
            returnTime: dt(22, 22, 0),
            orderIndex: 1,
          },
        ],
      },
    },
  });

  // ── Tour 5: Sylhet Tea Country Day Trip ──────────────────
  await prisma.tourPackage.create({
    data: {
      slug: "sylhet-tea-country",
      title: "Sylhet Tea Country Day Trip",
      description:
        "One long, beautiful day weaving through Srimangal's tea gardens. Lawachara rainforest, the seven-layer tea, and a quiet walk through the hills.",
      highlights: [
        "Round-trip AC bus from Dhaka",
        "Lawachara National Park entry included",
        "Stop at the Seven Layer Tea Cabin",
        "Tea garden walk with the foreman",
      ],
      coverImage:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1597306183091-a59f86ed4b9d?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?auto=format&fit=crop&w=1600&q=80",
      ],
      region: TourRegion.TEA_COUNTRY,
      destinationCity: "Srimangal",
      durationDays: 1,
      departureDate: dt(5, 5, 30),
      returnDate: dt(5, 23, 0),
      adultPrice: 2200,
      childPrice: 1300,
      capacity: 25,
      minTravellers: 10,
      status: TourStatus.PUBLISHED,
      createdById: admin.id,
      spots: {
        create: [
          {
            name: "Lawachara National Park",
            description: "Rainforest trail in search of the hoolock gibbon.",
            dayNumber: 1,
            orderIndex: 0,
            startTime: "10:30",
            stayMinutes: 120,
            entryFeeIncluded: true,
          },
          {
            name: "Tea garden walk",
            description: "Walk the rows with a tea-garden foreman.",
            dayNumber: 1,
            orderIndex: 1,
            startTime: "13:00",
            stayMinutes: 90,
            entryFeeIncluded: true,
          },
          {
            name: "Seven Layer Tea Cabin",
            description: "Try Romesh Ram Gour's famous seven-layer tea.",
            dayNumber: 1,
            orderIndex: 2,
            startTime: "15:00",
            stayMinutes: 60,
            entryFeeIncluded: false,
          },
        ],
      },
      pickupPoints: {
        create: [
          {
            name: "Banani Office",
            city: "Dhaka",
            pickupTime: dt(5, 5, 30),
            returnTime: dt(5, 22, 30),
            orderIndex: 0,
          },
          {
            name: "Mohakhali Bus Terminal",
            city: "Dhaka",
            pickupTime: dt(5, 6, 0),
            returnTime: dt(5, 23, 0),
            orderIndex: 1,
          },
        ],
      },
    },
  });

  console.log("✅ Seed complete");
  console.log("👤 Admin: admin@pothik.bd / admin123");
  console.log("👤 User : demo@pothik.bd  / password123");
  console.log("🚌 5 tours, 4 buses ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
