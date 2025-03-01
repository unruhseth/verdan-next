import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="btn btn-primary px-4 py-2"
          >
            Go home
          </Link>
          <Link
            href="/admin/dashboard"
            className="btn btn-secondary px-4 py-2"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}