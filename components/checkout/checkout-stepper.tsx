"use client";

import { cn } from "@/lib/utils";
import { Check, ShoppingCart, ClipboardList, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
}

interface CheckoutStepperProps {
  currentStep: number;
  lang: string;
  dictionary: any;
}

export function CheckoutStepper({ currentStep, lang, dictionary }: CheckoutStepperProps) {
  const isAr = lang === 'ar';

  const steps: Step[] = [
    { id: 1, label: dictionary.cart_title || (isAr ? "السلة" : "Cart"), icon: ShoppingCart },
    { id: 2, label: dictionary.checkout_title || (isAr ? "تفاصيل الطلب" : "Order Details"), icon: ClipboardList },
    { id: 3, label: dictionary.order_confirmed || (isAr ? "تم الطلب" : "Completed"), icon: PartyPopper },
  ];

  const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <div className="w-full max-w-lg mx-auto mb-10 px-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute inset-x-0 top-5 h-0.5 bg-border z-0" />
        
        {/* Animated progress line */}
        <div className="absolute top-5 h-0.5 bg-primary z-0 transition-all duration-700 ease-in-out"
          style={{ width: progressWidth, [isAr ? 'right' : 'left']: 0 }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 font-bold text-sm",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-semibold whitespace-nowrap transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.id}. {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
