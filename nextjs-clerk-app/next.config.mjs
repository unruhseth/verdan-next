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
      // Handle specific admin API paths
      {
        source: '/admin/accounts/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/accounts/:path*',
      },
      {
        source: '/admin/users/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/users/:path*',
      },
      {
        source: '/admin/apps/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/admin/apps/:path*',
      },
      // Handle API paths
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      }
    ];
  },

  // Redirect non-www to www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'verdan.io',
          },
        ],
        destination: 'https://www.verdan.io/:path*',
        permanent: true,
      },
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