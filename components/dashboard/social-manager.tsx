'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSiteContent } from '@/actions/content';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Link as LinkIcon,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialIcon } from '@/components/layout/social-icon';

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
};

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'twitter', name: 'X / Twitter' },
  { id: 'whatsapp', name: 'WhatsApp' },
];

export function SocialManager({ initialLinks, lang }: { initialLinks: SocialLink[], lang: string }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const handleAdd = () => {
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: 'facebook',
      url: '',
      isActive: true
    };
    setLinks([...links, newLink]);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateSiteContent('social_media_links', links);
    setLoading(false);

    if (result.success) {
      toast({ title: isAr ? 'تم الحفظ بنجاح' : 'Saved successfully' });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this link?')) return;
    setLinks(links.filter(l => l.id !== id));
  };

  const handleChange = (id: string, field: keyof SocialLink, value: any) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <div className="space-y-6">
      <div className={cn("flex justify-between items-center", isAr && "flex-row-reverse")}>
        <h2 className="text-xl font-bold">{isAr ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd} variant="outline" className="rounded-full px-6">
            <Plus className={cn("h-4 w-4 mr-2", isAr && "ml-2 mr-0")} />
            {isAr ? 'إضافة رابط' : 'Add Link'}
          </Button>
          <Button onClick={handleSave} disabled={loading} className="rounded-full px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => {

          return (
            <div key={link.id} className={cn("group bg-card rounded-[2rem] border-2 transition-all p-6 shadow-xl shadow-black/10 flex flex-col gap-4", !link.isActive ? "opacity-60 border-transparent" : "border-primary/20 hover:border-primary/40")}>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <SocialIcon platform={link.platform} className="h-6 w-6" />
                  </div>
                  <Switch 
                    checked={link.isActive}
                    onCheckedChange={(c) => handleChange(link.id, 'isActive', c)}
                  />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(link.id)}
                  className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-50 px-1">{isAr ? 'المنصة' : 'Platform'}</Label>
                  <Select value={link.platform} onValueChange={(val) => handleChange(link.id, 'platform', val)}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <SocialIcon platform={p.id} className="h-4 w-4" />
                            {p.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-50 px-1">{isAr ? 'الرابط' : 'URL'}</Label>
                  <div className="relative">
                    <LinkIcon className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", isAr ? "right-3" : "left-3")} />
                    <Input 
                      value={link.url} 
                      onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                      className={cn("h-11 rounded-xl bg-muted/30 border-none", isAr ? "pr-10 text-right font-mono text-[10px]" : "pl-10 font-mono text-[10px]")}
                      placeholder="https://..."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
        {links.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-[2rem] border border-dashed border-border">
             {isAr ? 'لا توجد روابط مضافة' : 'No social links added yet'}
          </div>
        )}
      </div>
    </div>
  );
}
