import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { UrgencyBanner } from '@/components/layout/urgency-banner';
import { getActivePromotion } from '@/actions/promotions';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const dictionary = await getDictionary(params.lang as Locale);
  const activePromotion = await getActivePromotion();
  
  return (
    <div className="relative flex min-h-dvh flex-col bg-transparent">
      {activePromotion && (
        <UrgencyBanner promotion={activePromotion} lang={params.lang} />
      )}
      <Header lang={params.lang as Locale} dictionary={dictionary} />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <Footer dictionary={dictionary} lang={params.lang} />
      <MobileBottomNav lang={params.lang as Locale} dictionary={dictionary} />
    </div>
  );
}
