/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BETTING_URL: string;
  readonly VITE_BROKER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
