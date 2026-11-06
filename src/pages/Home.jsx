import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TestRun from '../components/TestRun';
import ContactForm from '../components/ContactForm';
import { profile, stats, experience, education, skills, loadProjects, loadPosts, fallbackProjects } from '../lib/data';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [posts, setPosts] = useState([]);
  const [views, setViews] = useState(null);

  useEffect(() => {
    loadProjects().then(setProjects);
    loadPosts().then((p) => setPosts(p.slice(0, 3)));
    supabase?.rpc('view_count').then(({ data }) => typeof data === 'number' || typeof data === 'string' ? setViews(Number(data)) : null);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" /> Available for senior QA and SDET roles</p>
          <h1>
            I make software<br />
            <span className="grad">impossible to break</span><br />
            quietly.
          </h1>
          <p className="lede">{profile.about}</p>
          <div className="cta">
            <a className="btn" href="#projects">See my work</a>
            <Link className="btn ghost" to="/contact">Get in touch</Link>
          </div>
          <ul className="stats">
            {stats.map((s) => (
              <li key={s.label}><b>{s.n}</b><span>{s.label}</span></li>
            ))}
          </ul>
        </div>
        <TestRun />
      </section>

      <section id="experience" className="sec">
        <Reveal><h2><span className="num">01</span> Experience</h2></Reveal>
        <div className="timeline">
          {experience.map((x, i) => (
            <Reveal key={x.company} delay={i * 80} className="job">
              <div className="job-head">
                <h3>{x.company}</h3>
                <span className="period">{x.period}</span>
              </div>
              <p className="role">{x.role} <span className="dim">· {x.meta}</span></p>
              <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skills" className="sec">
        <Reveal><h2><span className="num">02</span> Toolbox</h2></Reveal>
        <div className="skills">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 60} className="card">
              <h4>{g.group}</h4>
              <div className="chips">{g.items.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="projects" className="sec">
        <Reveal><h2><span className="num">03</span> Selected work</h2></Reveal>
        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 70} className={`card proj ${p.featured ? 'feat' : ''}`}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="chips">{(p.tags || []).map((t) => <span key={t} className="chip">{t}</span>)}</div>
              <div className="links">
                {p.url && <a href={p.url} target="_blank" rel="noreferrer">Live ↗</a>}
                {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Code ↗</a>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="education" className="sec">
        <Reveal><h2><span className="num">04</span> Education</h2></Reveal>
        {education.map((e) => (
          <Reveal key={e.degree} className="card">
            <div className="job-head"><h3>{e.degree}</h3><span className="period">{e.period}</span></div>
            <p className="role">{e.school}</p>
          </Reveal>
        ))}
      </section>

      {posts.length > 0 && (
        <section className="sec">
          <Reveal><h2><span className="num">05</span> Writing</h2></Reveal>
          <div className="projects">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card proj">
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="dim">{new Date(p.created_at).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="sec">
        <Reveal><h2><span className="num">06</span> Let's talk</h2></Reveal>
        <div className="contact-grid">
          <Reveal>
            <p className="lede">Hiring, collaborating, or want to pair on a tricky test problem? Send a note, or open a live coding room and we can write it together.</p>
            <p className="mono">{profile.email}<br />{profile.location}<br /><a href={profile.githubUrl} target="_blank" rel="noreferrer">github.com/{profile.github} ↗</a></p>
          </Reveal>
          <Reveal delay={100}><ContactForm /></Reveal>
        </div>
      </section>

      <footer className="foot">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        {views !== null && <span className="mono dim">{views.toLocaleString()} visits</span>}
      </footer>
    </>
  );
}
