import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import CategoryHeader from "@/components/products/CategoryHeader";
import ProductGrid from "@/components/products/ProductGrid";
import GroupedProductGrid from "@/components/products/GroupedProductGrid";
import { categorySEOContent, getDefaultCategorySEO } from "@/data/categorySEO";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Chair category slugs that should be grouped by back height
const chairCategorySlugs = ["executive-chairs", "task-chairs", "visitor-chairs"];

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductFilterSidebar, { FilterState } from "@/components/products/ProductFilterSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// ... existing imports ...

const ProductCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [sortBy, setSortBy] = useState<string>("latest");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    discountMin: null,
    ratingMin: null,
    colors: [],
    materials: [],
    tags: []
  });

  if (!categorySlug) {
    return <Navigate to="/products" replace />;
  }

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Construct query params from filters
  const queryParams = {
    sort: sortBy,
    categorySlug, // Added for backend filtering
    priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    priceMax: filters.priceRange[1] < 100000 ? filters.priceRange[1] : undefined,
    discountMin: filters.discountMin || undefined,
    ratingMin: filters.ratingMin || undefined,
    colors: filters.colors.length > 0 ? filters.colors.join(',') : undefined,
    materials: filters.materials.length > 0 ? filters.materials.join(',') : undefined,
    tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined
  };

  const { data: products = [], isLoading: loadingProducts, isFetching } = useQuery({
    queryKey: ['products', categorySlug, queryParams], // Include all params in key
    queryFn: () => fetchProducts(queryParams),
  });

  // Extract unique colors from products for the sidebar filter
  const availableColors = Array.from(new Set(products.flatMap((p: any) => p.colors?.map((c: any) => c.name) || []))).sort() as string[];

  // ... skeleton ...
  if (loadingCategories) { // loadingProducts handled by skeleton inside structure or simple placeholder
    // Use lighter skeleton for now or same full page
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-full w-full" />
        </div>
      </Layout>
    );
  }

  const category = categories?.find(c => c.slug === categorySlug);
  const subCategories = categories?.filter(c => {
    const parentId = typeof c.parent === 'object' && c.parent !== null ? (c.parent as any)._id : c.parent;
    return parentId === category?._id;
  }) || [];

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  const isChairCategory = chairCategorySlugs.includes(categorySlug);
  const seoContent = categorySEOContent[categorySlug] || getDefaultCategorySEO(category.name, categorySlug);

  // Related categories for internal linking
  const relatedCategories = categories
    ?.filter(c => {
      const parentId = typeof c.parent === 'object' && c.parent !== null ? (c.parent as any)._id : c.parent;
      return c.slug !== categorySlug && parentId !== category?._id;
    })
    .slice(0, 4) || [];

  // ... imports and related logic ...

  return (
    <Layout>
      {/* SEO & Header ... same ... */}
      <SEOHead
        title={seoContent.metaTitle}
        description={seoContent.metaDescription}
        keywords={seoContent.keywords}
        canonicalUrl={`https://dipaksteelfurniture.lovable.app/products/${categorySlug}`}
      />

      <CategoryHeader
        title={seoContent.h1Title}
        description={category.description}
        breadcrumbs={[
          { name: "Products", path: "/products" },
          { name: category.name, path: `/products/${categorySlug}` },
        ]}
      />

      {/* SEO Description Section */}
      <section className="py-8 bg-secondary/30">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-sm text-muted-foreground">
              {seoContent.seoDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24">
              <ProductFilterSidebar
                filters={filters}
                onChange={setFilters}
                availableColors={availableColors}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1 w-full">
              {subCategories.length > 0 && (
                <div className="mb-8 p-4 bg-white rounded-xl border border-border/60 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Explore Sub-categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {subCategories.map(sc => (
                      <Link
                        key={sc._id}
                        to={`/products/${sc.slug}`}
                        className="px-4 py-2 rounded-full bg-accent/5 text-accent border border-accent/20 hover:bg-accent hover:text-white transition-all text-sm font-medium"
                      >
                        {sc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-2">
                        <Filter className="h-4 w-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[540px] overflow-y-auto">
                      <div className="py-4">
                        <h3 className="text-lg font-bold mb-4">Filters</h3>
                        <ProductFilterSidebar
                          filters={filters}
                          onChange={setFilters}
                          availableColors={availableColors}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <h2 className="text-xl font-bold text-foreground">
                    {products.length} Products
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">Sort By:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] bg-card h-9 border-border/60">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">New Arrivals</SelectItem>
                      <SelectItem value="bestseller">Best Selling</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="discount_desc">Discount: High to Low</SelectItem>
                      <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={`transition-opacity duration-300 min-h-[400px] ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {loadingProducts && !isFetching ? ( // Initial load
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-96 w-full rounded-xl" />)}
                  </div>
                ) : products.length > 0 ? (
                  isChairCategory ? (
                    <GroupedProductGrid products={products} />
                  ) : (
                    <ProductGrid products={products} />
                  )
                ) : (
                  <div className="text-center py-20 border rounded-lg bg-muted/20">
                    <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                    <Button variant="link" onClick={() => setFilters({ priceRange: [0, 100000], discountMin: null, ratingMin: null, colors: [], materials: [], tags: [] })}>
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-white">
        <div className="container">
          <h3 className="mb-6 text-xl font-semibold text-foreground">
            Related Product Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {relatedCategories.map(cat => (
              <Link
                key={cat.slug}
                to={`/products/${cat.slug}`}
                className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/products"
              className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-12">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground">
            Need Bulk Orders or Custom Solutions?
          </h2>
          <p className="mb-6 text-accent-foreground/80 max-w-xl mx-auto">
            Get special pricing on bulk orders. We're a leading {category.name.toLowerCase()} manufacturer in Ahmedabad with factory-direct prices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+919824044585"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-foreground/30 bg-transparent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-foreground/10"
            >
              <Phone className="h-4 w-4" />
              +91 98240 44585
            </a>
            <a
              href={`https://wa.me/919824044585?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(category.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition-colors hover:bg-[#25D366]/90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;
