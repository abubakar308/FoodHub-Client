"use client";

import { FaTruck, FaLeaf, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

const WhyFoodhub = () => {
  const features = [
    {
      icon: <FaTruck size={28} />,
      title: "Fast Delivery",
      description:
        "Get your meals delivered hot and fresh in record time, right to your doorstep.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "group-hover:border-green-200",
    },
    {
      icon: <FaLeaf size={28} />,
      title: "Fresh Ingredients",
      description:
        "All meals are made from high-quality, fresh ingredients for the perfect taste.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "group-hover:border-amber-200",
    },
    {
      icon: <FaStar size={28} />,
      title: "Trusted Providers",
      description:
        "We partner with verified restaurants and chefs to ensure top-notch quality.",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "group-hover:border-rose-200",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-20 lg:py-28">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Why Choose <span className="text-green-600">FoodHub?</span>
        </h2>
        <p className="text-slate-500 text-lg">
          We combine technology with taste to bring you the best dining experience at home.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "group relative flex flex-col items-center text-center p-10 bg-white rounded-[32px] border border-slate-100 transition-all duration-500",
              "hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2",
              feature.borderColor
            )}
          >
            {/* Icon Box */}
            <div
              className={cn(
                "w-20 h-20 flex items-center justify-center rounded-2xl mb-8 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110",
                feature.bgColor,
                feature.color
              )}
            >
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-extrabold text-slate-800 mb-4 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              {feature.description}
            </p>

            {/* Bottom Accent Line */}
            <div className={cn(
              "absolute bottom-0 h-1.5 w-0 group-hover:w-24 transition-all duration-500 rounded-t-full",
              feature.color.replace("text", "bg")
            )} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyFoodhub;