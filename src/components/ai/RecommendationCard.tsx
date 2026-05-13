"use client";

import { useState } from "react";
import { recommendMeals } from "@/services/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Utensils, Zap, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestionChips = [
  "Healthy meals",
  "Spicy chicken",
  "Budget meals",
  "Fast food under 500",
];

export default function RecommendationCard() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await recommendMeals(query);
      if (res.success) {
        setResult(res.data.reply);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-[32px] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="w-5 h-5 fill-amber-500" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">AI Meal Recommendations</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground font-medium">
          Tell us what you're craving and our AI will suggest the best meals for you.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative group">
          <Input
            placeholder="What kind of food do you want?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRecommend(prompt)}
            className="h-14 pl-12 pr-4 rounded-2xl bg-muted/30 border-border/50 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setPrompt(chip);
                handleRecommend(chip);
              }}
              className="px-4 py-2 rounded-full border border-border bg-background hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all text-sm font-semibold text-muted-foreground"
            >
              {chip}
            </button>
          ))}
        </div>

        <Button
          onClick={() => handleRecommend(prompt)}
          disabled={loading || !prompt.trim()}
          className="w-full h-14 rounded-2xl font-bold text-lg bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Recommendations"}
        </Button>

        {loading && (
          <div className="p-6 rounded-2xl border border-dashed border-border bg-muted/20 animate-pulse space-y-3">
            <div className="h-4 w-3/4 bg-border/50 rounded" />
            <div className="h-4 w-1/2 bg-border/50 rounded" />
          </div>
        )}

        {result && !loading && (
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3 h-3" />
              AI Recommendation
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed font-medium">
              {result}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold flex items-center gap-2">
             <span>⚠️ {error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
