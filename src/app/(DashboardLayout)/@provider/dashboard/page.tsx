"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Store,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Star,
  UserRound,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { getProfile, getProviderDashboardStats } from "@/services/provider";

type ProviderProfile = {
  id?: string;
  restaurantName?: string;
  isApproved?: boolean;
};

type DashboardData = {
  provider?: {
    id: string;
    restaurantName: string;
  };
  overview?: {
    totalMeals: number;
    totalOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    totalReviews: number;
    averageRating: number;
  };
  orderStatusDistribution?: { status: string; count: number }[];
  monthlyOrders?: { month: string; count: number }[];
  monthlyRevenue?: { month: string; revenue: number }[];
  topMeals?: {
    mealId: string;
    title: string;
    totalSold: number;
    revenue: number;
    averageRating: number;
    totalReviews: number;
  }[];
  recentOrders?: {
    id: string;
    status: string;
    totalPrice: number | string;
    createdAt: string;
    customer?: {
      name?: string;
      email?: string;
    };
  }[];
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"];

const OverviewCard = ({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">
          {title}
        </p>
        <h3 className="mt-2 text-3xl font-extrabold text-foreground">
          {value}
        </h3>
        {subtitle ? (
          <p className="mt-2 text-xs text-muted-foreground/60">{subtitle}</p>
        ) : null}
      </div>
      <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
    </div>
  </div>
);

export default function ProviderDashboard() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const [profileRes, statsRes] = await Promise.all([
          getProfile(),
          getProviderDashboardStats(),
        ]);

        const profileData = profileRes?.data || [];
        const statsData = statsRes?.data || [];

        setProfile(profileData);
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const overview = stats?.overview;

  const providerProfileHref = useMemo(() => {
    return profile?.id
      ? "/dashboard/provider-profile"
      : "/dashboard/create-provider-profile";
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/80">
              Provider Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              {stats?.provider?.restaurantName || profile?.restaurantName || "Welcome Back"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
              Track meals, orders, revenue, reviews, and keep your restaurant operations organized from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={providerProfileHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-slate-100"
            >
              {profile?.id ? "View / Update Provider Profile" : "Create Provider Profile"}
              <ChevronRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard/add-menu"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Add New Meal
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {!profile?.id && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-500/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-amber-700 dark:text-amber-300">
                Provider profile is not created yet
              </h2>
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-200/80">
                Create your restaurant profile to manage meals, branding, and receive orders properly.
              </p>
            </div>

            <Link
              href="/dashboard/create-provider-profile"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              Create Profile
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Total Meals"
          value={overview?.totalMeals ?? 0}
          icon={<UtensilsCrossed className="h-5 w-5" />}
          subtitle="All published meals"
        />
        <OverviewCard
          title="Total Orders"
          value={overview?.totalOrders ?? 0}
          icon={<ShoppingBag className="h-5 w-5" />}
          subtitle="All customer orders"
        />
        <OverviewCard
          title="Total Revenue"
          value={`৳${overview?.totalRevenue ?? 0}`}
          icon={<DollarSign className="h-5 w-5" />}
          subtitle="Delivered order revenue"
        />
        <OverviewCard
          title="Average Rating"
          value={overview?.averageRating ?? 0}
          icon={<Star className="h-5 w-5" />}
          subtitle={`${overview?.totalReviews ?? 0} total reviews`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            Order Status Distribution
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pie chart for current order statuses
          </p>

          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.orderStatusDistribution || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {(stats?.orderStatusDistribution || []).map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">
            Monthly Orders
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bar chart showing last months order trend
          </p>

          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyOrders || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest customer orders from your restaurant
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Total
                  </th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).length > 0 ? (
                  stats?.recentOrders?.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <UserRound className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                               {order.customer?.name || "Customer"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                               {order.customer?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-foreground/80">
                        {order.status}
                      </td>
                      <td className="px-3 py-4 text-sm font-semibold text-foreground">
                        ৳{order.totalPrice}
                      </td>
                      <td className="px-3 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-10 text-center text-sm text-muted-foreground"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            Top Meals
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Best performing meals by sales
          </p>

          <div className="mt-5 space-y-4">
            {(stats?.topMeals || []).length > 0 ? (
              stats?.topMeals?.map((meal) => (
                <div
                  key={meal.mealId}
                  className="rounded-2xl border border-border p-4"
                >
                  <h3 className="font-bold text-foreground">
                    {meal.title}
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-muted p-3">
                      <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Sold</p>
                      <p className="mt-1 font-bold text-foreground">
                        {meal.totalSold}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted p-3">
                      <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Revenue</p>
                      <p className="mt-1 font-bold text-foreground">
                        ৳{meal.revenue}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No top meals data found
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Pending Orders"
          value={overview?.pendingOrders ?? 0}
          icon={<Clock3 className="h-5 w-5" />}
        />
        <OverviewCard
          title="Preparing Orders"
          value={overview?.preparingOrders ?? 0}
          icon={<Store className="h-5 w-5" />}
        />
        <OverviewCard
          title="Delivered Orders"
          value={overview?.deliveredOrders ?? 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <OverviewCard
          title="Cancelled Orders"
          value={overview?.cancelledOrders ?? 0}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>
    </section>
  );
}