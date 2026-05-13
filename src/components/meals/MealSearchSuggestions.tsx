"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAISearchSuggestions, AISearchSuggestion } from "@/services/ai";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Sparkles, ArrowRight, Utensils, Store, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  defaultValue?: string;
  searchParams?: Record<string, string | number | undefined>;
}

export default function MealSearchSuggestions({ defaultValue = "", searchParams = {} }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<AISearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [skipNextFetch, setSkipNextFetch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // We want to keep all current filters except for the search term and page
  const otherParams = Object.entries(searchParams).filter(([key]) => key !== "searchTerm" && key !== "page");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipNextFetch) {
      setSkipNextFetch(false);
      return;
    }

    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getAISearchSuggestions(query);
        if (res.success && Array.isArray(res.data)) {
          setSuggestions(res.data);
          setOpen(res.data.length > 0);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: AISearchSuggestion) => {
    setQuery(item.text);
    setOpen(false);
    setSuggestions([]);
    setSkipNextFetch(true);

    if (item.type === "category") {
      router.push(`/meals?categoryId=${item.id}`);
    } else if (item.type === "provider") {
      router.push(`/providers/${item.id}`);
    } else {
      router.push(`/meals?searchTerm=${encodeURIComponent(item.text)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setOpen(false);
    setSuggestions([]);
    setSkipNextFetch(true);
  };

  return (
    <div className="relative w-full md:max-w-md" ref={dropdownRef}>
      <form
        method="GET"
        action="/meals"
        onSubmit={handleSubmit}
        className="flex gap-2 relative"
      >
        {otherParams.map(([key, value]) => (
          value !== undefined && <input key={key} type="hidden" name={key} value={String(value)} />
        ))}
        <div className="relative w-full group">
          <Input
            name="searchTerm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setOpen(suggestions.length > 0)}
            placeholder="Search meals)"
            className="w-full rounded-full border border-border bg-background px-12 py-6 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm group-hover:shadow-md transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          )}
        </div>
        <button
          type="submit"
          className="rounded-full px-6 py-2 bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          Search
        </button>
      </form>

      {/* Dropdown Suggestions */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5 px-4 py-2">
            Search Suggestions
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary/5 transition-all border-b border-border/50 last:border-0 group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted flex-shrink-0 border border-border/50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.text}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5">
                        {item.type === "meal" && <Utensils className="h-5 w-5 text-primary/40" />}
                        {item.type === "category" && <Tag className="h-5 w-5 text-primary/40" />}
                        {item.type === "provider" && <Store className="h-5 w-5 text-primary/40" />}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.text}
                    </p>
                    {item.subText && (
                      <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                        {item.subText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary/70 transition-colors">
                    {item.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Suggestion */}
      {open && suggestions.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 p-6 text-center bg-card border border-border rounded-2xl shadow-xl">
          <p className="text-sm text-muted-foreground font-medium">No smart suggestions found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
