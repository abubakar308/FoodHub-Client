"use client";

import { useState } from "react";
import { generateMealContent, GenerateMealContentRequest } from "@/services/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles, Copy, Check, Loader2, Wand2, ArrowRight } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is available based on project patterns

export default function AIContentGeneratorPage() {
  const [formData, setFormData] = useState<GenerateMealContentRequest>({
    title: "",
    category: "",
    ingredients: "",
  });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{
    shortDescription?: string;
    description?: string;
    tags?: string[];
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
        toast.error("Please fill in Title and Category at least.");
        return;
    }
    setLoading(true);
    setGenerated(null);

    try {
      const res = await generateMealContent(formData);
      if (res.success) {
        let data = res.data;
        // The backend might return a JSON string OR a structured object
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch {
                // Handle plain text fallback if parsing fails
                data = { description: data };
            }
        }
        setGenerated(data);
        toast.success("AI content generated successfully!");
      } else {
        toast.error(res.message || "Failed to generate content.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">AI Content Creator</h1>
        <p className="text-muted-foreground font-medium">Generate professional descriptions and tags for your meals instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Form Section */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-[32px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-500" />
              Meal Details
            </CardTitle>
            <CardDescription>Provide basic info to help the AI understand your meal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Meal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Spicy Grilled Chicken Burger"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Fast Food / Burgers"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients" className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Key Ingredients (comma separated)</Label>
                <Textarea
                  id="ingredients"
                  placeholder="e.g. Chicken breast, Brioche bun, Secret sauce, Lettuce, Swiss cheese..."
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="min-h-[120px] rounded-xl bg-muted/30 border-border/50 focus:ring-amber-500/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl font-bold text-lg bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all text-white"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>
                    Generate Premium Content
                    <Sparkles className="w-5 h-5 ml-2 fill-white" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
            {!generated && !loading && (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/50 rounded-[32px] bg-muted/5 opacity-60">
                    <div className="p-5 rounded-3xl bg-muted text-muted-foreground mb-4">
                        <Bot className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold">Waiting for Magic...</h3>
                    <p className="text-sm text-muted-foreground mt-1">Fill the form and click generate to see AI magic happen.</p>
                </div>
            )}

            {loading && (
                <Card className="border-border/50 bg-card/60 rounded-[32px] animate-pulse">
                    <CardHeader>
                        <div className="h-8 w-1/2 bg-muted rounded-lg" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="h-4 w-1/4 bg-muted rounded" />
                            <div className="h-20 w-full bg-muted rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-1/4 bg-muted rounded" />
                            <div className="h-32 w-full bg-muted rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {generated && !loading && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    {/* Short Description */}
                    <Card className="border-border/50 bg-card/60 rounded-3xl overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Short Description</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(generated.shortDescription || "", "Short Description")}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10 hover:text-amber-500"
                            >
                                {copiedField === "Short Description" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4 pb-4">
                            <p className="text-sm font-semibold leading-relaxed">{generated.shortDescription || "No short description generated."}</p>
                        </CardContent>
                    </Card>

                    {/* Long Description */}
                    <Card className="border-border/50 bg-card/60 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Full Description</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(generated.description || "", "Full Description")}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10 hover:text-amber-500"
                            >
                                {copiedField === "Full Description" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4 pb-4">
                            <p className="text-sm text-foreground/80 leading-7 font-medium whitespace-pre-wrap">{generated.description}</p>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {generated.tags && generated.tags.length > 0 && (
                        <Card className="border-border/50 bg-card/60 rounded-3xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10">
                                <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Smart Tags</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(generated.tags?.join(", ") || "", "Tags")}
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10 hover:text-amber-500"
                                >
                                    {copiedField === "Tags" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4 pb-4 flex flex-wrap gap-2">
                                {generated.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-500/20">
                                        #{tag}
                                    </span>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
