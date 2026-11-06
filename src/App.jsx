import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { trackView } from './lib/data';
import Nav from './components/Nav';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
const Admin = lazy(() => import('./pages/Admin'));
import { BlogList, BlogPost } from './pages/Blog';
const CollabHome = lazy(() => import('./pages/Collab').then((m) => ({ default: m.CollabHome })));
const CollabRoom = lazy(() => import('./pages/Collab').then((m) => ({ default: m.CollabRoom })));
import { backendReady } from './lib/supabase';

function Tracker() {
  const { pathname } = useLocation();
  useEffect(() => { trackView(pathname); }, [pathname]);
  return null;
}

function NeedsBackend({ children }) {
  return backendReady ? children : <section className="sec narrow"><p className="dim">This feature needs the backend connection.</p></section>;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Tracker />
        <div className="glow" aria-hidden="true" />
        <Nav />
        <main>
          <Suspense fallback={<section className="sec narrow"><p className="dim">Loading…</p></section>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<NeedsBackend><Login /></NeedsBackend>} />
            <Route path="/admin" element={<NeedsBackend><Admin /></NeedsBackend>} />
            <Route path="/collab" element={<NeedsBackend><CollabHome /></NeedsBackend>} />
            <Route path="/collab/:id" element={<NeedsBackend><CollabRoom /></NeedsBackend>} />
            <Route path="*" element={<section className="sec narrow"><h2>404</h2><p>Test not found.</p></section>} />
          </Routes>
          </Suspense>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
