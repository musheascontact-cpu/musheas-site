'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/actions/newsletter';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterForm({ lang }: { lang: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    if (!email) return;

    setIsLoading(true);
    const result = await subscribeToNewsletter(formData);
    setIsLoading(false);

    if (result.success) {
      setIsSubscribed(true);
      toast({
        title: isAr ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!',
        description: isAr ? 'شكراً لاشتراكك في نشرتنا البريدية.' : 'Thank you for joining our newsletter.',
      });
    } else {
      toast({
        title: isAr ? 'خطأ' : 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <AnimatePresence mode="wait">
        {isSubscribed ? (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary"
          >
            <div className="bg-primary text-white p-1 rounded-full">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-widest">
                {isAr ? 'تم بنجاح!' : 'Confirmed!'}
              </span>
              <span className="text-[10px] opacity-70">
                {isAr ? 'أنت الآن في القائمة البريدية' : 'You are on the list'}
              </span>
            </div>
            <Sparkles className="h-4 w-4 ml-auto animate-pulse" />
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="flex gap-2"
          >
            <div className="relative flex-1 group">
              <Input 
                name="email"
                type="email"
                placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email address'} 
                className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:bg-white/10 transition-all focus:ring-primary/20" 
                required
                disabled={isLoading}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all pointer-events-none" />
            </div>
            <Button 
              type="submit"
              size="icon" 
              className="h-12 w-12 rounded-2xl shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
