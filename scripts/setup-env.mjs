#!/usr/bin/env node
/**
 * Cria o arquivo .env com URL e chave do Supabase.
 * Uso: npm run setup
 */
import { existsSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

console.log('\n=== Configuração Supabase — Agropecuária ===\n');
console.log('No painel: https://supabase.com/dashboard → seu projeto → Settings → API\n');

const url = (await ask('Project URL (ex: https://abc123.supabase.co): ')).trim();
const key = (await ask('anon public key: ')).trim();

if (!url || !key) {
  console.error('\nURL e chave são obrigatórios.');
  rl.close();
  process.exit(1);
}

const content = `# Gerado por npm run setup
VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=${key}
`;

if (existsSync(envPath)) {
  const overwrite = (await ask('\n.env já existe. Substituir? (s/N): ')).trim().toLowerCase();
  if (overwrite !== 's' && overwrite !== 'sim') {
    console.log('Cancelado.');
    rl.close();
    process.exit(0);
  }
}

writeFileSync(envPath, content, 'utf8');
console.log('\n✓ Arquivo .env criado em:', envPath);
console.log('\nPróximo passo: execute supabase/schema.sql no SQL Editor do Supabase.');
console.log('Depois: npm run dev\n');

rl.close();
