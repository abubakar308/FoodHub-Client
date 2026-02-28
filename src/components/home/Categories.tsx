import { getCategories } from "@/services/categories";


const Categories = async () => {


const { data, error } = await getCategories();
console.log(data.data)

    return (
        <div>
             {/* CATEGORIES */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8">Popular Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {data.data.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-border p-6 text-center font-medium hover:border-primary hover:text-primary transition cursor-pointer"
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>
        </div>
    );
};

export default Categories;