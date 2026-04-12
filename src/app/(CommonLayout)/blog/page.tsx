export default function BlogPage() {
    const blogs = [
        {
            title: "How Order Tracking Improves Experience",
            content:
                "Real-time tracking improves trust and satisfaction for customers.",
        },
        {
            title: "Why Reviews Matter",
            content:
                "Reviews help customers choose better and improve providers.",
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-extrabold mb-10">Blog</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {blogs.map((blog, i) => (
                    <div key={i} className="p-6 border bg-card rounded-2xl">
                        <h2 className="text-xl font-bold">{blog.title}</h2>
                        <p className="text-muted-foreground mt-2">{blog.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}