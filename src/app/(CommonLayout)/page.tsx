import BlogSection from "@/components/home/BlogSection";
import Categories from "@/components/home/Categories";
import ContactCTA from "@/components/home/ContactCTA";
import FAQSection from "@/components/home/FAQSection";
import Featured from "@/components/home/Featured";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import OffersSection from "@/components/home/OfferSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseUs from "@/components/home/WhyFoodhub";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero should be full width */}
      <Hero />





      {/* Page container */}
      <main className="w-full">
        <Categories />
        <Featured />
        <OffersSection />
        <WhyChooseUs />
        <HowItWorks />
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <ContactCTA />
      </main>
    </div>
  );
}