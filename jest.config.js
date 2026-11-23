/** Jest config. Coverage thresholds fail the run if not met (see AGENTS.md Definition of Done). */
/** @type {import('jest').Config} */
const functions = {
  displayName: 'functions',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/functions/src', '<rootDir>/functions/tests'],
  // Tests live only in functions/tests/, mirroring functions/src/ (e.g. tests/rules/scoring.test.ts).
  testMatch: ['<rootDir>/functions/tests/**/*.test.ts'],
};

/** @type {import('jest').Config} */
const app = {
  displayName: 'app',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app/src', '<rootDir>/app/tests'],
  // Tests live only in app/tests/, mirroring app/src/ (e.g. tests/lib/auth.test.tsx).
  testMatch: ['<rootDir>/app/tests/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/app/tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^next/font/google$': '<rootDir>/app/tests/helpers/nextFont.ts',
    '^@/(.*)$': '<rootDir>/app/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/app/tests/setup.ts'],
};

module.exports = {
  projects: [functions, app],
  collectCoverageFrom: [
    'functions/src/**/*.ts',
    'app/src/**/*.{ts,tsx}',
    '!**/*.test.ts',
    '!**/index.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
    // Add with the first files in each folder (Jest fails on a path with no files):
    //   './functions/src/rules/': 100% branches, functions, lines, statements (pure game rules)
    //   './functions/src/adapters/balldontlie/mapping.ts': 100% (pure mapping)
    //   './app/src/': 90%
  },
};
