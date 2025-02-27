/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  // Configure runtime for specific paths
  experimental: {
    serverActions: true,
    // Opt out of Edge Runtime for auth-related routes
    runtime: {
      nodejs: {
        paths: [
          '/api/**/*',
          '/auth/**/*',
          '/(auth)/**/*'
        ]
      }
    }
  },
  // Suppress setImmediate warnings
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'scheduler/tracing': 'scheduler/tracing-profiling',
      });
    }
    return config;
  }
}

module.exports = nextConfig 