"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createReview } from "@/services/order";

export default function ReviewModal({ mealId, mealTitle, onClose }: { mealId: string; mealTitle: string; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a rating");
    setLoading(true);
    try {
      const res = await createReview({ mealId, rating, comment });
      if (res.success) {
        toast.success("Review submitted! Thank you.");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review {mealTitle}</h2>
        
        {/* Star Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              className={`cursor-pointer transition ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder="Share your experience..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-green-500 h-32 resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl font-bold" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}