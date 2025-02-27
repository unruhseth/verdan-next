'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    app_id: string;
  }
}

export default function AppPage({ params }: Props) {
  const { app_id } = params;
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/apps/${app_id}/manage`);
  }, [app_id, router]);

  return null;
} 