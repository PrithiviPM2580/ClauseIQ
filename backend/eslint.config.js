import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
    },
    ignores: ['node_modules', 'dist', 'coverage'],
  },
  ...tseslint.configs.recommended,
]);
