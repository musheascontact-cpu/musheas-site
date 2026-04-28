import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { i18n, Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { AnimatedBackground } from '@/components/layout/animated-background';
import AuthProvider from '@/context/auth-provider';
import { CartProvider } from '@/context/cart-context';
import { ErrorBoundary } from '@/components/error-boundary';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fontLiterata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  weight: '700',
  display: 'swap',
});

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const dictionary = await getDictionary(params.lang as Locale);
  
  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-body antialiased overflow-x-hidden',
          fontInter.variable,
          fontLiterata.variable
        )}
      >
        <AuthProvider>
          <CartProvider lang={params.lang as Locale} dictionary={dictionary}>
            <AnimatedBackground />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
