import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout, { AuthButton, AuthInput, AuthMessage } from '../components/auth/AuthLayout';

export default function LoginPage() {
  const { signIn, resetPassword, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/conta';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (resetMode) {
      const { error: resetError } = await resetPassword(email);
      setSubmitting(false);
      if (resetError) {
        setError(resetError);
        return;
      }
      setSuccess('Enviamos um link para redefinir sua senha. Verifique seu e-mail.');
      setResetMode(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <AuthLayout
      title={resetMode ? 'Recuperar senha' : 'Entrar na conta'}
      subtitle={
        resetMode
          ? 'Informe seu e-mail e enviaremos o link de recuperação.'
          : 'Acesse pedidos, favoritos e seu histórico na agropecuária.'
      }
      footer={
        <>
          <span className="text-slate-400">Ainda não tem conta? </span>
          <Link to="/cadastro" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Criar conta
          </Link>
        </>
      }
    >
      {!configured && (
        <AuthMessage type="error">
          Supabase ainda não configurado.{' '}
          <Link to="/configurar" className="underline font-bold text-rose-100">
            Abrir assistente de configuração
          </Link>
        </AuthMessage>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthMessage type="error">{error}</AuthMessage>}
        {success && <AuthMessage type="success">{success}</AuthMessage>}

        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />

        {!resetMode && (
          <AuthInput
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        )}

        <AuthButton type="submit" disabled={submitting || !configured}>
          <span className="inline-flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            {submitting ? 'Aguarde...' : resetMode ? 'Enviar link' : 'Entrar'}
          </span>
        </AuthButton>

        <button
          type="button"
          onClick={() => {
            setResetMode((m) => !m);
            setError(null);
            setSuccess(null);
          }}
          className="w-full text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          {resetMode ? 'Voltar ao login' : 'Esqueci minha senha'}
        </button>
      </form>
    </AuthLayout>
  );
}
