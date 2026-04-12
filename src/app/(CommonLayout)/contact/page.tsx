"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message submitted (connect backend later)");
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground">
                    Contact Support
                </h1>
                <p className="text-muted-foreground mt-2">
                    Have a question? We're here to help.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        placeholder="Full Name"
                        className="input"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        placeholder="Email"
                        className="input"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        placeholder="Subject"
                        className="input"
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                    <textarea
                        placeholder="Message"
                        className="input h-32"
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />

                    <button className="w-full bg-primary text-white py-3 rounded-xl">
                        Send Message
                    </button>
                </form>

                {/* Info */}
                <div className="space-y-6">
                    <Info icon={<Phone />} text="+880 1234 567 890" />
                    <Info icon={<Mail />} text="support@quickplatter.com" />
                    <Info icon={<MapPin />} text="Dhaka, Bangladesh" />
                </div>
            </div>
        </section>
    );
}

function Info({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 p-4 bg-card border rounded-xl">
            <div className="text-primary">{icon}</div>
            <p className="text-muted-foreground">{text}</p>
        </div>
    );
}