'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateSiteContent } from '@/actions/content';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Globe, Search, LayoutGrid, Type, Navigation, Info, ShoppingCart, Mail, Settings, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/components/ui/image-upload';

interface ContentItem {
  key: string;
  value: {
    en: string;
    ar: string;
    fr?: string;
  };
}

const CATEGORIES = [
  { id: 'all', label_en: 'All Content', label_ar: 'كل المحتوى', icon: LayoutGrid },
  { id: 'nav', prefix: 'nav_', label_en: 'Menus & Navigation', label_ar: 'القوائم والملاحة', icon: Navigation },
  { id: 'home', prefix: 'hero_', label_en: 'Home Page', label_ar: 'الصفحة الرئيسية', icon: LayoutGrid },
  { id: 'shop', prefix: 'product_', label_en: 'Products & Shop', label_ar: 'المنتجات والمتجر', icon: ShoppingCart },
  { id: 'checkout', prefix: 'checkout_', label_en: 'Checkout Process', label_ar: 'عملية الدفع', icon: ShoppingCart },
  { id: 'contact', prefix: 'contact_', label_en: 'Contact & B2B', label_ar: 'التواصل و B2B', icon: Mail },
  { id: 'about', prefix: 'about_', label_en: 'About Us', label_ar: 'من نحن', icon: Info },
  { id: 'footer', prefix: 'footer_', label_en: 'Footer', label_ar: 'تذييل الموقع', icon: LayoutGrid },
  { id: 'account', prefix: 'account_', label_en: 'Account & Login', label_ar: 'الحساب والدخول', icon: Settings },
  { id: 'system', prefix: 'validation_', label_en: 'System & Errors', label_ar: 'النظام والأخطاء', icon: Settings },
  { id: 'url', prefix: '_url', label_en: 'Links & Social', label_ar: 'الروابط والتواصل', icon: Globe },
];

