"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Meals", href: "/meals" },
  { name: "Providers", href: "/providers" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          FoodHub 🍔
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6 text-foreground" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="bg-background border-border p-6"
          >
            <div className="flex flex-col gap-6">

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-6 border-t border-border">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>

            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
