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
    NEXT_PUBLIC_CLERK_JS_URL: 'https://js.clerk.com',
    NEXT_PUBLIC_CLERK_LOAD_JS: 'true',
  },

  // Domain configuration
  images: {
    domains: ['localhost', 'www.verdan.io', 'verdan.io', 'img.clerk.com', 'js.clerk.com'],
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
  },

  // Additional configuration for Clerk
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'www.verdan.io',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
};

export default nextConfig;