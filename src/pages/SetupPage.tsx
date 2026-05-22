import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, CheckCircle2, Copy, ExternalLink, Database, Key, Play,
  AlertCircle, ArrowLeft,
} from 'lucide-react';
import schemaSql from '../../supabase/schema.sql?raw';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseConfig,
  testSupabaseConnection,
  type SupabaseConfig,
} from '../lib/supabase';
import { AuthMessage } from '../components/auth/AuthLayout';

const STEPS = [
  {
    n: 1,
    title: 'Criar projeto no Supabase',
    desc: 'Conta grátis em supabase.com → New project → anote nome e senha do banco.',
    href: 'https://supabase.com/dashboard',
  },
  {
    n: 2,
    title: 'Colar URL e chave abaixo',
    desc: 'Dashboard → Settings → API → Project URL e anon public.',
  },
  {
    n: 3,
    title: 'Executar o SQL',
    desc: 'SQL Editor → New query → cole o script → Run.',
  },
  {
    n: 4,
    title: 'Virar administrador',
    desc: 'Cadastre-se no site, depois execute supabase/seed-admin.sql com seu e-mail.',
  },
];

export default function SetupPage() {
  const existing = getSupabaseConfig();
  const [url, setUrl] = useState(existing?.url ?? '');
  const [anonKey, setAnonKey] = useState(existing?.anonKey ?? '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState<'sql' | 'env' | null>(null);

  const envPreview = `VITE_SUPABASE_URL=${url || 'https://SEU_PROJETO.supabase.co'}
VITE_SUPABASE_ANON_KEY=${anonKey || 'sua_chave_anon_publica'}`;

  async function handleTestAndSave() {
    setTesting(true);
    setTestResult(null);
    const config: SupabaseConfig = { url: url.trim(), anonKey: anonKey.trim() };
    const result = await testSupabaseConnection(config);
    setTestResult(result);
    if (result.ok) {
      saveSupabaseConfig(config);
    }
    setTesting(false);
  }

  function copyText(text: string, kind: 'sql' | 'env') {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  const ready = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#0a0f0a] grain text-white relative overflow-hidden py-12 px-5">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0a0f0a] to-[#1a2a10]" />
      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Configurar Supabase</h1>
            <p className="text-slate-400 text-sm">Assistente passo a passo — ~5 minutos</p>
          </div>
        </div>

        {ready && (
          <div className="mb-6">
            <AuthMessage type="success">
              Supabase conectado! Você já pode{' '}
              <Link to="/cadastro" className="underline font-bold">criar conta</Link>, usar favoritos e pedidos.
              {isSupabaseConfigured() && (
                <>
                  {' '}
                  <Link to="/admin" className="underline font-bold">Painel admin</Link> (após rodar seed-admin.sql).
                </>
              )}
            </AuthMessage>
          </div>
        )}

        <ol className="space-y-4 mb-8">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#0e1a0e]/90 to-[#101810]/90 border border-emerald-900/50"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                {step.n}
              </span>
              <div>
                <div className="text-white font-bold text-sm">{step.title}</div>
                <p className="text-slate-400 text-xs mt-1">{step.desc}</p>
                {step.href && (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-2 hover:text-emerald-300"
                  >
                    Abrir painel <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        <section className="mb-8 p-6 rounded-2xl border border-emerald-900/60 bg-[#0e1a0e]/90">
          <h2 className="text-white font-bold flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-emerald-400" />
            Passo 2 — Conectar
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Project URL</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxx.supabase.co"
                className="mt-1 w-full bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">anon public key</span>
              <input
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="mt-1 w-full bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </label>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={testing || !url.trim() || !anonKey.trim()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
            >
              <Play className="w-4 h-4" />
              {testing ? 'Testando...' : 'Testar e salvar neste navegador'}
            </button>
            {testResult && (
              <p
                className={`text-sm px-3 py-2 rounded-lg border ${
                  testResult.ok
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                {testResult.ok ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : <AlertCircle className="w-4 h-4 inline mr-1" />}
                {testResult.message}
              </p>
            )}
            <p className="text-slate-500 text-[11px]">
              Para produção, copie também para o arquivo <code className="text-emerald-400/80">.env</code> na pasta do projeto e reinicie <code className="text-emerald-400/80">npm run dev</code>.
            </p>
            <button
              type="button"
              onClick={() => copyText(envPreview, 'env')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied === 'env' ? 'Copiado!' : 'Copiar conteúdo do .env'}
            </button>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl border border-emerald-900/60 bg-[#0e1a0e]/90">
          <h2 className="text-white font-bold flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            Passo 3 — SQL (copiar e colar no Supabase)
          </h2>
          <button
            type="button"
            onClick={() => copyText(schemaSql, 'sql')}
            className="mb-3 flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied === 'sql' ? 'SQL copiado!' : 'Copiar schema.sql completo'}
          </button>
          <pre className="text-[10px] text-slate-500 bg-black/30 rounded-xl p-3 max-h-40 overflow-auto border border-emerald-900/40 whitespace-pre-wrap">
            {schemaSql.slice(0, 500)}...
          </pre>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/cadastro"
            className="flex-1 min-w-[140px] text-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all"
          >
            Criar conta
          </Link>
          <Link
            to="/login"
            className="flex-1 min-w-[140px] text-center border border-emerald-800 text-slate-200 font-semibold py-3 rounded-xl hover:border-emerald-500 transition-all"
          >
            Entrar
          </Link>
        </div>

        <p className="text-slate-600 text-xs text-center mt-8">
          Terminal: <code className="text-slate-500">npm run setup</code> cria o .env automaticamente.
        </p>
      </div>
    </div>
  );
}
