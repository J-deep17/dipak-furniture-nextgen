import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
    CreditCard,
    Truck,
    ArrowLeft,
    ShieldCheck,
    Info,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Lock,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import SEOHead from "@/components/seo/SEOHead";

const Checkout = () => {
    const { items, getTotalItems, clearCart } = useCart();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        notes: ""
    });

    // Authentication Check
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error("Please login to proceed with checkout");
            navigate("/login?redirect=/checkout");
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Pre-fill form if user is logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phoneNumber || ""
            }));
        }
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

    // Calculations
    const subtotal = useMemo(() => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }, [items]);

    const shippingCharges = subtotal > 5000 ? 0 : 500;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst + shippingCharges;

    // Check if COD is allowed
    // Rule: COD allowed only if NO item is made_to_order.
    const hasMadeToOrder = items.some(item => item.fulfillmentType === 'made_to_order');
    const isCodDisabled = hasMadeToOrder;

    // Redirect if cart empty
    if (items.length === 0 && !loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Truck className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold">Your cart is empty</h1>
                        <p className="text-muted-foreground">Add some premium furniture to your cart to proceed with checkout.</p>
                        <Button asChild className="w-full h-12">
                            <Link to="/products">Browse Products</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            toast.error("Please fill all required fields");
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            toast.error("Please enter a valid 6-digit pincode");
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to place an order");
            navigate("/login?redirect=/checkout");
            return;
        }

        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = {
                user: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    landmark: formData.landmark
                },
                items: items.map(item => ({
                    product: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    mrp: item.product.mrp,
                    quantity: item.quantity,
                    selectedColor: item.selectedColor,
                    fulfillmentType: item.fulfillmentType || 'instock',
                    leadTimeDays: item.product.leadTimeDays
                })),
                pricing: {
                    subtotal,
                    gst,
                    shippingCharges,
                    total
                },
                payment: {
                    method: paymentMethod,
                    status: 'pending'
                },
                notes: formData.notes
            };

            const res = await api.post('/orders', orderData);

            if (res.data.success) {
                toast.success("Order placed successfully!");
                clearCart();
                navigate(`/order-success/${res.data.order.orderNumber}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to place order. Please check stock levels.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEOHead
                title="Checkout | SteelShow Digital"
                description="Complete your purchase of premium furniture."
            />

            <div className="bg-muted/30 min-h-screen pb-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
                            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Secure Checkout & Data Protection
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Information Form */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Shipping Information */}
                            <section className="bg-background rounded-2xl border p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">Shipping Information</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name" name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
                                        <Input
                                            id="email" name="email"
                                            placeholder="email@example.com"
                                            value={formData.email} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone" name="phone"
                                            placeholder="10-digit mobile number"
                                            value={formData.phone} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Shipping Address <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="address" name="address"
                                            placeholder="House No, Street Name, Area"
                                            value={formData.address} onChange={handleChange}
                                            className="min-h-[100px] resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="landmark">Landmark</Label>
                                        <Input
                                            id="landmark" name="landmark"
                                            placeholder="Nearby famous place"
                                            value={formData.landmark} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="city" name="city"
                                            placeholder="Ahmedabad"
                                            value={formData.city} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="state" name="state"
                                            placeholder="Gujarat"
                                            value={formData.state} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="pincode" name="pincode"
                                            placeholder="6-digit pin"
                                            value={formData.pincode} onChange={handleChange}
                                            className="h-12"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-background rounded-2xl border p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">Payment Method</h2>
                                </div>

                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(v: any) => setPaymentMethod(v)}
                                    className="grid gap-4"
                                >
                                    <Label
                                        htmlFor="razorpay"
                                        className={cn(
                                            "flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-muted/50",
                                            paymentMethod === 'razorpay' ? "border-primary bg-primary/5" : "border-muted"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <RadioGroupItem value="razorpay" id="razorpay" />
                                            <div className="space-y-0.5">
                                                <div className="font-bold">Pay Online</div>
                                                <div className="text-xs text-muted-foreground">UPI, Cards, Net Banking</div>
                                            </div>
                                        </div>
                                    </Label>

                                    <div className="relative">
                                        <Label
                                            htmlFor="cod"
                                            className={cn(
                                                "flex items-center justify-between p-4 border-2 rounded-xl transition-all",
                                                isCodDisabled ? "opacity-50 cursor-not-allowed bg-muted/20 border-muted grayscale" : "cursor-pointer hover:bg-muted/50",
                                                paymentMethod === 'cod' ? "border-primary bg-primary/5" : "border-muted"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <RadioGroupItem value="cod" id="cod" disabled={isCodDisabled} />
                                                <div className="space-y-0.5">
                                                    <div className="font-bold">Cash on Delivery</div>
                                                    <div className="text-xs text-muted-foreground">Pay when you receive the product</div>
                                                </div>
                                            </div>
                                        </Label>
                                        {isCodDisabled && (
                                            <p className="mt-2 text-[10px] text-amber-600 font-medium px-2 italic">
                                                * COD is restricted for Made to Order items.
                                            </p>
                                        )}
                                    </div>
                                </RadioGroup>
                            </section>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-5 sticky top-8">
                            <aside className="bg-background rounded-2xl border shadow-lg overflow-hidden">
                                <div className="p-6 bg-primary text-primary-foreground">
                                    <h2 className="text-xl font-bold">Order Summary</h2>
                                    <p className="opacity-80 text-sm">{getTotalItems()} items in your cart</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                                        {items.map((item, i) => (
                                            <div key={i} className="flex gap-3 pb-3 border-b last:border-0">
                                                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                                    <img src={item.product.image} className="h-full w-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="text-sm font-bold truncate">{item.product.name}</h4>
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                                                        {item.fulfillmentType === 'instock' ? 'Ready Stock' : 'Made to Order'} x {item.quantity}
                                                    </p>
                                                    <div className="text-sm font-black">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-dashed">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Estimated GST (18%)</span>
                                            <span className="font-bold">₹{gst.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-bold">{shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}</span>
                                        </div>
                                        <div className="pt-4 flex justify-between items-center border-t">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-black text-primary">₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 text-lg font-bold"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Confirm Order'}
                                    </Button>

                                    <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-widest pt-2">
                                        <Lock className="h-3 w-3" /> Secure Payment SSL Encrypted
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
