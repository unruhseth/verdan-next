'use client';

import { useAuth } from '@clerk/nextjs';

export default function TestPage() {
  const { userId } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Simple Test Page</h1>
      <p>User ID: {userId}</p>
      <p>Current URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
      <p>Environment: {process.env.NODE_ENV}</p>
    </div>
  );
} 