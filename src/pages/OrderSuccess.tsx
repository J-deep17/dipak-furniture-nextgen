import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
    const { orderNumber } = useParams();

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto bg-background rounded-3xl border shadow-xl overflow-hidden"
                    >
                        <div className="p-8 md:p-12 text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </motion.div>

                            <div className="space-y-2">
                                <h1 className="text-4xl font-black tracking-tight">Order Placed!</h1>
                                <p className="text-muted-foreground text-lg">
                                    Thank you for choosing SteelShow. Your furniture is being prepared with care.
                                </p>
                            </div>

                            <div className="bg-muted/50 rounded-2xl p-6 border border-dashed border-primary/20 inline-block w-full max-w-sm">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Order Reference</p>
                                <p className="text-2xl font-mono font-black text-primary">#{orderNumber}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                <Button asChild variant="outline" className="h-12 rounded-xl group">
                                    <Link to="/dashboard">
                                        <Package className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        Track Order
                                    </Link>
                                </Button>
                                <Button asChild className="h-12 rounded-xl group shadow-lg shadow-primary/20">
                                    <Link to="/products">
                                        Continue Shopping
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="pt-8 border-t flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
                                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <Download className="h-4 w-4" /> Download Invoice
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <Share2 className="h-4 w-4" /> Share Order
                                </button>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-6 border-t text-center">
                            <p className="text-sm font-medium">
                                A confirmation email has been sent to your registered address.
                                <br />
                                <span className="text-muted-foreground font-normal">Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link></span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderSuccess;
