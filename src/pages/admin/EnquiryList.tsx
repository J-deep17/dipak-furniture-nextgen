import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { api } from "@/lib/api";

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEnquiries = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/enquiries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                setEnquiries(res.data);
            } else {
                setError("Invalid data format received");
            }
        } catch (error) {
            setError("Failed to connect to the server");
            toast.error("Failed to load enquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/enquiries/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Status updated");
            fetchEnquiries();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Enquiries</h2>
                <p className="text-muted-foreground">View and manage customer enquiries</p>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <span>Loading enquiries...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-red-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>{error}</p>
                                        <Button variant="outline" size="sm" onClick={fetchEnquiries}>Retry</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (!Array.isArray(enquiries) || enquiries.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No enquiries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            enquiries.map((enquiry) => (
                                <TableRow key={enquiry._id}>
                                    <TableCell>{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{enquiry.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{enquiry.email || 'No email'}</div>
                                    </TableCell>
                                    <TableCell className="text-sm">{enquiry.phone}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-xs">{enquiry.productName || 'N/A'}</div>
                                        <div className="text-[10px] text-muted-foreground">ID: {enquiry.productId || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[10px]">Color: {enquiry.selectedColor || 'N/A'}</div>
                                        <div className="text-[10px]">Qty: {enquiry.quantity || 1}</div>
                                    </TableCell>
                                    <TableCell className="text-sm">{enquiry.city || 'N/A'}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                            enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {enquiry.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => updateStatus(enquiry._id, 'new')}>
                                                    Mark as New
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(enquiry._id, 'contacted')}>
                                                    Mark as Contacted
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(enquiry._id, 'closed')}>
                                                    Mark as Closed
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

export default EnquiryList;
