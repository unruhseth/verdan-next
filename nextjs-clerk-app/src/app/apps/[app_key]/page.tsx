'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    app_key: string;
  }
}

export default function AppPage({ params }: Props) {
  const { app_key } = params;
  const router = useRouter();

  useEffect(() => {
    const accountId = localStorage.getItem('currentAccountId');
    if (!accountId) {
      // If no account ID is found, redirect to account selection
      router.replace('/accounts');
      return;
    }

    // Redirect to the app's dashboard with the account ID
    router.replace(`/apps/${app_key}/dashboard?accountId=${accountId}`);
  }, [app_key, router]);

  return null;
} 