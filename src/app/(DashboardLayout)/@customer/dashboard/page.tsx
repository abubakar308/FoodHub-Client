"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    DollarSign,
    Clock3,
    CheckCircle2,
    Heart,
    Loader2,
    ChevronRight,
    Search,
    UserCircle,
    ArrowUpRight,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import { getCustomerDashboardStats } from "@/services/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function CustomerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getCustomerDashboardStats();

            console.log(res)
            if (res.success) {
                setData(res.data);
            }
            setLoading(false);
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                <div className="relative">
                    <Loader2 className="animate-spin text-primary h-12 w-12" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">Hydrating your dashboard...</p>
            </div>
        );
    }
    const overview = data?.overview;

    return (
        <div className="space-y-10 pb-20">
            {/* 🔥 Hero Welcome & Quick Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary shadow-2xl shadow-primary/20 rounded-[40px] p-8 md:p-12 text-primary-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Welcome Back!
                    </h1>
                    <p className="text-primary-foreground/80 text-lg font-medium">
                        Your hunger deserves the best. track your orders, manage your favorites, 
                        and discover new flavors in seconds.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link href="/meals">
                            <Button className="bg-white text-primary hover:bg-slate-50 font-black rounded-2xl px-8 py-6 h-auto shadow-lg flex items-center gap-2">
                                <Search size={20} /> Browse Meals
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white font-black rounded-2xl px-8 py-6 h-auto backdrop-blur-sm flex items-center gap-2">
                                <UserCircle size={20} /> Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="hidden lg:block relative z-10">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 shadow-2xl">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <ShoppingBag className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">Status</p>
                                <p className="text-xl font-black">Active Account</p>
                            </div>
                         </div>
                         <Link href="/dashboard/orders" className="flex items-center justify-between gap-8 group">
                            <span className="text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">View recent activity</span>
                            <div className="bg-white text-primary p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                                <ChevronRight size={16} />
                            </div>
                         </Link>
                    </div>
                </div>
            </div>

            {/* 🔥 Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Orders" value={overview?.totalOrders} icon={<ShoppingBag size={20} />} variant="primary" />
                <StatCard title="Spent" value={`৳${overview?.totalSpent?.toLocaleString()}`} icon={<DollarSign size={20} />} variant="success" />
                <StatCard title="Pending" value={overview?.pendingOrders} icon={<Clock3 size={20} />} variant="warning" />
                <StatCard title="Delivered" value={overview?.deliveredOrders} icon={<CheckCircle2 size={20} />} variant="info" />
            </div>

            {/* 🔥 Charts */}
            <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
                {/* Status Distribution */}
                <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm">
                    <h2 className="text-xl font-black text-foreground mb-8">Order Logistics</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.orderStatusDistribution}
                                    dataKey="count"
                                    nameKey="status"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                >
                                    {data?.orderStatusDistribution?.map((_: any, i: number) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} className="stroke-card outline-none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--card))', 
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '16px',
                                        color: 'hsl(var(--foreground))'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {data?.orderStatusDistribution?.map((status: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{status.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm">
                    <h2 className="text-xl font-black text-foreground mb-8">Financial Overview</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.monthlySpending}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--card))', 
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                                    }} 
                                />
                                <Bar 
                                    dataKey="amount" 
                                    fill="hsl(var(--primary))" 
                                    radius={[8, 8, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 🔥 Recent Orders */}
            <div className="bg-card border border-border rounded-[40px] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground font-medium">Tracking your latest culinary adventures</p>
                    </div>
                    <Link href="/dashboard/orders">
                        <Button variant="ghost" className="text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/5">
                            View All <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Investment</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Timestamp</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border/50">
                            {data?.recentOrders?.map((order: any) => (
                                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-black text-foreground">{order.provider?.restaurantName}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground opacity-60">ID: {order.id.slice(-8)}</p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn(
                                            "inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-tighter border",
                                            order.status === "DELIVERED" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-foreground">
                                        ৳{order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 text-right text-xs font-bold text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 Wishlist */}
            <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                        <Heart className="text-primary fill-primary" size={24} /> Favorite Bites
                    </h2>
                    <p className="text-sm font-bold text-muted-foreground">{data?.wishlistItems?.length || 0} ITEMS</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data?.wishlistItems?.map((item: any) => (
                        <div key={item.id} className="group relative bg-background border border-border/50 rounded-3xl p-3 transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
                            <div className="h-32 w-full overflow-hidden rounded-2xl relative mb-3">
                                <img
                                    src={item.meal.imageUrl}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <p className="font-black text-foreground text-sm truncate uppercase tracking-tight">{item.meal.title}</p>
                            <p className="text-primary font-black text-xs">৳{item.meal.discountPrice || item.meal.price}</p>
                            
                            <Link href={`/meals/${item.meal.id}`} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-lg text-primary">
                                    <ArrowUpRight size={14} />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, variant }: any) => {
    const variants: any = {
        primary: "text-primary bg-primary/10 border-primary/20",
        success: "text-green-500 bg-green-500/10 border-green-500/20",
        warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    };

    return (
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-md">
            <div className={cn("p-4 rounded-2xl border flex items-center justify-center shrink-0", variants[variant])}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70 mb-1">{title}</p>
                <h2 className="text-2xl font-black text-foreground tracking-tight">{value}</h2>
            </div>
        </div>
    );
};
