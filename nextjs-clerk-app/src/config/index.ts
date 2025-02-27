const env = process.env.NODE_ENV || 'development';

interface Config {
  apiUrl: string;
  clerkPublishableKey: string;
  appName: string;
  defaultRedirects: {
    afterSignIn: string;
    afterSignUp: string;
    onUnauthorized: string;
  };
  api: {
    baseUrl: string;
    endpoints: {
      users: string;
      apps: string;
      settings: string;
      analytics: string;
    };
  };
}

const development: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  appName: 'Verdan Platform (Dev)',
  defaultRedirects: {
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
    onUnauthorized: '/sign-in',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    endpoints: {
      users: '/api/users',
      apps: '/api/apps',
      settings: '/api/settings',
      analytics: '/api/analytics',
    },
  },
};

const production: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  appName: 'Verdan Platform',
  defaultRedirects: {
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
    onUnauthorized: '/sign-in',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    endpoints: {
      users: '/api/users',
      apps: '/api/apps',
      settings: '/api/settings',
      analytics: '/api/analytics',
    },
  },
};

const config: Record<string, Config> = {
  development,
  production,
};

export default config[env];