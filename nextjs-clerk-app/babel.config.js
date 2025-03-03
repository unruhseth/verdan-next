module.exports = api => {
  const isTest = api.env('test');
  
  // Only use custom Babel config for tests
  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        'next/babel',
      ],
    };
  }

  // For production builds, use Next.js default SWC configuration
  return {
    presets: ['next/babel'],
  };
}; 