"use client";

import Link from "next/link";
import { Menu, LogOut, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser, logOut } from "@/services/auth";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Meals", href: "/meals" },
  { name: "Providers", href: "/providers" },
];


export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
     
      const currentUser = getCurrentUser();
      setUser(currentUser); // ✅ state update is inside async callback
    };

    fetchUser();

  }, []);
  const handleLogout = async () => {
    await logOut();
    setUser(null);
    window.location.href = "/login";
  };

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
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          Cart Icon
          <Link href="/dashboard/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {/* {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )} */}
          </Link>

          {/* User / Auth */}
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="uppercase">
                    {user.role?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium capitalize">{user.role}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
             

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6 text-foreground" />
          </SheetTrigger>

          <SheetContent side="right" className="bg-background border-border p-6">
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-border flex flex-col gap-3">
                {/* Cart for Mobile */}
                <Link href="/cart" className="flex items-center gap-2 text-sm font-medium">
                  <ShoppingCart className="h-5 w-5" /> Cart
                </Link>

                {!user ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="text-sm font-medium">Profile</Link>
                    {user.role === "PROVIDER" && (
                      <Link href="/provider/dashboard" className="text-sm font-medium">
                        Dashboard
                      </Link>
                    )}
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}