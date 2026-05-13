"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBox from "./ChatBox";
import { cn } from "@/lib/utils";

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after a delay to grab attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-4 pointer-events-none">
      {/* Chat Window */}
      <div
        className={cn(
          "w-[350px] sm:w-[400px] max-h-[calc(100vh-140px)] flex flex-col transition-all duration-500 ease-in-out origin-bottom-right transform",
          isOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
            : "scale-95 opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <div className="relative shadow-2xl rounded-[32px] overflow-hidden border border-border/50 bg-card flex flex-col flex-1">
          <ChatBox />
          
          {/* Close button on the chat window for better UX */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-14 text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="relative group pointer-events-auto">
        {/* Tooltip/Badge */}
        {!isOpen && showTooltip && (
          <div className="absolute bottom-full right-0 mb-4 whitespace-nowrap animate-bounce">
            <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-2xl shadow-xl relative">
              Need help? Ask me anything!
              <div className="absolute top-full right-6 w-2 h-2 bg-primary rotate-45 -translate-y-1" />
            </div>
          </div>
        )}

        <Button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center",
            isOpen 
              ? "bg-destructive hover:bg-destructive/90 rotate-90" 
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-8 h-8 fill-current" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
          )}
        </Button>

        {/* Outer Glow Effect */}
        {!isOpen && (
          <div className="absolute inset-0 -z-10 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300 animate-pulse" />
        )}
      </div>
    </div>
  );
}
