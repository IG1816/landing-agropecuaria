import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useIsAdmin() {
  const { user, configured } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    if (!configured || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    setIsAdmin(!error && !!data);
    setLoading(false);
  }, [user, configured]);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    const onConfig = () => check();
    window.addEventListener('supabase-config-changed', onConfig);
    return () => window.removeEventListener('supabase-config-changed', onConfig);
  }, [check]);

  return { isAdmin, loading, refetch: check };
}
