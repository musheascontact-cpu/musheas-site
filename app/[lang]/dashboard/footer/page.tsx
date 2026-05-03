import { getSiteContent } from '@/actions/content';
import { FooterManager } from '@/components/dashboard/footer-manager';
import { Locale } from '@/lib/i18n-config';
import { Layout } from 'lucide-react';

export default async function FooterDashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dynamicContent = await getSiteContent();
  
  // Convert flat array to a key-value object for the manager
  const initialData: any = {};
  dynamicContent.forEach((item: any) => {
    initialData[item.key] = item.value;
  });

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-muted/50 border-2 border-primary/10 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <Layout className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isAr ? 'إدارة تذييل الموقع' : 'Footer Management'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              {isAr
                ? 'تعديل معلومات التواصل وشعار الموقع في الأسفل'
                : 'Edit contact information and footer branding'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <FooterManager initialData={initialData} lang={lang} />
      </div>
    </div>
  );
}
