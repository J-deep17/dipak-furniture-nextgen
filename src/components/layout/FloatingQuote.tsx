import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FloatingQuote = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40"
                >
                    <Button
                        asChild
                        className="h-14 px-6 rounded-full bg-accent text-accent-foreground shadow-2xl hover:scale-105 transition-transform"
                    >
                        <Link to="/contact" className="flex items-center gap-2">
                            <MessageSquareQuote className="h-5 w-5" />
                            <span className="font-bold tracking-tight">GET FREE QUOTE</span>
                        </Link>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingQuote;
