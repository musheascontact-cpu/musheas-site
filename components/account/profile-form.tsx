'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ProfileForm({ dictionary }: { dictionary: any }) {
  const { toast } = useToast();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: dictionary.validation_required }),
    lastName: z.string().min(1, { message: dictionary.validation_required }),
    email: z.string().email({ message: dictionary.validation_invalid_email }),
    address: z.string().min(1, { message: dictionary.validation_required }),
    city: z.string().min(1, { message: dictionary.validation_required }),
    postalCode: z.string().min(1, { message: dictionary.validation_required }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      address: "123 Mycelium Lane",
      city: "Fungitown",
      postalCode: "12345",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Profile updated:", values);
    toast({
      title: dictionary.account_profile_success_title,
      description: dictionary.account_profile_success_description,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{dictionary.account_profile_first_name}</FormLabel>
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
                <FormLabel>{dictionary.account_profile_last_name}</FormLabel>
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
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{dictionary.account_profile_email}</FormLabel>
                <FormControl>
                    <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Separator />
        <h3 className="text-lg font-semibold pt-2">{dictionary.account_profile_shipping}</h3>
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{dictionary.account_profile_address}</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>{dictionary.account_profile_city}</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{dictionary.account_profile_postal}</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />
        </div>
        <Button type="submit">{dictionary.account_profile_save}</Button>
      </form>
    </Form>
  );
}
