/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENDGRID_API_KEY: string;
  // ...other env vars
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
