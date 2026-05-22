import { Link } from 'react-router-dom';
import { Sprout, Leaf, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

const BUSINESS_NAME = 'Agropecuária';
const BUSINESS_TAGLINE = 'do Campo';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0f0a] grain text-white relative overflow-hidden flex items-center justify-center px-5 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0a0f0a] to-[#1a2a10]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#5b8c3e 1px,transparent 1px),linear-gradient(90deg,#5b8c3e 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-lime-400/10 rounded-full blur-[120px] animate-pulse-slow"
        style={{ animationDelay: '1s' }}
      />
      <Leaf className="absolute top-24 right-1/4 w-7 h-7 text-emerald-500/20 animate-float" />
      <Leaf
        className="absolute bottom-32 left-16 w-5 h-5 text-lime-400/20 animate-float"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <div className="text-white font-black text-lg tracking-tight">{BUSINESS_NAME}</div>
            <div className="text-emerald-400/80 text-[10px] uppercase tracking-widest font-semibold">
              {BUSINESS_TAGLINE}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/15 via-lime-400/5 to-transparent rounded-3xl blur-xl" />
          <div className="relative bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 backdrop-blur-md border border-emerald-900/60 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">{title}</h1>
            <p className="text-slate-400 text-sm mb-7">{subtitle}</p>
            {children}
            {footer && <div className="mt-6 pt-6 border-t border-emerald-900/50 text-center text-sm">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1.5 block">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
      />
    </label>
  );
}

export function AuthButton({
  children,
  type = 'submit',
  disabled,
  variant = 'primary',
}: {
  children: ReactNode;
  type?: 'submit' | 'button';
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  if (variant === 'ghost') {
    return (
      <button
        type={type}
        disabled={disabled}
        className="w-full border-2 border-emerald-800 hover:border-emerald-500 text-slate-200 hover:text-white font-semibold py-3.5 rounded-xl transition-all hover:bg-emerald-900/20 disabled:opacity-50 disabled:pointer-events-none"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
    >
      {children}
    </button>
  );
}

export function AuthMessage({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  const styles =
    type === 'error'
      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
  return (
    <p className={`text-sm px-4 py-3 rounded-xl border ${styles}`} role="alert">
      {children}
    </p>
  );
}
