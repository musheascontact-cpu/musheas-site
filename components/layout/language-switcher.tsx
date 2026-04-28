'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/lib/i18n-config'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react'

// --- Language Switcher Component ---

export default function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  const handleSwitch = (locale: Locale) => {
    router.push(redirectedPathName(locale))
  }

  const currentLocaleCode = pathName.split('/')[1] as Locale

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto transition-all duration-300 hover:bg-primary/10">
          <Globe className="h-5 w-5 text-primary" suppressHydrationWarning />
          <span className="text-sm font-medium uppercase text-white/90">{currentLocaleCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px] bg-card border-primary/20 animate-fade-in-up">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleSwitch(lang.code as Locale)}
            className="flex items-center gap-3 cursor-pointer"
            disabled={currentLocaleCode === lang.code}
          >
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
