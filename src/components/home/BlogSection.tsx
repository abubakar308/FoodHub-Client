import Link from "next/link";

const blogs = [
    {
        title: "How to Choose Healthier Meals",
        desc: "Tips to pick balanced meals when ordering online.",
    },
    {
        title: "What Makes a Good Food Provider?",
        desc: "Understand ratings and reviews.",
    },
    {
        title: "Improve Your Menu as Provider",
        desc: "Make your meals more attractive.",
    },
];

export default function BlogSection() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Latest Insights
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {blogs.map((blog, i) => (
                        <div key={i} className="p-6 bg-card border rounded-2xl">
                            <h3 className="font-bold text-lg">{blog.title}</h3>
                            <p className="text-muted-foreground text-sm mt-2">
                                {blog.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link href="/blog" className="text-primary font-semibold">
                        View All →
                    </Link>
                </div>
            </div>
        </section>
    );
}