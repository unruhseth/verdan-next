import { getApiUrl, buildApiUrl } from '../urls';

// Mock the debug logging function with the correct structure
jest.mock('../debug', () => ({
  debugLog: {
    env: jest.fn(),
    url: jest.fn(),
    api: jest.fn(),
    error: jest.fn(),
  },
}));

describe('URL Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_API_URL = 'https://api.verdan.io';
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore process.env after each test
    process.env = originalEnv;
  });

  describe('getApiUrl', () => {
    it('should throw error when NEXT_PUBLIC_API_URL is not set', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      expect(() => getApiUrl()).toThrow('NEXT_PUBLIC_API_URL environment variable is not set');
    });

    it('should return properly formatted API URL', () => {
      expect(getApiUrl()).toBe('https://api.verdan.io');
    });

    it('should handle URLs with trailing slashes', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.verdan.io/';
      expect(getApiUrl()).toBe('https://api.verdan.io');
    });

    it('should add https:// if protocol is missing', () => {
      process.env.NEXT_PUBLIC_API_URL = 'api.verdan.io';
      expect(getApiUrl()).toBe('https://api.verdan.io');
    });
  });

  describe('buildApiUrl', () => {
    it('should correctly join API URL with path', () => {
      expect(buildApiUrl('/admin/accounts')).toBe('https://api.verdan.io/admin/accounts');
    });

    it('should handle paths with leading slashes', () => {
      expect(buildApiUrl('admin/accounts')).toBe('https://api.verdan.io/admin/accounts');
    });

    it('should preserve query parameters', () => {
      expect(buildApiUrl('/admin/accounts?page=1')).toBe('https://api.verdan.io/admin/accounts?page=1');
    });

    it('should handle multiple slashes correctly', () => {
      expect(buildApiUrl('//admin//accounts//')).toBe('https://api.verdan.io/admin/accounts');
    });

    it('should not duplicate domains', () => {
      expect(buildApiUrl('https://api.verdan.io/admin/accounts')).toBe('https://api.verdan.io/admin/accounts');
      expect(buildApiUrl('www.api.verdan.io/admin/accounts')).toBe('https://api.verdan.io/admin/accounts');
    });

    // Real-world test cases
    it('should handle problematic URL patterns', () => {
      const testCases = [
        {
          input: 'https://www.verdan.io/admin/www.api.verdan.io/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        },
        {
          input: '/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        },
        {
          input: 'https://api.verdan.io/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        },
        {
          input: '/admin/www.api.verdan.io/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        },
        {
          input: 'www.verdan.io/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        },
        {
          input: '/admin/www.verdan.io/admin/accounts',
          expected: 'https://api.verdan.io/admin/accounts'
        }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(buildApiUrl(input)).toBe(expected);
      });
    });
  });
}); 