import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSecurity from 'eslint-plugin-security'
import js from '@eslint/js'

function withFiles(files, ...configs) {
  return configs.flat().map((config) => ({ ...config, files }))
}

export default defineConfig([
  { ignores: ['dist', 'dev-dist', 'public/mockServiceWorker.js', 'src/api/schema.d.ts'] },

  js.configs.recommended,

  ...withFiles(
    ['src/**/*.{ts,vue}'],
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ),

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
    files: ['src/**/*.vue'],
    rules: {
      'vue/component-name-in-template-casing': ['warn', 'kebab-case'],
      'vue/no-template-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'vue/no-v-html': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'security/detect-object-injection': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-undef': 'off', // JavaScript でのみ有用
    },
  },

  eslintConfigPrettier,
])
