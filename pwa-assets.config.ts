import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  images: ['public/icons/icon.png'],
  preset: 'minimal-2023',
  manifestIconsEntry: true,
})
