"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCurrentUser, googleLoginUser, registerUser } from "@/services/auth";
import { UserCircle, Mail, Lock, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

type UserRole = "PROVIDER" | "CUSTOMER";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      const result = await registerUser(payload);

      if (result.success) {
        toast.success("Account created! Please login.");
        router.push("/login");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) {
      toast.error("Google token not found");
      return;
    }

    try {
      setGoogleLoading(true);

      const result = await googleLoginUser({
        token: credentialResponse.credential,
      });

      if (result.success) {
        toast.success("Google signup/login successful!");
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.message || "Google signup failed");
      }
    } catch {
      toast.error("Google signup failed");
    } finally {
      setGoogleLoading(false);
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
            Join Quickplatter and start eating fresh
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              I am a...
            </label>
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
            disabled={loading || googleLoading}
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

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex justify-center">
          {googleLoading ? (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Loader2 className="animate-spin" size={18} />
              Processing Google auth...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google auth failed")}
              useOneTap={false}
            />
          )}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-black text-green-600 hover:text-green-700 transition-colors underline-offset-4 hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;