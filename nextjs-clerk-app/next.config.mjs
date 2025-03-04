/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for deployments that support it
  output: 'standalone',

  // Domain configuration
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },

  // Configure rewrites for development and production
  async rewrites() {
    const rewrites = [
      // Handle malformed admin paths with domain
      {
        source: '/admin/:slug*/admin/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/:path*',
      },
      // Handle normal admin paths
      {
        source: '/admin/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/:path*',
      },
      // Handle malformed API paths with domain
      {
        source: '/api/:slug*/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
      // Handle normal API paths
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      }
    ];

    // Add development-specific rewrites
    if (process.env.NODE_ENV === 'development') {
      rewrites.push({
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      });
    }

    return rewrites;
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
};

export default nextConfig;