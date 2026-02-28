"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // auto slide every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-520px w-full overflow-hidden">
      
      {/* Background Images */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt="Food Banner"
            className="h-full w-full object-cover"
          />

          {/* dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
        <div className="max-w-3xl text-white space-y-6">

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Fresh meals from local providers, delivered fast 🍽️
          </h1>

          <p className="text-lg md:text-xl text-white/90">
            Discover homemade and restaurant meals near you.  
            Order easily and enjoy quality food anytime.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/meals">Browse Meals</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="bg-white/90 hover:bg-white">
              <Link href="/register">Join as Provider</Link>
            </Button>
          </div>

        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-8 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;