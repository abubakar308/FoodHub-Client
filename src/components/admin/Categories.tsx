"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCategories, addCategory } from "@/services/categories";
import { Plus, Tag, Layers, Loader2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false); // বাটন লোডিং স্টেট
  const [newCategory, setNewCategory] = useState("");

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.error("Enter a category name");
    
    setAdding(true);
    try {
      const category = await addCategory(newCategory);
      setCategories((prev) => [category, ...prev]); // নতুনটি সবার আগে দেখাবে
      setNewCategory("");
      toast.success("New category added successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="animate-spin text-green-600" size={32} />
        <p className="text-gray-500 font-medium">Loading categories...</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-green-100 p-2 rounded-lg text-green-600">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Categories</h1>
          <p className="text-sm text-gray-500">Add and view menu categories</p>
        </div>
      </div>

      {/* Add new category Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Plus size={16} /> Create New Category
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Italian, Fast Food, Desi..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
          >
            {adding ? <Loader2 className="animate-spin" size={18} /> : "Add"}
          </button>
        </div>
      </div>

      {/* Category List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            Existing Categories <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{categories.length}</span>
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Tag className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-500">No categories found. Add one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                  <Tag size={16} />
                </div>
                <p className="font-semibold text-gray-700">{cat.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}