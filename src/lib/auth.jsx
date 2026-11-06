import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const Ctx = createContext({ user: null, admin: false, loading: false });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user) return setAdmin(false);
    supabase.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)));
  }, [user]);

  return <Ctx.Provider value={{ user, admin, loading }}>{children}</Ctx.Provider>;
}
