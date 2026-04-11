
import MealCard from "@/components/meals/MealCard";
import { getCategories } from "@/services/categories";
import { getAllMeals } from "@/services/meal";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    searchTerm?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    isAvailable?: string;
    isFeatured?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [mealsRes, categories] = await Promise.all([
    getAllMeals({
      searchTerm: params.searchTerm,
      categoryId: params.categoryId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
      isAvailable: params.isAvailable,
      isFeatured: params.isFeatured,
      page,
      limit: 8,
    }),
    getCategories(),
  ]);


  const meals = mealsRes?.data?.data || [];
  const meta = mealsRes?.data?.meta;



  const buildUrl = (newParams: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();

    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    if (params.sort) query.set("sort", params.sort);
    if (params.isAvailable) query.set("isAvailable", params.isAvailable);
    if (params.isFeatured) query.set("isFeatured", params.isFeatured);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      } else {
        query.delete(key);
      }
    });

    return `/meals${query.toString() ? `?${query.toString()}` : ""}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Discover Meals 🍽️
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore meals from trusted providers
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        {/* Search */}
        <form method="GET" className="w-full md:max-w-md flex gap-2">
          <input
            name="searchTerm"
            defaultValue={params.searchTerm}
            placeholder="Search meals..."
            className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />

          {params.categoryId && (
            <input type="hidden" name="categoryId" value={params.categoryId} />
          )}
          {params.minPrice && (
            <input type="hidden" name="minPrice" value={params.minPrice} />
          )}
          {params.maxPrice && (
            <input type="hidden" name="maxPrice" value={params.maxPrice} />
          )}
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          {params.isAvailable && (
            <input type="hidden" name="isAvailable" value={params.isAvailable} />
          )}
          {params.isFeatured && (
            <input type="hidden" name="isFeatured" value={params.isFeatured} />
          )}

          <button
            type="submit"
            className="rounded-full px-5 py-3 bg-primary text-primary-foreground text-sm"
          >
            Search
          </button>
        </form>

        {/* Sort */}
        <form method="GET" className="flex gap-2">
          {params.searchTerm && (
            <input type="hidden" name="searchTerm" value={params.searchTerm} />
          )}
          {params.categoryId && (
            <input type="hidden" name="categoryId" value={params.categoryId} />
          )}
          {params.minPrice && (
            <input type="hidden" name="minPrice" value={params.minPrice} />
          )}
          {params.maxPrice && (
            <input type="hidden" name="maxPrice" value={params.maxPrice} />
          )}
          {params.isAvailable && (
            <input type="hidden" name="isAvailable" value={params.isAvailable} />
          )}
          {params.isFeatured && (
            <input type="hidden" name="isFeatured" value={params.isFeatured} />
          )}

          <select
            name="sort"
            defaultValue={params.sort}
            className="rounded-full border border-border bg-background px-4 py-3 text-sm"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price Low → High</option>
            <option value="price_desc">Price High → Low</option>
            <option value="newest">Newest</option>
            <option value="rating_desc">Top Rated</option>
          </select>

          <button
            type="submit"
            className="rounded-full px-4 py-3 bg-primary text-primary-foreground text-sm"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-6">
          {/* Category */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold mb-3 text-card-foreground">Category</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/meals"
                className={!params.categoryId ? "text-primary font-semibold" : "hover:text-primary"}
              >
                All
              </Link>

              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ categoryId: cat.id, page: 1 })}
                  className={
                    params.categoryId === cat.id
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold mb-3 text-card-foreground">Price Range</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link href={buildUrl({ minPrice: 0, maxPrice: 200, page: 1 })}>
                Under ৳200
              </Link>
              <Link href={buildUrl({ minPrice: 200, maxPrice: 500, page: 1 })}>
                ৳200 - ৳500
              </Link>
              <Link href={buildUrl({ minPrice: 500, maxPrice: undefined, page: 1 })}>
                Above ৳500
              </Link>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold mb-3 text-card-foreground">Availability</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link href={buildUrl({ isAvailable: "true", page: 1 })}>
                Available
              </Link>
              <Link href={buildUrl({ isFeatured: "true", page: 1 })}>
                Featured
              </Link>
            </div>
          </div>
        </aside>

        <div>
          {meals.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {meals.map((meal: any) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>

              <div className="mt-10 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: meta?.totalPage || 1 }).map((_, i) => (
                  <Link
                    key={i}
                    href={buildUrl({ page: i + 1 })}
                    className={`px-4 py-2 rounded-full border text-sm ${page === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border-border"
                      }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-lg font-semibold text-muted-foreground">
                No meals found
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}