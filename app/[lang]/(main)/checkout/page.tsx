'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createOrder } from '@/actions/checkout';
import { getShippingRates } from '@/actions/shipping';
import { Loader2, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WILAYAS, MUNICIPALITIES } from '@/lib/algeria-data';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, isCartLoaded, lang, dictionary } =
    useCart();
  const router = useRouter();
  const currency = dictionary.currency;

  const formSchema = z.object({
    email: z.string().email({ message: dictionary.validation_invalid_email }),
    phone: z.string().min(1, { message: dictionary.validation_required }),
    firstName: z.string().min(1, { message: dictionary.validation_required }),
    lastName: z.string().min(1, { message: dictionary.validation_required }),
    address: z.string().min(1, { message: dictionary.validation_required }),
    wilaya: z.string().min(1, { message: dictionary.validation_required }),
    municipality: z.string().min(1, { message: dictionary.validation_required }),
    deliveryType: z.enum(['home', 'office']),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      wilaya: '',
      municipality: '',
      deliveryType: 'home',
    },
  });

  const selectedWilaya = form.watch('wilaya');
  const selectedDeliveryType = form.watch('deliveryType');
  const municipalities = selectedWilaya
    ? MUNICIPALITIES[parseInt(selectedWilaya, 10)] || []
    : [];

  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(0);

  // Fetch shipping rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      const result = await getShippingRates();
      if (result.success && Array.isArray(result.fees)) {
        setShippingRates(result.fees);
      }
    };
    fetchRates();
  }, []);

  // Update shipping fee when wilaya or delivery type changes
  useEffect(() => {
    if (selectedWilaya && shippingRates.length > 0) {
      const rate = shippingRates.find(r => r.wilaya_id === parseInt(selectedWilaya, 10));
      if (rate) {
        const fee = selectedDeliveryType === 'home' ? rate.livraison : rate.stop_desk;
        setShippingFee(Number(fee) || 0);
      }
    } else {
      setShippingFee(0);
    }
  }, [selectedWilaya, selectedDeliveryType, shippingRates]);

  useEffect(() => {
    form.setValue('municipality', '');
  }, [selectedWilaya, form]);

  const isOrderCompleted = useRef(false);

  useEffect(() => {
    if (isCartLoaded && cartItems.length === 0 && !isOrderCompleted.current) {
      router.push(`/${lang}/products`);
    }
  }, [isCartLoaded, cartItems, router, lang]);

  const [isPending, setIsPending] = useState(false);

  if (!isCartLoaded || cartItems.length === 0) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true);
    isOrderCompleted.current = true; // prevent empty-cart redirect
    
    // Prepare order data for Supabase
    const orderData = {
      customer_name: `${values.firstName} ${values.lastName}`,
      customer_email: values.email,
      customer_phone: values.phone,
      customer_wilaya: values.wilaya,
      customer_city: values.municipality,
      customer_address: values.address,
      delivery_type: values.deliveryType,
      shipping_fee: shippingFee,
      total_amount: cartTotal + shippingFee,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.salePrice ?? item.product.price,
      })),
    };

    const result = await createOrder(orderData);

    if (result.success && result.orderId) {
      // Keep localStorage for the confirmation page display
      const orderDetails = {
        id: result.orderId,
        trackingNumber: `YLD${Date.now().toString().slice(-8)}`,
        customer: values,
        items: cartItems,
        total: cartTotal,
        date: new Date().toISOString(),
      };
      localStorage.setItem('musheas_last_order', JSON.stringify(orderDetails));
      
      clearCart();
      router.push(`/${lang}/order-confirmation/${result.orderId}`);
    } else {
      setIsPending(false);
      console.error("Order creation failed:", result.error);
      alert(result.error || 'Failed to create order. Please check your data.');
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    alert(dictionary.validation_check_all_fields || "Please check all required fields.");
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {dictionary.checkout_title}
        </h1>
      </div>

      {/* Stepper */}
      <CheckoutStepper currentStep={2} lang={lang} dictionary={dictionary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="lg:order-2">
          <div className="sticky top-24">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>{dictionary.checkout_order_summary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map(item => {
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0">
                            <div className="h-full w-full rounded-lg overflow-hidden border bg-muted">
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name[lang as 'en' | 'ar'] ?? item.product.name.en}
                                fill
                                className="object-cover"
                                sizes="64px"
                                unoptimized
                              />
                            </div>
                            <span className="absolute -top-2 -right-2 rtl:right-auto rtl:-left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {item.product.name[lang as 'en' | 'ar'] ?? item.product.name.en}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-sm text-muted-foreground">
                                {price.toFixed(2)} {currency}
                              </p>
                              {item.product.salePrice && (
                                <p className="text-xs text-muted-foreground/70 line-through">
                                  {item.product.price.toFixed(2)} {currency}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="font-semibold whitespace-nowrap">
                          {(price * item.quantity).toFixed(2)} {currency}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Separator />
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{dictionary.cart_subtotal}</span>
                        <span className="font-bold">
                        {cartTotal.toLocaleString()} {currency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          {dictionary.cart_shipping}
                          {selectedDeliveryType && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {selectedDeliveryType === 'home' ? (dictionary.checkout_delivery_home || 'Home') : (dictionary.checkout_delivery_office || 'Office')}
                            </span>
                          )}
                        </span>
                        <span className={shippingFee > 0 ? "font-bold text-primary" : "text-muted-foreground italic text-xs"}>
                          {shippingFee > 0 ? `+ ${shippingFee.toLocaleString()} ${currency}` : dictionary.checkout_shipping_taxes_later}
                        </span>
                    </div>
                </div>
                <Separator className="bg-primary/10" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold block">{dictionary.cart_total}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{dictionary.checkout_cod_short}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-primary">
                      {(cartTotal + shippingFee).toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-primary ml-1">{currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:order-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
              <section>
                <h2 className="text-xl font-headline font-semibold text-foreground mb-4">
                  {dictionary.contact_info_title}
                </h2>
                <div className="p-6 rounded-lg border bg-card space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.checkout_email}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={dictionary.checkout_email_placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.checkout_phone}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={dictionary.checkout_phone_placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-headline font-semibold text-foreground mb-4">
                  {dictionary.checkout_shipping_info}
                </h2>
                <div className="p-6 rounded-lg border bg-card space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.checkout_first_name}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.checkout_last_name}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.checkout_address}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wilaya"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.checkout_wilaya}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    dictionary.checkout_wilaya_placeholder
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {WILAYAS.map(wilaya => (
                                <SelectItem
                                  key={wilaya.code}
                                  value={wilaya.code.toString()}
                                >
                                  {wilaya.ar_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {dictionary.checkout_municipality}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedWilaya}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    dictionary.checkout_municipality_placeholder
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {municipalities.map(municipality => (
                                <SelectItem
                                  key={municipality}
                                  value={municipality}
                                >
                                  {municipality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="deliveryType"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>{dictionary.checkout_delivery_type || 'Delivery Type'}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="home">{dictionary.checkout_delivery_home || 'Home Delivery'}</SelectItem>
                            <SelectItem value="office">{dictionary.checkout_delivery_office || 'Office Delivery'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section>
                 <h2 className="text-xl font-headline font-semibold text-foreground mb-4">
                  {dictionary.checkout_payment_method}
                </h2>
                <div className="p-4 rounded-lg border bg-card text-card-foreground">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" suppressHydrationWarning />
                      <div>
                        <p className="font-semibold">{dictionary.checkout_cod_short}</p>
                        <p className="text-sm text-muted-foreground">{dictionary.checkout_cod_info}</p>
                      </div>
                    </div>
                </div>
              </section>

              <div>
                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.checkout_confirm_order}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">{dictionary.checkout_post_order_note}</p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
