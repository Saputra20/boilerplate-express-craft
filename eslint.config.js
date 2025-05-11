const js = require('@eslint/js');
const airbnbBase = require('eslint-config-airbnb-base');
const prettier = require('eslint-config-prettier');
const jest = require('eslint-plugin-jest');
const security = require('eslint-plugin-security');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules', 'bin', 'src/database'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      jest,
      security,
      prettier: prettierPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      ...jest.configs.recommended.rules,
      ...security.configs.recommended.rules,
      'prettier/prettier': 'error',

      // Custom Express-friendly overrides
      'no-console': 'off',
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'consistent-return': 'off',
      'jest/expect-expect': 'off',
      'security/detect-object-injection': 'off',
      'no-useless-constructor': 'off',
      'no-plusplus': 'off',
    },
  },
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    plugins: {
      jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
  prettier,
];
