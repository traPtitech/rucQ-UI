import { defineConfig } from 'eslint-define-config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginSecurity from 'eslint-plugin-security'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', '.output', 'coverage'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginSecurity.configs.recommended,

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  eslintConfigPrettier,

  {
    rules: {
      'vue/component-name-in-template-casing': ['warn', 'kebab-case'], // kebab-case 推奨
      'vue/no-template-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'vue/no-v-html': 'error',
    },
  },
])
