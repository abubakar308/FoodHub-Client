"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithAI, recommendMeals, ChatMessage } from "@/services/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Sparkles, Trash2, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Recommend meals", icon: <Utensils className="w-3 h-3" />, prompt: "Recommend some delicious meals for me!" },
  { label: "Healthy options", icon: <Sparkles className="w-3 h-3" />, prompt: "Show me some healthy meal options." },
];

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!overrideInput) setInput("");
    setLoading(true);

    try {
      let res;
      // If it's a recommendation request, we can use the specialized service
      if (textToSend.toLowerCase().includes("recommend")) {
        res = await recommendMeals(textToSend);
      } else {
        res = await chatWithAI(newMessages);
      }

      if (res.success) {
        // Backend returns the string directly in res.data
        const aiReply = typeof res.data === "string" ? res.data : (res.data?.reply || JSON.stringify(res.data));
        setMessages([...newMessages, { role: "assistant", content: aiReply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠️ Sorry, I encountered an error: " + res.message }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Something went wrong. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col flex-1 border-none bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500 shadow-sm" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight leading-tight">FoodHub AI</h3>
            <div className="flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/80">Always Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors rounded-full"
                title="Clear Chat"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-6">
            <div className="relative">
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-xl">
                    <Sparkles className="w-12 h-12 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 bg-background rounded-full border border-border/50 shadow-lg">
                    <Bot className="w-4 h-4 text-primary" />
                </div>
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight">Your AI Foodie Friend</h4>
              <p className="text-muted-foreground text-sm max-w-[260px] mt-2 mx-auto font-medium">
                I can recommend meals, check calories, or help you find the best deals!
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                {QUICK_ACTIONS.map((action, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(action.prompt)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/50 bg-card/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-sm font-bold text-left group"
                    >
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white transition-colors">
                            {action.icon}
                        </span>
                        {action.label}
                    </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 max-w-[90%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                    "flex-shrink-0 p-2 rounded-xl shadow-sm mt-1",
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}>
                    {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div
                  className={cn(
                    "relative px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-semibold shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border/50 text-foreground rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 mr-auto max-w-[85%]">
                <div className="flex-shrink-0 p-2 rounded-xl bg-muted text-foreground shadow-sm">
                    <Bot className="w-3 h-3" />
                </div>
                <div className="bg-muted/30 border border-border/30 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 bg-muted/10 border-t border-border/50">
        <div className="flex gap-2 relative group">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="h-12 rounded-2xl bg-card border-border/80 pr-12 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm shadow-inner"
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-primary hover:bg-primary-dark transition-all shadow-lg active:scale-90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3 font-bold opacity-60 uppercase tracking-widest">
            Powered by Gemini Turbo
        </p>
      </div>
    </div>
  );
}
