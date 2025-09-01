"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
  description: string
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = require("../context/AuthContext").useAuth();

  // Fetch cart from Supabase on mount and when user changes
  useEffect(() => {
    async function fetchCart() {
      if (!user) return;
  const res = await fetch(`/api/cart?userId=${user.id}`);
      const data = await res.json();
      if (res.ok && data.cart) {
        setCart(data.cart.map((item: any) => ({
          ...item,
          id: item.product_id,
        })));
      }
    }
    fetchCart();
  }, [user]);

  const addToCart = async (product: Product) => {
    if (!user) return;
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1, access_token: user.access_token }),
    });
    if (res.ok) {
      // Refetch cart
      const getRes = await fetch(`/api/cart?userId=${user.id}&access_token=${user.access_token}`);
      const getData = await getRes.json();
      if (getRes.ok && getData.cart) {
        setCart(getData.cart.map((item: any) => ({ ...item, id: item.product_id })));
      }
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, productId, access_token: user.access_token }),
    });
    // Refetch cart
    const getRes = await fetch(`/api/cart?userId=${user.id}&access_token=${user.access_token}`);
    const getData = await getRes.json();
    if (getRes.ok && getData.cart) {
      setCart(getData.cart.map((item: any) => ({ ...item, id: item.product_id })));
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;
    if (quantity === 0) {
      await removeFromCart(productId);
      return;
    }
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, productId, quantity, access_token: user.access_token }),
    });
    // Refetch cart
    const getRes = await fetch(`/api/cart?userId=${user.id}&access_token=${user.access_token}`);
    const getData = await getRes.json();
    if (getRes.ok && getData.cart) {
      setCart(getData.cart.map((item: any) => ({ ...item, id: item.product_id })));
    }
  };

  const clearCart = async () => {
    if (!user) return;
    // Remove all items one by one
    for (const item of cart) {
      await removeFromCart(item.id);
    }
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
