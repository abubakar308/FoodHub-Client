"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ClipboardList, User, LayoutDashboard, ShoppingCart, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useCart } from "@/context/CartContext";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    name: "Profile",
    href: "/profile", 
    icon: User,
  },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count: cartCount } = useCart();


  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 transform flex-col border-r border-border bg-background p-6 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shadow-sm",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10 px-2 font-bold">
          <Link href="/" className="flex items-center gap-3">
             <div className="rounded-2xl bg-primary shadow-lg shadow-primary/20 p-2.5">
               <span className="text-primary-foreground font-black text-lg">QP</span>
             </div>
             <span className="text-xl font-black tracking-tight text-foreground">
               Quickplatter
             </span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-1"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-border pt-6 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col min-w-0 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden border border-border" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-black tracking-tight text-foreground hidden sm:block">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Professional Cart Button */}
            <Link href="/dashboard/cart">
              <Button variant="outline" className="relative gap-2 border-border hover:bg-muted rounded-full px-4 text-foreground">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="h-10 w-10 rounded-2xl border-2 border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden transition-all hover:scale-105">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}