import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default tseslint.config([
  {
    ignores: [
      'dist',
      'errorJson.js',
      'browser.js',
      'node_modules',
      'test',
      '.gitignore',
      '.prettierignore',
      'scripts/*',
      'rollup.config.mjs'
    ],
    extends: [
      js.configs.recommended,
      // typescript 规则
      tseslint.configs.recommended,
      // react 规则
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      // prettier 冲突
      eslintPluginPrettier.configs
    ],
    rules: {
      "no-useless-escape": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    languageOptions: {
      ecmaVersion: 2020,
      // 追加浏览器全局变量，例如window
      globals: globals.browser,
    }
  }
])