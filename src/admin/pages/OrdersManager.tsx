import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function OrdersManager() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                setOrders(res.data.orders);
            } catch (error) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div>Tracking orders...</div>;

    return (
        <div className="space-y-6 text-sm">
            <h2 className="text-xl font-bold">Transaction History</h2>
            <div className="bg-white rounded-xl border shadow-sm h-full overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((o) => (
                            <TableRow key={o._id}>
                                <TableCell className="font-mono">{o.orderNumber}</TableCell>
                                <TableCell>{o.user?.name}</TableCell>
                                <TableCell className="font-bold whitespace-nowrap">₹{o.pricing?.total?.toLocaleString()}</TableCell>
                                <TableCell className="uppercase">{o.payment?.method}</TableCell>
                                <TableCell>
                                    <Badge variant={o.payment.status === 'completed' ? 'secondary' : 'outline'} className="capitalize">
                                        {o.payment.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    No sales transactions recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
