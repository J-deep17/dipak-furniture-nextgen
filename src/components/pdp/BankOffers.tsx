import { CreditCard, Percent, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BankOffers() {
    const offers = [
        {
            icon: <CreditCard className="h-4 w-4 text-blue-600" />,
            title: "No Cost EMI",
            description: "Available on orders above ₹3,000",
        },
        {
            icon: <Percent className="h-4 w-4 text-green-600" />,
            title: "Bank Discounts",
            description: "Up to 10% off on select cards",
        },
    ];

    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Available Offers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {offers.map((offer, index) => (
                    <Card
                        key={index}
                        className="border-border/50 bg-gradient-to-br from-blue-50/50 to-green-50/50 hover:shadow-sm transition-all duration-150"
                    >
                        <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 flex-shrink-0">{offer.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground text-xs leading-tight">
                                        {offer.title}
                                    </p>
                                    <p className="text-muted-foreground text-[10px] mt-0.5 leading-snug">
                                        {offer.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-1.5 pt-1">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                <span className="text-[10px] text-muted-foreground">
                    Secured by <span className="font-semibold text-foreground">Razorpay</span>
                </span>
            </div>
        </div>
    );
}
