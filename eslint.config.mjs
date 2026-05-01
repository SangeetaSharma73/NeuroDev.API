// eslint.config.mjs
import eslintjs from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import promise from 'eslint-plugin-promise';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import security from 'eslint-plugin-security';

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'out', 'eslint.config.mjs']
  },

  eslintjs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vitest.config.ts']
        },
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      n: {
        tryExtensions: ['.js', '.ts', '.json']
      }
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      promise,
      import: importPlugin,
      n: nodePlugin,
      security
    },

    rules: {
      // Core correctness
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-func-assign': 'error',
      'no-unsafe-finally': 'error',
      'valid-typeof': 'error',

      // Clean code
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-shadow': 'error',
      'no-useless-return': 'error',

      // Logging / debugging
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // Complexity
      complexity: ['warn', 10],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Import hygiene
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',

      // Promise / async safety
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'require-await': 'warn',
      'no-return-await': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',

      // Node.js
      'n/no-missing-import': 'error',
      'n/no-unpublished-require': 'warn',
      'n/no-deprecated-api': 'warn',
      'n/handle-callback-err': 'error',
      'n/no-process-exit': 'warn',

      // Security
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-child-process': 'warn',

      // TypeScript
      'consistent-return': 'off',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn'
    }
  },

  {
    files: ['tests/**/*.ts', '**/*.test.ts', 'vitest.config.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-unresolved': 'off',
      'n/no-missing-import': 'off',
      'security/detect-object-injection': 'off'
    }
  },

  eslintConfigPrettier
]);
