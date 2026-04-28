import { Lightbulb, Leaf, TestTube, Handshake, Target, Eye, History, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import type { Metadata } from 'next';
import { getSiteContent } from '@/actions/content';
import { Reveal } from '@/components/ui/reveal';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.about_title,
    description: dictionary.about_description,
  };
}

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const siteContent = await getSiteContent();
  const isAr = lang === 'ar';

  const getContent = (key: string, defaultValue: string) => {
    const item = (siteContent as any[]).find(i => i.key === key);
    if (!item || !item.value) return defaultValue;
    return (item.value as any)[lang] || (item.value as any)['en'] || defaultValue;
  };

  const images = {
    hero: getContent('about_hero_image', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop'),
    story: getContent('about_story_image', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop'),
    mission: getContent('about_mission_image', 'https://images.unsplash.com/photo-1532187863486-abf51ad9469e?q=80&w=1000&auto=format&fit=crop'),
    vision: getContent('about_vision_image', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'),
  };

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: dictionary.about_value_innovation_title,
      description: dictionary.about_value_innovation_desc,
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: dictionary.about_value_sustainability_title,
      description: dictionary.about_value_sustainability_desc,
    },
    {
      icon: <TestTube className="w-8 h-8 text-primary" />,
      title: dictionary.about_value_quality_title,
      description: dictionary.about_value_quality_desc,
    },
    {
      icon: <Handshake className="w-8 h-8 text-primary" />,
      title: dictionary.about_value_partnership_title,
      description: dictionary.about_value_partnership_desc,
    },
  ];

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero}
            alt="Hero background"
            fill
            className="object-cover scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/40 via-[#020817]/60 to-[#020817]"></div>
        </div>
        
        <div className="container relative z-10">
          <Reveal width="100%" y={50} duration={0.8}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {isAr ? 'من نحن' : 'About Musheas'}
            </div>
            <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6">
              {dictionary.about_title.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? 'text-primary block sm:inline' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed">
              {dictionary.about_description}
            </p>
          </Reveal>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-0.5 h-10 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
        </div>
      </section>

      <div className="relative py-24 space-y-32">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Our Story Section */}
        <section className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal width="100%" y={30} delay={0.2} className={isAr ? "order-first lg:order-last" : ""}>
               <div className="inline-flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <History className="h-4 w-4" />
                {isAr ? 'قصتنا' : 'Our Story'}
              </div>
              <h2 className="font-headline text-4xl sm:text-5xl text-white font-black mb-8 leading-tight">
                {dictionary.about_story_title}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                {dictionary.about_story_desc}
              </p>
            </Reveal>
            <Reveal width="100%" y={30} delay={0.4}>
              <div className="relative aspect-[4/3] sm:aspect-square rounded-[3rem] overflow-hidden group">
                <Image
                  src={images.story}
                  alt="Story image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3rem]"></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Our Mission Section (Reversed) */}
        <section className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal width="100%" y={30} delay={0.2} className="order-last lg:order-first">
               <div className="relative aspect-[4/3] sm:aspect-square rounded-[3rem] overflow-hidden group">
                <Image
                  src={images.mission}
                  alt="Mission image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3rem]"></div>
              </div>
            </Reveal>
            <Reveal width="100%" y={30} delay={0.4} className={isAr ? "order-first lg:order-last" : ""}>
              <div className="inline-flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Target className="h-4 w-4" />
                {isAr ? 'مهمتنا' : 'Our Mission'}
              </div>
              <h2 className="font-headline text-4xl sm:text-5xl text-white font-black mb-8 leading-tight">
                {dictionary.about_mission_title}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                {dictionary.about_mission_desc}
              </p>
            </Reveal>
          </div>
        </section>
        
        {/* Our Vision Section */}
        <section className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal width="100%" y={30} delay={0.2} className={isAr ? "order-first lg:order-last" : ""}>
              <div className="inline-flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Eye className="h-4 w-4" />
                {isAr ? 'رؤيتنا' : 'Our Vision'}
              </div>
              <h2 className="font-headline text-4xl sm:text-5xl text-white font-black mb-8 leading-tight">
                {dictionary.about_vision_title}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                {dictionary.about_vision_desc}
              </p>
            </Reveal>
            <Reveal width="100%" y={30} delay={0.4}>
              <div className="relative aspect-[4/3] sm:aspect-square rounded-[3rem] overflow-hidden group">
                <Image
                  src={images.vision}
                  alt="Vision image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3rem]"></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="container relative py-12">
          <div className="text-center mb-20">
            <Reveal width="100%" y={20}>
              <h2 className="font-headline text-4xl sm:text-6xl text-white font-black tracking-tight mb-4">
                {dictionary.about_values_title}
              </h2>
              <p className="text-white/40 max-w-2xl mt-2 mx-auto text-lg font-light">
                {dictionary.about_values_desc}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Reveal key={index} width="100%" y={30} delay={0.1 * index}>
                <div className="group h-full p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all duration-500 hover:bg-primary/5 relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all"></div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-primary/20">
                    {value.icon}
                  </div>
                  
                  <h3 className="font-headline text-2xl text-white font-black mb-3 tracking-tight">{value.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-[240px]">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container">
           <Reveal width="100%" y={40}>
              <div className="rounded-[4rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-12 md:p-24 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                 <h2 className="font-headline text-4xl sm:text-6xl text-white font-black mb-8 relative z-10">
                    {isAr ? 'جاهز لاستكشاف ابتكاراتنا؟' : 'Ready to Explore Innovation?'}
                 </h2>
                 <div className="flex flex-wrap justify-center gap-4 relative z-10">
                    <a href={`/${lang}/shop`} className="px-10 py-5 bg-primary text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                       {dictionary.nav_shop}
                    </a>
                    <a href={`/${lang}/contact`} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                       {dictionary.nav_contact}
                    </a>
                 </div>
              </div>
           </Reveal>
        </section>
      </div>
    </main>
  );
}
