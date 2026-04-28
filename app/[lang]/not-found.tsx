'use client';

import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart-context';

export default function NotFound() {
  const { dictionary, lang, isCartLoaded } = useCart();

  // We need to wait for the cart context (which provides the dictionary) to be loaded.
  // isCartLoaded can serve as a proxy for the context being ready.
  if (!isCartLoaded || !dictionary) {
    return (
      <main className="container flex min-h-[70vh] items-center justify-center py-12 md:py-20 text-center">
        <div className="w-full max-w-md">
          <Frown className="mx-auto h-24 w-24 text-muted-foreground/30" suppressHydrationWarning />
          <Skeleton className="h-12 w-3/4 mx-auto mt-6" />
          <Skeleton className="h-6 w-full mx-auto mt-4" />
          <Skeleton className="h-11 w-40 mx-auto mt-8" />
        </div>
      </main>
    );
  }

  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12 md:py-20 text-center">
      <div className="w-full max-w-md">
        <Frown className="mx-auto h-24 w-24 text-muted-foreground/30" suppressHydrationWarning />
        <h1 className="mt-6 font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          404 - {dictionary.not_found_title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {dictionary.not_found_description}
        </p>
        <Button asChild className="mt-8">
          <Link href={`/${lang}`}>{dictionary.not_found_go_home}</Link>
        </Button>
      </div>
    </main>
  );
}
