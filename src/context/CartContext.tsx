"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { getCart } from "@/services/order";

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
  refetch: () => Promise<void>;
  invalidateCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading, refetch } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response = await getCart();
        return {
          items: response?.items || [],
          totalPrice: response?.totalPrice || 0,
        };
      } catch (error) {
        return { items: [], totalPrice: 0 };
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const cart = useMemo(
    () => cartData || { items: [], totalPrice: 0 },
    [cartData]
  );

  const count = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart.items]);

  const invalidateCart = async () => {
    await queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        isLoading,
        refetch: async () => {
          await refetch();
        },
        invalidateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};