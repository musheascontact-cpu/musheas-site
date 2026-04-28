import { LoginForm } from "@/components/auth/login-form";
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/lib/i18n-config'
import Image from "next/image";
import { Logo } from "@/components/layout/logo";

export const metadata = {
    title: 'Login | MUSHEAS E-Commerce',
};

export default async function LoginPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container grid min-h-[80vh] grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20">
      <div className="hidden lg:block">
        <div className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden border border-primary/20 bg-card shadow-2xl">
           <Image 
              src="https://picsum.photos/seed/login/800/1000" 
              alt="Mushroom-based cosmetics lab" 
              fill
              className="object-cover opacity-20"
              data-ai-hint="glowing mushrooms"
            />
           <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <Logo />
                <h1 className="mt-4 font-headline text-4xl">
                    {dictionary.hero_title_1} <span className="text-primary">{dictionary.hero_title_2}</span>
                    <br />
                    {dictionary.hero_title_3}
                </h1>
                <p className="mt-2 text-white/70 max-w-prose">
                    {dictionary.hero_description}
                </p>
            </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <LoginForm lang={lang} dictionary={dictionary} />
      </div>
    </div>
  );
}