export function ContentEditor({ initialContent, lang }: { initialContent: ContentItem[], lang: string }) {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const filteredContent = useMemo(() => {
    return content.filter(item => {
      // Category filter
      const category = CATEGORIES.find(c => c.id === selectedCategory);
      const matchesCategory = selectedCategory === 'all' || 
                             (category?.prefix && (item.key.startsWith(category.prefix) || item.key.endsWith(category.prefix)));

      // Search filter (across key and both language values)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
                           (item.key && item.key.toLowerCase().includes(q)) ||
                           (item.value?.ar && String(item.value.ar).toLowerCase().includes(q)) ||
                           (item.value?.en && String(item.value.en).toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [content, searchQuery, selectedCategory]);

  const handleChange = (key: string, locale: 'en' | 'ar', newValue: string) => {
    setContent(prev => prev.map(item => 
      item.key === key 
        ? { ...item, value: { ...item.value, [locale]: newValue } }
        : item
    ));
  };

  const handleSave = async (item: ContentItem) => {
    setSavingKey(item.key);
    const result = await updateSiteContent(item.key, item.value);
    setSavingKey(null);

    if (result.success) {
      toast({
        title: isAr ? 'تم الحفظ' : 'Saved',
        description: isAr ? `تم تحديث ${item.key} بنجاح.` : `${item.key} updated successfully.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Categories */}
      <aside className="lg:w-64 space-y-2 shrink-0">
        <h3 className={cn("text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-4", isAr && "text-right")}>
          {isAr ? 'التصنيفات' : 'Categories'}
        </h3>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                selectedCategory === cat.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                isAr && "flex-row-reverse text-right"
              )}
            >
              <cat.icon className="h-4 w-4" />
              {isAr ? cat.label_ar : cat.label_en}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Search Header */}
        <div className="sticky top-4 z-20 bg-background/80 backdrop-blur-xl p-2 rounded-[2rem] border-2 shadow-2xl shadow-black/20">
          <div className="relative">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground", isAr ? "right-5" : "left-5")} />
            <Input 
              placeholder={isAr ? 'ابحث عن أي نص (مثلاً: الصفحة الرئيسية، الهاتف...)' : 'Search for any text...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-bold placeholder:text-muted-foreground/50",
                isAr ? "pr-14 pl-6 text-right" : "pl-14 pr-6"
              )}
            />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <div 
                key={item.key} 
                className="group bg-card rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-xl shadow-black/10 overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", isAr && "sm:flex-row-reverse")}>
                    <div className={cn("flex items-center gap-4", isAr && "flex-row-reverse")}>
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        {item.key.includes('_image') ? <ImageIcon className="h-5 w-5" /> : <Type className="h-5 w-5" />}
                      </div>
                      <div className={isAr ? "text-right" : "text-left"}>
                        <h3 className="text-lg font-black tracking-tight font-headline">{item.key}</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          {isAr ? 'المعرف الفريد' : 'UNIQUE KEY'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSave(item)} 
                      disabled={savingKey === item.key}
                      className="rounded-2xl px-6 h-11 font-black uppercase tracking-widest shadow-xl shadow-primary/10 transition-transform active:scale-95"
                    >
                      {savingKey === item.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isAr ? 'حفظ' : 'Save'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Arabic Section */}
                    <div className="space-y-3" dir="rtl">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-2">
                        <Globe className="h-3 w-3" />
                        اللغة العربية
                      </Label>
                      {item.key.includes('_image') ? (
                        <div className="bg-muted/20 p-4 rounded-2xl border-2 border-dashed border-muted hover:border-primary/20 transition-all">
                          <ImageUpload 
                            value={item.value.ar || ''} 
                            onChange={(url) => handleChange(item.key, 'ar', url)}
                            disabled={savingKey === item.key}
                          />
                        </div>
                      ) : (item.value.ar || '').length > 100 ? (
                        <Textarea 
                          value={item.value.ar || ''}
                          onChange={(e) => handleChange(item.key, 'ar', e.target.value)}
                          className="min-h-[120px] rounded-2xl border-2 border-muted hover:border-primary/20 focus-visible:ring-primary font-bold text-right leading-relaxed bg-muted/20"
                        />
                      ) : (
                        <Input 
                          value={item.value.ar || ''}
                          onChange={(e) => handleChange(item.key, 'ar', e.target.value)}
                          className="h-12 rounded-2xl border-2 border-muted hover:border-primary/20 focus-visible:ring-primary font-bold text-right bg-muted/20"
                        />
                      )}
                    </div>

                    {/* English Section */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-2">
                        <Globe className="h-3 w-3" />
                        English Language
                      </Label>
                      {item.key.includes('_image') ? (
                        <div className="bg-muted/20 p-4 rounded-2xl border-2 border-dashed border-muted hover:border-primary/20 transition-all">
                          <ImageUpload 
                            value={item.value.en || ''} 
                            onChange={(url) => handleChange(item.key, 'en', url)}
                            disabled={savingKey === item.key}
                          />
                        </div>
                      ) : (item.value.en || '').length > 100 ? (
                        <Textarea 
                          value={item.value.en || ''}
                          onChange={(e) => handleChange(item.key, 'en', e.target.value)}
                          className="min-h-[120px] rounded-2xl border-2 border-muted hover:border-primary/20 focus-visible:ring-primary font-bold leading-relaxed bg-muted/20"
                        />
                      ) : (
                        <Input 
                          value={item.value.en || ''}
                          onChange={(e) => handleChange(item.key, 'en', e.target.value)}
                          className="h-12 rounded-2xl border-2 border-muted hover:border-primary/20 focus-visible:ring-primary font-bold bg-muted/20"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-card/50 rounded-[3rem] border-4 border-dashed border-muted">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/20 mb-6" />
              <h4 className="text-2xl font-black text-muted-foreground">
                {isAr ? 'لا توجد نتائج مطابقة' : 'No matches found'}
              </h4>
              <p className="text-muted-foreground/60 mt-2">
                {isAr ? 'حاول البحث بكلمة أخرى أو تغيير التصنيف' : 'Try searching for something else or change the category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
