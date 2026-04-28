"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

interface UpdateCartButtonProps {
  productId: string;
  quantity: number;
}

export function UpdateCartButton({ productId, quantity }: UpdateCartButtonProps) {
  const { updateQuantity, dictionary } = useCart();
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const newQuantity = parseInt(inputValue, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setInputValue(String(quantity));
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="flex items-center rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(productId, quantity - 1)}
        aria-label={dictionary.cart_decrease_quantity}
      >
        <Minus className="h-4 w-4" suppressHydrationWarning />
      </Button>
      <Input
        type="number"
        className="w-8 h-8 text-center bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min="1"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(productId, quantity + 1)}
        aria-label={dictionary.cart_increase_quantity}
      >
        <Plus className="h-4 w-4" suppressHydrationWarning />
      </Button>
    </div>
  );
}
