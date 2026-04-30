'use client';

import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { searchProducts } from '@/actions/products';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';

export function ProductSearch({ placeholder, onSelect }: { placeholder: string, onSelect?: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as string;
  const { replace } = useRouter();
  
  const [query, setQuery] = useState(searchParams.get('query')?.toString() ?? '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const results = await searchProducts(query, lang);
        setSuggestions(results);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, lang]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    if (query) {
      urlParams.set('query', query);
    } else {
      urlParams.delete('query');
    }
    setShowSuggestions(false);
    if (onSelect) onSelect();

    // Global Redirection Logic: If not on a products/shop page, go to /shop
    if (!pathname.includes('/products') && !pathname.includes('/shop')) {
      replace(`/${lang}/shop?${urlParams.toString()}`);
    } else {
      replace(`${pathname}?${urlParams.toString()}`);
    }
  };

  const isAr = lang === 'ar';

  return (
    <div ref={containerRef} className="relative w-full md:max-w-md group">
      <form onSubmit={handleSearch} className="relative">
        <Search className={cn(
          "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all",
          isAr ? "right-4" : "left-4",
          isLoading && "opacity-0"
        )} />
        
        {isLoading && (
          <Loader2 className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin",
            isAr ? "right-4" : "left-4"
          )} />
        )}

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(
            "h-12 rounded-full border-2 focus-visible:ring-primary/20 transition-all shadow-sm",
            isAr ? "pr-12 pl-12" : "pl-12 pr-12"
          )}
        />

        {query && (
          <button 
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors",
              isAr ? "left-3" : "right-3"
            )}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-xl bg-card/95 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            {isLoading ? (
               <div className="p-8 text-center text-muted-foreground text-sm italic">
                  {isAr ? 'جاري البحث عن تطابقات...' : 'Searching for matches...'}
               </div>
            ) : (
              suggestions.map((p) => (
                <Link
                  key={p.id}
                  href={`/${lang}/${p.type === 'b2b' ? 'products' : 'shop'}/${p.slug}`}
                  onClick={() => {
                    setShowSuggestions(false);
                    if (onSelect) onSelect();
                  }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all group/item border border-transparent hover:border-primary/10",
                    isAr && "flex-row-reverse"
                  )}
                >
                  <div className="h-12 w-12 rounded-xl overflow-hidden border bg-muted shrink-0">
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover group-hover/item:scale-110 transition-transform" />
                  </div>
                  <div className={cn("flex-1 overflow-hidden", isAr ? "text-right" : "text-left")}>
                    <p className="font-bold text-sm truncate group-hover/item:text-primary transition-colors">
                      {p.name[lang] || p.name.en}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {formatPrice(p.price, lang)} DZD
                    </p>
                  </div>
                </Link>
              ))
            )}
            
            {!isLoading && suggestions.length > 0 && (
              <button 
                onClick={() => {
                  const urlParams = new URLSearchParams(searchParams);
                  urlParams.set('query', query);
                  replace(`${pathname}?${urlParams.toString()}`);
                  setShowSuggestions(false);
                  if (onSelect) onSelect();
                }}
                className="w-full p-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-xl border-t mt-1 transition-colors"
              >
                {isAr ? 'عرض كل النتائج' : 'View all results'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
