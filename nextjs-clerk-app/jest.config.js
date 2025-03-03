module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Transform test files with Babel
    '^.+\\.(test|spec)\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    // Use SWC for all other files
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest'],
  },
}; 