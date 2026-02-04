import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Package,
    Folders,
    MessageSquare,
    Users,
    ArrowUpRight,
    AlertTriangle,
    ClipboardList
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardStats {
    products: number;
    categories: number;
    enquiries: number;
    users: number;
    lowStock: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        products: 0,
        categories: 0,
        enquiries: 0,
        users: 0,
        lowStock: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.stats);
                setRecentActivity(res.data.recentActivity);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: "Total Products", value: stats.products, icon: Package, color: "text-blue-500" },
        { title: "Categories", value: stats.categories, icon: Folders, color: "text-amber-500" },
        { title: "Inventory Alerts", value: stats.lowStock, icon: AlertTriangle, color: "text-red-500", path: "/admin/inventory" },
        { title: "New Enquiries", value: stats.enquiries, icon: MessageSquare, color: "text-emerald-500" },
    ];

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Real-time status of your store inventory and enquiries.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => {
                    const CardComponent = (
                        <Card key={card.title} className={cn("hover:shadow-lg transition-transform hover:-translate-y-1", card.path && "cursor-pointer")}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <card.icon className={cn("h-4 w-4", card.color)} />
                            </CardHeader>
                            <CardContent>
                                <div className={cn("text-2xl font-bold", card.title === "Inventory Alerts" && stats.lowStock > 0 && "text-red-600 animate-pulse")}>
                                    {card.value}
                                </div>
                                {card.title === "Inventory Alerts" && stats.lowStock > 0 && (
                                    <p className="text-[10px] text-red-500 font-semibold mt-1">Action Required</p>
                                )}
                            </CardContent>
                        </Card>
                    );

                    return card.path ? (
                        <Link key={card.title} to={card.path}>
                            {CardComponent}
                        </Link>
                    ) : (
                        <div key={card.title}>
                            {CardComponent}
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-8">
                                {recentActivity.map((enquiry: any) => (
                                    <div key={enquiry._id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {enquiry.name.charAt(0)}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{enquiry.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {enquiry.email} • {new Date(enquiry.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <span className={`px-2 py-1 rounded text-xs ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                enquiry.status === 'read' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {enquiry.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent enquiries found.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Could add another card here for something else */}
            </div>
        </div>
    );
};

export default AdminDashboard;
