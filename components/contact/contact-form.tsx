'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder={dictionary.contact_form_name_placeholder} {...field} />
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
                            <Input type="email" placeholder={dictionary.contact_form_email_placeholder} {...field} />
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
                            <Input placeholder={dictionary.checkout_phone_placeholder || "Phone number"} {...field} />
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
                        <Textarea
                            placeholder={dictionary.contact_form_message_placeholder}
                            className="min-h-28"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center pt-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {dictionary.contact_form_send_button}
                    </Button>
                    <p className="text-xs text-white/60 leading-relaxed">{dictionary.contact_form_response_time}</p>
                </div>
            </form>
        </Form>
    )
}
