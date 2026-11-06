import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const tabs = ['Overview', 'Messages', 'Projects', 'Posts', 'Rooms'];

export default function Admin() {
  const { user, admin, loading } = useAuth();
  const [tab, setTab] = useState('Overview');
  if (loading) return <section className="sec"><p className="dim">Loading…</p></section>;
  if (!user || !admin) return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  return (
    <section className="sec">
      <h2><span className="num">⚙</span> Admin</h2>
      <div className="tabs">{tabs.map((t) => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === 'Overview' && <Overview />}
      {tab === 'Messages' && <Messages />}
      {tab === 'Projects' && <Projects />}
      {tab === 'Posts' && <Posts />}
      {tab === 'Rooms' && <Rooms />}
    </section>
  );
}

function Overview() {
  const [days, setDays] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    supabase.rpc('views_by_day', { days: 14 }).then(({ data }) => setDays(data || []));
    supabase.rpc('view_count').then(({ data }) => setTotal(Number(data) || 0));
  }, []);
  const max = Math.max(1, ...days.map((d) => Number(d.views)));
  return (
    <div className="card">
      <h4>Visits: {total.toLocaleString()} total</h4>
      <div className="bars">
        {days.map((d) => (
          <div key={d.day} className="bar" title={`${d.day}: ${d.views}`}>
            <i style={{ height: `${(Number(d.views) / max) * 100}%` }} />
            <span>{String(d.day).slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messages() {
  const [rows, setRows] = useState([]);
  const load = useCallback(() => supabase.from('messages').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data || [])), []);
  useEffect(() => { load(); }, [load]);
  return (
    <div className="stack">
      {rows.length === 0 && <p className="dim">No messages yet.</p>}
      {rows.map((m) => (
        <div key={m.id} className={`card ${m.read ? '' : 'unread'}`}>
          <div className="job-head"><h3>{m.subject || '(no subject)'}</h3><span className="dim">{new Date(m.created_at).toLocaleString()}</span></div>
          <p className="mono small">{m.name} · <a href={`mailto:${m.email}`}>{m.email}</a></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{m.body}</p>
          <button className="linkbtn" onClick={async () => { await supabase.from('messages').update({ read: !m.read }).eq('id', m.id); load(); }}>{m.read ? 'Mark unread' : 'Mark read'}</button>
          <button className="linkbtn" onClick={async () => { await supabase.from('messages').delete().eq('id', m.id); load(); }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function Projects() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const load = useCallback(() => supabase.from('projects').select('*').order('sort').then(({ data }) => setRows(data || [])), []);
  useEffect(() => { load(); }, [load]);
  async function add(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from('projects').insert({
      title: f.get('title'), description: f.get('description'),
      tags: String(f.get('tags')).split(',').map((s) => s.trim()).filter(Boolean),
      url: f.get('url') || null, repo: f.get('repo') || null, featured: f.get('featured') === 'on', sort: Number(f.get('sort')) || 0,
    });
    if (error) setErr(error.message); else { setErr(''); e.currentTarget.reset(); load(); }
  }
  return (
    <>
      <form className="card form" onSubmit={add}>
        <h4>Add project</h4>
        <label>Title<input name="title" required /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <div className="row"><label>Tags (comma separated)<input name="tags" /></label><label>Sort order<input name="sort" type="number" defaultValue={0} /></label></div>
        <div className="row"><label>Live URL<input name="url" type="url" /></label><label>Repo URL<input name="repo" type="url" /></label></div>
        <label className="check"><input name="featured" type="checkbox" /> Featured</label>
        {err && <p className="err">{err}</p>}
        <button className="btn">Add</button>
      </form>
      <div className="stack">
        {rows.map((p) => (
          <div key={p.id} className="card row-card"><div><h3>{p.title}</h3><span className="dim mono">{(p.tags || []).join(' · ')}</span></div>
            <button className="linkbtn" onClick={async () => { if (confirm(`Delete "${p.title}"?`)) { await supabase.from('projects').delete().eq('id', p.id); load(); } }}>Delete</button></div>
        ))}
      </div>
    </>
  );
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function Posts() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const load = useCallback(() => supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data || [])), []);
  useEffect(() => { load(); }, [load]);
  async function add(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get('title'));
    const { error } = await supabase.from('posts').insert({
      title, slug: slugify(f.get('slug') || title), excerpt: f.get('excerpt'), body: f.get('body'), published: f.get('published') === 'on',
    });
    if (error) setErr(error.message); else { setErr(''); e.currentTarget.reset(); load(); }
  }
  return (
    <>
      <form className="card form" onSubmit={add}>
        <h4>New post</h4>
        <label>Title<input name="title" required /></label>
        <label>Slug (optional)<input name="slug" /></label>
        <label>Excerpt<input name="excerpt" /></label>
        <label>Body (## headings and ``` code blocks supported)<textarea name="body" rows={10} required /></label>
        <label className="check"><input name="published" type="checkbox" /> Publish now</label>
        {err && <p className="err">{err}</p>}
        <button className="btn">Save post</button>
      </form>
      <div className="stack">
        {rows.map((p) => (
          <div key={p.id} className="card row-card"><div><h3>{p.title}</h3><span className="dim mono">/{p.slug} · {p.published ? 'published' : 'draft'}</span></div>
            <div>
              <button className="linkbtn" onClick={async () => { await supabase.from('posts').update({ published: !p.published, updated_at: new Date().toISOString() }).eq('id', p.id); load(); }}>{p.published ? 'Unpublish' : 'Publish'}</button>
              <button className="linkbtn" onClick={async () => { if (confirm(`Delete "${p.title}"?`)) { await supabase.from('posts').delete().eq('id', p.id); load(); } }}>Delete</button>
            </div></div>
        ))}
      </div>
    </>
  );
}

function Rooms() {
  const [rows, setRows] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const load = useCallback(async () => {
    await supabase.rpc('purge_expired_sessions');
    const { data } = await supabase.rpc('admin_sessions');
    setRows(data || []);
  }, []);
  useEffect(() => { load(); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [load]);
  const left = (r) => Math.max(0, Math.floor((new Date(r.expires_at).getTime() - now) / 1000));
  return (
    <div className="stack">
      <p className="dim">Live code rooms close automatically 50 minutes after creation. You can delete any room immediately.</p>
      {rows === null && <p className="dim">Loading…</p>}
      {rows?.length === 0 && <p className="dim">No active rooms.</p>}
      {rows?.filter((r) => left(r) > 0).map((r) => (
        <div key={r.id} className="card row-card">
          <div>
            <h3>{r.title}</h3>
            <span className="dim mono">{r.language} · {r.owner_email} · {r.members} invited · {String(Math.floor(left(r) / 60)).padStart(2, '0')}:{String(left(r) % 60).padStart(2, '0')} left</span>
          </div>
          <button className="linkbtn" onClick={async () => { if (confirm(`Delete room "${r.title}" now?`)) { await supabase.from('collab_sessions').delete().eq('id', r.id); load(); } }}>Delete</button>
        </div>
      ))}
      <button className="btn ghost small-btn" onClick={load} style={{ justifySelf: 'start' }}>Refresh</button>
    </div>
  );
}
