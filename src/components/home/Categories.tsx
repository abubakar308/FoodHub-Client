"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/categories";

type Category = {
  id: string;
  name: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-10 text-lg">
        Loading categories...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 text-lg">{error}</p>
    );

  if (!categories.length)
    return (
      <p className="text-center text-gray-500 py-10 text-lg">
        No categories found.
      </p>
    );

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 text-center">
        Popular Categories
      </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
  {categories.map((cat) => (
    <div
      key={cat.id}
      className="flex items-center justify-center h-24 rounded-2xl border border-gray-200 p-4 text-center font-medium text-gray-800 
                 hover:border-green-600 hover:text-green-600 transition-shadow shadow-sm hover:shadow-lg cursor-pointer"
    >
      <span className="text-lg font-semibold">{cat.name}</span>
    </div>
  ))}
</div>
    </section>
  );
}