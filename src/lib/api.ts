import axios from "axios";
import { Product, Category, HeroBanner } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API ERROR:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
};

export const mapProduct = (item: any): Product => ({
    id: item._id,
    _id: item._id,
    sku: item.sku,
    name: item.name,
    category: item.category?.name || 'Uncategorized',
    categorySlug: item.category?.slug || 'uncategorized',
    image: getFullImageUrl(item.thumbnail || item.images?.[0]),
    thumbnail: getFullImageUrl(item.thumbnail),
    features: item.features || [],
    idealFor: item.idealFor || [],
    specifications: item.specifications || [],
    dimensions: item.dimensions || {},
    materialsUsed: item.materialsUsed || [],
    warranty: item.warranty || { coverage: [], care: [] },
    applications: [],
    finishes: item.colors || [],
    colorVariants: (item.colors || []).map((c: any) => ({
        color: typeof c === 'string' ? c : c.name,
        image: getFullImageUrl(item.thumbnail || item.images?.[0])
    })) || [],
    backHeight: undefined,
    description: item.shortDescription || item.description,
    longDescription: item.longDescription || "",
    price: item.price,
    images: (item.images || []).map(getFullImageUrl),
    colors: (item.colors || []).map((c: any) => {
        if (typeof c === 'string') return { name: c, hex: '#808080', sku: '', stock: 0, status: 'In Stock' };
        return {
            ...c,
            images: (c.images || []).map(getFullImageUrl)
        };
    }),
    reviews: item.reviews || [],
    averageRating: item.averageRating || 0,
    reviewCount: item.reviewCount || 0,
    mrp: item.mrp,
    discountPercent: item.discountPercent,
    isNew: item.isNewLaunch || item.isNew || false,
    isNewLaunch: item.isNewLaunch || false,
    isBestSeller: item.isBestSeller || false,
    isFeatured: item.isFeatured || false,
    tags: item.tags || [],
    stock: item.stock || 0,
    minStock: item.minStock || 5,
    stockStatus: item.stockStatus || 'In Stock',
    allowBackorder: item.allowBackorder || false,
    fulfillmentType: item.fulfillmentType || 'instock',
    leadTimeDays: item.leadTimeDays || 7
});

export const fetchProducts = async (params?: Record<string, any>): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return response.data.map(mapProduct);
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return mapProduct(response.data);
};

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.map((cat: any) => ({
        ...cat,
        image: getFullImageUrl(cat.image)
    }));
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query) return [];
    try {
        const response = await api.get('/products/search', { params: { q: query } });
        return response.data.map(mapProduct);
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
};

export const fetchHeroBanners = async (): Promise<HeroBanner[]> => {
    const response = await api.get('/hero-banners');
    return response.data;
};
