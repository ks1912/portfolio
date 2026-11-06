import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase, backendReady } from '../lib/supabase';

export default function Nav() {
  const { user, admin } = useAuth();
  return (
    <header className="nav">
      <Link to="/" className="logo"><span className="pass">✓</span> kunal<span className="dim">.tech</span></Link>
      <nav>
        <a href={`${import.meta.env.BASE_URL}#experience`}>Experience</a>
        <a href={`${import.meta.env.BASE_URL}#projects`}>Projects</a>
        <NavLink to="/cheatsheets">Cheatsheets</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {backendReady && <NavLink to="/collab" className="pill">Live code</NavLink>}
        {admin && <NavLink to="/admin">Admin</NavLink>}
        {backendReady &&
          (user ? (
            <button className="linkbtn" onClick={() => supabase.auth.signOut()}>Sign out</button>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          ))}
      </nav>
    </header>
  );
}
