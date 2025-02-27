/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  // Disable Edge Runtime completely since we're using Node.js features
  experimental: {
    serverActions: true,
    runtime: 'nodejs'
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
}

module.exports = nextConfig 