import { getSiteContent } from '@/actions/content';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { Locale } from '@/lib/i18n-config';
import { FileText, Settings2 } from 'lucide-react';

export default async function DashboardContent({ params: { lang } }: { params: { lang: Locale } }) {
  const dynamicContent = await getSiteContent();
  
  // Dynamically load all keys from the static dictionaries
  const arDict = await import('@/dictionaries/ar').then(m => m.default);
  const enDict = await import('@/dictionaries/en').then(m => m.default);
  
  const allKeys = Object.keys(arDict);

  // Prepare initial content by merging static dictionary with dynamic overrides
  const staticKeys = new Set(allKeys);
  const initialContent = [
    ...allKeys.map((key) => {
      const existing = dynamicContent.find(c => c.key === key);
      if (existing) return existing;
      
      return {
        key,
        value: {
          ar: arDict[key as keyof typeof arDict] || '',
          en: enDict[key as keyof typeof enDict] || ''
        }
      };
    }),
    // Add dynamic keys that are NOT in the static dictionary (like our new image keys)
    ...dynamicContent.filter(c => !staticKeys.has(c.key))
  ];

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-muted/50 border-2 border-primary/10 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <Settings2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isAr ? 'إدارة محتوى الموقع الشاملة' : 'Global Site Content Manager'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              {isAr
                ? 'تحكم في كافة نصوص الموقع (أكثر من 200 نص) من مكان واحد'
                : 'Control all website texts (200+ keys) from a single place'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <ContentEditor initialContent={initialContent as any} lang={lang} />
      </div>
    </div>
  );
}
