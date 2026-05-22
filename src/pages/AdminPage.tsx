import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, ShoppingBag, RefreshCw, Loader2, ArrowLeft, Settings,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STORE_SLUG } from '../lib/store';
import { orderStatusLabel, type Order } from '../types/customer';

type AdminOrder = {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  description: string | null;
  status: Order['status'];
  store_slug?: string;
  created_at: string;
};

const statuses: Order['status'][] = ['pendente', 'em_andamento', 'concluido', 'cancelado'];

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('admin_list_orders');
    if (rpcError) {
      setError(
        rpcError.message.includes('does not exist') || rpcError.message.includes('function')
          ? 'Execute supabase/schema.sql no Supabase e depois supabase/seed-admin.sql com seu usuário.'
          : rpcError.message
      );
      setOrders([]);
    } else {
      const rows = (data as AdminOrder[]) ?? [];
      setOrders(STORE_SLUG ? rows.filter((o) => o.store_slug === STORE_SLUG) : rows);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(orderId: string, status: Order['status']) {
    setUpdatingId(orderId);
    const { error: updateError } = await supabase.rpc('admin_update_order_status', {
      order_id: orderId,
      new_status: status,
    });
    setUpdatingId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] grain text-white">
      <header className="border-b border-emerald-900/40 bg-[#0a0f0a]/95 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-sm">Painel da loja</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={load}
              className="text-slate-400 hover:text-emerald-400 transition-colors"
              title="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link to="/configurar" className="text-slate-400 hover:text-emerald-400" title="Configuração">
              <Settings className="w-4 h-4" />
            </Link>
            <Link to="/" className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-400" />
          Pedidos dos clientes
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Atualize o status quando atender pelo WhatsApp.
        </p>

        {error && (
          <p className="mb-6 text-sm px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-slate-500 text-center py-16 text-sm">
            Nenhum pedido ainda. Quando clientes registrarem em /conta, aparecerão aqui.
          </p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1a0e] to-[#101810] border border-emerald-900/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-white font-bold">{order.title}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {order.user_email} · {new Date(order.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {orderStatusLabel[order.status]}
                  </span>
                </div>
                {order.description && (
                  <p className="text-slate-400 text-sm mb-4">{order.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={updatingId === order.id || order.status === s}
                      onClick={() => updateStatus(order.id, s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        order.status === s
                          ? 'bg-emerald-500/30 border-emerald-500 text-white'
                          : 'border-emerald-900/60 text-slate-400 hover:border-emerald-500 hover:text-white'
                      } disabled:opacity-40`}
                    >
                      {orderStatusLabel[s]}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
