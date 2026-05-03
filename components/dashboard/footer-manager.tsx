'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateSiteContent } from '@/actions/content';
import { Loader2, Save, Mail, Phone, MapPin, Type, Globe, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterData {
  tagline: { en: string; ar: string };
  email: string;
  phone: string;
  address: { en: string; ar: string };
  copyright: { en: string; ar: string };
}

export function FooterManager({ initialData, lang }: { initialData: any, lang: string }) {
  const [data, setData] = useState<FooterData>({
    tagline: initialData?.footer_tagline || { en: 'Mycology meets biotechnology.', ar: 'عندما يلتقي علم الفطريات بالتكنولوجيا الحيوية.' },
    email: initialData?.footer_email || 'contact@musheas.com',
    phone: initialData?.footer_phone || '+213 (0) 555 00 00 00',
    address: initialData?.footer_address || { en: 'Algiers, Algeria', ar: 'الجزائر العاصمة، الجزائر' },
    copyright: initialData?.footer_copyright || { en: '© {year} MUSHEAS. All rights reserved.', ar: '© {year} MUSHEAS. جميع الحقوق محفوظة.' },
  });

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const handleChange = (field: keyof FooterData, subfield: string | null, value: string) => {
    setData(prev => {
      if (subfield) {
        return {
          ...prev,
          [field]: { ...(prev[field] as any), [subfield]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save each field as a separate key in siteContent for easier access elsewhere
      const promises = [
        updateSiteContent('footer_tagline', data.tagline),
        updateSiteContent('footer_email', data.email),
        updateSiteContent('footer_phone', data.phone),
        updateSiteContent('footer_address', data.address),
        updateSiteContent('footer_copyright', data.copyright),
      ];

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        toast({
          title: isAr ? 'تم الحفظ بنجاح' : 'Saved Successfully',
          description: isAr ? 'تم تحديث معلومات تذييل الموقع.' : 'Footer information has been updated.',
        });
      } else {
        throw new Error('Some updates failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card className="p-8 rounded-[2.5rem] border-2 shadow-xl bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                {isAr ? 'معلومات التواصل' : 'Contact Info'}
              </h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                {isAr ? 'البريد، الهاتف والعنوان' : 'Email, Phone & Address'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                <Mail className="h-3 w-3" /> {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </Label>
              <Input 
                value={data.email}
                onChange={(e) => handleChange('email', null, e.target.value)}
                className="h-12 rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                <Phone className="h-3 w-3" /> {isAr ? 'رقم الهاتف' : 'Phone Number'}
              </Label>
              <Input 
                value={data.phone}
                onChange={(e) => handleChange('phone', null, e.target.value)}
                className="h-12 rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> {isAr ? 'العنوان (بالعربية)' : 'Address (Arabic)'}
                </Label>
                <Input 
                  value={data.address.ar}
                  onChange={(e) => handleChange('address', 'ar', e.target.value)}
                  className="h-12 rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold text-right"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> {isAr ? 'العنوان (بالإنجيزية)' : 'Address (English)'}
                </Label>
                <Input 
                  value={data.address.en}
                  onChange={(e) => handleChange('address', 'en', e.target.value)}
                  className="h-12 rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Branding & Content */}
        <Card className="p-8 rounded-[2.5rem] border-2 shadow-xl bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Layout className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                {isAr ? 'محتوى التذييل' : 'Footer Content'}
              </h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                {isAr ? 'الشعار وحقوق النشر' : 'Tagline & Copyright'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                <Type className="h-3 w-3" /> {isAr ? 'شعار الموقع (بالعربية)' : 'Tagline (Arabic)'}
              </Label>
              <Textarea 
                value={data.tagline.ar}
                onChange={(e) => handleChange('tagline', 'ar', e.target.value)}
                className="min-h-[80px] rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                <Type className="h-3 w-3" /> {isAr ? 'شعار الموقع (بالإنجيزية)' : 'Tagline (English)'}
              </Label>
              <Textarea 
                value={data.tagline.en}
                onChange={(e) => handleChange('tagline', 'en', e.target.value)}
                className="min-h-[80px] rounded-2xl border-2 bg-background/50 focus-visible:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                <Globe className="h-3 w-3" /> {isAr ? 'حقوق النشر' : 'Copyright Text'}
              </Label>
              <div className="grid grid-cols-1 gap-2">
                <Input 
                  value={data.copyright.ar}
                  onChange={(e) => handleChange('copyright', 'ar', e.target.value)}
                  placeholder="Arabic"
                  className="h-10 rounded-xl border-2 bg-background/50 text-right"
                  dir="rtl"
                />
                <Input 
                  value={data.copyright.en}
                  onChange={(e) => handleChange('copyright', 'en', e.target.value)}
                  placeholder="English"
                  className="h-10 rounded-xl border-2 bg-background/50"
                />
              </div>
              <p className="text-[9px] text-muted-foreground px-2">
                * {isAr ? 'استخدم {year} لوضع السنة الحالية تلقائياً.' : 'Use {year} to insert the current year automatically.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          onClick={handleSave}
          disabled={isSaving}
          className="h-16 px-12 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
        >
          {isSaving ? (
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
          ) : (
            <Save className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
          )}
          {isAr ? 'حفظ التغييرات' : 'Save Footer Changes'}
        </Button>
      </div>
    </div>
  );
}
