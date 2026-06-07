import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TODO: Configure rules
      // 1. Enable '@typescript-eslint/no-explicit-any' as 'error'
      // 2. Configure 'no-console' as 'warn'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.js']
  }
);
