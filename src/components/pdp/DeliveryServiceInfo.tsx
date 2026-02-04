import { Truck, MapPin, Package, Wrench, RefreshCw, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DeliveryInfoItem {
    icon: React.ReactNode;
    label: string;
    value: string;
}

interface DeliveryServiceInfoProps {
    description?: string;
    deliveryTime?: string;
    shippingLocation?: string;
    freeDeliveryText?: string;
    installationText?: string;
    replacementText?: string;
    bulkDiscountText?: string;
}

export default function DeliveryServiceInfo({
    description,
    deliveryTime = "3–7 Working Days",
    shippingLocation = "Ahmedabad, Gujarat",
    freeDeliveryText = "Free Delivery on Bulk Orders",
    installationText = "Installation Support Available",
    replacementText = "Easy Replacement Policy",
    bulkDiscountText = "Bulk Order Discounts Available",
}: DeliveryServiceInfoProps) {
    const deliveryInfo: DeliveryInfoItem[] = [
        {
            icon: <Truck className="h-4 w-4 text-primary" />,
            label: "Estimated Delivery",
            value: deliveryTime,
        },
        {
            icon: <MapPin className="h-4 w-4 text-primary" />,
            label: "Shipping From",
            value: shippingLocation,
        },
        {
            icon: <Package className="h-4 w-4 text-green-600" />,
            label: "Free Delivery",
            value: freeDeliveryText,
        },
        {
            icon: <Wrench className="h-4 w-4 text-blue-600" />,
            label: "Assembly Support",
            value: installationText,
        },
        {
            icon: <RefreshCw className="h-4 w-4 text-orange-600" />,
            label: "Replacement Policy",
            value: replacementText,
        },
        {
            icon: <TrendingDown className="h-4 w-4 text-purple-600" />,
            label: "Bulk Discounts",
            value: bulkDiscountText,
        },
    ];

    return (
        <Card className="w-full lg:max-w-[560px] lg:ml-auto border border-border/60 bg-white rounded-[14px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <CardContent className="p-6">
                <h3 className="mb-4 text-base font-bold text-foreground">
                    Product Description / Delivery & Service Information
                </h3>

                {description && (
                    <p className="mb-6 text-sm text-muted-foreground leading-relaxed italic">
                        {description}
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {deliveryInfo.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-1"
                        >
                            <div className="mt-1 flex-shrink-0 text-primary">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-foreground leading-tight text-[12px] uppercase tracking-wider">
                                    {item.label}
                                </p>
                                <p className="text-muted-foreground/80 text-[11px] mt-1 leading-snug">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
