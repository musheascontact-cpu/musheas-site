'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { submitInquiry } from '@/actions/inquiries';

const inquiryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please provide some details about your inquiry'),
  product_id: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

interface ProductInquiryDialogProps {
  product: {
    id: string;
    name: { [key: string]: string };
    slug: string;
  };
  lang: string;
  dictionary: any;
}

export function ProductInquiryDialog({ product, lang, dictionary }: ProductInquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `I would like to request more information about ${product.name[lang] || product.name['en']}.`,
      product_id: product.id,
    },
  });

  async function onSubmit(data: InquiryFormValues) {
    try {
      setIsSubmitting(true);
      const result = await submitInquiry({
        ...data,
        subject: `B2B Inquiry for ${product.name[lang] || product.name['en']}`,
      });

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setIsSuccess(false);
          form.reset();
        }, 3000);
      } else {
        toast({
          variant: 'destructive',
          title: isAr ? 'خطأ' : 'Error',
          description: result.error,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ غير متوقع' : 'Unexpected Error',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-14 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20 relative z-10 transition-all hover:scale-[1.02] active:scale-95">
          {dictionary.b2b_inquire_button}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl">
        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/20">
                <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground">
                {isAr ? 'تم الإرسال بنجاح' : 'Inquiry Sent!'}
              </h2>
              <p className="text-muted-foreground font-medium">
                {isAr ? 'سنقوم بالتواصل معك عبر البريد الإلكتروني أو الهاتف قريباً.' : 'Our team will get back to you via email or phone shortly.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-b border-white/5">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="text-left rtl:text-right">
                    <DialogTitle className="text-2xl font-black uppercase">
                      {isAr ? 'طلب معلومات تجارية' : 'B2B Inquiry'}
                    </DialogTitle>
                    <DialogDescription className="font-bold text-muted-foreground">
                      {product.name[lang] || product.name['en']}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                          <User className="h-3 w-3" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 rounded-xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3" /> {isAr ? 'البريد الإلكتروني' : 'Email'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="h-12 rounded-xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <Phone className="h-3 w-3" /> {isAr ? 'رقم الهاتف' : 'Phone'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl border-2 border-white/5 bg-background/50 focus-visible:ring-primary/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                          <Send className="h-3 w-3" /> {isAr ? 'رسالتك' : 'Your Message'}
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-[100px] rounded-xl border-2 border-white/5 bg-background/50 resize-none focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl text-lg font-black gap-2 shadow-xl shadow-primary/20">
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {isAr ? 'إرسال الطلب الآن' : 'Send Inquiry Now'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
