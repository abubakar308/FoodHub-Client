"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct for App Router
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { registerUser } from "@/services/auth"; // Correct import path
import { getCurrentUser } from "@/services/auth";
import { UserCircle, Mail, Lock, Loader2 } from "lucide-react";

type UserRole = "PROVIDER" | "CUSTOMER";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(false);

  // চেক করা ইউজার আগে থেকে লগইন কি না
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { name, email, password, role };
      
      // সার্ভিস কল
      const result = await registerUser(payload);

      if (result.success) {
        toast.success("Account created! Please login.");
        router.push("/login");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-slate-50/50">
      <div className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-10 shadow-2xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Account 🚀
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Join FoodHub and start eating fresh
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                placeholder="John Doe"
                className="h-12 pl-10 rounded-xl border-slate-100 focus:border-green-500 focus:ring-green-500/10 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                type="email"
                placeholder="name@example.com"
                className="h-12 pl-10 rounded-xl border-slate-100 focus:border-green-500 focus:ring-green-500/10 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 pl-10 rounded-xl border-slate-100 focus:border-green-500 focus:ring-green-500/10 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-12 rounded-xl border border-slate-100 px-4 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all appearance-none cursor-pointer"
            >
              <option value="CUSTOMER">🍲 Hungry Customer</option>
              <option value="PROVIDER">👨‍🍳 Food Provider</option>
            </select>
          </div>

          <Button 
            className="w-full h-14 text-lg font-black bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Creating...
              </span>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-black text-green-600 hover:text-green-700 transition-colors underline-offset-4 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;