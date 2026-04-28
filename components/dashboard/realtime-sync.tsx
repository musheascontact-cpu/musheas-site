'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function RealtimeDashboardSync() {
  const router = useRouter();

  useEffect(() => {
    // Since we removed Supabase, we rely on polling to keep the dashboard fresh
    // from our internal PostgreSQL database via Server Actions.
    const intervalId = setInterval(() => {
      router.refresh();
    }, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [router]);

  return null;
}
