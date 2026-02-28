"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginUser, registerUser } from "@/services/auth";

export default function LoginForm({
  className,
}: {
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log(email, password)


    try {
      const payload = { email, password };

   const data = await loginUser(payload);

      // redirect after login 

    if(data.success){
        window.location.href = "/";
    }

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      <Input
        type="email"
        placeholder="Email"
        className="h-11"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        className="h-11"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full h-11 text-base"
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
