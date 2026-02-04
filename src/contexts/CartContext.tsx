import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  fulfillmentType: 'instock' | 'made_to_order';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => void;
  removeFromCart: (productId: string, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => void;
  clearCart: () => void;
  getTotalItems: () => number;
  isInCart: (productId: string, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => boolean;
  sendToWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => {
    // Determine fulfillment type: Use provided one, or product's default, or fallback to instock
    const finalFulfillment = fulfillmentType || (product.fulfillmentType === 'made_to_order' ? 'made_to_order' : 'instock');

    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.fulfillmentType === finalFulfillment
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
            item.selectedColor === selectedColor &&
            item.fulfillmentType === finalFulfillment
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor, fulfillmentType: finalFulfillment }];
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => {
    setItems((prev) => prev.filter((item) => !(
      item.product.id === productId &&
      item.selectedColor === selectedColor &&
      (!fulfillmentType || item.fulfillmentType === fulfillmentType)
    )));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, fulfillmentType);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
          item.selectedColor === selectedColor &&
          (!fulfillmentType || item.fulfillmentType === fulfillmentType)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: string, selectedColor?: string, fulfillmentType?: 'instock' | 'made_to_order') => {
    return items.some((item) =>
      item.product.id === productId &&
      item.selectedColor === selectedColor &&
      (!fulfillmentType || item.fulfillmentType === fulfillmentType)
    );
  };

  const sendToWhatsApp = () => {
    if (items.length === 0) return;

    const phoneNumber = "919824044585";

    // Build the message with product list
    const productList = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.name}${item.selectedColor ? ` (Color: ${item.selectedColor})` : ''} - Qty: ${item.quantity}`
      )
      .join("\n");

    const message = `Hello! I'm interested in the following products:\n\n${productList}\n\nPlease provide pricing and availability details.`;

    // Encode the message for URL - validate and sanitize
    const encodedMessage = encodeURIComponent(message.substring(0, 2000)); // Limit message length
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        isInCart,
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
