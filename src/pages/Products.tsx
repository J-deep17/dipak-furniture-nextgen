import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <Layout>
      <SEOHead
        title="Office Furniture Products | Chairs, Tables, Almirahs | Dipak Furniture Ahmedabad"
        description="Browse our complete range of office furniture including executive chairs, ergonomic task chairs, visitor chairs, steel almirahs, school furniture, office tables and more. Factory-direct prices from Ahmedabad manufacturer."
        keywords="office furniture products, office chairs, executive chairs, task chairs, steel almirahs, school furniture, office tables, conference tables, institutional seating, office furniture ahmedabad"
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Office Furniture Products – Complete Range
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Explore our comprehensive collection of office and institutional
              furniture. From <strong>ergonomic office chairs</strong> to <strong>steel almirahs</strong>, find everything you need to furnish your workspace. Factory-direct prices from Ahmedabad's trusted furniture manufacturer.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Select a category to explore our range of quality office furniture. All products manufactured in our Ahmedabad facility with premium materials and quality warranty.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load categories. Please try again later.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories?.map((category) => (
                <Link
                  key={category.slug}
                  to={`/products/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/50">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-accent">
                      Browse Products
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h3 className="mb-6 text-xl font-semibold text-foreground text-center">
            Popular Office Furniture Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {!isLoading && categories?.slice(0, 6).map((cat) => (
              <Link key={cat.slug} to={`/products/${cat.slug}`} className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
            Can't Find What You're Looking For?
          </h2>
          <p className="mb-6 text-accent-foreground/80 max-w-2xl mx-auto">
            We offer custom furniture solutions and bulk order discounts. As a leading office furniture manufacturer in Ahmedabad, we can create furniture tailored to your specific requirements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Custom Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+919824044585"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-foreground/30 bg-transparent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-foreground/10"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/919824044585?text=Hi%2C%20I%27m%20looking%20for%20custom%20office%20furniture."
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

export default Products;
