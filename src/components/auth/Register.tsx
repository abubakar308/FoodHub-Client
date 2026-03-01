"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/auth";

type UserRole = "PROVIDER" | "CUSTOMER";

const SignupPage = () => {
  const router = useRouter();
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Auth Guard: Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          router.push("/");
        } else {
          setIsCheckingAuth(false);
        }
      } catch {
        setIsCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = { name, email, password, role };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Set inline errors if the API returns specific field messages
        const errMsg = data.message || "Signup failed";
        if (errMsg.toLowerCase().includes("email")) setErrors({ email: errMsg });
        else if (errMsg.toLowerCase().includes("name")) setErrors({ name: errMsg });
        else if (errMsg.toLowerCase().includes("password")) setErrors({ password: errMsg });
        
        throw new Error(errMsg);
      }

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering the form while checking if user is already logged in
  if (isCheckingAuth) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gray-50/50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Create Account 🚀
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Join FoodHub today
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <Input
              placeholder="Full name"
              className={cn("h-11", errors.name && "border-red-500 focus-visible:ring-red-500")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="text-xs font-medium text-red-500 ml-1">{errors.name}</p>}
          </div>

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
            {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
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
            {errors.password && <p className="text-xs font-medium text-red-500 ml-1">{errors.password}</p>}
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 ml-1">Register as:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </div>

          <Button className="w-full h-11 text-base font-medium mt-2" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;