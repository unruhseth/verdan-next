module.exports = function(api) {
  // Cache the returned value forever and don't call this function again
  api.cache(true);

  // For test environment, return full config
  if (api.env('test')) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        'next/babel'
      ]
    };
  }

  // For non-test environments, return minimal config that lets Next.js handle it
  return {
    presets: ['next/babel']
  };
}; 