import { useEffect, useMemo, useRef, useState } from 'react';
import { sheets, totalCommands } from '../lib/cheatsheets';

function Row({ desc, cmd }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); } catch { /* clipboard unavailable */ }
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };
  return (
    <div className="cs-row">
      <div className="cs-desc">{desc}</div>
      <div className="cs-code">
        <pre><code>{cmd}</code></pre>
        <button onClick={copy} aria-label={`Copy: ${desc}`}>{done ? '✓ Copied' : 'Copy'}</button>
      </div>
    </div>
  );
}

export default function Cheatsheets() {
  const [active, setActive] = useState(sheets[0].id);
  const [q, setQ] = useState('');
  const search = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); search.current?.focus(); }
      if (e.key === 'Escape') { setQ(''); search.current?.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return null;
    return sheets
      .map((s) => ({
        ...s,
        groups: s.groups
          .map((g) => ({ ...g, items: g.items.filter(([d, c]) => (d + ' ' + c + ' ' + s.title + ' ' + g.name).toLowerCase().includes(term)) }))
          .filter((g) => g.items.length),
      }))
      .filter((s) => s.groups.length);
  }, [term]);

  const sheet = sheets.find((s) => s.id === active);
  const shown = results ?? [sheet];
  const hits = results ? results.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0) : 0;
  const count = (s) => s.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="cs">
      <header className="cs-head">
        <h1>Developer reference</h1>
        <p className="lede">{totalCommands} commands across the tools I use every day. Click Copy on any row.</p>
        <div className="cs-search">
          <input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search commands, e.g. intercept, rebase, helm…" aria-label="Search commands" />
          <kbd>/</kbd>
        </div>
      </header>

      <div className="cs-layout">
        <nav className="cs-nav" aria-label="Technologies">
          {sheets.map((s) => (
            <button key={s.id} className={!results && s.id === active ? 'on' : ''} onClick={() => { setQ(''); setActive(s.id); }}>
              <span>{s.title}</span><em>{count(s)}</em>
            </button>
          ))}
        </nav>

        <div className="cs-main">
          {results && <p className="dim">{hits} result{hits === 1 ? '' : 's'} for “{q}”</p>}
          {results && results.length === 0 && <p className="dim">Nothing matches. Try a shorter word.</p>}
          {shown.map((s) => (
            <div key={s.id} className="cs-sheet">
              <div className="cs-title"><h2>{s.title}</h2><span className="dim">{s.blurb}</span></div>
              {s.groups.map((g) => (
                <div key={g.name} className="cs-group">
                  <h3>{g.name}</h3>
                  {g.items.map(([d, c]) => <Row key={d + c} desc={d} cmd={c} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
