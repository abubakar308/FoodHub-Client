"use client";

import { ShoppingCart, CookingPot, Truck } from "lucide-react";

const steps = [
  {
    icon: <ShoppingCart />,
    title: "Browse & Select",
    desc: "Explore meals and choose your favorite dishes from trusted providers.",
  },
  {
    icon: <CookingPot />,
    title: "Order & Prepare",
    desc: "Place your order and let providers prepare your meal fresh.",
  },
  {
    icon: <Truck />,
    title: "Fast Delivery",
    desc: "Get your food delivered quickly and enjoy it at your doorstep.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Simple steps to get your food delivered
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="group p-6 rounded-3xl border bg-card hover:shadow-lg transition">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {step.icon}
              </div>

              <h3 className="font-bold text-lg text-card-foreground">
                {step.title}
              </h3>

              <p className="mt-2 text-muted-foreground text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}