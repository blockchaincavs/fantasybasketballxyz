import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      '**/.next/',
      '**/*.js',
      '**/*.mjs',
      'app/next-env.d.ts',
      'test-results/',
      'playwright-report/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Backend game rules must stay pure: no Node built-ins, network, clock, or env access.
    // Time and randomness are passed in as arguments so every rule is testable.
    files: ['functions/src/rules/**/*.ts', 'functions/src/adapters/balldontlie/mapping.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'node:*',
            'fs',
            'http',
            'https',
            'net',
            'child_process',
            'node-appwrite',
            '../adapters/*',
            '../handlers/*',
            './client',
            './fixtures',
          ],
        },
      ],
      'no-restricted-globals': ['error', 'fetch', 'process', 'XMLHttpRequest', 'WebSocket'],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Pass `now` in as an argument.' },
        { object: 'Math', property: 'random', message: 'Pass an `rng` in as an argument.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Pass `now` in as an argument.',
        },
      ],
    },
  },
  {
    // The front end must never contain game rules or server code; it calls Appwrite Functions instead.
    files: ['app/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin, 'react-hooks': reactHooks },
    settings: { next: { rootDir: 'app/' } },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-restricted-imports': [
        'error',
        { patterns: ['**/functions/**', '@fbx/functions', '@fbx/functions/*', 'node-appwrite'] },
      ],
      // No server keys can be read in the app: only the public Appwrite ids and the site URL.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env']:not([property.name=/^NEXT_PUBLIC_(APPWRITE_[A-Z_]+|SITE_URL)$/])",
          message: 'Only NEXT_PUBLIC_APPWRITE_* and NEXT_PUBLIC_SITE_URL may be read in app/.',
        },
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']:not(MemberExpression > MemberExpression.object)",
          message: 'Read only NEXT_PUBLIC_APPWRITE_* and NEXT_PUBLIC_SITE_URL, one by name.',
        },
      ],
    },
  },
  {
    // Tests and e2e may set any variable to check how the app behaves.
    files: ['app/tests/**/*.{ts,tsx}', 'app/e2e/**/*.ts', 'app/playwright.config.ts'],
    // jest.mock factories load fakes with require().
    rules: { 'no-restricted-syntax': 'off', '@typescript-eslint/no-require-imports': 'off' },
  },
);
