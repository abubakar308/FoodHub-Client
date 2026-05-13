"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getCurrentUser,
  loginUser,
  googleLoginUser,
} from "@/services/auth";

export default function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = { email, password };
      const data = await loginUser(payload);

      if (data.success) {
        toast.success("Welcome back to Quickplatter!");
        router.push("/");
        router.refresh();
      } else {
        setErrors({
          email: data.message?.toLowerCase().includes("email")
            ? data.message
            : undefined,
          password: !data.message?.toLowerCase().includes("email")
            ? data.message
            : undefined,
        });
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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

      const data = await googleLoginUser({
        token: credentialResponse.credential,
      });

      if (data.success) {
        toast.success("Google login successful!");
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section
      className={cn(
        "min-h-screen flex items-center justify-center px-4 bg-background",
        className
      )}
    >
      <div className="w-full max-w-md rounded-[32px] border border-border bg-card p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            Log in to continue your Quickplatter journey
          </p>
        </div>

        {/* Demo Credentials Section */}
        <div className="mt-6 p-4 rounded-xl border border-border text-sm space-y-3">
          <p className="font-bold text-foreground text-center">Demo Credentials</p>

          <div className="flex flex-col gap-2">

            {/* Admin */}
            <button
              type="button"
              onClick={() => {
                setEmail("admin@gmail.com");
                setPassword("Admin@12");
              }}
              className="w-full text-left p-2 rounded-lg border hover:bg-green-50 dark:hover:bg-green-900/20 transition"
            >
              <p className="font-semibold">👨‍💼 Admin</p>
            </button>

            {/* Provider */}
            <button
              type="button"
              onClick={() => {
                setEmail("provider@gmail.com");
                setPassword("Provider12");
              }}
              className="w-full text-left p-2 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              <p className="font-semibold">🏪 Provider</p>
            </button>

            {/* Customer */}
            <button
              type="button"
              onClick={() => {
                setEmail("customer@gmail.com");
                setPassword("123456");
              }}
              className="w-full text-left p-2 rounded-lg border hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
            >
              <p className="font-semibold">👤 Customer</p>
            </button>

          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <Input
                type="email"
                placeholder="name@example.com"
                className={cn(
                  "h-12 pl-10 rounded-xl border-border bg-muted/30 focus:border-green-500 focus:ring-green-500/10 transition-all font-medium",
                  errors.email && "border-red-500 bg-red-50/30"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-bold text-red-500 ml-1 uppercase tracking-tighter">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-bold text-green-600 hover:text-green-700"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "h-12 pl-10 pr-10 rounded-xl border-border bg-muted/30 focus:border-green-500 focus:ring-green-500/10 transition-all font-medium",
                  errors.password && "border-red-500 bg-red-50/30"
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-bold text-red-500 ml-1 uppercase tracking-tighter">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-black bg-foreground text-background hover:bg-green-600 hover:text-white rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98] mt-2"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex justify-center">
          {googleLoading ? (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Loader2 className="animate-spin" size={18} />
              Processing Google login...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap={false}
            />
          )}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          New to Quickplatter?{" "}
          <Link
            href="/register"
            className="font-black text-green-600 hover:text-green-700 transition-colors underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}