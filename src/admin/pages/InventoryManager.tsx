import { useEffect, useState } from "react";
import { api, fetchProducts } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function InventoryManager() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchProducts();
            setInventory(data);
            setLoading(false);
        };
        load();
    }, []);

    const lowStock = inventory.filter(p => p.stock < 5);

    if (loading) return <div>Scoping inventory...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Inventory Watchlist</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStock.map(p => (
                    <Card key={p.id} className="border-red-100 bg-red-50/30">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4">
                            <AlertTriangle className="text-red-500" size={18} />
                            <CardTitle className="text-sm font-bold truncate">{p.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Current Stock</span>
                                <Badge variant="destructive">{p.stock} units</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm">Restock Priorities</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {lowStock.length > 0
                            ? `You have ${lowStock.length} items with critical stock levels. Consider restocking these immediately to avoid lost sales.`
                            : "All stock levels are currently healthy."
                        }
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
