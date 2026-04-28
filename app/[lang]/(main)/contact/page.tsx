import type { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';
import Image from 'next/image';
import { Reveal } from '@/components/ui/reveal';

import { getSiteContent } from '@/actions/content';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.contact_title,
    description: dictionary.contact_description,
  };
}

export default async function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    const siteContent = await getSiteContent();
    const isAr = lang === 'ar';

    const getContent = (key: string, defaultValue: string) => {
        const item = siteContent.find((i: any) => i.key === key);
        if (!item || !item.value) return defaultValue;
        return (item.value as any)[lang] || (item.value as any)['en'] || defaultValue;
    };

    const images = {
        hero: getContent('contact_hero_image', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop'),
        location: getContent('contact_location_image', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1600&auto=format&fit=crop'),
    };

    const contactInfo = {
        email: getContent('contact_email_value', 'contact@musheas.com'),
        phone: getContent('contact_phone_value', '+213 (0) 555 00 00 00'),
        address: getContent('contact_address_value', isAr ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'),
        workingHours: getContent('contact_working_hours', isAr 
            ? 'فريقنا متاح من الأحد إلى الخميس، من الساعة 9 صباحاً حتى 5 مساءً.' 
            : 'Our team is available Sunday to Thursday, 9:00 AM to 5:00 PM.'),
    };

    return (
        <main className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={images.hero}
                        alt="Contact hero"
                        fill
                        className="object-cover scale-105 animate-slow-zoom"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/40 via-[#020817]/60 to-[#020817]"></div>
                </div>
                
                <div className="container relative z-10">
                    <Reveal width="100%" y={50} duration={0.8}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {isAr ? 'تواصل معنا' : 'Get In Touch'}
                        </div>
                        <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6">
                            {dictionary.contact_title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed">
                            {dictionary.contact_description}
                        </p>
                    </Reveal>
                </div>
            </section>

            <div className="relative py-24 container">
                {/* Background Glows */}
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <Reveal width="100%" y={30}>
                            <h2 className="font-headline text-3xl sm:text-4xl text-white font-black mb-6">
                                {dictionary.contact_info_title}
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: <Mail className="h-5 w-5" />, title: dictionary.contact_email, value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                                    { icon: <Phone className="h-5 w-5" />, title: dictionary.contact_phone, value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
                                    { icon: <MapPin className="h-5 w-5" />, title: dictionary.contact_address, value: contactInfo.address }
                                ].map((item, i) => (
                                    <div key={i} className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{item.title}</p>
                                                {item.href ? (
                                                    <a href={item.href} className="text-white font-bold hover:text-primary transition-colors" dir="ltr">{item.value}</a>
                                                ) : (
                                                    <p className="text-white font-bold" dir="ltr">{item.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal width="100%" y={30} delay={0.2}>
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                <div className="flex items-center gap-4 mb-4">
                                    <Clock className="h-6 w-6 text-primary" />
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm">{isAr ? 'ساعات العمل' : 'Working Hours'}</h4>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {contactInfo.workingHours}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <Reveal width="100%" y={30} delay={0.3}>
                            <div className="p-8 md:p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Sparkles className="h-24 w-24 text-primary" />
                                </div>
                                
                                <h3 className="font-headline text-3xl text-white font-black mb-2">{dictionary.contact_form_title}</h3>
                                <p className="text-white/40 text-sm mb-8">{isAr ? 'املأ النموذج وسنعاود الاتصال بك قريباً.' : 'Fill out the form and we will get back to you shortly.'}</p>
                                
                                <ContactForm dictionary={dictionary} />
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Map Section or Additional Info */}
            <section className="container pb-24">
                <Reveal width="100%" y={40}>
                    <div className="h-[400px] w-full rounded-[4rem] bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden group relative">
                        {/* Placeholder for real map if needed, but for now a themed image */}
                        <Image 
                            src={images.location}
                            alt="Location Context"
                            fill
                            className="object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000"
                        />
                        <div className="relative z-10 text-center">
                            <MapPin className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{isAr ? 'مقرنا في الجزائر' : 'Based in Algiers'}</h3>
                            <p className="text-white/40 text-sm mt-2">{isAr ? 'نخدم العالم من قلب شمال أفريقيا' : 'Serving the world from the heart of North Africa'}</p>
                        </div>
                    </div>
                </Reveal>
            </section>
        </main>
    );
}
