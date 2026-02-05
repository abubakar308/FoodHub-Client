import Link from "next/link";

const Featured = () => {
    return (
        <div>
            {/* FEATURED MEALS */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Featured Meals</h2>
          <Link href="/meals" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border overflow-hidden hover:shadow-md transition"
            >
              <div className="h-40 bg-muted" />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold">Chicken Rice Bowl</h3>
                <p className="text-sm text-muted-foreground">
                  From Bakar Kitchen
                </p>
                <p className="font-semibold">$8.99</p>
              </div>
            </div>
          ))}

        </div>
      </section>
        </div>
    );
};

export default Featured;