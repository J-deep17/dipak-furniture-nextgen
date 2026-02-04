import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Check,
  MapPin,
  Phone,
  Heart,
  XCircle,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuoteModal from "./QuoteModal";
import { useWishlist } from "@/contexts/WishlistContext";
import BankOffers from "./BankOffers";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isInCart: boolean;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  chosenFulfillment: 'instock' | 'made_to_order';
  setChosenFulfillment: (f: 'instock' | 'made_to_order') => void;
}

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
  isInCart,
  selectedColor,
  setSelectedColor,
  chosenFulfillment,
  setChosenFulfillment,
}: ProductInfoProps) => {
  const [pincode, setPincode] = useState(() => localStorage.getItem("lastCheckedPincode") || "");
  const [deliveryResult, setDeliveryResult] = useState<{ available: boolean, city?: string, state?: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Local state removed, using props


  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Pricing
  const salePrice = product.price;
  const mrp = product.mrp;
  const hasDiscount = mrp && salePrice && mrp > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;

  // Inventory logic based on selected color
  const currentColorObj = product.colors?.find(c => c.name === selectedColor);
  const currentStock = currentColorObj ? currentColorObj.stock : product.stock;
  const currentStatus = currentColorObj ? currentColorObj.status : product.stockStatus;

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryResult({ available: false });
      return;
    }

    setIsChecking(true);
    try {
      const res = await api.get(`/delivery/check/${pincode}`);
      const data = res.data;
      setDeliveryResult(data);
      if (data.available) {
        localStorage.setItem("lastCheckedPincode", pincode);
      }
    } catch (error) {
      console.error(error);
      setDeliveryResult({ available: false });
    } finally {
      setIsChecking(false);
    }
  };

  const handlePincodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDelivery();
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < 100) setQuantity(quantity + 1);
  };

  // Real ratings
  const rating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="space-y-6">
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        product={product}
        selectedColor={selectedColor}
        quantity={quantity}
        pincode={pincode}
        location={deliveryResult?.available ? `${deliveryResult.city}, ${deliveryResult.state}` : undefined}
        deliveryAvailable={deliveryResult?.available}
      />
      <Badge variant="outline" className="mb-2 w-fit">{product.category}</Badge>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {product.name}
      </h1>

      {/* Product Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {(() => {
          const allTags = new Set<string>();
          if (product.isNewLaunch) allTags.add("New Launch");
          if (product.isBestSeller) allTags.add("Best Seller");
          if (product.isFeatured) allTags.add("Featured");
          if (product.tags) product.tags.forEach(t => allTags.add(t));

          return Array.from(allTags).map(tag => {
            let badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";

            if (tag === "New Launch") badgeClass = "bg-green-600 text-white hover:bg-green-700 border-none shadow-[0_0_8px_rgba(22,163,74,0.4)] animate-glow";
            if (tag === "Hot Selling") badgeClass = "bg-red-600 text-white hover:bg-red-700 border-none shadow-[0_0_8px_rgba(220,38,38,0.4)] animate-glow";
            if (tag === "Limited Offer") badgeClass = "bg-orange-500 text-white hover:bg-orange-600 border-none animate-bounce-slow shadow-sm";
            if (tag === "Best Seller") badgeClass = "bg-blue-600 text-white hover:bg-blue-700 border-none shadow-md";
            if (tag === "Online Exclusive") badgeClass = "bg-purple-600 text-white hover:bg-purple-700 border-none shadow-md";

            return (
              <Badge key={tag} className={`${badgeClass} transition-transform hover:scale-105 duration-500 px-3 py-1 cursor-default`}>
                {tag.toUpperCase()}
              </Badge>
            );
          });
        })()}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-5 w-5",
                star <= Math.floor(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : star === Math.ceil(rating) && rating % 1 !== 0
                    ? "text-yellow-400 fill-yellow-400/50"
                    : "text-muted-foreground"
              )}
            />
          ))}
        </div>
        {reviewCount > 0 ? (
          <>
            <span className="font-semibold">{rating}</span>
            <span className="text-muted-foreground">({reviewCount} reviews)</span>
          </>
        ) : (
          <span className="text-muted-foreground">No reviews yet</span>
        )}
      </div>

      {/* Price Section - Enhanced */}
      <div className="space-y-3">
        {salePrice ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-5xl font-bold text-primary">
                ₹{salePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{mrp?.toLocaleString()}
                  </span>
                  <Badge variant="destructive" className="text-xs font-semibold">
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>
            {hasDiscount && (
              <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-md px-2 py-1">
                <span className="text-red-600 font-bold text-sm">
                  You Save ₹{((mrp || 0) - salePrice).toLocaleString()}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              Request Quote
            </span>
            <Badge variant="secondary">Wholesale Available</Badge>
          </div>
        )}
      </div>

      {/* Fulfillment Choice (Hybrid Only) */}
      {product.fulfillmentType === 'hybrid' && (
        <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            How would you like this fulfilled?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setChosenFulfillment('instock')}
              disabled={currentStatus === 'Out of Stock'}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                chosenFulfillment === 'instock'
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-transparent bg-background text-muted-foreground hover:bg-muted",
                currentStatus === 'Out of Stock' && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs font-bold uppercase">Ready Stock</span>
              {currentStatus === 'Out of Stock' && <span className="text-[10px] text-red-500 mt-1">Sold Out</span>}
            </button>
            <button
              onClick={() => setChosenFulfillment('made_to_order')}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                chosenFulfillment === 'made_to_order'
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-transparent bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              <RefreshCw className="h-5 w-5 mb-1" />
              <span className="text-xs font-bold uppercase">Made to Order</span>
              <span className="text-[10px] text-muted-foreground mt-1">{product.leadTimeDays || 7} Days Lead</span>
            </button>
          </div>
        </div>
      )}

      {/* Stock Status Badge & Delivery Time */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {chosenFulfillment === 'instock' ? (
            <>
              {currentStatus === 'Out of Stock' ? (
                <Badge variant="destructive" className="px-3 py-1 gap-1.5 h-7">
                  <XCircle className="h-3.5 w-3.5" />
                  OUT OF STOCK
                </Badge>
              ) : currentStatus === 'Low Stock' ? (
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1 gap-1.5 h-7 w-fit">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    LOW STOCK
                  </Badge>
                  <p className="text-[10px] text-amber-700 font-medium">Only {currentStock} left in {selectedColor || 'this color'}!</p>
                </div>
              ) : (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1 gap-1.5 h-7">
                  <CheckCircle className="h-3.5 w-3.5" />
                  IN STOCK (READY)
                </Badge>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1 gap-1.5 h-7 w-fit">
                <RefreshCw className="h-3.5 w-3.5" />
                MADE TO ORDER
              </Badge>
              <p className="text-[10px] text-blue-700 font-medium italic">Manufacturing takes {product.leadTimeDays || 7} business days.</p>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-primary" />
            <span>Estimate: {chosenFulfillment === 'instock' ? '2-3 Days' : `${(product.leadTimeDays || 7) + 3} Days`}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>1 Year Warranty</span>
          </div>
        </div>
      </div>

      {/* Delivery Availability Check */}
      <div className="space-y-3 p-4 border rounded-xl bg-background shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <MapPin className="h-4 w-4" />
          Check Delivery Availability
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={handlePincodeKeyDown}
            className="h-10 border-muted-foreground/20 focus-visible:ring-primary"
          />
          <Button
            onClick={checkDelivery}
            disabled={isChecking || pincode.length !== 6}
            variant="outline"
            className="h-10 px-6 font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            {isChecking ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
            ) : "Check"}
          </Button>
        </div>

        {deliveryResult && (
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300",
            deliveryResult.available
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}>
            {deliveryResult.available ? (
              <>
                <div className="bg-green-500 p-0.5 rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>
                  Delivery available in <strong>{deliveryResult.city}, {deliveryResult.state}</strong>
                </span>
              </>
            ) : (
              <>
                <div className="bg-red-500 p-0.5 rounded-full">
                  <Plus className="h-3 w-3 text-white rotate-45" />
                </div>
                <span>Currently not serviceable at this pincode</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bank Offers */}
      <BankOffers />

      {/* Color Variants */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available Finishes:
            </p>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {product.colors.map((color, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-6 h-6 rounded-full border transition-all duration-150 relative hover:-translate-y-0.5",
                          selectedColor === color.name
                            ? "border-primary ring-1 ring-primary/30 shadow-sm"
                            : "border-border hover:border-gray-400"
                        )}
                        style={{ backgroundColor: color.hex || "#808080" }}
                        aria-label={`Select ${color.name}`}
                      >
                        {selectedColor === color.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white mix-blend-difference" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-medium">{color.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className={cn("space-y-2", product.stockStatus === 'Out of Stock' && "opacity-50 pointer-events-none")}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || product.stockStatus === 'Out of Stock'}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-10 text-center font-medium text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={incrementQuantity}
              disabled={quantity >= 100 || product.stockStatus === 'Out of Stock'}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            (Min: 1)
          </span>
        </div>
      </div>

      {/* CTA Buttons - Dual Action Layout */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            variant="outline"
            className="h-12 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            onClick={onAddToCart}
            disabled={currentStatus === 'Out of Stock'}
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                IN CART
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                ADD TO CART
              </>
            )}
          </Button>
          <Button
            size="lg"
            className={cn(
              "h-12 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg",
              currentStatus === 'Out of Stock'
                ? "bg-muted text-muted-foreground border border-muted"
                : "bg-primary hover:bg-primary/90 text-white"
            )}
            onClick={onBuyNow}
            disabled={currentStatus === 'Out of Stock'}
          >
            {currentStatus === 'Out of Stock' ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                OUT OF STOCK
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                BUY IT NOW
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-9 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-all duration-150"
            onClick={() => setIsQuoteOpen(true)}
          >
            Request Bulk Quote
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 px-0 transition-all duration-150 hover:-translate-y-0.5"
            onClick={() => toggleWishlist(product)}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </Button>
        </div>
      </div>

      {/* ... (rest) */}

      {/* Call Now */}
      <Button
        variant="outline"
        className="w-full h-9 text-sm transition-all duration-150 hover:-translate-y-0.5"
        asChild
      >
        <a href="tel:+919824044585">
          <Phone className="mr-2 h-3.5 w-3.5" />
          Call Now: +91 98240 44585
        </a>
      </Button>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On bulk orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">1 Year Warranty</p>
            <p className="text-xs text-muted-foreground">Manufacturing defects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
