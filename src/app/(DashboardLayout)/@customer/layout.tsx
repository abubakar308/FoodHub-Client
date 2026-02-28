
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ClipboardList, User, LayoutDashboard } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white shadow-xl p-6 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-green-600">
            FoodHub
          </Link>

          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                ${
                  active
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="mt-auto pt-10">
          <Link
            href="/"
            className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            Customer Dashboard
          </h2>

          <Link
            href="/dashboard/cart"
            className="text-sm text-gray-500 hover:text-green-600"
          >
            View Cart 🛒
          </Link>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}