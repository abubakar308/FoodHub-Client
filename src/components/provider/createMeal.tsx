"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Utensils, 
  Image as ImageIcon, 
  ArrowLeft, 
  Loader2, 
  Banknote, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMeal} from "@/services/meal";
import Image from "next/image";
import { getCategories } from "@/services/categories";

export default function CreateMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (err: any) {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !price || !categoryId || !description || !imageFile) {
      toast.error("Please fill all fields, including an image");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("price", price.toString());
      payload.append("categoryId", categoryId);
      payload.append("description", description.trim());
      payload.append("imageUrl", imageFile);

      await createMeal(payload);

      toast.success("Meal created successfully 🎉");
      router.push("/dashboard/manage-menu"); 
    } catch (err: any) {
      toast.error(err.message || "Failed to create meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Button & Title */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Menu</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Add New Dish</h1>
              <p className="text-slate-500 text-sm mt-1">
                Fill in the details to add a new masterpiece to your menu.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Utensils size={16} className="text-green-600" /> Meal Title
                </label>
                <Input
                  className="rounded-xl border-slate-200 py-6 focus-visible:ring-green-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spicy Grilled Chicken"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Banknote size={16} className="text-green-600" /> Price (৳)
                  </label>
                  <Input
                    className="rounded-xl border-slate-200 py-6 focus-visible:ring-green-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                    type="number"
                    placeholder="250"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Layers size={16} className="text-green-600" /> Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat?.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <Textarea
                  className="rounded-xl border-slate-200 focus-visible:ring-green-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the taste, ingredients, and portion size..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} className="text-green-600" /> Meal Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl px-8 py-6 font-bold shadow-lg shadow-green-100 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> Saving...
                    </span>
                  ) : "Publish Meal"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview</h2>
            <div className="rounded-[24px] border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon size={48} strokeWidth={1} />
                    <p className="text-xs mt-2">Image Preview</p>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 truncate">
                    {title || "Meal Title"}
                  </h3>
                  <p className="text-green-600 font-bold">৳{price || "0"}</p>
                </div>
                <p className="text-slate-500 text-xs line-clamp-2 h-8">
                  {description || "Your delicious meal description will appear here..."}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                💡 <b>Pro Tip:</b> High-quality images (1200x800px) increase your chances of getting more orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}