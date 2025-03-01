'use client';

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-600 mb-8">Join Verdan to get started</p>
      </div>
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-xl shadow-lg",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          }
        }}
        redirectUrl={redirectUrl || '/dashboard'}
        signInUrl="/sign-in"
        routing="path"
      />
    </main>
  );
}