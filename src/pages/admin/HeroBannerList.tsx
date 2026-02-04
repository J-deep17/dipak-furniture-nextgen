import { useState, useEffect, useRef } from "react";
import { api, fetchProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Image as ImageIcon, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { HeroBanner, Hotspot, Product } from "@/types";

const HeroBannerList = () => {
    const [banners, setBanners] = useState<HeroBanner[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const { toast } = useToast();
    const imageRef = useRef<HTMLImageElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "",
        buttonText: "Browse Products",
        buttonLink: "/products",
        order: 0,
        isActive: true,
        transitionEffect: "fade",
        imageEffect: "none",
    });

    useEffect(() => {
        fetchBanners();
        loadProducts();
    }, []);

    const fetchBanners = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/hero-banners/admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBanners(response.data);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            toast({
                title: "Error",
                description: "Failed to load hero banners",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const token = localStorage.getItem("token");
            const response = await api.post("/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.path;
        } catch (error: any) {
            console.error("Upload error details:", error);
            throw error;
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newHotspot: Hotspot = {
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
            label: "",
            productId: "",
        };

        setHotspots([...hotspots, newHotspot]);
    };

    const updateHotspot = (index: number, data: Partial<Hotspot>) => {
        const updated = [...hotspots];
        updated[index] = { ...updated[index], ...data };

        // If product is selected, auto-fill label
        if (data.productId) {
            const prod = products.find(p => p._id === data.productId || p.id === data.productId);
            if (prod) updated[index].label = prod.name;
        }

        setHotspots(updated);
    };

    const removeHotspot = (index: number) => {
        setHotspots(hotspots.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            let imagePath = formData.image;

            if (!editingBanner && !imageFile) {
                toast({ title: "Error", description: "Image is required", variant: "destructive" });
                return;
            }

            if (imageFile) imagePath = await uploadImage(imageFile);
            if (editingBanner && !imageFile) imagePath = editingBanner.image;

            const bannerData = {
                ...formData,
                image: imagePath,
                hotspots: hotspots.map(h => ({
                    ...h,
                    productId: h.productId === "" ? undefined : h.productId
                }))
            };

            if (editingBanner) {
                await api.put(`/hero-banners/${editingBanner._id}`, bannerData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast({ title: "Success", description: "Banner updated" });
            } else {
                await api.post("/hero-banners", bannerData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast({ title: "Success", description: "Banner created" });
            }

            setIsDialogOpen(false);
            resetForm();
            fetchBanners();
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to save banner", variant: "destructive" });
        }
    };

    const handleEdit = (banner: HeroBanner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle,
            image: banner.image,
            buttonText: banner.buttonText || "Browse Products",
            buttonLink: banner.buttonLink || "/products",
            order: banner.order,
            isActive: banner.isActive,
            transitionEffect: banner.transitionEffect || "fade",
            imageEffect: banner.imageEffect || "none",
        });
        setHotspots(banner.hotspots || []);
        setImagePreview(banner.image);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/hero-banners/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Deleted", description: "Banner removed" });
            fetchBanners();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            subtitle: "",
            image: "",
            buttonText: "Browse Products",
            buttonLink: "/products",
            order: 0,
            isActive: true,
            transitionEffect: "fade",
            imageEffect: "none",
        });
        setHotspots([]);
        setEditingBanner(null);
        setImageFile(null);
        setImagePreview("");
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">Hero Manager</h2>
                    <p className="text-slate-500 font-medium">Create interactive, high-conversion hero banners.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all" onClick={resetForm}>
                            <Plus className="mr-2 h-5 w-5" />
                            Create Banner
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{editingBanner ? "Refine Banner" : "Create New Slide"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
                            {/* Left: Form Fields */}
                            <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Main Title</Label>
                                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Luxury Executive Seating" className="h-12 border-slate-200 focus:border-accent" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Compelling Subtitle</Label>
                                    <Textarea value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Write a description that converts..." rows={3} className="border-slate-200 focus:border-accent" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Button Text</Label>
                                        <Input value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Target Link</Label>
                                        <Input value={formData.buttonLink} onChange={e => setFormData({ ...formData, buttonLink: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Banner Background</Label>
                                    <div className="flex items-center gap-4">
                                        <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="banner-upload" />
                                        <label htmlFor="banner-upload" className="flex-1 flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all">
                                            <ImageIcon className="mr-3 h-5 w-5 text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-600">Select High-Res Image</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Transition Effect</Label>
                                        <Select
                                            value={formData.transitionEffect}
                                            onValueChange={v => setFormData({ ...formData, transitionEffect: v as any })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selection Transition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fade">Dissolve / Fade</SelectItem>
                                                <SelectItem value="slide-left">Slide Left</SelectItem>
                                                <SelectItem value="slide-right">Slide Right</SelectItem>
                                                <SelectItem value="zoom-in">Zoom Transition</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Image Animation</Label>
                                        <Select
                                            value={formData.imageEffect}
                                            onValueChange={v => setFormData({ ...formData, imageEffect: v as any })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Effect" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None (Static)</SelectItem>
                                                <SelectItem value="zoom-in">Slow Zoom In</SelectItem>
                                                <SelectItem value="zoom-out">Slow Zoom Out</SelectItem>
                                                <SelectItem value="subtle-pan">Subtle Pan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Display Position</Label>
                                        <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-20" />
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg px-4">
                                        <Label className="text-sm font-bold text-slate-600">Live Status</Label>
                                        <Switch checked={formData.isActive} onCheckedChange={c => setFormData({ ...formData, isActive: c })} />
                                    </div>
                                </div>
                            </form>

                            {/* Right: Interactive Editor Overlay */}
                            <div className="space-y-4">
                                <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 block">Interactive Hotspots</Label>
                                <p className="text-xs text-slate-400 mb-2">Click on the image below to drop a product marker.</p>

                                <div
                                    className="relative rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner group/preview cursor-crosshair min-h-[300px] flex items-center justify-center bg-slate-50"
                                    onClick={handleImageClick}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img ref={imageRef} src={imagePreview} className="max-w-full block select-none" alt="Preview" />
                                            {hotspots.map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-8 h-8 -ml-4 -mt-4 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-primary animate-in zoom-in-50"
                                                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                                                >
                                                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="text-slate-400 flex flex-col items-center">
                                            <ImageIcon size={48} className="mb-2 opacity-20" />
                                            <span>Upload an image to start tagging</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hotspot List with scroll */}
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {hotspots.map((h, i) => (
                                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-center group animate-in slide-in-from-right-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <Select value={h.productId} onValueChange={v => updateHotspot(i, { productId: v })}>
                                                    <SelectTrigger className="h-9 truncate bg-white">
                                                        <SelectValue placeholder="Link a Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map(p => (
                                                            <SelectItem key={p._id || p.id} value={p._id || p.id as string}>
                                                                {p.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Input value={h.label} onChange={e => updateHotspot(i, { label: e.target.value })} placeholder="Custom Label" className="h-9 bg-white" />
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeHotspot(i)}>
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6">Cancel</Button>
                            <Button type="submit" form="banner-form" className="rounded-full px-8 bg-slate-900 hover:bg-black shadow-lg">Save Configuration</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {banners.length === 0 ? (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-20">
                        <div className="p-6 bg-white rounded-3xl shadow-sm mb-6">
                            <ImageIcon className="h-12 w-12 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-xl">No Active Banners</p>
                        <p className="text-slate-400 mt-2">Create your first experience to engage customers.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {banners.map((banner) => (
                        <Card key={banner._id} className="group overflow-hidden rounded-3xl border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white">
                            <div className="relative aspect-video bg-slate-100">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${banner.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                                        {banner.isActive ? 'Live' : 'Hidden'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">Pos: {banner.order}</span>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    {banner.title && <h3 className="text-white font-bold text-lg line-clamp-1 truncate">{banner.title}</h3>}
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <MapPin size={12} className="text-accent" />
                                        <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">{banner.hotspots?.length || 0} Interactive Hotspots</span>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-5 flex gap-3">
                                <Button variant="outline" size="lg" onClick={() => handleEdit(banner)} className="flex-1 rounded-full border-slate-200 font-bold text-slate-700 hover:bg-slate-50">
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="ghost" size="lg" onClick={() => handleDelete(banner._id)} className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroBannerList;

