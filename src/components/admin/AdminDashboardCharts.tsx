"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  overview?: {
    totalUsers: number;
    totalProviders: number;
    totalMeals: number;
    totalOrders: number;
    activeUsers: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  };
};

export default function AdminDashboardCharts({ overview }: Props) {
  const barData = [
    { name: "Users", value: overview?.totalUsers ?? 0 },
    { name: "Providers", value: overview?.totalProviders ?? 0 },
    { name: "Meals", value: overview?.totalMeals ?? 0 },
    { name: "Orders", value: overview?.totalOrders ?? 0 },
  ];

  const pieData = [
    { name: "Pending", value: overview?.pendingOrders ?? 0 },
    { name: "Delivered", value: overview?.deliveredOrders ?? 0 },
    {
      name: "Others",
      value: Math.max(
        (overview?.totalOrders ?? 0) -
          (overview?.pendingOrders ?? 0) -
          (overview?.deliveredOrders ?? 0),
        0
      ),
    },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#64748b"];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Order Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}