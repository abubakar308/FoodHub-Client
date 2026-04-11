"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ChevronRight,
  PlayCircle,
  Star,
  ArrowDown,
  MapPin,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1600",
];

const stats = [
  { label: "Categories", value: "50+" },
  { label: "Providers", value: "120+" },
  { label: "Avg Delivery", value: "15m" },
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
    <section className="relative min-h-[68vh] w-full overflow-hidden bg-slate-950">
      {/* Background slideshow */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === index ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
        >
          <img
            src={img}
            alt={`Food banner ${i + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Decorative glow */}
      <div className="absolute left-[-120px] top-[15%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[8%] h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left content */}
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Trusted by 5,000+ food lovers across the city
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Fresh meals,
              <span className="block text-primary">fast delivery,</span>
              right to your doorstep.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg md:text-xl">
              Discover handcrafted dishes from trusted local kitchens and top
              providers. Order in minutes, track with ease, and enjoy
              restaurant-quality food from the comfort of home.
            </p>

            {/* Trust points */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Citywide delivery
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <Clock3 className="h-4 w-4 text-primary" />
                Fast order tracking
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verified providers
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full px-8 text-base font-bold shadow-lg"
              >
                <Link href="/meals" className="flex items-center gap-2">
                  Explore Meals
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-white/25 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md hover:bg-white hover:text-slate-900"
              >
                <Link href="/register" className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Become a Provider
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right floating card */}
          <div className="hidden justify-end lg:flex">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="overflow-hidden rounded-[22px] border border-white/10">
                <img
                  src={images[index]}
                  alt="Featured meal preview"
                  className="h-[260px] w-full object-cover"
                />
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Featured Today
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Taste that feels premium
                    </h3>
                  </div>
                  <div className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    Live Now
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-200">
                  Curated dishes, trusted kitchens, and a delivery experience
                  designed for speed, quality, and convenience.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-lg font-bold text-white">4.8/5</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Customer Rating
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-lg font-bold text-white">30 min</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Delivery Promise
                    </p>
                  </div>
                </div>

                <Button asChild className="h-12 w-full rounded-full font-semibold">
                  <Link href="/meals">Order Your Favorite Meal</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3 md:left-auto md:right-8 md:translate-x-0">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-10 bg-primary"
                : "w-5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-6 z-20 hidden items-center gap-2 text-sm text-white/75 md:flex">
        <ArrowDown className="h-4 w-4 animate-bounce" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;