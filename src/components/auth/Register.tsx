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
 <section className={cn("min-h-screen bg-muted flex items-center justify-center", className)}>
      <div className="w-full max-w-sm rounded-md border bg-background p-6 shadow-md">
        {heading && (
          <h1 className="mb-6 text-center text-xl font-semibold">
            {heading}
          </h1>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            name="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>

          {/* Future: Image upload */}
          {/* 
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : buttonText}
          </Button>
        </form>

        <div className="mt-4 flex justify-center gap-1 text-sm text-muted-foreground">
          <span>{signupText}</span>
          <a
            href={signupUrl}
            className="font-medium text-primary hover:underline"
          >
            Login
          </a>
        </div>
      </div>
    </section>
  );
};

export default SignupPage ;
