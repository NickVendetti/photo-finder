export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.js',
      '!**/node_modules/**',
      '!**/tests/**',
      '!**/coverage/**',
      '!**/dist/**',
    ],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    testPathIgnorePatterns: ['/node_modules/'],
  };