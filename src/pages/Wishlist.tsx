import Layout from "@/components/layout/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <Layout>
            <SEOHead
                title="My Wishlist | Dipak Steel Furniture"
                description="View your saved products at Dipak Steel Furniture."
                canonicalUrl="https://dipaksteelfurniture.lovable.app/wishlist"
            />
            <div className="container py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">My Wishlist</h1>
                        <p className="text-muted-foreground">{wishlist.length} Items saved for later</p>
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <ProductGrid products={wishlist} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-gray-50/50 dashed border-gray-200">
                        <div className="bg-card p-4 rounded-full shadow-sm mb-4">
                            <Heart className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Looks like you haven't added anything to your wishlist yet.
                            Explore our wide range of furniture to find your favorites.
                        </p>
                        <Button asChild className="gap-2">
                            <Link to="/products">
                                <ShoppingBag className="w-4 h-4" /> Start Shopping
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
