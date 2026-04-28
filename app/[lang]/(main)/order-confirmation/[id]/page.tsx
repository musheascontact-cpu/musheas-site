'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import type { CartItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { getOrderDetails } from '@/actions/checkout';

/**
 * Defines the structure of the order details object that is expected
 * to be found in the browser's localStorage. This provides type safety.
 */
interface OrderDetails {
  id: string;
  trackingNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    wilaya: string;
    municipality: string;
    deliveryType?: string;
  };
  items: CartItem[];
  total: number;
  date: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  const { lang, dictionary } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currency = dictionary?.currency || 'DZD';
  const isAr = lang === 'ar';

  useEffect(() => {
    async function fetchOrder() {
        if (!id) return;
        
        setIsLoading(true);
        
        // Try localStorage first for instant display
        const storedOrder = localStorage.getItem('musheas_last_order');
        if (storedOrder) {
          try {
            const parsedOrder = JSON.parse(storedOrder);
            if (parsedOrder.id == id) {
              setOrderDetails(parsedOrder);
              setIsLoading(false);
              // We still fetch from server to verify and get latest state
            }
          } catch (e) {
            console.error("Failed to parse order details", e);
          }
        }
        
        // Fetch from server
        try {
            const serverOrder = await getOrderDetails(id);
            if (serverOrder) {
                setOrderDetails(serverOrder as unknown as OrderDetails);
            }
        } catch (e) {
            console.error("Failed to fetch order from server", e);
        } finally {
            setIsLoading(false);
        }
    }

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-12 md:py-20">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="w-full max-w-2xl space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <Card className="text-center border-2 border-destructive/20 bg-background/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <Package className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-headline text-destructive">
                {dictionary?.order_not_found_title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {dictionary?.order_not_found_description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href={`/${lang}/shop`}>
                  {dictionary.order_confirmation_continue_shopping}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <motion.div 
        initial={{ opacity: 1, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
          {dictionary?.order_confirmation_title}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {dictionary?.order_confirmation_thank_you} {orderDetails.customer?.firstName}!
          {isAr ? ' لقد قمنا باستلام طلبك وسنباشر في معالجته.' : ' We have received your order and are processing it.'}
        </p>
      </motion.div>

      {/* Stepper */}
      {dictionary && (
        <CheckoutStepper currentStep={3} lang={lang} dictionary={dictionary} />
      )}

      <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Success Message & Tracking */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-background relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle className="h-32 w-32" />
              </div>
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500 ring-4 ring-green-500/10">
                    <CheckCircle className="h-7 w-7" suppressHydrationWarning />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline">
                      {dictionary?.order_confirmation_stage_3_success || (isAr ? 'اكتمل الطلب' : 'Order Completed')}
                    </CardTitle>
                    <CardDescription>
                      {dictionary?.order_confirmation_order_number || (isAr ? 'رقم الطلب' : 'Order Number')}{' '}
                      <span className="font-bold text-foreground">#{orderDetails.id}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  {dictionary?.order_confirmation_details}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{dictionary?.checkout_email || 'Email'}</p>
                      <p className="text-sm font-medium">{orderDetails.customer?.email}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{dictionary?.checkout_phone || 'Phone'}</p>
                      <p className="text-sm font-medium">{orderDetails.customer?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{dictionary?.checkout_address || 'Address'}</p>
                    <p className="text-sm font-medium">
                      {orderDetails.customer?.address}, {orderDetails.customer?.municipality}, {orderDetails.customer?.wilaya}
                    </p>
                    {orderDetails.customer?.deliveryType && (
                      <p className="text-xs mt-1 text-primary/80 font-medium italic">
                        {orderDetails.customer?.deliveryType === 'home' ? (dictionary?.checkout_delivery_home || 'Home Delivery') : (dictionary?.checkout_delivery_office || 'Office Delivery')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>


        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 1, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="sticky top-24"
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">{dictionary.checkout_order_summary}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/10">
                  {orderDetails.items?.map((item, idx) => {
                    const price = Number(item.product?.salePrice ?? item.product?.price ?? 0);
                    const productName = item.product?.name?.[lang as 'en' | 'ar'] ?? item.product?.name?.en ?? (isAr ? 'منتج غير معروف' : 'Unknown Product');
                    return (
                      <div key={item.id || idx} className="flex items-center gap-4 group">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden border bg-muted shrink-0 shadow-sm transition-transform group-hover:scale-105">
                          {item.product?.imageUrl && (
                            <Image
                              src={item.product?.imageUrl}
                              alt={productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-sm truncate">{productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {price.toFixed(2)} {currency}
                          </p>
                        </div>
                        <p className="font-bold text-sm shrink-0">
                          {(price * item.quantity).toFixed(2)} {currency}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-6 bg-muted/10 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{dictionary?.cart_subtotal}</span>
                    <span className="font-medium">{Number(orderDetails.total || 0).toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{dictionary?.cart_shipping}</span>
                    <span className="text-primary font-medium">{dictionary?.checkout_shipping_taxes_later}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>{dictionary?.cart_total}</span>
                    <span>{Number(orderDetails.total || 0).toFixed(2)} {currency}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                <Button asChild className="w-full rounded-xl h-12 shadow-lg shadow-primary/20">
                  <Link href={`/${lang}/shop`}>
                    {dictionary.order_confirmation_continue_shopping}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full rounded-xl h-12">
                  <Link href={`/${lang}/`}>
                    <Home className="mr-2 h-4 w-4" />
                    {dictionary.order_confirmation_back_to_home}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
