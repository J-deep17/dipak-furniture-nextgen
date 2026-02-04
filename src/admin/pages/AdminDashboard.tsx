import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, ClipboardList, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, enquiries: 0, lowStock: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/dashboard/stats");
                setStats(res.data.stats || { products: 0, orders: 0, enquiries: 0, lowStock: 0 });
            } catch (error) {
                console.error("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const indicators = [
        { label: "Total Products", value: stats.products, icon: Package, color: "text-blue-500" },
        { label: "Pending Orders", value: stats.orders, icon: ShoppingBag, color: "text-amber-500" },
        { label: "Inventory Items", value: stats.products, icon: ClipboardList, color: "text-purple-500" },
        { label: "Low Stock Alerts", value: stats.lowStock, icon: AlertCircle, color: "text-red-500" },
    ];

    if (loading) return <div className="text-muted-foreground animate-pulse">Initializing dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {indicators.map((item) => (
                    <Card key={item.label} className="border-none shadow-sm h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                            <item.icon className={item.color} size={18} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Welcome to Admin Control</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    Use the sidebar to manage your store, track orders, and monitor your inventory levels.
                    All changes made here reflect in real-time on your store.
                </CardContent>
            </Card>
        </div>
    );
}
