import 'server-only'
import type { Locale } from './i18n-config'
import prisma from './prisma'

const dictionaries = {
  en: () => import('@/dictionaries/en').then((module) => module.default),
  ar: () => import('@/dictionaries/ar').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const dictionary = await dictionaries[locale]();
  
  try {
    const overrides = await prisma.siteContent.findMany({
      select: { key: true, value: true }
    });

    if (overrides && overrides.length > 0) {
      const merged = { ...dictionary } as any;
      overrides.forEach((item: any) => {
        const val = item.value as any;
        if (val && val[locale]) {
          merged[item.key] = val[locale];
        } else if (val && val['en']) {
          merged[item.key] = val['en'];
        }
      });
      return merged;
    }
  } catch (error) {
    console.error('Error fetching overrides from database:', error);
  }

  return dictionary;
}
