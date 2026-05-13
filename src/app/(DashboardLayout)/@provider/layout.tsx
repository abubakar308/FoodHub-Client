"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  PlusCircle,
  ArrowLeft,
  Store,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manage Menu", href: "/dashboard/manage-menu", icon: UtensilsCrossed },
  { name: "Add New Meal", href: "/dashboard/add-menu", icon: PlusCircle },
  { name: "AI Content Creator", href: "/dashboard/ai-content", icon: Wand2 },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "My Profile", href: "/dashboard/provider-profile", icon: Store },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);


  return (
    <div className="flex min-h-screen bg-secondary/30">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 transform flex-col border-r border-border bg-card p-6 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-primary">
              QuickPlatter
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Provider Panel
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col transition-colors duration-300">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">
                {navItems.find((i) => i.href === pathname)?.name ||
                  (pathname.includes("provider-profile")
                    ? "Provider Profile"
                    : "Provider Overview")}
              </h2>
              <p className="hidden text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:block">
                Merchant Operations Hub 👨‍🍳
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="mr-2 hidden flex-col items-end sm:flex text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Restaurant Status
              </span>
              <span className="flex items-center gap-1.5 text-xs font-black text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                ONLINE
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 text-primary transition-all hover:scale-105">
              <Store size={22} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}