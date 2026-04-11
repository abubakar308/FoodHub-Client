"use client";

import {
  FaTruck,
  FaLeaf,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaTruck size={26} />,
      title: "Fast Delivery",
      description:
        "Get your meals delivered hot and fresh in record time, right to your doorstep.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "group-hover:border-primary/30",
    },
    {
      icon: <FaLeaf size={26} />,
      title: "Fresh Ingredients",
      description:
        "All meals are prepared using high-quality, fresh ingredients for the best taste.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500/30",
    },
    {
      icon: <FaStar size={26} />,
      title: "Top Rated Meals",
      description:
        "Highly rated dishes from customers who love our quality and consistency.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "group-hover:border-yellow-500/30",
    },
    {
      icon: <FaShieldAlt size={26} />,
      title: "Trusted Providers",
      description:
        "We work with verified restaurants and chefs to ensure quality and safety.",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "group-hover:border-rose-500/30",
    },
  ];

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Why Choose <span className="text-primary">Us?</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We combine technology with taste to deliver a seamless and delightful
            food experience from kitchen to doorstep.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative flex flex-col items-center text-center p-8 rounded-3xl border transition-all duration-300",
                "bg-card border-border hover:-translate-y-2 hover:shadow-xl",
                feature.borderColor
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl mb-6 transition-all duration-300",
                  feature.bgColor,
                  feature.color,
                  "group-hover:scale-110 group-hover:rotate-6"
                )}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-card-foreground mb-3 tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>

              {/* Bottom Accent */}
              <div
                className={cn(
                  "absolute bottom-0 h-1 w-0 rounded-full transition-all duration-300",
                  feature.color.replace("text", "bg"),
                  "group-hover:w-16"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;