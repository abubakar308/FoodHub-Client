"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight, PlayCircle, Star } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-slate-900">
      
      {/* Background Slideshow */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === index ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        >
          <img
            src={img}
            alt="Food Banner"
            className="h-full w-full object-cover"
          />
          {/* Gradient Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to- from-black/80 via-black/40 to-transparent md:from-black/70 md:via-black/20" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-24 container mx-auto">
        <div className="max-w-3xl space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-sm font-medium animate-bounce-slow">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span>Trusted by 5000+ Foodies in Dhaka</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            Deliciousness <br /> 
            <span className="text-green-500">Delivered</span> at <br />
            Your Doorstep.
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-xl leading-relaxed">
            From local kitchens to your table. Experience fresh, homemade, and restaurant-quality meals with just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-900/20 transition-all hover:translate-y-[-2px]">
              <Link href="/meals" className="flex items-center gap-2">
                Order Now <ChevronRight size={20} />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black h-14 px-8 rounded-2xl text-lg font-bold transition-all">
              <Link href="/register" className="flex items-center gap-2">
                <PlayCircle size={20} /> Become a Provider
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 max-w-md">
            <div>
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-slate-400 uppercase font-black">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">120+</p>
              <p className="text-xs text-slate-400 uppercase font-black">Providers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">15m</p>
              <p className="text-xs text-slate-400 uppercase font-black">Avg Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Indicators */}
      <div className="absolute bottom-10 left-6 md:left-24 flex gap-3 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === index ? "w-12 bg-green-500" : "w-6 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;