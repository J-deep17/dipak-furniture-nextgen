import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryTiles = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const featuredCategories = categories?.slice(0, 6) || [];

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
            Our Collection
          </p>
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Browse Office Furniture by Category
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our comprehensive range of <strong>office chairs</strong>, <strong>steel almirahs</strong>, and institutional furniture,
            designed for comfort and built to last.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-[340px] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/products/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-50">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center justify-between p-5 text-center">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-accent mt-2">
                    View Products
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-accent bg-transparent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;