module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!**/node_modules/**', '!**/dist/**', '!**/coverage/**', '!**/example/**'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['text', 'text-summary'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/', '/example/', '/fixtures/'],
};
