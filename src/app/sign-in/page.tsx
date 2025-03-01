'use client';

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import React from 'react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  const { user, isLoaded } = useUser();
  
  // Get the role-based redirect path
  const getRoleBasedPath = () => {
    if (!user) return '/dashboard';
    const role = user.organizationMemberships?.[0]?.role || 'org:user';
    return role.includes('admin') ? '/admin/dashboard' : '/dashboard';
  };

  // Use the redirect URL from the query params, or fall back to role-based path
  const afterSignInUrl = redirectUrl || getRoleBasedPath();

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

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
        afterSignInUrl={afterSignInUrl}
        signUpUrl="/sign-up"
        path="/sign-in"
        routing="path"
      />
    </main>
  );
} 