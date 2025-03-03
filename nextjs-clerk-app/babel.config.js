module.exports = api => {
  // Return false for non-test environments to tell Babel to ignore the config
  if (!api.env('test')) {
    return false;
  }

  // Only use Babel for tests
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
      ['next/babel', {
        'preset-env': {},
        'transform-runtime': {},
        'styled-jsx': {},
        'class-properties': {}
      }]
    ]
  };
}; 