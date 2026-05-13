"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  sortValue?: string;
}

export default function MealSort({ sortValue }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    
    params.set("page", "1"); // Reset to page 1 on sort change
    
    router.push(`/meals?${params.toString()}`);
  };

  return (
    <select
      name="sort"
      defaultValue={sortValue}
      onChange={handleSortChange}
      className="rounded-full border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
    >
      <option value="">Sort By</option>
      <option value="price_asc">Price Low → High</option>
      <option value="price_desc">Price High → Low</option>
      <option value="newest">Newest</option>
      <option value="rating_desc">Top Rated</option>
    </select>
  );
}
