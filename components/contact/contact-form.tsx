'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { submitInquiry } from '@/actions/inquiries';

export function ContactForm({ dictionary }: { dictionary: any }) {
    const { toast } = useToast();
    const [isPending, setIsPending] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, { message: dictionary.validation_required }),
        email: z.string().email({ message: dictionary.validation_invalid_email }),
        phone: z.string().optional(),
        message: z.string().min(10, { message: dictionary.validation_min_chars.replace('{count}', '10') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsPending(true);
        const result = await submitInquiry(values);
        setIsPending(false);

        if (result.success) {
            toast({
              title: dictionary.contact_form_success_title,
              description: dictionary.contact_form_success_description,
            });
            form.reset();
        } else {
            toast({
              title: "Error",
              description: "Failed to send message. Please try again.",
              variant: "destructive"
            });
        }
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="relative group">
                                <Input 
                                    placeholder={dictionary.contact_form_name_placeholder} 
                                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:bg-primary/5 transition-all"
                                    {...field} 
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="relative group">
                                <Input 
                                    type="email" 
                                    placeholder={dictionary.contact_form_email_placeholder} 
                                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:bg-primary/5 transition-all"
                                    {...field} 
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="relative group">
                                <Input 
                                    placeholder={dictionary.checkout_phone_placeholder || "Phone number"} 
                                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:bg-primary/5 transition-all"
                                    {...field} 
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="relative group">
                                <Textarea
                                    placeholder={dictionary.contact_form_message_placeholder}
                                    className="min-h-32 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:bg-primary/5 transition-all resize-none"
                                    {...field}
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex flex-col sm:flex-row gap-6 items-center pt-2">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        {dictionary.contact_form_send_button}
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">{dictionary.contact_form_response_time}</p>
                    </div>
                </div>
            </form>
        </Form>
    )
}
