import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  Award,
  Truck,
  Clock,
  HeartHandshake,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";

const qualityPoints = [
  {
    icon: Shield,
    title: "Rigorous Testing",
    description:
      "Every product undergoes extensive durability and safety testing before leaving our facility.",
  },
  {
    icon: CheckCircle,
    title: "Quality Control",
    description:
      "Multi-stage quality checks ensure consistent standards across all products.",
  },
  {
    icon: Award,
    title: "Premium Materials",
    description:
      "We source only high-grade materials from trusted suppliers with verified quality.",
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    description:
      "Careful packaging and handling ensure your furniture arrives in perfect condition.",
  },
  {
    icon: Clock,
    title: "Long Lifespan",
    description:
      "Built to last for years with minimal maintenance, reducing replacement costs.",
  },
  {
    icon: HeartHandshake,
    title: "Warranty Support",
    description:
      "Comprehensive warranty coverage with responsive after-sales support.",
  },
];

const testimonials = [
  {
    quote:
      "Dipak Furniture has been our furniture partner for 10 years. Their quality and service are unmatched in the industry.",
    author: "Rajesh Sharma",
    company: "ABC Corporation, Ahmedabad",
  },
  {
    quote:
      "We furnished our entire school with their products. The durability has been exceptional even with heavy student use.",
    author: "Dr. Meera Patel",
    company: "Sunshine School, Gandhinagar",
  },
  {
    quote:
      "Professional service from enquiry to delivery. The ergonomic chairs have significantly improved our team's comfort.",
    author: "Amit Desai",
    company: "TechStart Solutions, Bangalore",
  },
];

const Quality = () => {
  return (
    <Layout>
      <SEOHead
        title="Quality & Trust | Office Furniture Manufacturer Ahmedabad | Dipak Furniture"
        description="Dipak Furniture maintains strict quality standards in office furniture manufacturing. 25+ years of trusted quality, rigorous testing, premium materials, and 5-year warranty on all products."
        keywords="quality office furniture, trusted furniture manufacturer, office furniture warranty, durable office chairs, premium office furniture india"
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Quality & Trust – Our Manufacturing Promise
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Our commitment to excellence is reflected in every office chair, table, and furniture piece we manufacture.
              Quality you can trust from Ahmedabad's leading furniture manufacturer.
            </p>
          </div>
        </div>
      </section>

      {/* Quality Points */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Our Quality Promise
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From raw materials to final delivery, quality is embedded in every
              step of our manufacturing process. That's why businesses trust us for their <strong>office furniture</strong> needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {qualityPoints.map((point, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <point.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold text-foreground text-center">
            Trusted by Businesses Across India
          </h2>
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <p className="text-4xl font-bold text-accent">25+</p>
              <p className="text-muted-foreground">Years in Business</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent">10,000+</p>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent">98%</p>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent">5 Years</p>
              <p className="text-muted-foreground">Warranty Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Trusted by offices, schools, hospitals, and institutions across India.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="mb-4 text-muted-foreground">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Products */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h3 className="mb-6 text-xl font-semibold text-foreground text-center">
            Explore Our Quality Office Furniture
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products/executive-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Executive Chairs
            </Link>
            <Link to="/products/task-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Ergonomic Task Chairs
            </Link>
            <Link to="/products/almirahs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Steel Almirahs
            </Link>
            <Link to="/products/school-furniture" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              School Furniture
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
            Experience the Dipak Furniture Difference
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-accent-foreground/80">
            Join thousands of satisfied clients who trust us for their office furniture needs. Get in touch today for a free quote.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get a Quote
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
              href="https://wa.me/919824044585"
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

export default Quality;
