export interface ColorVariant {
    color: string;
    image: string;
}

export type BackHeight = 'HB' | 'MB' | 'LB';

export interface Review {
    name: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
    isApproved?: boolean;
}

export interface Specification {
    label: string;
    value: string;
}

export interface Dimensions {
    seatHeight?: string;
    seatWidth?: string;
    seatDepth?: string;
    backHeight?: string;
    armrestHeight?: string;
    overallHeight?: string;
    baseDiameter?: string;
    netWeight?: string;
}

export interface Warranty {
    coverage: string[];
    care: string[];
}

export interface Color {
    _id?: string;
    name: string;
    hex: string;
    sku: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    images?: string[];
}

export interface Product {
    _id?: string;
    id: string;
    sku: string;
    name: string;
    category: string | any;
    categorySlug: string;
    image: string;
    thumbnail?: string;
    features: string[];
    idealFor?: string[];
    specifications?: Specification[];
    dimensions?: Dimensions;
    materialsUsed?: string[];
    warranty?: Warranty;
    applications: string[];
    finishes: string[];
    isNew?: boolean;
    colorVariants?: ColorVariant[];
    backHeight?: string; // Legacy field
    material?: string;
    colors?: Color[];
    description?: string;
    longDescription?: string;
    price?: number;
    mrp?: number;
    images?: string[];
    reviews?: Review[];
    averageRating?: number;
    reviewCount?: number;
    tags?: string[];
    isBestSeller?: boolean;
    isNewLaunch?: boolean; // Replaces or works with isNew
    isFeatured?: boolean;
    discountPercent?: number;
    stock?: number;
    minStock?: number;
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
    allowBackorder?: boolean;
    fulfillmentType?: 'instock' | 'made_to_order' | 'hybrid';
    leadTimeDays?: number;
}

export interface Category {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    parent?: string | Category;
}

export interface Hotspot {
    x: number;
    y: number;
    label?: string;
    productId?: string;
    productUrl?: string;
}

export interface HeroBanner {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
    isActive: boolean;
    hotspots?: Hotspot[];
    transitionEffect?: 'fade' | 'slide-left' | 'slide-right' | 'zoom-in';
    imageEffect?: 'none' | 'zoom-in' | 'zoom-out' | 'subtle-pan';
}
