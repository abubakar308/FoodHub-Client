"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getProfile } from "@/services/provider";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Manage Menu", href: "/dashboard/add-menu" },
  { name: "Orders", href: "/dashboard/orders" }
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

const [hasProfile, setHasProfile] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile(); // fetch from API
        setHasProfile(!!profile); // convert to boolean
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setHasProfile(false);
      }
    }
    fetchProfile();
  }, []);

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
            FoodHub Provider
          </Link>

          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Nav */}
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

           {/* Create Provider Profile button */}
  {!hasProfile && (
    <Link
      href="/dashboard/create-provider-profile"
      className="mt-4 px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium text-center hover:bg-yellow-600"
    >
      Create Provider Profile
    </Link>
  )}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pt-10">
          <Link
            href="/profile"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Profile
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            Provider Panel
          </h2>

          <div className="text-sm text-gray-500">
            Manage your restaurant 🍔
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}