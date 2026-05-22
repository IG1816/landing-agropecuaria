import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut, User, Mail, Sprout, MessageCircle, Heart, ShoppingBag,
  Trash2, Plus, Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerData } from '../contexts/CustomerDataContext';
import { catalogProducts } from '../data/catalog';
import { orderStatusLabel } from '../types/customer';
import FavoriteButton from '../components/FavoriteButton';

const WHATSAPP_NUMBER = '5500000000000';
const WHATSAPP_MESSAGE = 'Olá! Estou logado no site e gostaria de falar com a agropecuária.';
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

type Tab = 'favoritos' | 'pedidos';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const {
    favorites,
    orders,
    favoritesLoading,
    ordersLoading,
    favoritesError,
    ordersError,
    removeFavorite,
    createOrder,
    deleteOrder,
  } = useCustomerData();

  const [tab, setTab] = useState<Tab>('favoritos');
  const [orderTitle, setOrderTitle] = useState('');
  const [orderDesc, setOrderDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Cliente';

  async function handleNewOrder(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!orderTitle.trim()) {
      setFormError('Informe um título para o pedido.');
      return;
    }
    setSubmitting(true);
    const { error } = await createOrder(orderTitle, orderDesc);
    setSubmitting(false);
    if (error) {
      setFormError(error);
      return;
    }
    setOrderTitle('');
    setOrderDesc('');
    setFormSuccess('Pedido registrado! Entraremos em contato pelo WhatsApp.');
    setTab('pedidos');
  }

  function waLinkForProduct(name: string) {
    const msg = `Olá! Tenho interesse em "${name}" (salvei nos favoritos no site).`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] grain text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0a0f0a] to-[#1a2a10]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#5b8c3e 1px,transparent 1px),linear-gradient(90deg,#5b8c3e 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <header className="relative z-10 border-b border-emerald-900/40 bg-[#0a0f0a]/90 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-sm">Minha conta</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-slate-300 hover:text-rose-300 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-5 py-10 pb-16">
        <div className="relative mb-8">
          <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/15 to-transparent rounded-3xl blur-xl" />
          <div className="relative bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 border border-emerald-900/60 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Bem-vindo</p>
                <h1 className="text-xl font-black text-white">{displayName}</h1>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-white text-sm font-medium truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {([
            ['favoritos', Heart, 'Favoritos'],
            ['pedidos', ShoppingBag, 'Pedidos'],
          ] as const).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-emerald-950/40 border border-emerald-900/50 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'favoritos' && (
          <section className="space-y-6">
            <div className="bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 border border-emerald-900/60 rounded-2xl p-5">
              <h2 className="text-white font-bold mb-1">Seus favoritos</h2>
              <p className="text-slate-400 text-xs mb-4">
                Produtos salvos no site ou adicionados abaixo.
              </p>

              {favoritesError && (
                <p className="text-rose-300 text-sm mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  {favoritesError}
                </p>
              )}

              {favoritesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              ) : favorites.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">
                  Nenhum favorito ainda. Use o coração nas categorias do site ou adicione abaixo.
                </p>
              ) : (
                <ul className="space-y-2">
                  {favorites.map((fav) => (
                    <li
                      key={fav.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50"
                    >
                      <div className="min-w-0">
                        <div className="text-white text-sm font-bold truncate">{fav.product_name}</div>
                        {fav.category && (
                          <div className="text-slate-500 text-xs">{fav.category}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={waLinkForProduct(fav.product_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 p-2"
                          title="Pedir no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => removeFavorite(fav.id)}
                          className="text-slate-500 hover:text-rose-400 p-2 transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 border border-emerald-900/60 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Adicionar dos produtos</h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {catalogProducts.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-emerald-950/40 transition-colors"
                  >
                    <span className="text-slate-300 text-sm truncate">{p.name}</span>
                    <FavoriteButton productName={p.name} category={p.category} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {tab === 'pedidos' && (
          <section className="space-y-6">
            <form
              onSubmit={handleNewOrder}
              className="bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 border border-emerald-900/60 rounded-2xl p-5 space-y-4"
            >
              <h2 className="text-white font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Novo pedido / orçamento
              </h2>
              <p className="text-slate-400 text-xs -mt-2">
                Descreva o que precisa. A loja vê aqui e pode responder pelo WhatsApp.
              </p>

              {formError && (
                <p className="text-rose-300 text-sm px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="text-emerald-200 text-sm px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  {formSuccess}
                </p>
              )}

              <input
                value={orderTitle}
                onChange={(e) => setOrderTitle(e.target.value)}
                placeholder="Ex: Ração para aves — 10 sacos"
                required
                className="w-full bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <textarea
                value={orderDesc}
                onChange={(e) => setOrderDesc(e.target.value)}
                placeholder="Detalhes, quantidade, marca preferida..."
                rows={3}
                className="w-full bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-sm resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {submitting ? 'Salvando...' : 'Registrar pedido'}
              </button>
            </form>

            <div className="bg-gradient-to-br from-[#0e1a0e]/95 to-[#101810]/95 border border-emerald-900/60 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">Histórico</h3>

              {ordersError && (
                <p className="text-rose-300 text-sm mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  {ordersError}
                </p>
              )}

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Nenhum pedido registrado ainda.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-sm">{order.title}</h4>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                          {orderStatusLabel[order.status]}
                        </span>
                      </div>
                      {order.description && (
                        <p className="text-slate-400 text-xs mb-2">{order.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-[10px]">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border-2 border-emerald-800 hover:border-emerald-500 text-slate-200 font-semibold px-5 py-3.5 rounded-xl transition-all hover:bg-emerald-900/20"
          >
            Ver o site
          </Link>
        </div>
      </main>
    </div>
  );
}
