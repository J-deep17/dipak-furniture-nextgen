import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    CreditCard,
    Truck,
    RefreshCw
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Order {
    _id: string;
    orderNumber: string;
    user: { name: string; email: string; phone: string };
    pricing: { total: number };
    payment: { method: 'razorpay' | 'cod'; status: string };
    status: string;
    createdAt: string;
    items: any[];
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders');
            // Backend returns { orders, totalPages, currentPage, total }
            const ordersData = res.data.orders || res.data;
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setFilteredOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== "all") {
            result = result.filter(o => o.status === statusFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(o =>
                o.orderNumber.toLowerCase().includes(q) ||
                o.user.name.toLowerCase().includes(q) ||
                o.user.phone.includes(q)
            );
        }
        setFilteredOrders(result);
    }, [orders, statusFilter, searchQuery]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/orders/${id}/status`, { orderStatus: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
            case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
            case 'shipped': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
            case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
            case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage customer purchases and fulfillment.</p>
                </div>
                <Button variant="outline" onClick={fetchOrders}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Order #, Customer or Phone..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Fulfillment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
                                    <p>Loading orders...</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p>No orders found.</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.map((order) => {
                            // Determine primary fulfillment type for the order
                            const hasMTO = order.items?.some(i => i.fulfillmentType === 'made_to_order');

                            return (
                                <TableRow key={order._id} className="hover:bg-muted/30">
                                    <TableCell className="font-mono font-bold">
                                        #{order.orderNumber}
                                        <div className="text-[10px] font-normal text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.user.name}</div>
                                        <div className="text-xs text-muted-foreground">{order.user.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                                            {order.payment.method === 'razorpay' ? (
                                                <>
                                                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                                                    Online
                                                </>
                                            ) : (
                                                <>
                                                    <Truck className="h-3.5 w-3.5 text-slate-600" />
                                                    COD
                                                </>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "text-[10px] mt-0.5",
                                            order.payment.status === 'paid' ? "text-green-600 font-bold" : "text-amber-600"
                                        )}>
                                            {order.payment.status.toUpperCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] px-1.5 py-0",
                                            hasMTO ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"
                                        )}>
                                            {hasMTO ? 'MADE TO ORDER' : 'IN STOCK'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-black">₹{order.pricing.total.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/orders/${order._id}`} className="flex items-center">
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'processing')}>
                                                    Mark Processing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'shipped')}>
                                                    Mark Shipped
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'delivered')}>
                                                    Mark Delivered
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleUpdateStatus(order._id, 'cancelled')}>
                                                    Cancel Order
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" /> Invoice
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default OrderList;
