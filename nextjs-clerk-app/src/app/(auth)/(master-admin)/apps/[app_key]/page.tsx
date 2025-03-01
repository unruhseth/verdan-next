'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AppPage() {
  const { app_key } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/apps/${app_key}/manage`);
  }, [app_key, router]);

  return null;
} 