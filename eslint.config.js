import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSecurity from 'eslint-plugin-security'

export default defineConfig([
  { ignores: ['dist', 'dev-dist', 'public/mockServiceWorker.js'] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginVue.configs['flat/recommended'],
  pluginSecurity.configs.recommended,

  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  {
    rules: {
      'vue/component-name-in-template-casing': ['warn', 'kebab-case'], // kebab-case 推奨
      'vue/no-template-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'security/detect-object-injection': 'off', // 過剰な警告を無効化
      'vue/no-v-html': 'error',
    },
  },

  eslintConfigPrettier,
])
