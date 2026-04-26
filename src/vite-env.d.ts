/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GLIDE_API_MODE?: 'local' | 'http';
  readonly VITE_GLIDE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
