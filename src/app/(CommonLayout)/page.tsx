import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import Hero from "@/components/home/Hero";
import WhyFoodhub from "@/components/home/WhyFoodhub";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero should be full width */}
      <Hero />

      {/* Page container */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* spacing between sections */}
        <section className="py-12 sm:py-16">
          <Categories />
        </section>

        <section className="py-12 sm:py-16 border-t">
          <Featured />
        </section>

        <section className="py-12 sm:py-16 border-t">
          <WhyFoodhub />
        </section>

      </main>
    </div>
  );
}