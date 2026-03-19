/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_CONFIG_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
