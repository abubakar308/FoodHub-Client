"use client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Signup1Props {
  heading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
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


   const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // const toastId = toast.loading("Creating account...");
    // setLoading(true);

    console.log(name, email, role, password)
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,   // PROVIDER | CUSTOMER
        // image,  // image URL
        // callbackURL: "/", // redirect after signup
      }as any);

      if (error) {
        // toast.error(error.message, { id: toastId });
        return;
      }

      // toast.success("Account created successfully 🎉", { id: toastId });
      window.location.href = "/";

    } catch (err) {
      // toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className={cn("h-screen bg-muted", className)}>
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
       
          <div className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
           <form onSubmit={handleSignup}>
             <Input
             name="name"
              type="text"
              id="name"
              placeholder="Full Name"
               value={name}
                onChange={(e) => setName(e.target.value)}
              className="text-sm"
              required
            />
            <Input
              type="email"
              id="email"
              placeholder="Email"
               value={email}
                onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              required
            />
            <Input
              type="password"
              id="password"
              placeholder="Password"
               value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              required
            />
            {/* <Input
              type="password"
              id="password"
              placeholder="Confirm Password"
               value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              required
            /> */}
          <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="PROVIDER">Provider</option>
              </select>

            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
           </form>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage ;
