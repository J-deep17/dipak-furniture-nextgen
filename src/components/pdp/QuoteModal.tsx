import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    selectedColor?: string | null;
    quantity?: number;
    pincode?: string;
    location?: string;
    deliveryAvailable?: boolean;
}

const QuoteModal = ({
    isOpen,
    onClose,
    product,
    selectedColor,
    quantity = 1,
    pincode = "",
    location = "",
    deliveryAvailable = false
}: QuoteModalProps) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            productId: product._id || product.id,
            productName: product.name,
            selectedColor: selectedColor || 'Default',
            quantity: quantity,
            pincode: pincode,
            city: location.split(',')[0]?.trim() || '',
            state: location.split(',')[1]?.trim() || '',
            deliveryAvailable: deliveryAvailable,
            name: '',
            phone: '',
            email: '',
            city_input: '', // renamed from 'city' to avoid conflict if needed, but let's see
            message: ''
        }
    });

    // Update form values when props change
    useEffect(() => {
        if (selectedColor) setValue('selectedColor', selectedColor);
        setValue('quantity', quantity);
        setValue('pincode', pincode);
        if (location) {
            const parts = location.split(',');
            setValue('city', parts[0]?.trim() || '');
            setValue('state', parts[1]?.trim() || '');
        }
        setValue('deliveryAvailable', deliveryAvailable);
    }, [selectedColor, quantity, pincode, location, deliveryAvailable, setValue]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await api.post('/enquiries', {
                ...data,
                productId: product._id || product.id,
                productName: product.name,
                selectedColor: selectedColor, // Assuming selectedColor is a string or null
                delivery: {
                    pincode,
                    location,
                    available: deliveryAvailable
                }
            });

            if (res.status === 201) {
                toast.success("Quote request sent successfully!");
                reset();
                onClose();
            } else {
                // api.post throws an error for non-2xx status codes, so this block might not be reached for non-201
                // but keeping it for robustness if api.post is configured differently or for future changes.
                toast.error("Failed to send quote request");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Get a Quote</DialogTitle>
                    <DialogDescription>
                        Request pricing and availability for <strong>{product.name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" {...register('name', { required: "Name is required" })} placeholder="John Doe" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" {...register('phone', { required: "Phone is required" })} placeholder="98XXXXXXXX" />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" {...register('city', { required: "City is required" })} placeholder="Ahmedabad" />
                            {errors.city && <p className="text-red-500 text-xs">{errors.city.message as string}</p>}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-[10px] grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <span className="text-muted-foreground block uppercase font-bold tracking-tight">Product</span>
                            <span className="font-semibold block truncate">{product.name}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block uppercase font-bold tracking-tight">Color</span>
                            <span className="font-semibold block truncate">{selectedColor || 'Default'}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block uppercase font-bold tracking-tight">Quantity</span>
                            <span className="font-semibold block">{quantity}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block uppercase font-bold tracking-tight">Delivery</span>
                            <span className={cn(
                                "font-semibold block truncate",
                                deliveryAvailable ? "text-green-600" : pincode ? "text-red-600" : "text-gray-400"
                            )}>
                                {deliveryAvailable ? (location || "Available") : pincode ? "Not Serviceable" : "Not Checked"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea id="message" {...register('message')} placeholder="Ask about bulk pricing, delivery time, etc." />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Quote Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default QuoteModal;
