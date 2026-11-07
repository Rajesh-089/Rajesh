import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient = null;
let supabaseAdminClient = null;

export function getSupabase() {
  if (!supabaseClient) {
    if (!config.supabase.url || (!config.supabase.anonKey && !config.supabase.serviceRoleKey)) {
      return null;
    }
    const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
    supabaseClient = createClient(config.supabase.url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseClient;
}

export function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      return getSupabase(); // Fallback if service role key not provided
    }
    supabaseAdminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdminClient;
}
