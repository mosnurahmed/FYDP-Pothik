import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PopularRoutes from "@/components/home/PopularRoutes";
import SearchBar from "@/components/search/SearchBar";

export default function RoutesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-950 py-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
          <div className="container-padded relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white">
              Every route, every operator —{" "}
              <span className="bg-gradient-to-r from-accent-300 to-brand-200 bg-clip-text text-transparent">
                in one place.
              </span>
            </h1>
            <p className="mt-3 text-brand-200 max-w-2xl">
              From Dhaka's morning express to the late-night sleeper to Cox's
              Bazar — find the trip that fits your day.
            </p>
            <div className="mt-8">
              <SearchBar variant="compact" />
            </div>
          </div>
        </section>
        <PopularRoutes />
      </main>
      <Footer />
    </>
  );
}
