import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const perks = [
  ['</>', 'Live code rooms', 'Code in the same editor, at the same time, with live cursors.'],
  ['✉', 'Invite by email', 'Only people you invite can enter your room.'],
  ['⌨', 'Your language, your theme', 'JavaScript, TypeScript, Python, Java, SQL and more.'],
];

export default function Login() {
  const { user } = useAuth();
  const loc = useLocation();
  const [mode, setMode] = useState('in'); // in | up | forgot | reset
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('reset');
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (user && mode !== 'reset') return <Navigate to={loc.state?.from || '/collab'} replace />;

  const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const say = (type, text) => setMsg({ type, text });
  const switchTo = (m) => { setMode(m); setMsg({ type: '', text: '' }); setShow(false); };

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    const password = String(f.get('password') || '');
    setBusy(true);
    say('', '');
    let error;
    if (mode === 'in') ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    else if (mode === 'up') {
      const res = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${base}login` } });
      error = res.error;
      if (!error && !res.data.session) say('ok', 'Account created. Check your inbox to confirm your email, then sign in.');
    } else if (mode === 'forgot') {
      ({ error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${base}login` }));
      if (!error) say('ok', 'If that email has an account, a reset link is on its way.');
    } else if (mode === 'reset') {
      ({ error } = await supabase.auth.updateUser({ password }));
      if (!error) { say('ok', 'Password updated. You are signed in.'); setTimeout(() => switchTo('in'), 800); }
    }
    setBusy(false);
    if (error) say('err', error.message);
  }

  const titles = { in: 'Welcome back', up: 'Create your account', forgot: 'Reset your password', reset: 'Choose a new password' };
  const cta = { in: 'Sign in', up: 'Create account', forgot: 'Send reset link', reset: 'Update password' };

  return (
    <section className="auth">
      <aside className="auth-side">
        <p className="eyebrow"><span className="dot" /> Members area</p>
        <h1>Code together, <span className="grad">live.</span></h1>
        <p className="lede">Create a free account to open or join collaborative coding rooms on this site.</p>
        <ul className="perks">
          {perks.map(([icon, t, d]) => (
            <li key={t}><span className="perk-icon">{icon}</span><div><b>{t}</b><span>{d}</span></div></li>
          ))}
        </ul>
        <Link to="/" className="dim">← Back to portfolio</Link>
      </aside>

      <div className="auth-card card">
        {(mode === 'in' || mode === 'up') && (
          <div className="seg" role="tablist">
            <button role="tab" aria-selected={mode === 'in'} className={mode === 'in' ? 'on' : ''} onClick={() => switchTo('in')}>Sign in</button>
            <button role="tab" aria-selected={mode === 'up'} className={mode === 'up' ? 'on' : ''} onClick={() => switchTo('up')}>Sign up</button>
          </div>
        )}
        <h2>{titles[mode]}</h2>
        {mode === 'forgot' && <p className="dim">Enter your email and we will send a link to set a new password.</p>}

        <form className="form" onSubmit={submit}>
          {mode !== 'reset' && (
            <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          )}
          {mode !== 'forgot' && (
            <label>
              {mode === 'reset' ? 'New password' : 'Password'}
              <span className="pw">
                <input name="password" type={show ? 'text' : 'password'} required minLength={8} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" />
                <button type="button" className="linkbtn" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
              </span>
            </label>
          )}
          {msg.text && <p className={msg.type === 'ok' ? 'pass' : 'err'} role="status">{msg.text}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Please wait…' : cta[mode]}</button>
        </form>

        <div className="auth-links">
          {mode === 'in' && <button className="linkbtn" onClick={() => switchTo('forgot')}>Forgot password?</button>}
          {mode === 'forgot' && <button className="linkbtn" onClick={() => switchTo('in')}>← Back to sign in</button>}
        </div>
      </div>
    </section>
  );
}
