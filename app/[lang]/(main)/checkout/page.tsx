'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createOrder } from '@/actions/checkout';
import { getShippingRates, getCommunesByWilaya } from '@/actions/shipping';
import { 
  Loader2, 
  Truck, 
  User, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  AlertCircle,
  PackageCheck,
  Zap,
  ShieldCheck
} from 'lucide-react';
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
import { cn, formatPrice } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, isCartLoaded, lang, dictionary } =
    useCart();
  const router = useRouter();
  const currency = dictionary.currency;
  const isAr = lang === 'ar';

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
  
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [apiCommunes, setApiCommunes] = useState<any[]>([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<string[]>([]);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const result = await getShippingRates();
      if (result && result.success && Array.isArray(result.fees)) {
        setShippingRates(result.fees);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    const fetchCommunes = async () => {
      if (!selectedWilaya) {
        setApiCommunes([]);
        return;
      }
      setIsLoadingCommunes(true);
      const result = await getCommunesByWilaya(parseInt(selectedWilaya, 10));
      if (result && result.success && Array.isArray(result.communes)) {
        setApiCommunes(result.communes);
      } else {
        setApiCommunes([]);
      }
      setIsLoadingCommunes(false);
    };
    fetchCommunes();
  }, [selectedWilaya]);

  useEffect(() => {
    let finalMunicipalities: string[] = [];
    
    if (apiCommunes.length > 0) {
      if (selectedDeliveryType === 'office') {
        finalMunicipalities = apiCommunes.filter(c => c.has_stop_desk === 1).map(c => c.nom);
      } else {
        finalMunicipalities = apiCommunes.map(c => c.nom);
      }
    } else {
      const localMuni = selectedWilaya ? MUNICIPALITIES[parseInt(selectedWilaya, 10)] || [] : [];
      finalMunicipalities = localMuni;
    }
    
    setFilteredMunicipalities(finalMunicipalities);
    
    const currentMuni = form.getValues('municipality');
    if (currentMuni && !finalMunicipalities.includes(currentMuni) && !isLoadingCommunes) {
      form.setValue('municipality', '');
    }
  }, [selectedWilaya, selectedDeliveryType, apiCommunes, form, isLoadingCommunes]);

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

  const isOrderCompleted = useRef(false);

  useEffect(() => {
    if (isCartLoaded && cartItems.length === 0 && !isOrderCompleted.current) {
      router.push(`/${lang}/products`);
    }
  }, [isCartLoaded, cartItems, router, lang]);

  const [isPending, setIsPending] = useState(false);

  if (!isCartLoaded || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true);
    isOrderCompleted.current = true;
    
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
    <div className="container py-12 md:py-24 max-w-7xl">
      <Reveal width="100%">
        <div className="mb-16 text-center space-y-4">
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tight text-foreground uppercase italic">
            {dictionary.checkout_title}
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.3em] text-sm">
            {isAr ? 'خطوة واحدة تفصلك عن الابتكار' : 'One step away from innovation'}
          </p>
        </div>
      </Reveal>

      {/* Stepper with Reveal */}
      <Reveal delay={0.1} width="100%">
         <CheckoutStepper currentStep={2} lang={lang} dictionary={dictionary} />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-12">
        {/* Main Form Area */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-12">
              {/* Contact Section */}
              <Reveal delay={0.2} width="100%">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-wider">
                      {dictionary.contact_info_title}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-xl shadow-2xl">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_email}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={dictionary.checkout_email_placeholder}
                              {...field}
                              className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20 transition-all text-lg"
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
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_phone}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={dictionary.checkout_phone_placeholder}
                              {...field}
                              className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20 transition-all text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </Reveal>

              {/* Shipping Section */}
              <Reveal delay={0.3} width="100%">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-wider">
                      {dictionary.checkout_shipping_info}
                    </h2>
                  </div>
                  
                  <div className="space-y-6 p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_first_name}</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20 text-lg" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_last_name}</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20 text-lg" />
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
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_address}</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20 text-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="wilaya"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_wilaya}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 text-lg px-6">
                                  <SelectValue placeholder={dictionary.checkout_wilaya_placeholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl backdrop-blur-xl bg-card/90 border-white/10">
                                {WILAYAS.map(wilaya => (
                                  <SelectItem key={wilaya.code} value={wilaya.code.toString()} className="rounded-xl my-1 focus:bg-primary/20">
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
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_municipality}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedWilaya}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl border-2 border-white/5 bg-background/50 text-lg px-6">
                                  <SelectValue placeholder={dictionary.checkout_municipality_placeholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl backdrop-blur-xl bg-card/90 border-white/10 max-h-60">
                                {isLoadingCommunes ? (
                                   <div className="p-4 flex items-center justify-center">
                                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                   </div>
                                ) : (
                                  filteredMunicipalities.map(municipality => (
                                    <SelectItem key={municipality} value={municipality} className="rounded-xl my-1 focus:bg-primary/20">
                                      {municipality}
                                    </SelectItem>
                                  ))
                                )}
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
                        <FormItem className="space-y-4">
                          <FormLabel className="text-xs font-black uppercase text-muted-foreground tracking-widest">{dictionary.checkout_delivery_type || 'Delivery Type'}</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                             {['home', 'office'].map((type) => (
                               <button
                                 key={type}
                                 type="button"
                                 onClick={() => field.onChange(type)}
                                 className={cn(
                                   "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-500",
                                   field.value === type 
                                     ? "bg-primary/20 border-primary shadow-lg shadow-primary/20" 
                                     : "bg-background/30 border-white/5 hover:border-white/20"
                                 )}
                               >
                                  <div className={cn(
                                    "p-3 rounded-2xl transition-colors",
                                    field.value === type ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"
                                  )}>
                                     {type === 'home' ? <MapPin className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                                  </div>
                                  <span className="font-black text-sm uppercase">
                                    {type === 'home' ? (dictionary.checkout_delivery_home || 'Home') : (dictionary.checkout_delivery_office || 'Office')}
                                  </span>
                               </button>
                             ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </Reveal>

              {/* Payment Section */}
              <Reveal delay={0.4} width="100%">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-wider">
                      {dictionary.checkout_payment_method}
                    </h2>
                  </div>
                  
                  <div className="p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                        <Truck className="h-20 w-20" />
                     </div>
                     <div className="flex items-start gap-6 relative z-10">
                        <div className="p-4 rounded-3xl bg-green-500/10 text-green-500">
                           <PackageCheck className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xl font-black uppercase">{dictionary.checkout_cod_short}</p>
                           <p className="text-muted-foreground leading-relaxed font-medium">{dictionary.checkout_cod_info}</p>
                        </div>
                     </div>
                  </div>
                </section>
              </Reveal>

              {/* Submit Area for Mobile */}
              <div className="lg:hidden mt-8">
                 <Button type="submit" size="lg" className="h-16 w-full rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 gap-3" disabled={isPending}>
                   {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-current" />}
                   {dictionary.checkout_confirm_order}
                 </Button>
                 <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-bold">
                    {dictionary.checkout_post_order_note}
                 </p>
              </div>
            </form>
          </Form>
        </div>

        {/* Sidebar Summary Area */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24">
            <Reveal delay={0.5}>
              <Card className="rounded-[2.5rem] bg-card/50 border-white/5 backdrop-blur-3xl shadow-2xl shadow-black overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <CardHeader className="p-8 pb-4 relative">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-black uppercase italic">{dictionary.checkout_order_summary}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 pt-4 space-y-8 relative">
                  {/* Items List */}
                  <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/5">
                    {cartItems.map(item => {
                      const price = item.product.salePrice ?? item.product.price;
                      return (
                        <div key={item.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <div className="relative h-20 w-20 shrink-0">
                              <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-white/5 bg-muted shadow-lg group-hover:scale-105 transition-transform duration-500">
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name[lang as 'en' | 'ar'] ?? item.product.name.en}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                  unoptimized
                                />
                              </div>
                              <span className="absolute -top-2 -right-2 rtl:right-auto rtl:-left-2 z-10 flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-xl">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-base group-hover:text-primary transition-colors">
                                {item.product.name[lang as 'en' | 'ar'] ?? item.product.name.en}
                              </p>
                              <div className="flex items-baseline gap-2">
                                <p className="text-sm font-bold text-muted-foreground">
                                  {formatPrice(price, lang)} {currency}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="font-black text-lg">
                            {formatPrice(price * item.quantity, lang)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Calculations */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest">{dictionary.cart_subtotal}</span>
                      <span className="text-lg">{formatPrice(cartTotal, lang)} {currency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        {dictionary.cart_shipping}
                        {selectedDeliveryType && (
                          <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                            {selectedDeliveryType === 'home' ? (dictionary.checkout_delivery_home || 'Home') : (dictionary.checkout_delivery_office || 'Office')}
                          </span>
                        )}
                      </span>
                      <span className={shippingFee > 0 ? "text-lg text-primary" : "text-xs text-muted-foreground italic font-medium"}>
                        {shippingFee > 0 ? `+ ${formatPrice(shippingFee, lang)} ${currency}` : dictionary.checkout_shipping_taxes_later}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total Card */}
                  <div className="p-8 rounded-[2rem] bg-primary/10 border-2 border-primary/20 space-y-2 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                     <div className="flex justify-between items-end relative z-10">
                        <div>
                          <span className="text-sm font-black text-primary uppercase tracking-widest block">{dictionary.cart_total}</span>
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                             {dictionary.checkout_cod_short}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-black text-primary leading-none">
                            {formatPrice(cartTotal + shippingFee, lang)}
                          </span>
                          <span className="text-xs font-black text-primary ml-2 uppercase tracking-tighter">{currency}</span>
                        </div>
                     </div>
                  </div>

                  {/* Action Button for Desktop */}
                  <div className="hidden lg:block pt-4">
                    <Button type="submit" size="lg" className="h-16 w-full rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 gap-3 group/btn overflow-hidden relative" disabled={isPending} onClick={() => form.handleSubmit(onSubmit, onInvalid)()}>
                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                       {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-current group-hover/btn:scale-125 transition-transform" />}
                       {dictionary.checkout_confirm_order}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-black opacity-60">
                       {dictionary.checkout_post_order_note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Secure Badges */}
            <Reveal delay={0.6}>
               <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
                  <div className="flex flex-col items-center gap-2">
                     <ShieldCheck className="h-6 w-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <PackageCheck className="h-6 w-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                  </div>
               </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
