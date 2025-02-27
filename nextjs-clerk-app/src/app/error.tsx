'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary px-4 py-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn btn-secondary px-4 py-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}