"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  UserCircle, 
  AlertCircle,
  PlusCircle,
  ArrowLeft
} from "lucide-react";
import { getProfile } from "@/services/provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manage Menu", href: "/dashboard/manage-menu", icon: UtensilsCrossed }, 
  { name: "Add New Meal", href: "/dashboard/add-menu", icon: PlusCircle }, 
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag }
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile();
        setHasProfile(!!profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setHasProfile(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static z-50 top-0 left-0 h-full w-72 bg-white border-r border-slate-200 p-6 transform transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10 px-2">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold text-green-600 tracking-tight">FoodHub</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Provider Panel</span>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)}>
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          {/* Create Provider Profile Notice */}
          {hasProfile === false && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">Profile Missing</span>
              </div>
              <p className="text-xs text-amber-600 mb-3">Setup your store to start receiving orders.</p>
              <Link href="/dashboard/create-provider-profile">
                <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2 text-xs">
                  <PlusCircle size={14} /> Create Profile
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 pt-6 flex flex-col gap-2">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              pathname === "/profile" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <UserCircle size={20} />
            My Account
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {navItems.find(i => i.href === pathname)?.name || "Provider Overview"}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">Welcome back, ready to serve? 👨‍🍳</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-800">Restaurant Status</span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                </span>
             </div>
             <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <UserCircle size={24} />
             </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}