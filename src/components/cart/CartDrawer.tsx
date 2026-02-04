import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, getTotalItems, clearCart, sendToWhatsApp } = useCart();
  const totalItems = getTotalItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-12 w-12 p-0 bg-slate-100/50 hover:bg-accent/10 hover:text-accent group transition-all rounded-xl">
          <motion.div
            animate={totalItems > 0 ? {
              rotate: [0, -10, 10, -10, 10, 0],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
          </motion.div>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-6 w-6 rounded-full p-0 text-[12px] font-bold items-center justify-center bg-accent text-accent-foreground border-2 border-background shadow-md">
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Inquiry List ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Your inquiry list is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Add products to send via WhatsApp
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor || 'default'}`}
                    className="flex gap-3 p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {item.product.name}
                      </p>
                      {item.selectedColor && (
                        <p className="text-[10px] text-primary font-semibold uppercase">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-muted-foreground truncate flex-1">
                          {item.product.category}
                        </p>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                          item.fulfillmentType === 'instock' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {item.fulfillmentType === 'instock' ? 'Ready' : 'MTO'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-border space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear All
                </Button>
                <Link to="/checkout">
                  <SheetClose asChild>
                    <Button className="w-full h-12 font-bold mb-3 shadow-lg shadow-primary/20">
                      Checkout Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SheetClose>
                </Link>
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12"
                  onClick={sendToWhatsApp}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Inquiry on WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet >
  );
};

export default CartDrawer;
