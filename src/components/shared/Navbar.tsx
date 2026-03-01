"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, ShoppingCart, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser, logOut } from "@/services/auth";
import { getCart } from "@/services/order";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Meals", href: "/meals" },
  { name: "Providers", href: "/providers" },
];

export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const response = await getCart();
      if (response.items) {
        // Calculate sum of all quantities
        const total = response.items.reduce(
          (acc: number, item: any) => acc + item.quantity,
          0
        );
        setCartCount(total);
      }
    };

    fetchData();
  }, []);



  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
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

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
   
          {
            user && (
          <Link href="/dashboard/cart" className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

            )
          }
          {!user ? (
            <div className="flex items-center gap-2">

              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="uppercase bg-primary/10 text-primary text-xs">
                    {user?.name?.[0] || user?.role?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium capitalize">{user.role?.toLowerCase()}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetTitle className="text-left">Navigation</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="text-lg font-medium">
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-border flex flex-col gap-4">
          

                {!user ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </>
                ) : (
                  <>

                   {/* Mobile Cart */}
                <Link href="/dashboard/cart" className="flex items-center justify-between text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Cart
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </Link>
                    <Link href="/profile" className="flex items-center gap-2 text-lg font-medium">
                      <User className="h-5 w-5" /> Profile
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium text-primary">
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                    <Button variant="destructive" onClick={handleLogout} className="w-full mt-4">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
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