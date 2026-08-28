const js = require('@eslint/js');
const airbnbBase = require('eslint-config-airbnb-base');
const prettier = require('eslint-config-prettier');
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
        Bun: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      security,
      prettier: prettierPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      ...security.configs.recommended.rules,
      'prettier/prettier': 'error',

      // Custom Express-friendly overrides
      'no-console': 'off',
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'consistent-return': 'off',
      'security/detect-object-injection': 'off',
      'no-useless-constructor': 'off',
      'no-plusplus': 'off',
    },
  },
  prettier,
];
