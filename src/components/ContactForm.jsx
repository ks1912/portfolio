import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { profile } from '../lib/data';

export default function ContactForm() {
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('website')) return; // honeypot
    if (!supabase) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(f.get('subject') || 'Hello')}&body=${encodeURIComponent(f.get('body'))}`;
      return;
    }
    setState('sending');
    const { error } = await supabase.from('messages').insert({
      name: f.get('name'),
      email: f.get('email'),
      subject: f.get('subject') || null,
      body: f.get('body'),
    });
    if (error) {
      setErr(error.message);
      setState('error');
    } else {
      setState('sent');
      e.currentTarget.reset();
    }
  }

  if (state === 'sent')
    return (
      <div className="card sent">
        <b className="pass">✓ Message delivered.</b>
        <p>Thanks for reaching out. I will reply to the email you gave.</p>
        <button className="btn ghost" onClick={() => setState('idle')}>Send another</button>
      </div>
    );

  return (
    <form className="card form" onSubmit={submit}>
      <div className="row">
        <label>Name<input name="name" required maxLength={120} autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      <label>Subject<input name="subject" maxLength={200} /></label>
      <label>Message<textarea name="body" required rows={6} maxLength={5000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {state === 'error' && <p className="err">Could not send: {err}</p>}
      <button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message →'}</button>
    </form>
  );
}
