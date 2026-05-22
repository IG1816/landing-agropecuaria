import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout, { AuthButton, AuthInput, AuthMessage } from '../components/auth/AuthLayout';

export default function RegisterPage() {
  const { signUp, configured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(email, password, fullName.trim() || undefined);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    setSuccess(
      'Conta criada! Se a confirmação por e-mail estiver ativa no Supabase, confira sua caixa de entrada. Caso contrário, você já pode entrar.'
    );
    setTimeout(() => navigate('/login'), 2500);
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Cadastre-se para acompanhar pedidos e ter um atendimento mais rápido."
      footer={
        <>
          <span className="text-slate-400">Já tem conta? </span>
          <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Entrar
          </Link>
        </>
      }
    >
      {!configured && (
        <AuthMessage type="error">
          Supabase ainda não configurado.{' '}
          <Link to="/configurar" className="underline font-bold text-rose-100">
            Configurar agora
          </Link>
        </AuthMessage>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthMessage type="error">{error}</AuthMessage>}
        {success && <AuthMessage type="success">{success}</AuthMessage>}

        <AuthInput
          label="Nome completo"
          value={fullName}
          onChange={setFullName}
          placeholder="Seu nome"
          autoComplete="name"
        />
        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
        <AuthInput
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 6 caracteres"
          required
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirmar senha"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
        />

        <AuthButton type="submit" disabled={submitting || !configured}>
          <span className="inline-flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            {submitting ? 'Criando...' : 'Criar conta'}
          </span>
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
