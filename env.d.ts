/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHANNEL_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
