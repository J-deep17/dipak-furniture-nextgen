import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X } from "lucide-react";

interface ProductFilterSidebarProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    categories?: { name: string, count?: number }[];
    availableColors?: string[];
    availableMaterials?: string[];
}

export interface FilterState {
    priceRange: [number, number];
    discountMin: number | null;
    ratingMin: number | null;
    colors: string[];
    materials: string[];
    tags: string[];
}

const ProductFilterSidebar = ({ filters, onChange, availableColors = [], availableMaterials = [] }: ProductFilterSidebarProps) => {

    // Local state for smooth slider interaction
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);

    useEffect(() => {
        setLocalPriceRange(filters.priceRange);
    }, [filters.priceRange]);

    const handlePriceChange = (value: number[]) => {
        setLocalPriceRange([value[0], value[1]]);
    };

    const handlePriceCommit = (value: number[]) => {
        onChange({ ...filters, priceRange: [value[0], value[1]] });
    };

    const toggleFilter = (key: keyof FilterState, value: any) => {
        if (Array.isArray(filters[key])) {
            const current = filters[key] as string[];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            onChange({ ...filters, [key]: updated });
        } else {
            // For single selects (discount, rating) - toggle off if selected
            onChange({ ...filters, [key]: filters[key] === value ? null : value });
        }
    };

    const clearAll = () => {
        onChange({
            priceRange: [0, 100000],
            discountMin: null,
            ratingMin: null,
            colors: [],
            materials: [],
            tags: []
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground text-xs h-auto py-1 px-2">Clear All</Button>
            </div>

            <Accordion type="multiple" defaultValue={["price", "discount", "tags", "rating"]} className="w-full">
                {/* Price Filter */}
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent className="pt-4 px-1">
                        <Slider
                            defaultValue={[0, 100000]}
                            max={100000}
                            step={1000}
                            value={localPriceRange}
                            onValueChange={handlePriceChange}
                            onValueCommit={handlePriceCommit}
                            className="mb-4"
                        />
                        <div className="flex items-center justify-between text-sm">
                            <div className="border rounded px-2 py-1">₹{localPriceRange[0].toLocaleString()}</div>
                            <div className="text-muted-foreground">-</div>
                            <div className="border rounded px-2 py-1">₹{localPriceRange[1].toLocaleString()}</div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Tags Filter */}
                <AccordionItem value="tags">
                    <AccordionTrigger>Badges & Offers</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        {["New Launch", "Best Seller", "Hot Selling", "Limited Offer", "Online Exclusive"].map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`filter-tag-${tag}`}
                                    checked={filters.tags.includes(tag)}
                                    onCheckedChange={() => toggleFilter('tags', tag)}
                                />
                                <label
                                    htmlFor={`filter-tag-${tag}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                                >
                                    {tag}
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Discount Filter */}
                <AccordionItem value="discount">
                    <AccordionTrigger>Discount</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        {[10, 20, 30, 40, 50].map((disc) => (
                            <div key={disc} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`filter-disc-${disc}`}
                                    checked={filters.discountMin === disc}
                                    onCheckedChange={() => toggleFilter('discountMin', disc)}
                                />
                                <label htmlFor={`filter-disc-${disc}`} className="text-sm font-medium leading-none cursor-pointer">
                                    {disc}% and above
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Rating Filter */}
                <AccordionItem value="rating">
                    <AccordionTrigger>Customer Rating</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        {[4, 3, 2].map((star) => (
                            <div key={star} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`filter-star-${star}`}
                                    checked={filters.ratingMin === star}
                                    onCheckedChange={() => toggleFilter('ratingMin', star)}
                                />
                                <label htmlFor={`filter-star-${star}`} className="text-sm font-medium leading-none cursor-pointer flex items-center">
                                    {star}<Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-0.5" /> & above
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Colors (Optional dynamic) */}
                {availableColors.length > 0 && (
                    <AccordionItem value="colors">
                        <AccordionTrigger>Color</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                                {availableColors.map(color => (
                                    <div
                                        key={color}
                                        className={`
                                            w-8 h-8 rounded-full border-2 cursor-pointer transition-all relative flex items-center justify-center
                                            ${filters.colors.includes(color) ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:scale-110'}
                                        `}
                                        style={{ backgroundColor: color.toLowerCase() }} // Assuming color name is valid CSS color or use map
                                        title={color}
                                        onClick={() => toggleFilter('colors', color)}
                                    >
                                        {filters.colors.includes(color) && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
};

export default ProductFilterSidebar;
