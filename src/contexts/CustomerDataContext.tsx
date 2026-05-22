import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { STORE_SLUG } from '../lib/store';
import { useAuth } from './AuthContext';
import type { Favorite, Order } from '../types/customer';

type CustomerDataContextValue = {
  favorites: Favorite[];
  orders: Order[];
  favoritesLoading: boolean;
  ordersLoading: boolean;
  favoritesError: string | null;
  ordersError: string | null;
  isFavorite: (productName: string) => boolean;
  toggleFavorite: (productName: string, category?: string) => Promise<{ error: string | null }>;
  removeFavorite: (id: string) => Promise<{ error: string | null }>;
  createOrder: (title: string, description: string) => Promise<{ error: string | null }>;
  deleteOrder: (id: string) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
};

const CustomerDataContext = createContext<CustomerDataContextValue | null>(null);

function mapTableError(message: string): string {
  if (message.includes('does not exist')) {
    return 'Execute o arquivo supabase/schema.sql no painel do Supabase.';
  }
  return message;
}

function favoritesQuery() {
  let q = supabase.from('favorites').select('*').order('created_at', { ascending: false });
  if (STORE_SLUG) q = q.eq('store_slug', STORE_SLUG);
  return q;
}

function ordersQuery() {
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (STORE_SLUG) q = q.eq('store_slug', STORE_SLUG);
  return q;
}

export function CustomerDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setOrders([]);
      setFavoritesLoading(false);
      setOrdersLoading(false);
      return;
    }

    setFavoritesLoading(true);
    setOrdersLoading(true);
    setFavoritesError(null);
    setOrdersError(null);

    const [favRes, ordRes] = await Promise.all([favoritesQuery(), ordersQuery()]);

    if (favRes.error) {
      setFavoritesError(mapTableError(favRes.error.message));
      setFavorites([]);
    } else {
      setFavorites((favRes.data as Favorite[]) ?? []);
    }

    if (ordRes.error) {
      setOrdersError(mapTableError(ordRes.error.message));
      setOrders([]);
    } else {
      setOrders((ordRes.data as Order[]) ?? []);
    }

    setFavoritesLoading(false);
    setOrdersLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isFavorite = useCallback(
    (productName: string) => favorites.some((f) => f.product_name === productName),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (productName: string, category?: string) => {
      if (!user) return { error: 'Faça login para salvar favoritos.' };
      if (isFavorite(productName)) {
        let q = supabase.from('favorites').delete().eq('user_id', user.id).eq('product_name', productName);
        if (STORE_SLUG) q = q.eq('store_slug', STORE_SLUG);
        const { error } = await q;
        if (!error) await refetch();
        return { error: error?.message ?? null };
      }
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        product_name: productName,
        category: category ?? null,
        ...(STORE_SLUG ? { store_slug: STORE_SLUG } : {}),
      });
      if (!error) await refetch();
      return { error: error?.message ?? null };
    },
    [user, isFavorite, refetch]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('favorites').delete().eq('id', id);
      if (!error) await refetch();
      return { error: error?.message ?? null };
    },
    [refetch]
  );

  const createOrder = useCallback(
    async (title: string, description: string) => {
      if (!user) return { error: 'Faça login para registrar pedidos.' };
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        status: 'pendente',
        ...(STORE_SLUG ? { store_slug: STORE_SLUG } : {}),
      });
      if (!error) await refetch();
      return { error: error?.message ?? null };
    },
    [user, refetch]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) await refetch();
      return { error: error?.message ?? null };
    },
    [refetch]
  );

  const value = useMemo(
    () => ({
      favorites,
      orders,
      favoritesLoading,
      ordersLoading,
      favoritesError,
      ordersError,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      createOrder,
      deleteOrder,
      refetch,
    }),
    [
      favorites,
      orders,
      favoritesLoading,
      ordersLoading,
      favoritesError,
      ordersError,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      createOrder,
      deleteOrder,
      refetch,
    ]
  );

  return <CustomerDataContext.Provider value={value}>{children}</CustomerDataContext.Provider>;
}

export function useCustomerData() {
  const ctx = useContext(CustomerDataContext);
  if (!ctx) throw new Error('useCustomerData deve ser usado dentro de CustomerDataProvider');
  return ctx;
}
