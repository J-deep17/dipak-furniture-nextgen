import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, X, Plus, Trash2, ChevronDown, ChevronRight, Wand2, RefreshCw } from "lucide-react";
import { api, getFullImageUrl } from "@/lib/api";

const ProductForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    // AI Auto-Fill State
    const [aiImage, setAiImage] = useState<File | null>(null);
    const [aiImagePreview, setAiImagePreview] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSettings, setAiSettings] = useState({
        brandName: 'Dipak Furniture',
        positioning: 'Premium',
        targetMarket: 'Home'
    });
    const [openAiSection, setOpenAiSection] = useState(true);
    const [regeneratingField, setRegeneratingField] = useState<string | null>(null);
    const aiFileInputRef = useRef<HTMLInputElement>(null);

    // Existing images from DB (for edit mode)
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);

    // Reviews Manager
    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

    // Specifications Manager
    const [specifications, setSpecifications] = useState<{ label: string, value: string }[]>([
        { label: 'Brand', value: 'Dipak Furniture' },
        { label: 'Back Type', value: 'High Back' },
        { label: 'Upholstery Material', value: 'Premium Leatherette' },
        { label: 'Frame Material', value: 'Metal & Engineered Wood' },
        { label: 'Weight Capacity', value: 'Up to 120 kg' },
        { label: 'Warranty', value: '1 Year Manufacturing Warranty' },
        { label: 'Country of Origin', value: 'India' },
        { label: 'Manufacturer', value: 'Dipak Furniture, Ahmedabad' }
    ]);

    // Color System
    interface ProductColor {
        name: string;
        hex: string;
        sku?: string;
        stock?: number;
        status?: string;
        images: string[]; // URLs
        newImages: File[]; // Uploads
        previews: string[]; // Local previews for new images
    }

    const [productColors, setProductColors] = useState<ProductColor[]>([
        { name: 'Brown', hex: '#5D4037', images: [], newImages: [], previews: [] },
        { name: 'Ivory White', hex: '#FFFFF0', images: [], newImages: [], previews: [] },
        { name: 'Jet Black', hex: '#000000', images: [], newImages: [], previews: [] },
        { name: 'Custom Colors Available', hex: '#808080', images: [], newImages: [], previews: [] }
    ]);

    // Collapsible states
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        basic: true,
        details: true,
        colors: true,
        specs: false,
        dimensions: false,
        materials: false,
        warranty: false,
        reviews: false,
        images: true,
        seo: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();

    useEffect(() => {
        if (productColors && productColors.length > 0) {
            const totalStock = productColors.reduce((acc, c) => acc + (c.stock ? Number(c.stock) : 0), 0);
            setValue('stock', totalStock);
        }
    }, [productColors, setValue]);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const res = await api.get('/categories');
            setCategories(res.data);

            if (!isEditMode) {
                // Pre-fill fields for new product
                setValue('name', 'Director HB Premium');
                const targetCat = res.data.find((c: any) => c.name.includes('Executive & Director') || c.name === 'Executive & Director Chairs');
                if (targetCat) {
                    setValue('category', targetCat._id);
                }
            }
        };
        fetchCategoriesData();

        if (isEditMode) {
            const fetchProduct = async () => {
                const res = await api.get(`/products/${id}`);
                const data = res.data;

                // Set form values
                setValue('name', data.name);
                setValue('sku', data.sku);
                setValue('category', data.category?._id || data.category);
                setValue('price', data.price);
                setValue('mrp', data.mrp);
                setValue('shortDescription', data.shortDescription);
                setValue('longDescription', data.longDescription);
                setValue('features', data.features?.join('\n'));
                setValue('material', data.material);
                setValue('idealFor', data.idealFor?.join('\n'));

                // Inventory & Fulfillment
                setValue('stock', data.stock);
                setValue('minStock', data.minStock);
                setValue('allowBackorder', data.allowBackorder);
                setValue('fulfillmentType', data.fulfillmentType || 'instock');
                setValue('leadTimeDays', data.leadTimeDays || 7);

                // Load Colors with Images
                // Load Colors with Images & Inventory
                if (data.colors && data.colors.length > 0) {
                    const parsedColors = data.colors.map((c: any) => ({
                        name: c.name,
                        hex: c.hex,
                        sku: c.sku || '',
                        stock: c.stock || 0,
                        status: c.status || 'In Stock',
                        images: c.images || [],
                        newImages: [],
                        previews: []
                    }));
                    setProductColors(parsedColors);
                } else {
                    setProductColors([]);
                }

                setValue('seoTitle', data.seoTitle);
                setValue('seoDescription', data.seoDescription);
                setValue('seoKeywords', data.seoKeywords?.join(', '));
                setValue('tags', data.tags?.join(', '));
                setValue('isBestSeller', data.isBestSeller);
                setValue('isNewLaunch', data.isNewLaunch);
                setValue('isFeatured', data.isFeatured);

                // Dimensions
                if (data.dimensions) {
                    setValue('dim_seatHeight', data.dimensions.seatHeight);
                    setValue('dim_seatWidth', data.dimensions.seatWidth);
                    setValue('dim_seatDepth', data.dimensions.seatDepth);
                    setValue('dim_backHeight', data.dimensions.backHeight);
                    setValue('dim_armrestHeight', data.dimensions.armrestHeight);
                    setValue('dim_overallHeight', data.dimensions.overallHeight);
                    setValue('dim_baseDiameter', data.dimensions.baseDiameter);
                    setValue('dim_netWeight', data.dimensions.netWeight);
                }

                // Materials Used
                setValue('materialsUsed', data.materialsUsed?.join('\n'));

                // Warranty
                if (data.warranty) {
                    setValue('warranty_coverage', data.warranty.coverage?.join('\n'));
                    setValue('warranty_care', data.warranty.care?.join('\n'));
                }

                setExistingThumbnail(data.thumbnail);
                setExistingImages(data.images || []);
                setReviews(data.reviews || []);
                if (data.specifications && data.specifications.length > 0) {
                    setSpecifications(data.specifications);
                }
            };
            fetchProduct();
        }
    }, [id, setValue, isEditMode]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addReview = () => {
        if (!newReview.name || !newReview.comment) {
            toast.error("Please fill name and comment");
            return;
        }
        setReviews(prev => [...prev, { ...newReview, createdAt: new Date() }]);
        setNewReview({ name: '', rating: 5, comment: '' });
    };

    const deleteReview = (index: number) => {
        setReviews(prev => prev.filter((_, i) => i !== index));
    };

    const addSpec = () => {
        setSpecifications([...specifications, { label: '', value: '' }]);
    };

    const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    const deleteSpec = (index: number) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    const addColor = () => {
        setProductColors([...productColors, { name: '', hex: '#000000', images: [], newImages: [], previews: [] }]);
    };

    const updateColor = (index: number, field: string, value: any) => {
        const newColors = [...productColors];
        // @ts-ignore
        newColors[index][field] = value;
        setProductColors(newColors);
    };

    const deleteColor = (index: number) => {
        setProductColors(productColors.filter((_, i) => i !== index));
    };

    const handleColorImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviews = files.map(file => URL.createObjectURL(file));

            const newColors = [...productColors];
            newColors[index].newImages = [...newColors[index].newImages, ...files];
            newColors[index].previews = [...newColors[index].previews, ...newPreviews];
            setProductColors(newColors);
        }
    };

    const removeColorImage = (colorIndex: number, type: 'existing' | 'new', imgIndex: number) => {
        const newColors = [...productColors];
        if (type === 'existing') {
            newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imgIndex);
        } else {
            newColors[colorIndex].newImages = newColors[colorIndex].newImages.filter((_, i) => i !== imgIndex);
            newColors[colorIndex].previews = newColors[colorIndex].previews.filter((_, i) => i !== imgIndex);
        }
        setProductColors(newColors);
    };

    const handleAIGenerate = async () => {
        if (!aiImage) {
            toast.error("Please upload an image first");
            return;
        }

        setAiLoading(true);
        const formData = new FormData();
        formData.append('image', aiImage);
        formData.append('brandName', aiSettings.brandName);
        formData.append('positioning', aiSettings.positioning);
        formData.append('targetMarket', aiSettings.targetMarket);

        try {
            const res = await api.post('/ai/generate', formData);
            const data = res.data;

            // Auto-fill form fields
            setValue('name', data.name);
            setValue('shortDescription', data.shortDescription);
            setValue('longDescription', data.longDescription);
            setValue('features', Array.isArray(data.features) ? data.features.join('\n') : data.features);
            setValue('materialsUsed', Array.isArray(data.materialsUsed) ? data.materialsUsed.join('\n') : data.materialsUsed);
            setValue('idealFor', Array.isArray(data.idealFor) ? data.idealFor.join('\n') : data.idealFor);
            setValue('warranty_coverage', Array.isArray(data.warranty_coverage) ? data.warranty_coverage.join('\n') : data.warranty_coverage);
            setValue('warranty_care', Array.isArray(data.warranty_care) ? data.warranty_care.join('\n') : data.warranty_care);
            setValue('seoTitle', data.seoTitle);
            setValue('seoDescription', data.seoDescription);
            setValue('seoKeywords', Array.isArray(data.seoKeywords) ? data.seoKeywords.join(', ') : data.seoKeywords);
            setValue('sku', data.sku);

            if (data.price) setValue('price', data.price);
            if (data.mrp) setValue('mrp', data.mrp);

            // Handle Colors
            if (data.colors && Array.isArray(data.colors)) {
                setProductColors(data.colors.map((c: any) => ({
                    name: c.name || '',
                    hex: c.hex || '#000000',
                    images: c.images || [], // AI might return images if we support it later
                    newImages: [],
                    previews: []
                })));
            }

            // Handle Specifications
            if (data.specifications && Array.isArray(data.specifications)) {
                setSpecifications(data.specifications.map((s: any) => ({ label: s.label || '', value: s.value || '' })));
            }

            // Handle Dimensions
            if (data.dimensions) {
                setValue('dim_seatHeight', data.dimensions.seatHeight);
                setValue('dim_seatWidth', data.dimensions.seatWidth);
                setValue('dim_seatDepth', data.dimensions.seatDepth);
                setValue('dim_backHeight', data.dimensions.backHeight);
                setValue('dim_armrestHeight', data.dimensions.armrestHeight);
                setValue('dim_overallHeight', data.dimensions.overallHeight);
                setValue('dim_baseDiameter', data.dimensions.baseDiameter);
                setValue('dim_netWeight', data.dimensions.netWeight);
            }

            // Handle Category (Simple matching logic)
            if (data.category) {
                const match = categories.find((c: any) => c.name.toLowerCase().includes(data.category.toLowerCase()));
                if (match) {
                    setValue('category', match._id);
                }
                // If subcategory match is better
                if (data.subCategory) {
                    const subMatch = categories.find((c: any) => c.name.toLowerCase().includes(data.subCategory.toLowerCase()));
                    if (subMatch) {
                        setValue('category', subMatch._id);
                    }
                }
            }

            // Set as thumbnail if none
            if (!thumbnail && !isEditMode) {
                setThumbnail(aiImage);
                setThumbnailPreview(aiImagePreview);
            }
            // Add to gallery
            setImages(prev => [...prev, aiImage]);
            setImagePreviews(prev => [...prev, aiImagePreview!]);


            toast.success("Product data generated successfully!");
            setOpenAiSection(false); // Collapse AI section
            setOpenSections(prev => ({ ...prev, basic: true, details: true, specs: true, materials: true, warranty: true, seo: true }));

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to generate product data");
        } finally {
            setAiLoading(false);
        }
    };

    const handleRegenerateContent = async (fieldName: string, label: string) => {
        if (!aiImage) {
            toast.error("Please ensure an image is uploaded in the AI section first.");
            return;
        }

        setRegeneratingField(fieldName);
        const formData = new FormData();
        formData.append('image', aiImage);
        formData.append('fieldName', fieldName);
        formData.append('brandName', aiSettings.brandName);
        formData.append('positioning', aiSettings.positioning);
        formData.append('currentVal', watch(fieldName) || '');

        try {
            const res = await api.post('/ai/regenerate', formData);
            const { result } = res.data;

            if (fieldName === 'features') {
                try {
                    const parsed = JSON.parse(result);
                    setValue(fieldName, Array.isArray(parsed) ? parsed.join('\n') : parsed);
                } catch (e) {
                    setValue(fieldName, result);
                }
            } else {
                setValue(fieldName, result);
            }
            toast.success(`${label} regenerated!`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to regenerate ${label}`);
        } finally {
            setRegeneratingField(null);
        }
    };

    const RegenerateButton = ({ field, label }: { field: string, label: string }) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
            onClick={() => handleRegenerateContent(field, label)}
            disabled={!aiImage || regeneratingField === field}
            title={`Regenerate ${label} with AI`}
        >
            <RefreshCw className={`h-3 w-3 mr-1 ${regeneratingField === field ? 'animate-spin' : ''}`} />
            Regenerate
        </Button>
    );

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Construct base data object
            const productDataRaw = {
                ...data,
                price: data.price ? Number(data.price) : undefined,
                mrp: data.mrp ? Number(data.mrp) : undefined,
                discountPercent: data.discountPercent ? Number(data.discountPercent) : 0,
                rating: 0,
                // Arrays/Objects
                features: data.features,
                idealFor: data.idealFor,
                // Inventory
                stock: data.stock ? Number(data.stock) : 0,
                minStock: data.minStock ? Number(data.minStock) : 5,
                allowBackorder: data.allowBackorder || false,

                materialsUsed: data.materialsUsed,
                warranty: {
                    coverage: data.warranty_coverage,
                    care: data.warranty_care
                },
                dimensions: {
                    seatHeight: data.dim_seatHeight,
                    seatWidth: data.dim_seatWidth,
                    seatDepth: data.dim_seatDepth,
                    backHeight: data.dim_backHeight,
                    armrestHeight: data.dim_armrestHeight,
                    overallHeight: data.dim_overallHeight,
                    baseDiameter: data.dim_baseDiameter,
                    netWeight: data.dim_netWeight
                },
                specifications: specifications.filter(s => s.label.trim() !== ''),
                colors: productColors.filter(c => c.name.trim() !== ''),
                seoKeywords: data.seoKeywords ? data.seoKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k !== '') : [],
                tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((k: string) => k.trim()).filter((k: string) => k !== '') : []),
                isBestSeller: data.isBestSeller,
                isNewLaunch: data.isNewLaunch,
                isFeatured: data.isFeatured,
                reviews: reviews
            };

            if (true) { // Unified logic for both Create and Update
                const formData = new FormData();

                // 1. Append Base Fields
                Object.keys(productDataRaw).forEach(key => {
                    const val = (productDataRaw as any)[key];
                    if (key === 'images' || key === 'thumbnail' || key === 'colors') return; // Skip special fields

                    if (key === 'dimensions' || key === 'warranty' || key === 'specifications' || key === 'reviews') {
                        formData.append(key, JSON.stringify(val));
                    } else if (key === 'seoKeywords' || key === 'tags') {
                        formData.append(key, (val || []).join(','));
                    } else if (key === 'features' || key === 'idealFor' || key === 'materialsUsed') {
                        formData.append(key, val || '');
                    } else if (val !== undefined) {
                        formData.append(key, String(val));
                    }
                });

                // 2. Append Colors (Clean JSON) and Color Images
                // Prepare clean colors array for JSON
                const cleanColors = productColors
                    .filter(c => c.name.trim() !== '')
                    .map(c => ({
                        name: c.name,
                        hex: c.hex,
                        sku: c.sku || `${data.sku}-${c.name}`.replace(/\s+/g, '-').toUpperCase(),
                        stock: Number(c.stock) || 0,
                        status: c.status || 'In Stock',
                        images: c.images || [] // Existing images (URLs)
                    }));
                formData.append('colors', JSON.stringify(cleanColors));

                // Append new images for each color
                productColors.forEach((color, index) => {
                    if (color.name.trim() !== '' && color.newImages && color.newImages.length > 0) {
                        color.newImages.forEach(file => {
                            formData.append(`color_${index}_images`, file);
                        });
                    }
                });

                // 3. Files
                if (thumbnail instanceof File) {
                    formData.append('thumbnail', thumbnail);
                }

                // Existing Images (for main gallery)
                existingImages.forEach(img => formData.append('existingImages', img));

                // New Images (for main gallery)
                images.forEach(img => {
                    if (img instanceof File) formData.append('images', img);
                });

                if (isEditMode) {
                    await api.put(`/products/${id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    await api.post('/products', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
            }

            toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
            navigate('/admin/products');

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ title, id }: { title: string, id: string }) => (
        <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection(id)}
        >
            <div className="flex items-center justify-between w-full">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                {openSections[id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
        </CardHeader>
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* AI Auto-Fill Section */}
                <Card className="border-2 border-primary/20 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Wand2 className="w-40 h-40" />
                    </div>
                    <CardHeader
                        className="cursor-pointer bg-primary/5 transition-colors"
                        onClick={() => setOpenAiSection(!openAiSection)}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                    <Wand2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                        AI Product Auto-Fill
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Upload an image and let AI build your product page</p>
                                </div>
                            </div>
                            {openAiSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </div>
                    </CardHeader>
                    {openAiSection && (
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Image Upload */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">1. Upload Product Image</Label>
                                    <div
                                        onClick={() => aiFileInputRef.current?.click()}
                                        className="border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors h-64 relative bg-muted/10 cursor-pointer"
                                    >
                                        {aiImagePreview ? (
                                            <>
                                                <img src={aiImagePreview} alt="Preview" className="h-full w-full object-contain rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAiImage(null);
                                                        setAiImagePreview(null);
                                                        if (aiFileInputRef.current) aiFileInputRef.current.value = '';
                                                    }}
                                                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-background p-4 rounded-full shadow-sm">
                                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={aiFileInputRef}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            setAiImage(file);
                                                            setAiImagePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    accept="image/*"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Settings & Action */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">2. Advanced Settings</Label>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label>Brand Name</Label>
                                                <Input
                                                    value={aiSettings.brandName}
                                                    onChange={(e) => setAiSettings({ ...aiSettings, brandName: e.target.value })}
                                                    placeholder="Dipak Furniture"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Positioning</Label>
                                                    <Select value={aiSettings.positioning} onValueChange={(val) => setAiSettings({ ...aiSettings, positioning: val })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Budget">Budget</SelectItem>
                                                            <SelectItem value="Mid-range">Mid-range</SelectItem>
                                                            <SelectItem value="Premium">Premium</SelectItem>
                                                            <SelectItem value="Luxury">Luxury</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Target Market</Label>
                                                    <Select value={aiSettings.targetMarket} onValueChange={(val) => setAiSettings({ ...aiSettings, targetMarket: val })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Home">Home</SelectItem>
                                                            <SelectItem value="Office">Office</SelectItem>
                                                            <SelectItem value="Commercial">Commercial</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                                            onClick={handleAIGenerate}
                                            disabled={aiLoading || !aiImage}
                                        >
                                            {aiLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Analyzing Image...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Wand2 className="h-5 w-5" />
                                                    Generate Product Data
                                                </div>
                                            )}
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-2">
                                            AI will analyze the image and auto-fill all sections below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
                {/* Basic Information */}
                <Card>
                    <SectionHeader title="Basic Information" id="basic" />
                    {openSections.basic && (
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Product Name</Label>
                                        <RegenerateButton field="name" label="Name" />
                                    </div>
                                    <Input {...register('name', { required: true })} placeholder="Executive Chair" />
                                    {errors.name && <span className="text-red-500 text-sm">Required</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label>SKU / Model Number</Label>
                                    <Input {...register('sku', { required: true })} placeholder="CH-001" />
                                    {errors.sku && <span className="text-red-500 text-sm">Required</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Category</Label>
                                    <Select onValueChange={(val) => setValue('category', val)} value={watch('category')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.filter(c => !c.parent).map(parent => (
                                                <div key={parent._id}>
                                                    <SelectItem value={parent._id}>{parent.name}</SelectItem>
                                                    {categories.filter(c => (c.parent?._id || c.parent) === parent._id).map(sub => (
                                                        <SelectItem key={sub._id} value={sub._id} className="pl-6">
                                                            — {sub.name}
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>MRP (₹)</Label>
                                    <Input type="number" {...register('mrp')} placeholder="10000" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Offer Price (₹)</Label>
                                    <Input type="number" {...register('price')} placeholder="5000" />
                                </div>
                            </div>

                            {watch('mrp') && watch('price') && (Number(watch('mrp')) > Number(watch('price'))) && (
                                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                                    🎉 <span className="font-bold">{Math.round(((Number(watch('mrp')) - Number(watch('price'))) / Number(watch('mrp'))) * 100)}% Discount</span> will be displayed.
                                </div>
                            )}

                            {/* Fulfillment Settings */}
                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-primary" />
                                    Fulfillment Settings
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Fulfillment Type</Label>
                                        <Select
                                            onValueChange={(val) => setValue('fulfillmentType', val)}
                                            value={watch('fulfillmentType') || 'instock'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="instock">In Stock (Inventory Based)</SelectItem>
                                                <SelectItem value="made_to_order">Made to Order (Always Available)</SelectItem>
                                                <SelectItem value="hybrid">Hybrid (Both Options)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground italic">
                                            Determines behavior for stock and payment.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Manufacturing Lead Time (Days)</Label>
                                        <Input type="number" {...register('leadTimeDays')} placeholder="7" />
                                        <p className="text-xs text-muted-foreground italic">
                                            Required for Made to Order items.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base font-semibold">Inventory Management</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Total Stock</Label>
                                        <Input type="number" {...register('stock')} placeholder="100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Min Stock Alert</Label>
                                        <Input type="number" {...register('minStock')} placeholder="5" />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Checkbox
                                            id="allowBackorder"
                                            checked={watch('allowBackorder')}
                                            onCheckedChange={(c) => setValue('allowBackorder', c)}
                                        />
                                        <Label htmlFor="allowBackorder">Allow Backorders?</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Product Tags Manager */}
                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base font-semibold">Product Tags & Badges</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {["New Launch", "Best Seller", "Hot Selling", "Limited Offer", "Online Exclusive"].map((tag) => {
                                        // Helper to check if tag is selected in comma-separated string or array
                                        const currentTags = watch('tags') || "";
                                        const isSelected = Array.isArray(currentTags)
                                            ? currentTags.includes(tag)
                                            : typeof currentTags === 'string' && currentTags.split(',').map(t => t.trim()).includes(tag);

                                        return (
                                            <div key={tag} className="flex items-center space-x-2 border p-3 rounded hover:bg-accent/50 transition-colors">
                                                <Checkbox
                                                    id={`tag-${tag}`}
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => {
                                                        const current = watch('tags');
                                                        let newTags: string[] = [];

                                                        // Normalize current tags to array
                                                        if (Array.isArray(current)) {
                                                            newTags = [...current];
                                                        } else if (typeof current === 'string' && current.trim() !== '') {
                                                            newTags = current.split(',').map(t => t.trim());
                                                        }

                                                        if (checked) {
                                                            if (!newTags.includes(tag)) newTags.push(tag);
                                                        } else {
                                                            newTags = newTags.filter(t => t !== tag);
                                                        }

                                                        setValue('tags', newTags); // Store as array directly if possible, or join if backend expects string
                                                        // But wait, the backend expects array or string. Frontend onSubmit handles explicit split.
                                                        // Let's standardise on passing Array to setValue and handle it in onSubmit.

                                                        // Also sync legacy boolean flags for backward compatibility
                                                        if (tag === "Best Seller") setValue('isBestSeller', checked);
                                                        if (tag === "New Launch") setValue('isNewLaunch', checked);
                                                        // if (tag === "Featured") setValue('isFeatured', checked); 
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`tag-${tag}`}
                                                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                                                >
                                                    {tag}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2">
                                    <Label>Other Custom Tags</Label>
                                    <Input
                                        placeholder="Type custom tag and press Enter/Comma..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault();
                                                const input = e.currentTarget as HTMLInputElement;
                                                const val = input.value.trim();
                                                if (val) {
                                                    const current = watch('tags');
                                                    let newTags: string[] = [];
                                                    if (Array.isArray(current)) newTags = [...current];
                                                    else if (typeof current === 'string' && current) newTags = current.split(',').map(t => t.trim());

                                                    if (!newTags.includes(val)) {
                                                        setValue('tags', [...newTags, val]);
                                                    }
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(Array.isArray(watch('tags')) ? watch('tags') : (watch('tags') ? watch('tags').toString().split(',') : []))
                                            .map((t: string) => t.trim())
                                            .filter((t: string) => t !== '')
                                            .map((tag: string, i: number) => (
                                                <div key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                                    {tag}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                        onClick={() => {
                                                            const current = watch('tags');
                                                            let newTags: string[] = [];
                                                            if (Array.isArray(current)) newTags = [...current];
                                                            else if (typeof current === 'string') newTags = current.split(',').map(t => t.trim());
                                                            setValue('tags', newTags.filter(item => item !== tag));

                                                            if (tag === "Best Seller") setValue('isBestSeller', false);
                                                            if (tag === "New Launch") setValue('isNewLaunch', false);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Custom tags will appear as neutral grey badges.</p>
                                </div>
                            </div>




                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Short Description</Label>
                                    <RegenerateButton field="shortDescription" label="Short Desc" />
                                </div>
                                <Input {...register('shortDescription')} placeholder="Brief summary" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Long Description</Label>
                                    <RegenerateButton field="longDescription" label="Long Desc" />
                                </div>
                                <Textarea {...register('longDescription')} placeholder="Detailed description..." className="min-h-[100px]" />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Features & Ideal For */}
                <Card>
                    <SectionHeader title="Key Features & Ideal For" id="details" />
                    {openSections.details && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Features (One per line)</Label>
                                    <RegenerateButton field="features" label="Features" />
                                </div>
                                <Textarea {...register('features')} placeholder={"Adjustable height\nLumbar support"} className="min-h-[100px]" />
                            </div>

                            <div className="space-y-2">
                                <Label>Ideal For (One per line)</Label>
                                <Textarea {...register('idealFor')} placeholder={"Director cabins\nCEO offices"} className="min-h-[100px]" />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Colors Manager */}
                <Card>
                    <SectionHeader title="Available Colors & Finishes" id="colors" />
                    {openSections.colors && (
                        <CardContent className="space-y-4">
                            <div className="space-y-6">
                                {productColors.map((color, index) => (
                                    <div key={index} className="border p-4 rounded-xl bg-muted/20 space-y-4">
                                        <div className="flex gap-4 items-end">
                                            <div className="w-12 h-10 rounded border shadow-sm shrink-0" style={{ backgroundColor: color.hex }} />
                                            <div className="flex-1 space-y-2">
                                                <Label>Color Name</Label>
                                                <Input
                                                    value={color.name}
                                                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                                                    placeholder="Royal Black"
                                                />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <Label>Picker</Label>
                                                <Input
                                                    type="color"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                    className="h-10 p-1 cursor-pointer"
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Hex Code</Label>
                                                <Input
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-end mt-2">
                                            <div className="flex-1 space-y-2">
                                                <Label>Variant SKU</Label>
                                                <Input
                                                    value={color.sku || ''}
                                                    onChange={(e) => updateColor(index, 'sku', e.target.value)}
                                                    placeholder="Keep empty to auto-generate"
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Stock</Label>
                                                <Input
                                                    type="number"
                                                    value={color.stock || 0}
                                                    onChange={(e) => updateColor(index, 'stock', e.target.value)}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500"
                                                onClick={() => deleteColor(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Color Variant Images */}
                                        <div className="bg-background p-3 rounded-lg border">
                                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
                                                Variant Images Gallery
                                            </Label>
                                            <div className="flex flex-wrap gap-3">
                                                {/* Existing Images */}
                                                {color.images && color.images.map((img, i) => (
                                                    <div key={`c-exist-${i}`} className="h-20 w-20 relative group border rounded-md overflow-hidden bg-white">
                                                        <img src={getFullImageUrl(img)} alt="" className="h-full w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeColorImage(index, 'existing', i)}
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-bl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* New Previews */}
                                                {color.previews && color.previews.map((img, i) => (
                                                    <div key={`c-new-${i}`} className="h-20 w-20 relative group border rounded-md overflow-hidden bg-white">
                                                        <img src={img} alt="" className="h-full w-full object-cover opacity-90" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeColorImage(index, 'new', i)}
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-bl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">New</div>
                                                    </div>
                                                ))}

                                                {/* Upload Button */}
                                                <label className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-md cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all">
                                                    <Plus className="h-5 w-5 text-primary/60 mb-1" />
                                                    <span className="text-[10px] text-primary/60 font-medium">Add Image</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleColorImageUpload(index, e)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addColor} className="w-full h-12 border-dashed border-2 hover:bg-muted/50">
                                    <Plus className="mr-2 h-4 w-4" /> Add Another Color Variant
                                </Button>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Specifications Manager */}
                <Card>
                    <SectionHeader title="Specifications Section" id="specs" />
                    {openSections.specs && (
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-4 items-end border p-3 rounded bg-muted/30">
                                        <div className="flex-1 space-y-2">
                                            <Label>Label</Label>
                                            <Input
                                                value={spec.label}
                                                onChange={(e) => updateSpec(index, 'label', e.target.value)}
                                                placeholder="Brand, Weight Capacity, etc."
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label>Value</Label>
                                            <Input
                                                value={spec.value}
                                                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                                placeholder="Dipak Furniture, 120 kg, etc."
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => deleteSpec(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addSpec} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" /> Add Specification Row
                                </Button>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Dimensions */}
                <Card>
                    <SectionHeader title="Dimensions Section" id="dimensions" />
                    {openSections.dimensions && (
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Seat Height</Label>
                                    <Input {...register('dim_seatHeight')} placeholder="45-55 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Seat Width</Label>
                                    <Input {...register('dim_seatWidth')} placeholder="50 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Seat Depth</Label>
                                    <Input {...register('dim_seatDepth')} placeholder="48 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Back Height</Label>
                                    <Input {...register('dim_backHeight')} placeholder="75 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Armrest Height</Label>
                                    <Input {...register('dim_armrestHeight')} placeholder="25 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Overall Height</Label>
                                    <Input {...register('dim_overallHeight')} placeholder="120 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Base Diameter</Label>
                                    <Input {...register('dim_baseDiameter')} placeholder="65 cm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Net Weight</Label>
                                    <Input {...register('dim_netWeight')} placeholder="15 kg" />
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Materials & Legacy Section */}
                <Card>
                    <SectionHeader title="Materials Used Checklist" id="materials" />
                    {openSections.materials && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Materials Used (One per line)</Label>
                                <Textarea {...register('materialsUsed')} placeholder={"High-density foam\nNylon casters\nMetal base"} className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Material Description (Legacy Field)</Label>
                                <Input {...register('material')} placeholder="Leather, Mesh, etc." />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Warranty */}
                <Card>
                    <SectionHeader title="Warranty & Care Information" id="warranty" />
                    {openSections.warranty && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Warranty Coverage (One per line)</Label>
                                <Textarea {...register('warranty_coverage')} placeholder={"1 Year warranty against manufacturing defects\nCovers gas lift and mechanism"} className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Care Instructions (One per line)</Label>
                                <Textarea {...register('warranty_care')} placeholder={"Clean with soft damp cloth\nAvoid harsh chemicals"} className="min-h-[100px]" />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Reviews Manager */}
                <Card>
                    <SectionHeader title="Reviews Manager" id="reviews" />
                    {openSections.reviews && (
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded bg-muted/30">
                                    <div className="space-y-2">
                                        <Label>Reviewer Name</Label>
                                        <Input value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rating (1-5)</Label>
                                        <Input type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-end">
                                        <Button type="button" onClick={addReview}>Add Review</Button>
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label>Comment</Label>
                                        <Textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Excellent quality..." />
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {reviews.map((rev, i) => (
                                        <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
                                            <div>
                                                <div className="font-semibold">{rev.name} <span className="text-yellow-500">{rev.rating}⭐</span></div>
                                                <div className="text-sm text-muted-foreground">{rev.comment}</div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => deleteReview(i)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {reviews.length === 0 && <p className="text-sm text-center py-4 text-muted-foreground">No reviews added yet.</p>}
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Images */}
                <Card>
                    <SectionHeader title="Images Manager" id="images" />
                    {openSections.images && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Thumbnail Image</Label>
                                <div className="flex items-center gap-4">
                                    {(thumbnailPreview || existingThumbnail) && (
                                        <div className="h-20 w-20 border rounded overflow-hidden relative">
                                            <img
                                                src={thumbnailPreview || getFullImageUrl(existingThumbnail || "")}
                                                alt="Thumbnail"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input type="file" onChange={handleThumbnailChange} accept="image/*" />
                                        <p className="text-xs text-muted-foreground mt-1">Recommended: Square image (800x800)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Label>Gallery Images</Label>
                                <div className="flex items-center gap-2 mb-4">
                                    <Input type="file" multiple onChange={handleImageChange} accept="image/*" id="gallery-upload" className="hidden" />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('gallery-upload')?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload Gallery Images
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {existingImages.map((img, i) => (
                                        <div key={`exist-${i}`} className="h-24 border rounded overflow-hidden relative group">
                                            <img src={getFullImageUrl(img)} alt="" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {imagePreviews.map((src, i) => (
                                        <div key={`new-${i}`} className="h-24 border rounded overflow-hidden relative group">
                                            <img src={src} alt="" className="h-full w-full object-cover border-2 border-primary/50" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* SEO */}
                <Card>
                    <SectionHeader title="SEO Information" id="seo" />
                    {openSections.seo && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>SEO Title</Label>
                                <Input {...register('seoTitle')} placeholder="Product name | STEEL SHOW" />
                            </div>
                            <div className="space-y-2">
                                <Label>SEO Description</Label>
                                <Textarea {...register('seoDescription')} placeholder="Meta description for search engines" />
                            </div>
                            <div className="space-y-2">
                                <Label>Keywords (comma separated)</Label>
                                <Input {...register('seoKeywords')} placeholder="office chair, ergonomic, mesh chair" />
                            </div>
                        </CardContent>
                    )}
                </Card>

                <div className="flex justify-end gap-4 pb-10">
                    <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin/products')}>Cancel</Button>
                    <Button type="submit" size="lg" className="min-w-[150px]" disabled={loading}>
                        {loading ? 'Saving Product...' : 'Persist Everything'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
