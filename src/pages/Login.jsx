import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { user } = useAuth();
  const loc = useLocation();
  const [mode, setMode] = useState('in');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={loc.state?.from || '/collab'} replace />;

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg('');
    const creds = { email: f.get('email'), password: f.get('password') };
    const { data, error } =
      mode === 'in'
        ? await supabase.auth.signInWithPassword(creds)
        : await supabase.auth.signUp({ ...creds, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === 'up' && !data.session) setMsg('Check your inbox to confirm your email, then sign in.');
  }

  return (
    <section className="sec narrow">
      <h2><span className="num">⚿</span> {mode === 'in' ? 'Sign in' : 'Create account'}</h2>
      <p className="dim">An account is needed to open or join live coding rooms.</p>
      <form className="card form" onSubmit={submit}>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required minLength={8} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
        {msg && <p className="err">{msg}</p>}
        <button className="btn" disabled={busy}>{busy ? '…' : mode === 'in' ? 'Sign in' : 'Sign up'}</button>
        <button type="button" className="linkbtn" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg(''); }}>
          {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
      </form>
    </section>
  );
}
