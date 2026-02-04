import { Link } from "react-router-dom";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Link
          to={`/products/${products[0]?.categorySlug}`}
          className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            {/* ProductCard handles its own navigation / linkage logic, but RelatedProducts wraps it in a Link currently. 
                    ProductCard *also* has valid navigation logic inside it (onClick -> navigate). 
                    So we should just render ProductCard. 
                */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
