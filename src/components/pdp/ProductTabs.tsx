import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2,
    Ruler,
    Wrench,
    ShieldCheck,
    Star,
    ThumbsUp,
    Info,
    Layers,
    FileText,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
    product: Product;
}

const AddReviewSection = ({ productId }: { productId: string }) => {
    const { user, isAuthenticated } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/products/${productId}/reviews`, { rating, comment });
            setSubmitted(true);
            toast.success("Review submitted for approval!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800">Review Submitted!</h4>
                <p className="text-sm text-green-700 mt-1">Your review is pending approval and will appear soon.</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 border border-border rounded-xl p-8 text-center space-y-4">
                <h4 className="font-semibold text-foreground">Have you used this product?</h4>
                <p className="text-muted-foreground text-sm">Sign in to share your experience with the community.</p>
                <Button asChild>
                    <Link to="/auth/login">Login to Write a Review</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h4 className="font-semibold text-lg">Write a Review</h4>

            <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={cn(
                                    "h-6 w-6 transition-colors",
                                    star <= rating ? "text-[#FFB800] fill-[#FFB800]" : "text-muted"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                    id="comment"
                    placeholder="Tell us what you think about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="min-h-[100px]"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
};

const ProductTabs = ({ product }: ProductTabsProps) => {
    // Real reviews data
    const reviews = (product.reviews || []).filter(r => r.isApproved); // Only show approved reviews
    const averageRating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;

    // ... (rest of the component logic)

    // Specifications
    const specs = (product.specifications && product.specifications.length > 0)
        ? product.specifications
        : [
            { label: "Brand", value: "STEEL SHOW" },
            { label: "SKU", value: product.sku || "N/A" },
            { label: "Category", value: typeof product.category === 'object' ? product.category.name : (product.category || "Furniture") },
            { label: "Material", value: product.material || "Premium Quality" },
            { label: "Country of Origin", value: "India" }
        ];

    // Dimensions
    const dims = product.dimensions || {};
    const dimensionList = [
        { label: "Seat Height", value: dims.seatHeight },
        { label: "Seat Width", value: dims.seatWidth },
        { label: "Seat Depth", value: dims.seatDepth },
        { label: "Back Height", value: dims.backHeight },
        { label: "Armrest Height", value: dims.armrestHeight },
        { label: "Overall Height", value: dims.overallHeight },
        { label: "Base Diameter", value: dims.baseDiameter },
        { label: "Net Weight", value: dims.netWeight },
    ].filter(d => !!d.value);

    // Warranty
    const warranty = product.warranty || { coverage: [], care: [] };

    // Materials Used
    const materialsUsed = product.materialsUsed || [];

    // Ideal For items
    const idealForItems = product.idealFor && product.idealFor.length > 0
        ? product.idealFor
        : product.applications && product.applications.length > 0
            ? product.applications
            : ["Offices", "Commercial Spaces", "Modern Workspaces"];

    return (
        <div className="w-full bg-white mt-16 px-4 py-12 md:px-6 md:py-16">
            <div className="max-w-[1200px] mx-auto">
                <Tabs defaultValue="features" className="w-full">
                    {/* ... existing tab content ... */}

                    {/* Tabs Navigation - Premium Pill Style */}
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-gray-100/80 p-1.5 rounded-xl h-auto inline-flex overflow-x-auto no-scrollbar max-w-full border border-border">
                            {[
                                { val: "features", label: "Key Features" },
                                { val: "description", label: "Description" },
                                { val: "specs", label: "Specifications" },
                                { val: "dimensions", label: "Dimensions" },
                                { val: "warranty", label: "Warranty & Care" },
                                { val: "reviews", label: `Reviews (${reviewCount})` }
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.val}
                                    value={tab.val}
                                    className="rounded-lg px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Tab Contents */}

                    {/* 1. Key Features Tab */}
                    <TabsContent value="features" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-8 md:p-12 space-y-12">
                                <div>
                                    <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground mb-8">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {product.features?.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-border transition-all duration-200"
                                            >
                                                <div className="bg-[#22C55E]/10 p-1.5 rounded-full shrink-0">
                                                    <Check className="h-4 w-4 text-[#22C55E]" />
                                                </div>
                                                <span className="text-[14px] md:text-[15px] font-medium text-muted-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border/40">
                                    <h3 className="text-[18px] font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <Info className="h-5 w-5 text-foreground" />
                                        Ideal For
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {idealForItems.map((item, index) => (
                                            <span
                                                key={index}
                                                className="px-5 py-2 bg-gray-100/50 text-muted-foreground rounded-full text-[14px] font-medium transition-colors hover:bg-border/40"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 2. Description Tab */}
                    <TabsContent value="description" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-10 md:p-16">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h3 className="text-[22px] font-semibold text-foreground mb-8">Product Description</h3>
                                    <div className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] whitespace-pre-line text-left">
                                        {product.longDescription || product.description || "Designed with excellence and manufactured with premium materials, this product offers unparalleled durability and style for modern spaces. Every detail is crafted to ensure a perfect balance of form and function."}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 3. Specifications Tab */}
                    <TabsContent value="specs" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-8 md:p-12">
                                <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground mb-8">Technical Specifications</h3>
                                <div className="rounded-xl border border-border overflow-hidden">
                                    <table className="w-full text-left">
                                        <tbody>
                                            {specs.map((spec, index) => (
                                                <tr
                                                    key={index}
                                                    className={cn(
                                                        "border-b last:border-0",
                                                        index % 2 === 0 ? "bg-card" : "bg-gray-50/30"
                                                    )}
                                                >
                                                    <td className="py-4 px-6 text-[14px] font-bold text-foreground w-1/3 border-r border-border">{spec.label}</td>
                                                    <td className="py-4 px-6 text-[14px] font-medium text-muted-foreground">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 4. Dimensions Tab */}
                    <TabsContent value="dimensions" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-8 md:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                                    <div>
                                        <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground mb-8">Product Dimensions</h3>
                                        <div className="rounded-xl border border-border overflow-hidden">
                                            <table className="w-full text-left">
                                                <tbody>
                                                    {dimensionList.map((dim, index) => (
                                                        <tr
                                                            key={index}
                                                            className={cn(
                                                                "border-b last:border-0",
                                                                index % 2 === 0 ? "bg-card" : "bg-gray-50/30"
                                                            )}
                                                        >
                                                            <td className="py-4 px-6 text-[14px] font-bold text-foreground w-1/2 border-r border-border">{dim.label}</td>
                                                            <td className="py-4 px-6 text-[14px] font-medium text-muted-foreground">{dim.value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground mb-8">Build Components</h3>
                                        <div className="space-y-4">
                                            {materialsUsed.map((material, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-border transition-all duration-200"
                                                >
                                                    <div className="bg-[#22C55E]/10 p-1.5 rounded-full shrink-0">
                                                        <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                                                    </div>
                                                    <span className="text-[14px] font-medium text-muted-foreground">{material}</span>
                                                </div>
                                            ))}
                                            {materialsUsed.length === 0 && (
                                                <div className="p-6 bg-gray-50/30 rounded-xl border-2 border-dashed border-border text-center text-muted-foreground text-sm">
                                                    Standard high-quality components used in manufacturing.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 5. Warranty & Care Tab */}
                    <TabsContent value="warranty" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-8 md:p-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                    <div className="space-y-8">
                                        <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground flex items-center gap-3">
                                            <ShieldCheck className="h-6 w-6 text-[#22C55E]" />
                                            Warranty Coverage
                                        </h3>
                                        <ul className="space-y-4">
                                            {(product.warranty?.coverage && product.warranty.coverage.length > 0) ? product.warranty.coverage.map((line, i) => (
                                                <li key={i} className="flex gap-4 p-4 bg-gray-50/50 rounded-xl items-start group hover:bg-secondary/60 transition-colors duration-200">
                                                    <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0" />
                                                    <span className="text-[14px] font-medium text-muted-foreground leading-snug">{line}</span>
                                                </li>
                                            )) : (
                                                <div className="p-6 bg-gray-50/30 rounded-xl border border-dashed border-border flex items-center gap-4">
                                                    <ShieldCheck className="h-10 w-10 text-border" />
                                                    <p className="text-sm font-medium text-muted-foreground">Standard 1-year manufacturing warranty applies.</p>
                                                </div>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-[20px] md:text-[22px] font-semibold text-foreground flex items-center gap-3">
                                            <Wrench className="h-6 w-6 text-foreground" />
                                            Care Instructions
                                        </h3>
                                        <ul className="space-y-4">
                                            {(product.warranty?.care && product.warranty.care.length > 0) ? product.warranty.care.map((line, i) => (
                                                <li key={i} className="flex gap-4 p-4 bg-gray-50/50 rounded-xl items-start group hover:bg-secondary/60 transition-colors duration-200">
                                                    <Wrench className="h-5 w-5 text-foreground shrink-0 opacity-70" />
                                                    <span className="text-[14px] font-medium text-muted-foreground leading-snug">{line}</span>
                                                </li>
                                            )) : (
                                                <div className="p-6 bg-gray-50/30 rounded-xl border border-dashed border-border flex items-center gap-4">
                                                    <Wrench className="h-10 w-10 text-border" />
                                                    <p className="text-sm font-medium text-muted-foreground">Use mild cleaners and avoid direct sunlight.</p>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

// 6. Reviews Tab
                    <TabsContent value="reviews" className="focus-visible:ring-0 mt-0">
                        <Card className="bg-card rounded-2xl border-border shadow-none overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                            <CardContent className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
                                    <div>
                                        <h3 className="text-[22px] font-semibold text-foreground mb-2">Customer Reviews</h3>
                                        <p className="text-sm text-muted-foreground font-medium">Real feedback from verified purchasers</p>
                                    </div>
                                    <div className="flex items-center gap-8 bg-gray-50/50 p-8 rounded-2xl border border-border">
                                        <div className="text-center">
                                            <p className="text-[42px] font-bold text-foreground leading-none">{averageRating}</p>
                                            <div className="flex gap-0.5 mt-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "h-4 w-4",
                                                            star <= Math.floor(averageRating)
                                                                ? "text-[#FFB800] fill-[#FFB800]"
                                                                : "text-muted"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-3">Based on {reviewCount} reviews</p>
                                        </div>
                                    </div>
                                </div>

                                <AddReviewSection productId={product.id || product._id} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                    {reviews.length > 0 ? reviews.map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="p-8 bg-card border border-border/60 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-border"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-foreground">{review.name}</span>
                                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                                                                <Check className="h-3 w-3" />
                                                                Verified
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={cn(
                                                                            "h-3 w-3",
                                                                            star <= review.rating
                                                                                ? "text-[#FFB800] fill-[#FFB800]"
                                                                                : "text-muted"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-[14px] leading-relaxed italic">"{review.comment}"</p>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 text-center py-20 bg-gray-50/30 rounded-2xl border-2 border-dashed border-border flex flex-col items-center">
                                            <Star className="h-12 w-12 text-border mb-4" />
                                            <p className="text-xl font-semibold text-foreground">No reviews yet</p>
                                            <p className="text-muted-foreground mt-2">Be the first to share your experience with this product!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ProductTabs;
