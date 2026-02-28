"use client";

import { getCart } from "@/services/order";
import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalPrice: number;
};

type CartContextType = {
  cart: Cart;
  count: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
  const [count, setCount] = useState(0);

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);

    const totalCount = data.items.reduce(
      (sum: number, item: CartItem) => sum + (item.quantity || 1),
      0
    );

    setCount(totalCount);
  };

  useEffect(() => {
     loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, count, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};