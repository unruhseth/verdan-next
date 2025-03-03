module.exports = api => {
  const isTest = api.env('test');
  
  // Only use Babel for tests
  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
    };
  }

  // Return null to let SWC handle production builds
  return {};
}; 