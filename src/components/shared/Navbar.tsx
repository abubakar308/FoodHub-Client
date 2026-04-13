"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  ShoppingCart,
  LayoutDashboard,
  ChevronDown,
  BadgePercent,
  Info,
  UtensilsCrossed,
  Building2,
  House,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser, logOut } from "@/services/auth";
import { getCategories } from "@/services/categories";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/Skeletons";

const navItems = [
  { name: "Home", href: "/", icon: House },
  { name: "Meals", href: "/meals", icon: UtensilsCrossed },
  { name: "Providers", href: "/providers", icon: Building2 },
  { name: "Offers", href: "/offers", icon: BadgePercent },
  { name: "About", href: "/about", icon: Info },
];

const categoryItems = [
  { name: "Fast Food", href: "/meals?category=fast-food" },
  { name: "Healthy Meals", href: "/meals?category=healthy-meals" },
  { name: "Desserts", href: "/meals?category=desserts" },
  { name: "Drinks", href: "/meals?category=drinks" },
  { name: "Vegetarian", href: "/meals?category=vegetarian" },
  { name: "Chef Specials", href: "/meals?category=chef-specials" },
];

export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { count: cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      try {
        const [currentUser, categoriesData] = await Promise.all([
          getCurrentUser(),
          getCategories(),
        ]);
        setUser(currentUser);
        setCategories(categoriesData || []);
      } catch {
        setUser(null);
      } finally {
        setCategoriesLoading(false);
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
    } catch {
      toast.error("Failed to logout");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg shadow-sm ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
            🍽️
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              QuickPlatter
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Fast • Fresh • Reliable
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 outline-none transition-all duration-200 hover:bg-muted hover:text-primary">
              Categories
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              className="w-64 rounded-2xl border border-border/60 bg-popover p-2 text-popover-foreground shadow-xl"
            >
              <div className="px-2 py-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Explore Categories
                </h4>
                <p className="text-xs text-muted-foreground">
                  Browse meals by your favorite type
                </p>
              </div>

              <DropdownMenuSeparator />

              <div className="grid grid-cols-2 gap-1 p-1">
                {categoriesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="px-3 py-2">
                      <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                  ))
                ) : categories.length > 0 ? (
                  categories.slice(0, 8).map((cat) => {
                    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <DropdownMenuItem
                        key={cat.id}
                        asChild
                        className="rounded-xl px-3 py-2"
                      >
                        <Link href={`/meals?category=${slug}`}>{cat.name}</Link>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-4 text-center text-xs text-muted-foreground italic">
                    No categories found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user && user.role?.toUpperCase() === "CUSTOMER" && (
            <Link href="/dashboard/cart">
              <Button variant="outline" className="relative gap-2 border-border hover:bg-accent rounded-full px-4">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline text-foreground">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="rounded-full px-5 text-sm font-semibold"
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button
                asChild
                className="rounded-full px-5 text-sm font-semibold shadow-sm"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-full border border-border/60 bg-card px-2 py-1.5 shadow-sm outline-none transition-all hover:border-primary/30 hover:bg-muted/60">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold uppercase text-primary">
                    {user?.name?.[0] || user?.role?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden text-left xl:block">
                  <p className="max-w-[120px] truncate text-sm font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user?.role?.toLowerCase()}
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl border border-border/60 bg-popover p-2 text-popover-foreground shadow-xl"
              >
                <DropdownMenuItem asChild className="rounded-xl">
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-xl">
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                {user.role?.toUpperCase() === "CUSTOMER" && (
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link href="/dashboard/cart" className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/60 bg-card shadow-sm"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <div className="lg:hidden ml-2">
               <ThemeToggle />
            </div>

            <SheetContent
              side="right"
              className="w-[320px] border-l border-border/60 bg-background px-5"
            >
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

              <div className="mt-4 flex items-center gap-3 border-b border-border pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg">
                  🍽️
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    QuickPlatter
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Taste delivered to your door
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-border/60 bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Popular Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoriesLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))
                  ) : categories.length > 0 ? (
                    categories.slice(0, 10).map((cat) => {
                      const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <Link
                          key={cat.id}
                          href={`/meals?category=${slug}`}
                          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/30 hover:text-primary"
                        >
                          {cat.name}
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No categories found
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                {!user ? (
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" asChild className="w-full rounded-full">
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button asChild className="w-full rounded-full">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl border border-border/60 bg-card p-4">
                      <p className="text-sm font-semibold text-foreground">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {user?.role?.toLowerCase()}
                      </p>
                    </div>

                    {user.role?.toUpperCase() === "CUSTOMER" && (
                          <Link href="/dashboard/cart">
              <Button variant="outline" className="relative gap-2 border-border hover:bg-accent rounded-full px-4 w-full">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
                    )}

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="mt-2 w-full rounded-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}