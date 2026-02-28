
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Users", href: "/dashboard/users" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Categories", href: "/dashboard/categories" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static top-0 left-0 h-full w-64 bg-white shadow-xl p-6 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-green-600">
            FoodHub Admin
          </Link>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg font-medium transition-all
                ${
                  active
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <div className="text-sm text-gray-500">
            Welcome back 👋
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}