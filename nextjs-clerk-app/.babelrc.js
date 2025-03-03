module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    'next/babel'
  ],
  // Only apply this config in test environment
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        'next/babel'
      ]
    }
  }
}; 