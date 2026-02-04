import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Leaf, Activity, Sparkles, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Philosophy = () => {
  return (
    <Layout>
      <SEOHead
        title="Design Philosophy | Ergonomic Office Furniture | Dipak Furniture Ahmedabad"
        description="Learn about Dipak Furniture's design philosophy combining eco-friendly materials with ergonomic engineering. Office chairs designed for long working hours and Indian workspaces."
        keywords="ergonomic office furniture, eco-friendly furniture, sustainable office chairs, ergonomic design, office furniture for long hours, best ergonomic chairs india"
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Our Design Philosophy – Ergonomic Office Furniture
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Where sustainability meets ergonomics for smarter, healthier
              workspaces. Office furniture designed for <strong>long working hours</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ECO + ERGO = SMART COMFORT */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-3xl font-bold md:text-5xl">
              <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-green-700">
                <Leaf className="h-8 w-8" />
                ECO
              </span>
              <span className="text-muted-foreground">+</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-blue-700">
                <Activity className="h-8 w-8" />
                ERGO
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent/20 px-4 py-2 text-accent">
                <Sparkles className="h-8 w-8" />
                SMART COMFORT
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              Our design philosophy combines eco-friendly materials with
              ergonomic engineering to create furniture that's good for you and
              good for the planet. The <strong>best ergonomic office chairs</strong> for Indian workplaces.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* ECO */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Eco-Conscious Design
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span>
                    Sustainable materials sourced from responsible suppliers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span>
                    Low-VOC finishes and environmentally safe adhesives
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span>
                    Durable construction that reduces replacement frequency
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <span>
                    Recyclable components and minimal packaging waste
                  </span>
                </li>
              </ul>
            </div>

            {/* ERGO */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Activity className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Ergonomic Excellence – Best Office Chairs for Long Hours
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span>
                    Scientifically designed for proper posture support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span>
                    Adjustable features to accommodate different body types
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span>
                    Lumbar support and pressure distribution for all-day comfort
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span>
                    Reduces fatigue and prevents work-related strain injuries
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Indian Workspaces */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Designed for Indian Workspaces
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Indian offices face unique challenges – varied climate
                  conditions, diverse body types, and the need for furniture that
                  withstands heavy use while remaining budget-friendly.
                </p>
                <p>
                  Our <strong>ergonomic office chairs</strong> are specifically engineered for these conditions.
                  From the humidity-resistant finishes to the robust construction
                  that handles high-traffic environments, every detail is
                  considered for the Indian workplace.
                </p>
                <p>
                  Whether it's a startup in Bangalore, a school in Bihar, or a
                  corporate office in Mumbai – our furniture is built to perform
                  in any Indian setting.
                </p>
              </div>
              
              {/* Internal Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/products/executive-chairs" className="text-accent hover:underline">Executive Chairs →</Link>
                <Link to="/products/task-chairs" className="text-accent hover:underline">Mesh Chairs →</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary p-6 text-center">
                <p className="text-3xl font-bold text-accent">28+</p>
                <p className="text-sm text-muted-foreground">States Served</p>
              </div>
              <div className="rounded-xl bg-secondary p-6 text-center">
                <p className="text-3xl font-bold text-accent">All Climates</p>
                <p className="text-sm text-muted-foreground">Tested & Proven</p>
              </div>
              <div className="rounded-xl bg-secondary p-6 text-center">
                <p className="text-3xl font-bold text-accent">ISO</p>
                <p className="text-sm text-muted-foreground">Quality Standards</p>
              </div>
              <div className="rounded-xl bg-secondary p-6 text-center">
                <p className="text-3xl font-bold text-accent">5 Year</p>
                <p className="text-sm text-muted-foreground">Warranty Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Philosophy;
