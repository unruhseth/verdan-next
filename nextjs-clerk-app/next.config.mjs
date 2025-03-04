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
    return [
      // Handle admin paths
      {
        source: '/admin/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/:path*',
      },
      // Handle API paths
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      }
    ];
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