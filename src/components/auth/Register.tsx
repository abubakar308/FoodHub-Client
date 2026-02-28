"use client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Signup1Props {
  heading?: string;
  // logo: {
  //   url: string;
  //   src: string;
  //   alt: string;
  //   title?: string;
  // };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  className?: string;
}


const SignupPage = ({
  heading = "Signup",
  buttonText = "Create Account",
  signupText = "Already a user?",
  signupUrl = "/login",
  className,
}: Signup1Props) => {

  type UserRole = "PROVIDER" | "CUSTOMER";

 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(false);


  // const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const payload = {
  //       name,
  //       email,
  //       password,
  //       role,
  //       // image,
  //     };

  //     console.log("Signup payload:", payload);

  //     const res = await fetch("/api/auth/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Signup failed");
  //     }

  //     // redirect after signup
  //     window.location.href = "/";
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      name,
      email,
      password,
      role, // CUSTOMER | PROVIDER
      // image: later
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Signup failed");
    }

    // ✅ redirect to login (correct flow)
    window.location.href = "/login";

  } catch (error) {
    console.error("Signup error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
<section className="min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
    <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
      Create Account 🚀
    </h1>
    <p className="mb-6 text-center text-sm text-gray-500">
      Join FoodHub today
    </p>

    <form onSubmit={handleSignup} className="space-y-4">
      <Input
        placeholder="Full name"
        className="h-11"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        className="w-full h-11 rounded-md border px-3 text-sm"
      >
        <option value="CUSTOMER">Customer</option>
        <option value="PROVIDER">Provider</option>
      </select>

      <Button className="w-full h-11 text-base" disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </Button>
    </form>

    <p className="mt-5 text-center text-sm text-gray-500">
      Already have an account?{" "}
      <a href="/login" className="font-semibold text-green-600 hover:underline">
        Login
      </a>
    </p>
  </div>
</section>
  );
};

export default SignupPage ;
