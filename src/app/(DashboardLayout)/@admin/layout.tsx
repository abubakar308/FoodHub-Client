"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Grid2X2, 
  Settings,
  ShieldCheck,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Categories", href: "/dashboard/categories", icon: Grid2X2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 lg:static top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Admin Brand */}
        <div className="flex items-center justify-between mb-10 px-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-green-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FoodHub <span className="text-green-500">Admin</span></span>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-400 hover:text-white" 
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-4">Main Management</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} className={cn(active ? "text-white" : "text-slate-500 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Website
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-600" 
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-800">
                {navItems.find(i => i.href === pathname)?.name || "System Overview"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 xs:flex">
              <span className="text-xs font-bold text-slate-900">Admin User</span>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">Super Admin</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold overflow-hidden ring-2 ring-green-500/20">
               AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-8 max-w-1600px w-full mx-auto">
          {/* Dashboard Stats Breadcrumb style (Optional) */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {pathname.split("/").pop()} Management
            </h1>
            <p className="text-sm text-slate-500">Monitor and manage your food hub platform data.</p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}