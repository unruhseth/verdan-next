/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
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