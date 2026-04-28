import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n-config';

export default function SignupPage({ params: { lang } }: { params: { lang: Locale } }) {
    redirect(`/${lang}/login`);
}
