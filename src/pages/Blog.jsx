import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadPosts, devPosts, fmtDate, profile } from '../lib/data';
import { supabase } from '../lib/supabase';

export function BlogList() {
  const [posts, setPosts] = useState(null);
  useEffect(() => { loadPosts().then(setPosts); }, []);
  return (
    <section className="sec narrow">
      <h2><span className="num">✎</span> Blog</h2>
      <p className="lede">Notes on test automation, DevOps and security. My articles are published on dev.to.</p>
      <div className="stack">
        {devPosts.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="card proj row-card">
            <div><h3>{p.title}</h3><span className="dim mono">{fmtDate(p.date)} · {p.tag}</span></div>
            <span className="pass">Read ↗</span>
          </a>
        ))}
        <a href={profile.devtoUrl} target="_blank" rel="noreferrer" className="dim">All articles on dev.to ↗</a>
      </div>
      {posts?.length > 0 && <h3 style={{ margin: '40px 0 0' }}>More from this site</h3>}
      <div className="stack">
        {posts?.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="card proj">
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="dim">{new Date(p.created_at).toLocaleDateString()}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Tiny safe markdown: headings, fenced code, paragraphs. No raw HTML is ever injected.
function Body({ text }) {
  const out = [];
  const parts = text.split(/```/);
  parts.forEach((chunk, i) => {
    if (i % 2) {
      out.push(<pre key={i}><code>{chunk.replace(/^\w*\n/, '')}</code></pre>);
    } else {
      chunk.split(/\n{2,}/).forEach((blk, j) => {
        const b = blk.trim();
        if (!b) return;
        if (b.startsWith('## ')) out.push(<h3 key={`${i}-${j}`}>{b.slice(3)}</h3>);
        else if (b.startsWith('# ')) out.push(<h2 key={`${i}-${j}`}>{b.slice(2)}</h2>);
        else out.push(<p key={`${i}-${j}`}>{b}</p>);
      });
    }
  });
  return <div className="prose">{out}</div>;
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined);
  useEffect(() => {
    if (!supabase) return setPost(null);
    supabase.from('posts').select('*').eq('slug', slug).maybeSingle().then(({ data }) => setPost(data));
  }, [slug]);
  if (post === undefined) return <section className="sec narrow"><p className="dim">Loading…</p></section>;
  if (!post) return <section className="sec narrow"><p>Post not found. <Link to="/blog">Back to blog</Link></p></section>;
  return (
    <article className="sec narrow">
      <Link to="/blog" className="dim">← All posts</Link>
      <h1 className="post-title">{post.title}</h1>
      <p className="dim mono">{new Date(post.created_at).toLocaleDateString()}</p>
      <Body text={post.body} />
    </article>
  );
}
