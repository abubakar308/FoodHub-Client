"use client";

import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="bg-primary/10 py-16">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-3xl font-extrabold text-foreground mb-4">
                    Need Help or Have Questions?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Our support team is here to help you with orders, providers, or account issues.
                </p>

                <Link
                    href="/contact"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
                >
                    Contact Support
                </Link>
            </div>
        </section>
    );
}