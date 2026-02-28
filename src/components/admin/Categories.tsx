"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categories";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

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
    try {
      const category = await addCategory(newCategory);
      setCategories((prev) => [...prev, category]);
      setNewCategory("");
      toast.success("Category added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return toast.error("Enter a category name");
    try {
      const updated = await updateCategory(id, editingName);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      setEditingId(null);
      setEditingName("");
      toast.success("Category updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 p-10 text-lg">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>

      {/* Add new category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Add
        </button>
      </div>

      {/* Category list */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between bg-white p-3 rounded-xl shadow hover:shadow-lg transition"
          >
            {editingId === cat.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500 outline-none"
              />
            ) : (
              <p className="font-medium">{cat.name}</p>
            )}

            <div className="flex gap-2">
              {editingId === cat.id ? (
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditingName(cat.name);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg font-medium transition"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(cat.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}