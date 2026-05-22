import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'agropecuaria_supabase_config';
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-key';

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function fromEnv(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  if (url.includes('SEU_PROJETO') || anonKey.includes('sua_chave')) return null;
  return { url, anonKey };
}

function fromStorage(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupabaseConfig;
    if (parsed?.url && parsed?.anonKey) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  return fromEnv() ?? fromStorage();
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  resetSupabaseClient();
  window.dispatchEvent(new CustomEvent('supabase-config-changed'));
}

export function clearSupabaseConfigOverride() {
  localStorage.removeItem(STORAGE_KEY);
  resetSupabaseClient();
  window.dispatchEvent(new CustomEvent('supabase-config-changed'));
}

let client: SupabaseClient | null = null;
let clientKey = '';

function buildClient(): SupabaseClient {
  const config = getSupabaseConfig();
  const url = config?.url ?? PLACEHOLDER_URL;
  const anonKey = config?.anonKey ?? PLACEHOLDER_KEY;
  const key = `${url}|${anonKey}`;

  if (client && clientKey === key) return client;

  clientKey = key;
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function resetSupabaseClient() {
  client = null;
  clientKey = '';
}

/** Cliente Supabase (usa .env ou config salva em /configurar) */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = buildClient();
    const value = c[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(c) : value;
  },
});

export async function testSupabaseConnection(config: SupabaseConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const test = createClient(config.url, config.anonKey);
    const { error } = await test.auth.getSession();
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Conexão OK! Supabase respondeu corretamente.' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Erro ao conectar.' };
  }
}
