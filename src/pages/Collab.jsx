import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import * as Y from 'yjs';
import CodeMirror from '@uiw/react-codemirror';
import { LANGS, THEMES } from '../lib/langs';
import { yCollab } from 'y-codemirror.next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { SupabaseProvider } from '../lib/yprovider';

const fmt = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

function useGate() {
  const { user, loading } = useAuth();
  if (loading) return <section className="sec narrow"><p className="dim">Loading…</p></section>;
  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  return null;
}

export function CollabHome() {
  const gate = useGate();
  const { user } = useAuth();
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('javascript');
  const [err, setErr] = useState('');
  const now = useNow(1000);

  const load = useCallback(async () => {
    await supabase.rpc('purge_expired_sessions');
    const { data } = await supabase.from('collab_sessions').select('id,title,language,owner_id,updated_at,expires_at').order('created_at', { ascending: false });
    setRooms(data || []);
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);

  if (gate) return gate;

  async function create(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('collab_sessions')
      .insert({ title: title || 'Untitled session', language: lang, content: LANGS[lang].starter })
      .select('id')
      .single();
    if (error) return setErr(error.message);
    nav(`/collab/${data.id}`);
  }

  return (
    <section className="sec narrow">
      <h2><span className="num">{'</>'}</span> Live code rooms</h2>
      <p className="lede">Start a room, invite people by email, and code together in real time. Everyone needs an account. Rooms are temporary and close automatically after 50 minutes.</p>
      <form className="card form inline" onSubmit={create}>
        <input placeholder="Room name" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button className="btn">Create room</button>
      </form>
      {err && <p className="err">{err}</p>}
      <div className="stack">
        {rooms.length === 0 && <p className="dim">No rooms yet. Create one, or ask a friend to invite {user.email}.</p>}
        {rooms.filter((r) => new Date(r.expires_at).getTime() > now).map((r) => (
          <Link key={r.id} to={`/collab/${r.id}`} className="card proj row-card">
            <div><h3>{r.title}</h3><span className="dim mono">{LANGS[r.language]?.label || r.language} · {r.owner_id === user.id ? 'owner' : 'invited'}</span></div>
            <span className="chip live">⏱ {fmt(new Date(r.expires_at).getTime() - now)} left</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function runJs(code, onLine) {
  const frame = document.createElement('iframe');
  frame.sandbox = 'allow-scripts';
  frame.style.display = 'none';
  const handler = (e) => {
    if (e.source !== frame.contentWindow) return;
    onLine(e.data);
    if (e.data.done) {
      window.removeEventListener('message', handler);
      frame.remove();
    }
  };
  window.addEventListener('message', handler);
  const safe = JSON.stringify(code).replace(/</g, '\\u003c');
  frame.srcdoc = `<script>
    const send=(t,m)=>parent.postMessage({t,m},'*');
    const fmt=a=>a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ');
    console.log=(...a)=>send('log',fmt(a)); console.error=(...a)=>send('err',fmt(a));
    const t=setTimeout(()=>{send('err','Timed out after 5s');parent.postMessage({done:true},'*')},5000);
    Promise.resolve().then(()=>(0,eval)(${safe})).catch(e=>send('err',String(e))).finally(()=>{clearTimeout(t);setTimeout(()=>parent.postMessage({done:true},'*'),50)});
  <\/script>`;
  document.body.appendChild(frame);
}

export function CollabRoom() {
  const gate = useGate();
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(undefined);
  const [members, setMembers] = useState([]);
  const [invite, setInvite] = useState('');
  const [status, setStatus] = useState({ peers: 1 });
  const [ext, setExt] = useState([]);
  const [out, setOut] = useState([]);
  const [lang, setLang] = useState(null);
  const [themeKey, setThemeKey] = useState(() => { try { return localStorage.getItem('editor-theme') || 'one-dark'; } catch { return 'one-dark'; } });
  const doc = useMemo(() => new Y.Doc(), [id]);
  const providerRef = useRef(null);
  const now = useNow(1000);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from('collab_sessions').select('*').eq('id', id).maybeSingle().then(({ data }) => { setRoom(data); if (data) setLang(data.language); });
    supabase.from('collab_members').select('email').eq('session_id', id).then(({ data }) => setMembers(data || []));
  }, [id, user]);

  useEffect(() => {
    if (!room || !user || new Date(room.expires_at).getTime() <= Date.now()) return;
    const provider = new SupabaseProvider(id, doc, user, room.content, (s) => setStatus((p) => ({ ...p, ...s })));
    providerRef.current = provider;
    const ytext = doc.getText('code');
    const name = user.email.split('@')[0];
    const hue = [...user.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    provider.awareness.setLocalStateField('user', { name, color: `hsl(${hue} 90% 60%)`, colorLight: `hsl(${hue} 90% 60% / .25)` });
    setExt([yCollab(ytext, provider.awareness)]);

    let timer;
    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        supabase.from('collab_sessions').update({ content: ytext.toString(), updated_at: new Date().toISOString() }).eq('id', id);
      }, 2000);
    };
    ytext.observe(save);
    return () => {
      clearTimeout(timer);
      ytext.unobserve(save);
      provider.destroy();
    };
  }, [room?.id, user?.id, doc]);

  if (gate) return gate;
  if (room === undefined) return <section className="sec narrow"><p className="dim">Loading…</p></section>;
  if (!room) return <section className="sec narrow"><p>Room not found, or you have not been invited. <Link to="/collab">Back</Link></p></section>;

  const owner = room.owner_id === user.id;
  const left = new Date(room.expires_at).getTime() - now;
  const ended = left <= 0;
  const L = LANGS[lang || room.language] || LANGS.javascript;
  const langExt = L.ext();
  const pickTheme = (k) => { setThemeKey(k); try { localStorage.setItem('editor-theme', k); } catch { /* ignore */ } };

  async function addMember(e) {
    e.preventDefault();
    const email = invite.trim().toLowerCase();
    if (!email) return;
    const { error } = await supabase.from('collab_members').insert({ session_id: id, email });
    if (!error) { setMembers((m) => [...m, { email }]); setInvite(''); }
  }
  async function removeMember(email) {
    await supabase.from('collab_members').delete().eq('session_id', id).eq('email', email);
    setMembers((m) => m.filter((x) => x.email !== email));
  }
  async function endSession() {
    if (!confirm('End this session for everyone and delete it?')) return;
    await supabase.from('collab_sessions').delete().eq('id', id);
    nav('/collab');
  }
  function run() {
    setOut([]);
    runJs(doc.getText('code').toString(), (m) => m.t && setOut((o) => [...o, m]));
  }

  return (
    <section className="room">
      <div className="room-head">
        <div>
          <Link to="/collab" className="dim">← Rooms</Link>
          <h2>{room.title}</h2>
        </div>
        <div className="room-meta">
          <span className={`chip ${left < 5 * 60000 ? 'warn' : 'live'}`} title="Rooms close automatically 50 minutes after creation">⏱ {fmt(left)} left</span>
          <span className="chip live">● {status.peers || 1} online</span>
          {owner && <button className="btn ghost small-btn" onClick={endSession}>End session</button>}
          <span className="chip">{status.status === 'SUBSCRIBED' ? 'connected' : status.status || 'connecting…'}</span>
          <select className="mini" value={lang || room.language} onChange={(e) => setLang(e.target.value)} aria-label="Language">
            {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="mini" value={themeKey} onChange={(e) => pickTheme(e.target.value)} aria-label="Editor theme">
            {Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {L.runnable && <button className="btn" onClick={run}>▶ Run</button>}
        </div>
      </div>
      {!ended && left < 5 * 60000 && <p className="err">This room closes in {fmt(left)}. Copy your code now.</p>}
      {ended && (
        <div className="ended card">
          <h3>Session ended</h3>
          <p className="dim">Rooms last 50 minutes and then close. Create a new one to keep coding.</p>
          <Link to="/collab" className="btn">Back to rooms</Link>
        </div>
      )}
      <div className="room-body" style={ended ? { opacity: 0.35, pointerEvents: 'none' } : undefined}>
        <div className="editor">
          {ext.length > 0 && <CodeMirror height="100%" theme={THEMES[themeKey].theme} extensions={[langExt, ...ext]} basicSetup={{ history: false }} />}
        </div>
        <aside className="side">
          <h4>People</h4>
          <p className="mono small">{room.owner_id === user.id ? 'You (owner)' : 'Owner'}</p>
          {members.map((m) => (
            <p key={m.email} className="mono small member">{m.email}{owner && <button className="linkbtn" onClick={() => removeMember(m.email)}>remove</button>}</p>
          ))}
          {owner && (
            <form onSubmit={addMember} className="invite">
              <input type="email" placeholder="invite by email" value={invite} onChange={(e) => setInvite(e.target.value)} />
              <button className="btn small-btn">Invite</button>
            </form>
          )}
          <p className="dim small">Invited people must sign in with that exact email to join.</p>
          <h4>Output</h4>
          <pre className="out">{out.length === 0 ? <span className="dim">Output appears here for JavaScript. Other languages are edit-only.</span> : out.map((o, i) => <div key={i} className={o.t === 'err' ? 'err' : ''}>{o.m}</div>)}</pre>
        </aside>
      </div>
    </section>
  );
}
