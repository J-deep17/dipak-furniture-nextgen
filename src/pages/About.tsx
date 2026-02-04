import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Target, Eye, Heart, Award, Users, Lightbulb, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description: "Honest dealings and transparent business practices in every interaction.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "Uncompromising standards in materials, craftsmanship, and finish.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Your satisfaction is our primary measure of success.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously improving designs for better comfort and functionality.",
  },
];

const About = () => {
  return (
    <Layout>
      <SEOHead
        title="About Dipak Furniture | Office Furniture Manufacturer Ahmedabad Since 1998"
        description="Learn about Dipak Furniture, a leading office furniture manufacturer in Ahmedabad, Gujarat with 25+ years of experience. We manufacture ergonomic office chairs, steel almirahs, school furniture & institutional seating."
        keywords="about dipak furniture, office furniture manufacturer ahmedabad, furniture company ahmedabad, office chair manufacturer india, institutional furniture supplier"
      />

      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              About Dipak Furniture – Since 1998
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Crafting premium office and institutional furniture for Indian
              workspaces for over 25 years.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Who We Are</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Dipak Furniture</strong> is a leading <strong>office furniture manufacturer in Ahmedabad</strong>, Gujarat,
                with over 25 years of experience in crafting premium quality furniture for offices,
                educational institutions, healthcare facilities, and government organizations across India.
                As a trusted <strong>office chair manufacturer</strong>, we specialize in ergonomic seating solutions
                designed for comfort during long working hours.
              </p>
              <p>
                Our state-of-the-art manufacturing facility combines traditional craftsmanship with modern
                technology to produce furniture that meets the highest standards of quality, durability, and comfort.
                Every piece that leaves our factory undergoes rigorous quality checks to ensure it meets our exacting standards.
                We are proud to be a <strong>wholesale office furniture supplier</strong> serving businesses of all sizes.
              </p>
              <p>
                We believe that great furniture can transform spaces and improve productivity. That's why we focus on
                ergonomic design, premium materials, and attention to detail in everything we create. Whether you need
                <strong> executive office chairs</strong>, <strong>mesh task chairs</strong>, <strong>steel almirahs</strong>,
                or <strong>school furniture</strong>, Dipak Furniture has you covered.
              </p>
            </div>

            {/* Internal Links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products/executive-chairs" className="text-accent hover:underline">Executive Chairs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/task-chairs" className="text-accent hover:underline">Task Chairs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/almirahs" className="text-accent hover:underline">Steel Almirahs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/school-furniture" className="text-accent hover:underline">School Furniture</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gray-50/50 py-14 md:py-20">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Vision */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">Our Vision</h3>
              <p className="text-muted-foreground">
                To be India's most trusted office furniture brand, known for transforming
                workspaces with ergonomic, sustainable, and beautifully designed
                furniture that enhances productivity and well-being.
              </p>
            </div>

            {/* Mission */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground">
                To design and manufacture furniture that combines comfort,
                durability, and aesthetics while maintaining affordable pricing
                and exceptional customer service. We aim to support Indian
                businesses with products made for Indian workspaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Our Core Values</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The principles that guide every decision we make and every product
              we create.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="bg-primary py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-2xl font-bold text-primary-foreground md:text-3xl">
              Manufacturing Excellence in Ahmedabad
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Our manufacturing facility in Ahmedabad is equipped with modern
              machinery and staffed by skilled craftsmen who bring decades of
              experience to every piece of furniture. We use premium-grade
              materials sourced from trusted suppliers, ensuring durability and
              longevity in all our products.
            </p>
            <div className="grid gap-6 text-center sm:grid-cols-3">
              <div>
                <p className="text-4xl font-bold text-accent">25+</p>
                <p className="text-primary-foreground/70">Years of Experience</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">10,000+</p>
                <p className="text-primary-foreground/70">Satisfied Clients</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">50,000+</p>
                <p className="text-primary-foreground/70">Products Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
            Ready to Furnish Your Workspace?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-accent-foreground/80">
            Contact us for personalized recommendations and competitive quotes on bulk orders.
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
              +91 98240 44585
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

export default About;
