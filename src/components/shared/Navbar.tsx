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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-orange-600">
          FoodHub 🍔
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-orange-600 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="p-6">
            <div className="flex flex-col gap-6">

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-6">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
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
