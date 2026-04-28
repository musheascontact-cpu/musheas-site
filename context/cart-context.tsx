"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import type { Locale } from '@/lib/i18n-config';
import { products as allProducts } from '@/lib/data'; // Import the master product list

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, showToast?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartLoaded: boolean;
  lang: Locale;
  dictionary: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// A type guard to check if an item from storage has the old structure
type OldStorageItem = { id: string; product: Product; quantity: number };
function isOldStorageItem(item: any): item is OldStorageItem {
    return item && item.product && typeof item.product === 'object';
}

export const CartProvider = ({ children, lang, dictionary }: { children: ReactNode, lang: Locale, dictionary: any }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('musheas_cart');
      if (storedCart) {
        const itemsFromStorage: ({ id: string, quantity: number } | OldStorageItem)[] = JSON.parse(storedCart);
        
        // Re-hydrate the cart with fresh product data to prevent using stale data
        const hydratedCart: CartItem[] = itemsFromStorage.map(item => {
          const productId = isOldStorageItem(item) ? item.product.id : item.id;
          const product = allProducts.find(p => p.id === productId);

          if (product) {
            return {
              id: product.id,
              product: product,
              quantity: item.quantity
            };
          }
          return null;
        }).filter((item): item is CartItem => item !== null); // Filter out any items where product wasn't found

        setCartItems(hydratedCart);
      }
    } catch (e) {
      console.error("Failed to parse or hydrate cart from localStorage", e);
      // If parsing fails, it's likely corrupt. Clear it.
      localStorage.removeItem('musheas_cart');
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isCartLoaded) {
      // To prevent stale data, only store product IDs and quantities in localStorage.
      const cartToStore = cartItems.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem('musheas_cart', JSON.stringify(cartToStore));
    }
  }, [cartItems, isCartLoaded]);

  const addToCart = (product: Product, quantity: number = 1, showToast: boolean = true) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { id: product.id, product, quantity }];
    });
    if (showToast) {
        toast({
            title: dictionary.toast_added_to_cart_title,
            description: dictionary.toast_added_to_cart_description.replace('{productName}', product.name[lang]),
        });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({
      title: dictionary.toast_removed_from_cart_title,
      description: dictionary.toast_removed_from_cart_description,
      variant: "destructive",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isCartLoaded, lang, dictionary }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
