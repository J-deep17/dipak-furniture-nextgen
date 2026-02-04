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
import { Search, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api, getFullImageUrl } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface InventoryItem {
    _id: string;
    name: string;
    sku: string;
    category: { name: string } | null;
    stock: number;
    minStock: number;
    stockStatus: string;
    fulfillmentType: 'instock' | 'made_to_order' | 'hybrid';
    leadTimeDays?: number;
    colors: any[];
    thumbnail?: string;
}

const Inventory = () => {
    const [products, setProducts] = useState<InventoryItem[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterFulfillment, setFilterFulfillment] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Quick Edit State
    const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
    const [quickEditOpen, setQuickEditOpen] = useState(false);
    const [editStock, setEditStock] = useState<number>(0);
    const [editVariants, setEditVariants] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            if (Array.isArray(res.data)) {
                setProducts(res.data);
                setFilteredProducts(res.data);
            }
        } catch (error) {
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const openQuickEdit = (product: InventoryItem) => {
        setSelectedProduct(product);
        setEditStock(product.stock);
        // Deep copy colors to avoid direct mutation
        setEditVariants(product.colors ? JSON.parse(JSON.stringify(product.colors)) : []);
        setQuickEditOpen(true);
    };

    const handleQuickSave = async () => {
        if (!selectedProduct) return;
        setSaving(true);
        try {
            const payload = {
                stock: editStock,
                variants: editVariants
            };

            await api.patch(`/products/${selectedProduct._id}/stock`, payload);

            toast.success("Stock updated successfully");
            setQuickEditOpen(false);
            fetchInventory(); // Refresh list to get updated statuses
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update stock");
        } finally {
            setLoading(false);
            setSaving(false);
        }
    };

    const handleVariantStockChange = (index: number, val: string) => {
        const newVars = [...editVariants];
        newVars[index].stock = parseInt(val) || 0;
        setEditVariants(newVars);

        // Auto-update total stock if variants exist
        if (newVars.length > 0) {
            const total = newVars.reduce((sum, v) => sum + (v.stock || 0), 0);
            setEditStock(total);
        }
    };

    useEffect(() => {
        let result = products;

        // Filter by Status
        if (filterStatus !== 'all') {
            result = result.filter(p => p.stockStatus === filterStatus);
        }

        // Filter by Fulfillment
        if (filterFulfillment !== 'all') {
            result = result.filter(p => p.fulfillmentType === filterFulfillment);
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q)
            );
        }

        setFilteredProducts(result);
    }, [products, filterStatus, filterFulfillment, searchQuery]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'In Stock': return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium"><CheckCircle className="w-3 h-3 mr-1" /> In Stock</span>;
            case 'Low Stock': return <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium"><AlertTriangle className="w-3 h-3 mr-1" /> Low Stock</span>;
            case 'Out of Stock': return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium"><XCircle className="w-3 h-3 mr-1" /> Out of Stock</span>;
            default: return <span className="text-gray-500">{status}</span>;
        }
    };

    const getFulfillmentBadge = (type: string) => {
        switch (type) {
            case 'instock': return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">Inventory</span>;
            case 'made_to_order': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200">MTO</span>;
            case 'hybrid': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-200">Hybrid</span>;
            default: return <span className="text-[10px]">{type}</span>;
        }
    };

    const lowStockCount = products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                    <p className="text-muted-foreground">Track stock levels and manage availability</p>
                </div>
                {lowStockCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md flex items-center shadow-sm animate-pulse">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span className="font-semibold">{lowStockCount} Products need attention</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by product name or SKU..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={filterFulfillment} onValueChange={setFilterFulfillment}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Fulfillment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="instock">In Stock</SelectItem>
                            <SelectItem value="made_to_order">Made to Order</SelectItem>
                            <SelectItem value="hybrid">Hybrid Mode</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Stock Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={fetchInventory} title="Refresh">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Total Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Quick Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading inventory...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No products found matching your filter.
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.map((product) => (
                            <TableRow key={product._id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="h-10 w-10 rounded overflow-hidden border bg-gray-100">
                                        <img src={getFullImageUrl(product.thumbnail || '')} className="h-full w-full object-cover" alt="" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link to={`/admin/products/${product._id}`} className="hover:underline text-blue-600">
                                        {product.name}
                                    </Link>
                                    <div className="flex gap-1 mt-1">
                                        {product.colors && product.colors.slice(0, 3).map((c, i) => (
                                            <div key={i} className="w-2.5 h-2.5 rounded-full border" title={`${c.name}: ${c.stock}`} style={{ backgroundColor: c.hex }} />
                                        ))}
                                        {product.colors?.length > 3 && <span className="text-[10px]">+{product.colors.length - 3}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-mono">{product.sku}</TableCell>
                                <TableCell>{getFulfillmentBadge(product.fulfillmentType)}</TableCell>
                                <TableCell className="font-mono text-base font-semibold">
                                    {product.fulfillmentType === 'made_to_order' ? (
                                        <span className="text-muted-foreground text-xs font-normal italic">N/A</span>
                                    ) : product.stock}
                                </TableCell>
                                <TableCell>{getStatusBadge(product.stockStatus)}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => openQuickEdit(product)}>
                                        Update Stock
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Quick Edit Modal */}
            <Dialog open={quickEditOpen} onOpenChange={setQuickEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Stock: {selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Total Product Stock (Main Inventory)</Label>
                            <Input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                className="font-mono text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                This is the global stock count. If you use variants, ensure this matches the sum or is managed separately.
                            </p>
                        </div>

                        {editVariants.length > 0 && (
                            <div className="border-t pt-4 mt-4 space-y-3">
                                <Label className="font-semibold">Variant Stock Levels</Label>
                                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                                    {editVariants.map((v, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex-1 text-sm font-medium truncate" title={v.name}>
                                                {v.name} <span className="text-xs text-muted-foreground">({v.sku})</span>
                                            </div>
                                            <Input
                                                type="number"
                                                value={v.stock}
                                                onChange={(e) => handleVariantStockChange(idx, e.target.value)}
                                                className="w-24 h-8"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setQuickEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleQuickSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Inventory;
