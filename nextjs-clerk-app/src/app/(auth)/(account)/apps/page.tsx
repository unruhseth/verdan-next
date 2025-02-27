'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import AppsList from '@/components/apps/AppsList';

export default function MyAppsPage() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user account');
        }

        const data = await response.json();
        setAccountId(data.account_id);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchUserAccount();
  }, [getToken]);

  const handleAppClick = (app: any) => {
    if (accountId) {
      router.push(`/auth/user/my-apps/${app.app_key}/dashboard`);
    }
  };

  if (!accountId) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Apps</h1>
      <AppsList
        accountId={accountId}
        onAppClick={handleAppClick}
      />
    </div>
  );
} 