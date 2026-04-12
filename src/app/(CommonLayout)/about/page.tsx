import { Users, UtensilsCrossed, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16">

            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
                    About <span className="text-primary">QuickPlatter</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    A modern food ordering platform connecting customers with trusted
                    local providers — fast, reliable, and built for real-world use.
                </p>
            </div>

            {/* Intro */}
            <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        What is QuickPlatter?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        QuickPlatter is a full-stack meal ordering platform where customers
                        can explore meals from different providers, place orders, and track
                        deliveries in real-time.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        It is designed to give local food providers a digital presence while
                        making food ordering simple and efficient for customers.
                    </p>
                </div>

                <div className="rounded-3xl bg-muted/40 p-8 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                        Core Idea
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        One platform where customers, providers, and admins work together in
                        a structured system — ensuring smooth food ordering and delivery
                        experience.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                    Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    Our mission is to empower local food providers with a digital platform
                    and give customers a reliable way to discover and enjoy quality meals.
                </p>
            </div>

            {/* Features */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                    Platform Features
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Explore Meals",
                            desc: "Browse meals by category, price, and ratings from multiple providers.",
                            icon: <UtensilsCrossed size={28} />,
                        },
                        {
                            title: "Order Tracking",
                            desc: "Track your order status from preparation to delivery in real-time.",
                            icon: <ShieldCheck size={28} />,
                        },
                        {
                            title: "Multi-role System",
                            desc: "Customers, providers, and admins all have dedicated dashboards.",
                            icon: <Users size={28} />,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl border border-border bg-card hover:shadow-xl transition-all"
                        >
                            <div className="mb-4 text-primary">{item.icon}</div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roles */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                    User Roles
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Customer",
                            desc: "Browse meals, place orders, track deliveries, and leave reviews.",
                        },
                        {
                            title: "Provider",
                            desc: "Manage menu, handle orders, and update delivery status.",
                        },
                        {
                            title: "Admin",
                            desc: "Control platform activity, manage users, and ensure system integrity.",
                        },
                    ].map((role, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl border border-border bg-muted/40"
                        >
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                {role.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {role.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-primary/10 border border-primary/20 p-10 rounded-3xl">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                    Ready to explore meals?
                </h2>
                <p className="text-muted-foreground mb-6">
                    Discover fresh meals from trusted providers near you.
                </p>
                <Link
                    href="/meals"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
                >
                    Browse Meals
                </Link>
            </div>
        </section>
    );
}