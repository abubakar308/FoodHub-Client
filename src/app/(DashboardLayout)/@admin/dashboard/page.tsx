import {
  Users,
  Store,
  UtensilsCrossed,
  ShoppingCart,
  Wallet,
  Truck,
  Clock3,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAdminDashboardStats } from "@/services/admin";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString()}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";
    case "PENDING":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300";
  }
};

export default async function AdminDashboardPage() {
  const res = await getAdminDashboardStats();

  const overview = res?.data?.overview;
  const recentOrders = res?.data?.recentOrders || [];

  const cards = [
    {
      title: "Total Users",
      value: overview?.totalUsers ?? 0,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Providers",
      value: overview?.totalProviders ?? 0,
      icon: Store,
      description: "Active providers",
    },
    {
      title: "Meals",
      value: overview?.totalMeals ?? 0,
      icon: UtensilsCrossed,
      description: "Listed meals",
    },
    {
      title: "Orders",
      value: overview?.totalOrders ?? 0,
      icon: ShoppingCart,
      description: "Total placed orders",
    },
    {
      title: "Delivered",
      value: overview?.deliveredOrders ?? 0,
      icon: Truck,
      description: "Completed orders",
    },
    {
      title: "Pending",
      value: overview?.pendingOrders ?? 0,
      icon: Clock3,
      description: "Awaiting action",
    },
    {
      title: "Active Users",
      value: overview?.activeUsers ?? 0,
      icon: Activity,
      description: "Currently active",
    },
    {
      title: "Revenue",
      value: formatCurrency(Number(overview?.totalRevenue ?? 0)),
      icon: Wallet,
      description: "Total revenue",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-card px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and recent order activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="rounded-3xl border-border shadow-sm transition hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {card.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold text-foreground">
                      {card.value}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground/60">
                      {card.description}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AdminDashboardCharts overview={overview} />

      <Card className="rounded-3xl border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-foreground">
            Recent Orders
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Latest orders from the platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Customer</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Email</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Provider</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Amount</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Payment</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Status</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Address</th>
                  <th className="px-3 py-3 text-left font-bold text-muted-foreground">Created</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-border transition hover:bg-muted/40"
                    >
                      <td className="px-3 py-4 font-medium text-foreground">
                        {order.customer?.name?.trim() || "N/A"}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {order.customer?.email || "N/A"}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {order.provider?.restaurantName || "N/A"}
                      </td>
                      <td className="px-3 py-4 font-semibold text-foreground">
                        ৳{Number(order.totalPrice || 0)}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {order.paymentMethod}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusVariant(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {order.address}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-muted-foreground"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}