"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most deliveries take 20–30 minutes depending on your location.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, you can track your order in real-time from your dashboard.",
  },
  {
    q: "Are meals fresh?",
    a: "All meals are freshly prepared by verified providers.",
  },
  {
    q: "How can I become a provider?",
    a: "Register as a provider and submit your details for approval.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl bg-card"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-semibold text-card-foreground">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>

              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}