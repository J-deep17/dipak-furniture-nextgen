import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ShoppingCart, Check, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import QuoteModal from "@/components/pdp/QuoteModal";
import ImageZoomModal from "./ImageZoomModal";
import ColorSelector from "./ColorSelector";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ""
  );
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Get image based on selected color variant or default
  const currentImage = useMemo(() => {
    if (product.colorVariants && selectedColor) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      return variant?.image || product.image;
    }
    return product.image;
  }, [product.colorVariants, selectedColor, product.image]);

  const imageSrc = currentImage || "/placeholder.svg";
  const inCart = isInCart(product.id, selectedColor);
  const isWishlisted = isInWishlist(product.id);

  // Special handling for sofa-4 to crop from bottom
  const isSofa4 = currentImage === "sofa-4";

  // Pricing Logic
  const salePrice = product.price;
  const mrp = product.mrp;
  const calculatedDiscount = (mrp && salePrice && mrp > salePrice)
    ? Math.round(((mrp - salePrice) / mrp) * 100)
    : 0;

  const discountPercent = product.discountPercent || calculatedDiscount;
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    toast({
      title: "Added to list",
      description: `${product.name}${selectedColor ? ` (${selectedColor})` : ""} has been added to your inquiry list.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      duration: 1500,
    });
  };

  // Prevent right-click on images
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] cursor-pointer"
      >
        {/* Image - Navigates to PDP */}
        <div
          className="relative aspect-square w-full overflow-hidden bg-gray-100/30"
          onContextMenu={handleContextMenu}
        >
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
            draggable={false}
            onContextMenu={handleContextMenu}
          />

          {/* Out of Stock Overlay */}
          {product.stockStatus === 'Out of Stock' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
              <Badge variant="destructive" className="px-3 py-1 text-[11px] font-bold shadow-lg">
                OUT OF STOCK
              </Badge>
            </div>
          )}

          {/* Top Left: Discount Badge */}
          <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <Badge className="bg-red-600 text-white hover:bg-red-700 font-bold px-2 py-0.5 text-xs shadow-sm w-fit">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.stockStatus === 'Low Stock' && (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-bold px-2 py-0.5 text-[9px] shadow-sm w-fit">
                ONLY {product.stock} LEFT
              </Badge>
            )}
          </div>

          {/* Top Right: Wishlist Icon */}
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-all shadow-sm z-10"
          >
            <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
          {/* Badges Overlay (Bottom Left) */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start">
            {(() => {
              const allTags = new Set<string>();
              if (product.isNewLaunch) allTags.add("New Launch");
              if (product.isBestSeller) allTags.add("Best Seller");
              if (product.isFeatured) allTags.add("Featured"); // Keep Featured for back-compat
              if (product.tags) product.tags.forEach(t => allTags.add(t));

              const tagsToShow = Array.from(allTags).slice(0, 2); // Max 2

              return tagsToShow.map(tag => {
                let badgeClass = "bg-gray-100 text-gray-700";

                // Base styles with animation/glow logic
                if (tag === "New Launch") badgeClass = "bg-green-600 text-white border-green-700 shadow-[0_0_8px_rgba(22,163,74,0.4)] animate-glow";
                if (tag === "Hot Selling") badgeClass = "bg-red-600 text-white border-red-700 shadow-[0_0_8px_rgba(220,38,38,0.4)] animate-glow";
                if (tag === "Limited Offer") badgeClass = "bg-orange-500 text-white border-orange-600 animate-bounce-slow shadow-sm";
                if (tag === "Best Seller") badgeClass = "bg-blue-600 text-white border-blue-700 shadow-md";
                if (tag === "Online Exclusive") badgeClass = "bg-purple-600 text-white border-purple-700 shadow-md";

                return (
                  <Badge key={tag} className={`${badgeClass} text-[10px] px-2 py-0.5 border-none transition-all duration-300 hover:scale-105`}>
                    {tag.toUpperCase()}
                  </Badge>
                );
              });
            })()}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-4">

          {/* Category Label */}
          <div className="mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </span>
          </div>

          <h3 className="mb-2 h-[42px] text-[15px] font-bold leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mb-3">
            {product.price ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-[13px] text-muted-foreground line-through">₹{product.mrp?.toLocaleString()}</span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="text-[12px] font-medium text-green-600">
                    You Save ₹{((product.mrp || 0) - product.price).toLocaleString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[16px] font-bold text-primary">Request Quote</div>
            )}
          </div>

          {/* Features - Simplified */}
          {(!product.tags || product.tags.length === 0) && (
            <div className="mb-3 flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] font-normal text-muted-foreground bg-gray-50/50"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          {/* Color Selector - Compact */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-auto flex gap-2 pt-2 border-t border-gray-50">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsEnquiryOpen(true);
              }}
              variant="outline"
              size="sm"
              className="h-9 flex-1 border-primary text-primary hover:bg-primary hover:text-white text-xs font-semibold uppercase tracking-wide"
            >
              Get Quote
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              title="Zoom Image"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(true);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddToCart}
              variant={inCart ? "default" : "outline"}
              size="icon"
              disabled={product.stockStatus === 'Out of Stock'}
              className={cn(
                "h-9 w-9 transition-colors",
                inCart ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                product.stockStatus === 'Out of Stock' && "opacity-50 cursor-not-allowed"
              )}
              title={product.stockStatus === 'Out of Stock' ? "Out of Stock" : (inCart ? "Added to list" : "Add to list")}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={product}
        selectedColor={selectedColor}
      />

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageSrc={imageSrc}
        alt={product.name}
        productId={product.id}
        images={product.images}
      />
    </>
  );
};

export default ProductCard;
