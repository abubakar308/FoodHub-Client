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
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 transform flex-col border-r border-slate-200 bg-white p-6 transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10 px-2">
          <Link href="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <span className="bg-green-600 text-white p-1 rounded-lg">QP</span>
            Quickplatter
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            // ✅ FIX: Exact matching logic to prevent double activation
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-200 translate-x-1"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={20} className={cn(active ? "text-white" : "text-slate-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-slate-100 pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Professional Cart Button */}
            <Link href="/dashboard/cart">
              <Button variant="outline" className="relative gap-2 border-slate-200 hover:bg-slate-50 rounded-full px-4">
                <ShoppingCart className="h-4 w-4 text-slate-600" />
                <span className="hidden sm:inline text-slate-700">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}