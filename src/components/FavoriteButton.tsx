import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerData } from '../contexts/CustomerDataContext';

type FavoriteButtonProps = {
  productName: string;
  category?: string;
  className?: string;
};

export default function FavoriteButton({ productName, category, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useCustomerData();
  const [busy, setBusy] = useState(false);

  const active = isFavorite(productName);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setBusy(true);
    await toggleFavorite(productName, category);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={active ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
        active
          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
          : 'bg-emerald-950/60 border-emerald-900/50 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${active ? 'fill-current' : ''}`} />
    </button>
  );
}
