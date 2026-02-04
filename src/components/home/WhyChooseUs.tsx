import { Check, Shield, Truck, HeartHandshake, Leaf, Award } from "lucide-react";
const features = [{
  icon: Check,
  title: "Ergonomic Design",
  description: "Every product is designed with human comfort in mind, supporting proper posture during long working hours."
}, {
  icon: Shield,
  title: "Premium Quality",
  description: "Built with high-grade materials and rigorous quality checks to ensure durability and longevity."
}, {
  icon: Truck,
  title: "Pan-India Delivery",
  description: "We deliver across India with careful handling and professional installation services."
}, {
  icon: HeartHandshake,
  title: "Customer First",
  description: "Dedicated support team ready to assist you from selection to after-sales service."
}, {
  icon: Leaf,
  title: "Eco-Friendly",
  description: "Sustainable manufacturing practices with eco-conscious materials wherever possible."
}, {
  icon: Award,
  title: "Made in India",
  description: "Proudly manufactured in Ahmedabad, supporting local craftsmanship and the Indian economy."
}];
const WhyChooseUs = () => {
  return <section className="py-14 md:py-20">
    <div className="container">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">WHY DIPAK STEEL FURNITURE</p>
        <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
          The Smart Choice for Your Workspace
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          For over two decades, we've been crafting furniture that combines
          comfort, quality, and value for Indian businesses and homes.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => <div key={index} className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {feature.description}
          </p>
        </div>)}
      </div>
    </div>
  </section>;
};
export default WhyChooseUs;