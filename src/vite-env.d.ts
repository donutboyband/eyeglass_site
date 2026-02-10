/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_MODE?: string
  readonly VITE_EYEGLASS_FORCE_ENABLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
