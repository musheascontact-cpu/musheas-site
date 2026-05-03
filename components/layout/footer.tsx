import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Link as LinkIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsletterForm } from './newsletter-form';
import { getSiteContent } from '@/actions/content';
import { SocialLink } from '@/components/dashboard/social-manager';
import { SocialIcon } from './social-icon';

export async function Footer({ dictionary, lang }: { dictionary: any, lang: string }) {
  const currentYear = new Date().getFullYear();
  const isAr = lang === 'ar';

  const dynamicContent = await getSiteContent();
  const socialLinksContent = dynamicContent.find((c: any) => c.key === 'social_media_links');
  
  // Dynamic Content with fallbacks to dictionary or defaults
  const getContent = (key: string, defaultValue: any) => {
    const item = dynamicContent.find((c: any) => c.key === key);
    if (!item) return defaultValue;
    if (typeof item.value === 'object' && item.value !== null && !Array.isArray(item.value)) {
      const val = item.value as Record<string, any>;
      return val[lang] || val['en'] || defaultValue;
    }
    return (item.value as string) || defaultValue;
  };

  const tagline = getContent('footer_tagline', dictionary?.footer_tagline || 'Mycology meets biotechnology.');
  const email = getContent('footer_email', 'contact@musheas.com');
  const phone = getContent('footer_phone', '+213 (0) 555 00 00 00');
  const address = getContent('footer_address', isAr ? 'الجزائر العاصمة' : 'Algiers, Algeria');
  const copyright = getContent('footer_copyright', dictionary?.footer_copy || '© {year} MUSHEAS. All rights reserved.');

  let socialLinks: SocialLink[] = [];
  if (socialLinksContent && Array.isArray(socialLinksContent.value)) {
    socialLinks = (socialLinksContent.value as any[]).filter((link: any) => link.isActive);
  } else {
    // Fallback to dictionary if not configured yet
    socialLinks = [
      { id: '1', platform: 'facebook', url: dictionary?.facebook_url || '#', isActive: true },
      { id: '2', platform: 'instagram', url: dictionary?.instagram_url || '#', isActive: true },
      { id: '3', platform: 'youtube', url: dictionary?.youtube_url || '#', isActive: true },
      { id: '4', platform: 'linkedin', url: dictionary?.linkedin_url || '#', isActive: true },
    ];
  }

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#020817] text-white/70">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary tracking-tight">MUSHEAS</h2>
            <p className="text-sm opacity-50 max-w-xs leading-relaxed">
              {tagline}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                return (
                  <Link 
                    key={social.id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3 text-sm">
               <li><Link href={`/${lang}/products`} className="hover:text-primary transition-colors">{dictionary?.nav_shop}</Link></li>
               <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dictionary?.nav_about}</Link></li>
               <li><Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">{dictionary?.nav_contact}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              {isAr ? 'اتصل بنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4 text-sm">
               <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> {email}</li>
               <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> <span dir="ltr">{phone}</span></li>
               <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> {address}</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              {isAr ? 'النشرة البريدية' : 'Newsletter'}
            </h4>
            <NewsletterForm lang={lang} />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest opacity-30">
          {copyright?.replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
