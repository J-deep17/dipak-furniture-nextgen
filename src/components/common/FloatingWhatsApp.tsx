import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingWhatsApp() {
    return (
        <a
            href="https://wa.me/919824044585?text=Hi%2C%20I%27m%20interested%20in%20your%20office%20furniture%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#25D366]/90 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
                <MessageCircle className="h-6 w-6 text-white" />
            </Button>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    Chat with us on WhatsApp
                    <div className="absolute top-full right-4 -mt-1">
                        <div className="border-4 border-transparent border-t-slate-900" />
                    </div>
                </div>
            </div>

            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        </a>
    );
}
