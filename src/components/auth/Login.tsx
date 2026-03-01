"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getCurrentUser, loginUser } from "@/services/auth";

export default function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Track specific field errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors on new attempt

    try {
      const payload = { email, password };
      const data = await loginUser(payload);

      if (data.success) {
        toast.success("Login successful! Redirecting...");
        router.push("/");
        router.refresh();
      } else {
        // If API returns specific field errors, map them here
        // Otherwise, set a general error or check logic
        setErrors({
          email: data.message?.includes("email") ? data.message : undefined,
          password: data.message?.includes("password") ? data.message : "Invalid credentials",
        });
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchUser = async () => {
    const currentUser = await getCurrentUser()

    // ✅ If user is already logged in, redirect them away from login page
    if (currentUser) {
      router.push("/");
    }
  };

  fetchUser();
}, [router]);

  return (
    <section className={cn("min-h-screen flex items-center justify-center px-4", className)}>
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Login to continue to FoodHub
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="Email"
              className={cn("h-11", errors.email && "border-red-500 focus-visible:ring-red-500")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={cn("h-11 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 ml-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          New here?{" "}
          <Link href="/register" className="font-semibold text-green-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}