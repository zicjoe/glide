/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GLIDE_API_MODE?: 'local' | 'http' | 'supabase';
  readonly VITE_GLIDE_API_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_CANTON_ENVIRONMENT?: 'DevNet' | 'TestNet' | 'MainNet';
  readonly VITE_CANTON_LEDGER_API_URL?: string;
  readonly VITE_CANTON_PARTICIPANT_ID?: string;
  readonly VITE_CANTON_WORKFLOW_PACKAGE?: string;
  readonly VITE_CANTON_WORKFLOW_MODULE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
