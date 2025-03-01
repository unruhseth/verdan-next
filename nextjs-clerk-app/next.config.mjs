/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for deployments that support it
  output: 'standalone',

  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/dashboard',
  },

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Handle webpack configuration
  webpack: (config, { isServer }) => {
    // Ignore specific Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        setImmediate: false,
      };
    }

    // Suppress warnings for specific modules
    config.ignoreWarnings = [
      { module: /node_modules\/scheduler/ },
      { module: /node_modules\/@clerk/ }
    ];

    return config;
  }
};

export default nextConfig;