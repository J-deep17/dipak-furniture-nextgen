import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ZoomIn, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset selection when images change
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const scrollThumbnails = (direction: "up" | "down") => {
    if (!thumbnailsRef.current) return;
    const scrollAmount = 80;
    thumbnailsRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} from Dipak Furniture`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Failed to share");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Vertical Thumbnails */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col items-center gap-2 w-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => scrollThumbnails("up")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <div
            ref={thumbnailsRef}
            className="flex flex-col gap-2 overflow-y-auto max-h-[400px] scrollbar-hide"
          >
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={img}
                  alt={`${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => scrollThumbnails("down")}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={images[selectedIndex]}
            alt={productName}
            className={cn(
              "w-full h-full object-contain transition-transform duration-200",
              isZoomed && "scale-150"
            )}
            style={
              isZoomed
                ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
                : undefined
            }
          />

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-4 w-4" />
            <span>Hover to zoom</span>
          </div>

          {/* Watermarks */}
          <div className="absolute top-4 left-4 text-foreground/30 text-sm font-medium pointer-events-none">
            Dipak Furniture
          </div>
          <div className="absolute bottom-4 right-4 text-foreground/30 text-sm font-medium pointer-events-none">
            dipaksteelfurniture.com
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full shadow-md"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full shadow-md",
              isWishlisted && "text-red-500"
            )}
            onClick={handleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </Button>
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Mobile horizontal thumbnails */}
        {images.length > 1 && (
          <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={img}
                  alt={`${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
