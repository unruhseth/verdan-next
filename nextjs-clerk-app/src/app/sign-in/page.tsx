'use client';

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getDefaultRouteForRole, Role } from '@/config/roles';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  const { user, isLoaded } = useUser();
  const [defaultRedirect, setDefaultRedirect] = useState('/dashboard');

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.organizationMemberships?.[0]?.role || 'org:user';
      const normalizedRole = role.replace('-', '_') as Role;
      setDefaultRedirect(getDefaultRouteForRole(normalizedRole));
    }
  }, [isLoaded, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Sign in to access your account</p>
      </div>
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-xl shadow-lg",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          }
        }}
        redirectUrl={redirectUrl || defaultRedirect}
        signUpUrl="/sign-up"
        routing="path"
      />
    </main>
  );
}