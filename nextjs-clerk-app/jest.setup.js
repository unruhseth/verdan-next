import '@testing-library/jest-dom';

// Mock process.env
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'https://api.verdan.io',
}; 