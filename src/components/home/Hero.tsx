import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div>
             {/* HERO */}
      <section className="container mx-auto px-4 pt-24 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Fresh meals from local providers, delivered fast 🍽️
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover homemade and restaurant meals near you. Order easily and enjoy quality food anytime.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button asChild>
            <Link href="/meals">Browse Meals</Link>
          </Button>
        </div>
      </section>
        </div>
    );
};

export default Hero;