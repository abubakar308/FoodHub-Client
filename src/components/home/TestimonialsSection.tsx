"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
    id: string;
    rating: number;
    comment: string;
    isVisible: boolean;
    createdAt: string;
    userId: string;
    mealId: string;
    user: {
        id: string;
        name: string;
        avatar?: string | null;
    };
    meal: {
        id: string;
        title: string;
        imageUrl?: string | null;
    };
};

type TestimonialsResponse = {
    success: boolean;
    message?: string;
    data: Testimonial[];
};

const staticTestimonials: Testimonial[] = [
    {
        id: "1",
        rating: 5,
        comment: "Absolutely delicious and delivered fresh. One of the best ordering experiences I have had.",
        isVisible: true,
        createdAt: new Date().toISOString(),
        userId: "u1",
        mealId: "m1",
        user: {
            id: "u1",
            name: "Sarah Khan",
            avatar: null,
        },
        meal: {
            id: "m1",
            title: "Grilled Chicken Bowl",
            imageUrl: null,
        },
    },
    {
        id: "2",
        rating: 4,
        comment: "Fast delivery, great taste, and the packaging was really nice. Will order again.",
        isVisible: true,
        createdAt: new Date().toISOString(),
        userId: "u2",
        mealId: "m2",
        user: {
            id: "u2",
            name: "Rakib Hasan",
            avatar: null,
        },
        meal: {
            id: "m2",
            title: "Beef Burger Deluxe",
            imageUrl: null,
        },
    },
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
                    cache: "no-store",
                });

                const data: TestimonialsResponse = await res.json();

                const visibleTestimonials =
                    data?.data?.filter((item) => item.isVisible) || [];

                setTestimonials(
                    visibleTestimonials.length > 0
                        ? visibleTestimonials.slice(0, 6)
                        : staticTestimonials
                );
            } catch (error) {
                setTestimonials(staticTestimonials);
            } finally {
                setLoading(false);
            }
        };

        loadTestimonials();
    }, []);

    if (loading) {
        return (
            <section className="bg-muted/30 py-16 lg:py-24">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm font-medium text-muted-foreground">
                        Loading testimonials...
                    </p>
                </div>
            </section>
        );
    }

    if (!testimonials.length) return null;

    return (
        <section className="bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Customer Love
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                        What Our <span className="text-primary">Customers Say</span>
                    </h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                        Real feedback from customers who ordered their favorite meals from
                        trusted providers on our platform.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Top */}
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
                                        {item.user?.avatar ? (
                                            <Image
                                                src={item.user.avatar}
                                                alt={item.user.name || "User"}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                                                {(item.user?.name || "U").trim().charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-card-foreground">
                                            {(item.user?.name || "Anonymous").trim()}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Quote className="h-4 w-4" />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-4 flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={cn(
                                            "h-4 w-4",
                                            index < item.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="min-h-[88px] text-sm leading-7 text-muted-foreground">
                                “{item.comment}”
                            </p>

                            {/* Meal card */}
                            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3">
                                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted">
                                    {item.meal?.imageUrl ? (
                                        <Image
                                            src={item.meal.imageUrl}
                                            alt={item.meal.title}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                            Meal
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                                        Reviewed Meal
                                    </p>
                                    <h4 className="truncate text-sm font-semibold text-foreground">
                                        {item.meal?.title}
                                    </h4>
                                </div>
                            </div>

                            {/* Decorative blur */}
                            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}