'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import useApi from '@/hooks/useApi';

interface App {
  id: string;
  name: string;
  description: string;
  app_key: string;
  icon_url?: string;
  fa_icon?: string;
}

export default function UserSidebar() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const loadApps = async () => {
      if (!accountId) return;

      try {
        const result = await fetchWithAuth<App[]>(`/admin/accounts/${accountId}/apps/installed`);
        if (result.data) {
          setApps(result.data);
        }
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [accountId, fetchWithAuth]);

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-700 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/dashboard" className="text-xl font-bold text-white">
          Verdan Admin
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>

      <nav className="space-y-2">
        <Link
          href="/admin/dashboard"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname === '/admin/dashboard'
              ? 'bg-purple-800 text-white'
              : 'text-purple-100 hover:bg-purple-800 hover:text-white'
          }`}
        >
          <span className="mr-3">⌂</span>
          Dashboard
        </Link>

        <Link
          href="/apps"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith('/apps')
              ? 'bg-purple-800 text-white'
              : 'text-purple-100 hover:bg-purple-800 hover:text-white'
          }`}
        >
          <span className="mr-3">⬚</span>
          Apps
        </Link>

        <Link
          href="/settings"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname === '/settings'
              ? 'bg-purple-800 text-white'
              : 'text-purple-100 hover:bg-purple-800 hover:text-white'
          }`}
        >
          <span className="mr-3">⚙</span>
          Settings
        </Link>
      </nav>
    </div>
  );
} 