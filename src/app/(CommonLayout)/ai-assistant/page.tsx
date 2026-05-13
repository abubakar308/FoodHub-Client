import ChatBox from "@/components/ai/ChatBox";
import RecommendationCard from "@/components/ai/RecommendationCard";
import { Sparkles, Bot, Utensils } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-4 w-4" />
            Next-Gen Dining
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Your Personal <span className="text-primary">AI Foodie</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed">
            Get personalized meal recommendations, nutrition advice, and healthy food suggestions 
            instantly with our advanced AI assistant.
          </p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Chat Interface */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
             <ChatBox />
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <RecommendationCard />
            
            {/* Info Card */}
            <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                    <Bot className="w-6 h-6" />
                    <h3 className="text-xl font-black">AI Capabilities</h3>
                </div>
                <ul className="space-y-3">
                    {[
                        "Suggest healthy alternatives",
                        "Calculate estimated calories",
                        "Explain ingredients & benefits",
                        "Create personalized meal plans"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
