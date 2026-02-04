import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PromoAds = () => {
    const promoImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/5ha6ZdhQ08RpTfTOozGqv4IhXmi1/social-images/social-1769834111515-ads.png";

    return (
        <section className="py-10 md:py-16 bg-white overflow-hidden">
            <div className="container px-6 sm:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative group rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100"
                >
                    {/* Main Banner Image */}
                    <div className="aspect-[16/9] md:aspect-[21/7] lg:aspect-[25/8] overflow-hidden">
                        <motion.img
                            src={promoImage}
                            alt="Limited Time Furniture Offer"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        />
                    </div>

                    {/* Overlay for better readability if needed, though usually these sent images have text embedded */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Optional Action Button Overlay */}
                    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full h-14 px-8 bg-white text-primary hover:bg-slate-100 shadow-xl border-none font-bold text-lg transition-all hover:scale-105"
                        >
                            <Link to="/products">
                                Shop the Sale
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-8 left-8">
                        <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                            Limited Time Offer
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PromoAds;
