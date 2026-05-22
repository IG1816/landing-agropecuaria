import { Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavAuthLinkProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function NavAuthLink({ mobile, onNavigate }: NavAuthLinkProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  const base = mobile
    ? 'block w-full text-left text-sm py-1.5 transition-colors'
    : 'text-sm font-medium transition-colors flex items-center gap-1.5';

  if (user) {
    return (
      <Link
        to="/conta"
        onClick={onNavigate}
        className={`${base} ${mobile ? 'text-slate-200 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`}
      >
        <User className="w-4 h-4" />
        Minha conta
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      onClick={onNavigate}
      className={
        mobile
          ? `${base} text-slate-200 hover:text-emerald-400`
          : `${base} text-slate-300 hover:text-emerald-400 border border-emerald-800/80 hover:border-emerald-500 px-3.5 py-2 rounded-lg`
      }
    >
      {!mobile && <LogIn className="w-4 h-4" />}
      Entrar
    </Link>
  );
}
