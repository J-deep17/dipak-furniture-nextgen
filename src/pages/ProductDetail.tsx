import { useParams, Link } from "react-router-dom"; // Trigger HMR
import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { useCart } from "@/contexts/CartContext";
import ProductImageGallery from "@/components/pdp/ProductImageGallery";
import ProductInfo from "@/components/pdp/ProductInfo";
import ProductTabs from "@/components/pdp/ProductTabs";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import ProductBreadcrumb from "@/components/pdp/ProductBreadcrumb";
import ProductSchema from "@/components/pdp/ProductSchema";
import StickyMobileCart from "@/components/pdp/StickyMobileCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchProducts, fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import DeliveryServiceInfo from "@/components/pdp/DeliveryServiceInfo";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [chosenFulfillment, setChosenFulfillment] = useState<'instock' | 'made_to_order'>('instock');

  // Inventory logic for color
  const currentStatus = useMemo(() => {
    if (!product) return 'In Stock';
    const currentColorObj = product.colors?.find(c => c.name === selectedColor);
    return currentColorObj ? currentColorObj.status : product.stockStatus;
  }, [product, selectedColor]);

  // Sync fulfillment choice
  useMemo(() => {
    if (!product) return;
    if (product.fulfillmentType === 'made_to_order') {
      setChosenFulfillment('made_to_order');
    } else if (product.fulfillmentType === 'instock') {
      setChosenFulfillment('instock');
    } else if (product.fulfillmentType === 'hybrid') {
      if (currentStatus === 'Out of Stock') {
        setChosenFulfillment('made_to_order');
      }
    }
  }, [product, currentStatus]);

  // Initialize selected color when product loads
  useMemo(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  const category = useMemo(() => {
    if (!product || !categories) return null;
    return categories.find((c) => c.slug === product.categorySlug);
  }, [product, categories]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  // Get images based on selected color
  const productImages = useMemo(() => {
    if (!product) return [];
    let images: string[] = [];

    // 1. If a color is selected, try to find its specific images
    if (selectedColor && product.colors) {
      const colorVariant = product.colors.find(c => c.name === selectedColor);
      if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
        images = [...colorVariant.images];
      }
    }

    // 2. If no color images found (or no color selected), fall back to main gallery
    if (images.length === 0) {
      if (product.image) images.push(product.image); // Main thumbnail
      if (product.images) {
        product.images.forEach(img => {
          if (img && !images.includes(img)) images.push(img);
        });
      }
    }

    // 3. Fallback: If still empty, try legacy colorVariants structure
    if (images.length === 0 && product.colorVariants) {
      product.colorVariants.forEach((variant) => {
        if (variant.image && !images.includes(variant.image)) {
          images.push(variant.image);
        }
      });
    }

    return images;
  }, [product, selectedColor]);

  if (loadingProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="h-[500px] w-full rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || undefined, chosenFulfillment);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Open WhatsApp with the product
    const phoneNumber = "919824044585";
    const message = `Hi! I want to buy: ${product.name} (Qty: ${quantity}, Color: ${selectedColor || 'Default'}, Fulfillment: ${chosenFulfillment === 'instock' ? 'Ready Stock' : 'Made to Order'}). Please share the price and availability.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : (product.category || "Furniture");
  const metaTitle = `${product.name} | ${categoryName} | Dipak Furniture Ahmedabad`;
  const metaDescription = `Buy ${product.name} from Dipak Furniture, leading ${categoryName.toLowerCase()} manufacturer in Ahmedabad. Features: ${product.features?.slice(0, 3).join(", ")}. Get quote now!`;

  return (
    <Layout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        keywords={`${product.name}, ${product.category}, office furniture ahmedabad, ${product.features.join(", ")}`}
        canonicalUrl={`https://dipaksteelfurniture.lovable.app/product/${product.id}`}
      />
      <ProductSchema product={product} images={productImages} />

      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <ProductBreadcrumb product={product} category={category} />

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
            {/* Left: Image Gallery + Delivery Info */}
            <div className="space-y-6">
              <ProductImageGallery images={productImages} productName={product.name} />
              <DeliveryServiceInfo description={product.description || product.longDescription?.slice(0, 160) + "..."} />
            </div>

            {/* Right: Product Info */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isInCart={isInCart(product.id, selectedColor || undefined, chosenFulfillment)}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              chosenFulfillment={chosenFulfillment}
              setChosenFulfillment={setChosenFulfillment}
            />
          </div>

          {/* Product Details Tabs */}
          <ProductTabs product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </div>

      {/* Sticky Mobile Cart */}
      <StickyMobileCart
        product={product}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        isInCart={isInCart(product.id, selectedColor || undefined)}
      />
    </Layout>
  );
};

export default ProductDetail;
