import { getPartners } from '@/actions/partners';
import { PartnersManager } from '@/components/dashboard/partners-manager';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function PartnersDashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
  const partners = await getPartners();
  const dictionary = await getDictionary(lang);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">{lang === 'ar' ? 'شركاء النجاح' : 'Our Partners'}</h1>
        <p className="text-muted-foreground mt-1">
          {lang === 'ar' ? 'إدارة الشعارات والشركات التي تظهر في الصفحة الرئيسية' : 'Manage the logos and companies displayed on the home page'}
        </p>
      </div>

      <PartnersManager initialPartners={partners} lang={lang} />
    </div>
  );
}
