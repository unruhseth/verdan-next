/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  // Specify runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    runtime: 'nodejs',
  },
  // Ignore the setImmediate warning since we're not using Edge Runtime
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        setImmediate: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 