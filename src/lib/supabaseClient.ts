import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function looksLikeRealSupabaseUrl(value?: string) {
  return Boolean(value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value));
}

function looksLikeRealAnonKey(value?: string) {
  return Boolean(
    value &&
      value.length > 40 &&
      !value.includes('replace-with') &&
      !value.includes('your-supabase') &&
      !value.includes('your-anon')
  );
}

export function isSupabaseConfigured() {
  return looksLikeRealSupabaseUrl(supabaseUrl) && looksLikeRealAnonKey(supabaseAnonKey);
}

export function getSupabaseConfigDiagnostics() {
  return {
    apiMode: import.meta.env.VITE_GLIDE_API_MODE || 'local',
    hasUrl: Boolean(supabaseUrl),
    urlLooksValid: looksLikeRealSupabaseUrl(supabaseUrl),
    hasAnonKey: Boolean(supabaseAnonKey),
    anonKeyLooksValid: looksLikeRealAnonKey(supabaseAnonKey),
  };
}

export function requireSupabaseConfig() {
  if (isSupabaseConfigured()) return;

  const diagnostics = getSupabaseConfigDiagnostics();
  const issues: string[] = [];

  if (!diagnostics.hasUrl) issues.push('VITE_SUPABASE_URL is missing');
  if (diagnostics.hasUrl && !diagnostics.urlLooksValid) issues.push('VITE_SUPABASE_URL must look like https://your-project-ref.supabase.co');
  if (!diagnostics.hasAnonKey) issues.push('VITE_SUPABASE_ANON_KEY is missing');
  if (diagnostics.hasAnonKey && !diagnostics.anonKeyLooksValid) issues.push('VITE_SUPABASE_ANON_KEY looks invalid or still contains placeholder text');

  throw new Error(
    `Supabase is not configured correctly: ${issues.join('; ')}. Put the real values in .env.local beside package.json, then fully stop and restart npm run dev:supabase.`
  );
}

export const supabase = createClient<Database>(
  looksLikeRealSupabaseUrl(supabaseUrl) ? supabaseUrl! : 'https://example.supabase.co',
  looksLikeRealAnonKey(supabaseAnonKey) ? supabaseAnonKey! : 'anon-key'
);
