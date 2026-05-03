import { ReactNode } from 'react';
import { Locale } from '@/lib/i18n-config';
import DashboardSidebar from '@/components/dashboard/sidebar';
import { DashboardBottomNav } from '@/components/dashboard/mobile-bottom-nav';
import { ErrorBoundary } from '@/components/error-boundary';

export default async function DashboardLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: Locale };
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardSidebar lang={lang} />

      {/* Main content - offset for sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0 rtl:md:ml-0 rtl:md:mr-64">
        {/* Spacer for mobile fixed header */}
        <div className="h-14 md:hidden" />

        <main className="flex-1 p-4 md:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
        
        <DashboardBottomNav lang={lang} />
      </div>
    </div>
  );
}
