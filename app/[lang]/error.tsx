'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a1a1a] text-white">
      <div className="max-w-md w-full text-center space-y-8 p-12 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-4xl font-black text-primary">!</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-headline tracking-tighter">حدث خطأ تقني</h1>
          <p className="text-white/60 font-light">
            نعتذر، واجهنا مشكلة في تحميل هذه الصفحة. الرجاء المحاولة مرة أخرى أو العودة للرئيسية.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => reset()}
            className="h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            إعادة المحاولة
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="h-14 rounded-2xl border-white/10 hover:bg-white/5 text-lg font-black uppercase tracking-widest"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-black/40 rounded-2xl text-left overflow-auto text-[10px] font-mono text-red-400 border border-red-500/20">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
