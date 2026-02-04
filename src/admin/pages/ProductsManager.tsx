import { useEffect, useState } from "react";
import { api, fetchProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductsManager() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    if (loading) return <div>Loading Catalog...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Product Catalog</h2>
                <Button className="gap-2">
                    <Plus size={16} /> New Product
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Inventory</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <img src={p.image} className="w-10 h-10 rounded object-cover shadow-sm bg-gray-50" />
                                </TableCell>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell>₹{p.price?.toLocaleString() || "0"}</TableCell>
                                <TableCell>
                                    <span className={p.stock < 5 ? "text-red-500 font-bold" : ""}>
                                        {p.stock} units
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
