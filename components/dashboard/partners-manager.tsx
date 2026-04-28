'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { upsertPartner, deletePartner } from '@/actions/partners';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Loader2, Link as LinkIcon, Building2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { cn } from '@/lib/utils';

export function PartnersManager({ initialPartners, lang }: { initialPartners: any[], lang: string }) {
  const [partners, setPartners] = useState(initialPartners);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const handleAdd = () => {
    const newPartner = {
      id: `new-${Date.now()}`,
      name: isAr ? 'شريك جديد' : 'New Partner',
      logo_url: '',
      website_url: '',
      display_order: partners.length + 1,
      is_new: true
    };
    setPartners([...partners, newPartner]);
  };

  const handleSave = async (partner: any) => {
    setLoadingId(partner.id);
    const partnerToSave = { ...partner };
    if (partner.is_new) delete partnerToSave.id;
    delete partnerToSave.is_new;

    const result = await upsertPartner(partnerToSave);
    setLoadingId(null);

    if (result.success) {
      toast({ title: isAr ? 'تم الحفظ' : 'Saved' });
      window.location.reload(); // Refresh to get fresh IDs
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, isNew: boolean) => {
    if (isNew) {
      setPartners(partners.filter(p => p.id !== id));
      return;
    }

    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this partner?')) return;

    setLoadingId(id);
    const result = await deletePartner(id);
    setLoadingId(null);

    if (result.success) {
      setPartners(partners.filter(p => p.id !== id));
      toast({ title: isAr ? 'تم الحذف' : 'Deleted' });
    }
  };

  const handleChange = (id: string, field: string, value: any) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="space-y-6">
      <div className={cn("flex justify-between items-center", isAr && "flex-row-reverse")}>
        <h2 className="text-xl font-bold">{isAr ? 'قائمة الشركاء' : 'Partner List'}</h2>
        <Button onClick={handleAdd} className="rounded-full px-6">
          <Plus className={cn("h-4 w-4 mr-2", isAr && "ml-2 mr-0")} />
          {isAr ? 'إضافة شريك' : 'Add Partner'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="group bg-card rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all p-6 shadow-xl shadow-black/10 flex flex-col gap-4">
            <div className="space-y-1">
               <Label className="text-[10px] uppercase font-black tracking-widest opacity-50 px-1">{isAr ? 'شعار الشركة' : 'Company Logo'}</Label>
               <ImageUpload 
                 value={partner.logo_url} 
                 onChange={(url) => handleChange(partner.id, 'logo_url', url)} 
                 disabled={loadingId === partner.id}
               />
            </div>

            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-50 px-1">{isAr ? 'اسم الشركة' : 'Company Name'}</Label>
                <div className="relative">
                  <Building2 className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", isAr ? "right-3" : "left-3")} />
                  <Input 
                    value={partner.name} 
                    onChange={(e) => handleChange(partner.id, 'name', e.target.value)}
                    className={cn("h-11 rounded-xl bg-muted/30 border-none", isAr ? "pr-10 text-right" : "pl-10")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-50 px-1">{isAr ? 'الموقع الإلكتروني' : 'Website URL'}</Label>
                <div className="relative">
                  <LinkIcon className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", isAr ? "right-3" : "left-3")} />
                  <Input 
                    value={partner.website_url || ''} 
                    onChange={(e) => handleChange(partner.id, 'website_url', e.target.value)}
                    className={cn("h-11 rounded-xl bg-muted/30 border-none", isAr ? "pr-10 text-right font-mono text-[10px]" : "pl-10 font-mono text-[10px]")}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 mt-auto">
                <Button 
                  onClick={() => handleSave(partner)} 
                  disabled={loadingId === partner.id}
                  className="flex-1 rounded-xl h-11 font-black uppercase tracking-widest"
                >
                  {loadingId === partner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {isAr ? 'حفظ' : 'Save'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(partner.id, partner.is_new)}
                  disabled={loadingId === partner.id}
                  className="rounded-xl h-11 w-11 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
