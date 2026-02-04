import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Trash2,
    Upload,
    Search,
    CheckCircle2,
    XCircle,
    MapPin,
    ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ServiceableArea {
    _id: string;
    pincode: string;
    city: string;
    state: string;
    isActive: boolean;
}

import { api } from "@/lib/api";

const DeliveryManager = () => {
    const [areas, setAreas] = useState<ServiceableArea[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newArea, setNewArea] = useState({ pincode: "", city: "", state: "" });

    const fetchAreas = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/delivery', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAreas(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error("Failed to load delivery areas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/delivery', newArea, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Area added successfully");
            setIsAddOpen(false);
            setNewArea({ pincode: "", city: "", state: "" });
            fetchAreas();
        } catch (error) {
            toast.error("Error adding area");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this delivery area?")) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/delivery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success("Area deleted");
            fetchAreas();
        } catch (error) {
            toast.error("Error deleting area");
        }
    };

    const toggleStatus = async (area: ServiceableArea) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/delivery/${area._id}`, { isActive: !area.isActive }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchAreas();
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            const rows = content.split('\n').slice(1); // Skip header
            const newAreas = rows.map(row => {
                const [pincode, city, state] = row.split(',').map(s => s.trim());
                if (pincode && city && state) {
                    return { pincode, city, state };
                }
                return null;
            }).filter(Boolean);

            if (newAreas.length === 0) {
                toast.error("No valid data found in CSV");
                return;
            }

            try {
                const token = localStorage.getItem('token');
                await api.post('/delivery/bulk', newAreas, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                toast.success("Bulk upload successful");
                fetchAreas();
            } catch (error) {
                toast.error("Error during bulk upload");
            }
        };
        reader.readAsText(file);
    };

    const filteredAreas = areas.filter(a =>
        a.pincode.includes(search) ||
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.state.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Delivery Manager</h2>
                    <p className="text-muted-foreground">Manage serviceable pincodes and delivery coverage.</p>
                </div>
                <div className="flex gap-2">
                    <div className="text-right mr-4 hidden md:block">
                        <p className="text-[10px] text-muted-foreground">CSV Format: pincode, city, state</p>
                    </div>
                    <Button variant="outline" className="relative">
                        <Upload className="mr-2 h-4 w-4" />
                        Bulk CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleBulkUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Pincode
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Serviceable Area</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAdd} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Pincode (6 digits)</Label>
                                    <Input
                                        required
                                        maxLength={6}
                                        value={newArea.pincode}
                                        onChange={e => setNewArea({ ...newArea, pincode: e.target.value.replace(/\D/g, "") })}
                                        placeholder="380001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        required
                                        value={newArea.city}
                                        onChange={e => setNewArea({ ...newArea, city: e.target.value })}
                                        placeholder="Ahmedabad"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Input
                                        required
                                        value={newArea.state}
                                        onChange={e => setNewArea({ ...newArea, state: e.target.value })}
                                        placeholder="Gujarat"
                                    />
                                </div>
                                <Button type="submit" className="w-full">Save Area</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by pincode, city or state..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-9"
                />
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pincode</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredAreas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No serviceable areas found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAreas.map((area) => (
                                <TableRow key={area._id}>
                                    <TableCell className="font-mono font-bold">{area.pincode}</TableCell>
                                    <TableCell>{area.city}</TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>
                                        <button onClick={() => toggleStatus(area)}>
                                            <Badge variant={area.isActive ? "outline" : "secondary"} className={cn(
                                                "cursor-pointer",
                                                area.isActive ? "bg-green-50 text-green-700 border-green-200" : ""
                                            )}>
                                                {area.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(area._id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DeliveryManager;
