// ============================================
// jest.config.js
// Fixed Jest configuration for ES modules
// ============================================
export default {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        'routes/**/*.js',
        'controllers/**/*.js',
        'services/**/*.js',
        '!**/*.test.js',
        '!**/node_modules/**',
    ],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    testTimeout: 30000,
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // Remove extensionsToTreatAsEsm since package.json has "type": "module"
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
};