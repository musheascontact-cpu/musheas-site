import { getSiteContent } from '@/actions/content';
import { SocialManager, SocialLink } from '@/components/dashboard/social-manager';
import { Locale } from '@/lib/i18n-config';
import { Share2 } from 'lucide-react';

export default async function SocialDashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dynamicContent = await getSiteContent();
  const socialLinksContent = dynamicContent.find(c => c.key === 'social_media_links');
  
  // Default values if nothing in db
  const defaultLinks: SocialLink[] = [
    { id: '1', platform: 'facebook', url: 'https://facebook.com', isActive: true },
    { id: '2', platform: 'instagram', url: 'https://instagram.com', isActive: true },
    { id: '3', platform: 'youtube', url: 'https://youtube.com', isActive: true },
    { id: '4', platform: 'linkedin', url: 'https://linkedin.com', isActive: true },
  ];

  let initialLinks: SocialLink[] = defaultLinks;
  if (socialLinksContent && Array.isArray(socialLinksContent.value)) {
    initialLinks = socialLinksContent.value as any;
  }

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-muted/50 border-2 border-primary/10 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <Share2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isAr ? 'منصات التواصل الاجتماعي' : 'Social Media Platforms'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              {isAr
                ? 'إدارة روابط حسابات التواصل الاجتماعي وإظهارها أو إخفائها'
                : 'Manage social media links, hide or show them on the site'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <SocialManager initialLinks={initialLinks} lang={lang} />
      </div>
    </div>
  );
}
