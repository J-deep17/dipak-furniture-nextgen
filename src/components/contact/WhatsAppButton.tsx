import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  productName?: string;
}

const WhatsAppButton = ({ message, productName }: WhatsAppButtonProps) => {
  const phoneNumber = "919824044585";

  const getWhatsAppMessage = () => {
    if (productName) {
      return encodeURIComponent(
        `Hi, I'm interested in ${productName} from Dipak Steel Furniture. Please share more details.`
      );
    }
    if (message) {
      return encodeURIComponent(message);
    }
    return encodeURIComponent(
      "Hi, I'm interested in your furniture products. Please share more details."
    );
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${getWhatsAppMessage()}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl md:h-16 md:w-16">
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8 relative z-10" />

        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 -mt-1">
            <div className="border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
