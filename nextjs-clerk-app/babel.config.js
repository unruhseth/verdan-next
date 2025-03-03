module.exports = function(api) {
  const isTest = api.env('test');

  // For test environment, return full config
  if (isTest) {
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