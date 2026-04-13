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
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Providers", href: "/dashboard/providers", icon: Store },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Meals", href: "/dashboard/meals", icon: UtensilsCrossed },
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
    <div className="min-h-screen bg-secondary/30 flex">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-background transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6 font-bold">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary shadow-lg shadow-primary/20 p-3">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Quickplatter <span className="text-primary">Admin</span>
              </h2>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Main Management
          </p>

          <div className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-all shadow-sm",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border px-4 py-5 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Website
          </Link>

          <button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-destructive transition hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col transition-colors duration-300">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-foreground">
                Admin User
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Super Admin
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 text-sm font-black text-primary transition-all hover:scale-105">
              AD
            </div>
          </div>
        </header>

        <main className="w-full p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}