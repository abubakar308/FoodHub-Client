"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

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
  isLoading: boolean;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    data: cartData, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/cart");
      return data || { items: [], totalPrice: 0 };
    },
  });

  const cart = useMemo(() => cartData || { items: [], totalPrice: 0 }, [cartData]);

  const count = useMemo(() => {
    return cart.items.reduce(
      (sum: number, item: CartItem) => sum + (item.quantity || 0),
      0
    );
  }, [cart.items]);

  return (
    <CartContext.Provider value={{ cart, count, isLoading, refreshCart: refetch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};