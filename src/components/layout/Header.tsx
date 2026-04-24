import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import Brand from '../common/Brand';
import { useAuth } from '../../app/providers/AuthProvider';
import { ProfileDropdown } from '../../features/auth/modal/ProfileDropdown';
import { useModal } from '../../features/auth/context/AuthContext';

export type HeaderVariant = 'landing' | 'auth';

interface HeaderProps {
  variant?: HeaderVariant;
  /** Accepted but unused – kept for AppLayout compatibility */
  isSidebarOpen?: boolean;
}

const Header = ({ variant = 'landing' }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  const { isAuthenticated, user } = useAuth();
  const { openSignIn, openSelectRole } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Handle logo / brand click based on auth + role
  const handleLogoClick = () => {
    if (isAuthenticated) {
      const role = user?.role?.toLowerCase();
      if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'parent') navigate('/parent/dashboard');
      else navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="site-header">
      <div className="wrap">
        {/* Brand – clickable, routes based on auth state */}
        <span
          onClick={handleLogoClick}
          style={{ cursor: 'pointer', display: 'contents' }}
        >
          <Brand />
        </span>

        {/* Hamburger toggle (mobile only, hidden on desktop via CSS) */}
        <button
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={toggle}
        >
          <span />
          <span />
          <span />
        </button>

        {/* ── Unauthenticated nav ────────────────────────────── */}
        {!isAuthenticated && (
          <nav className={`nav${open ? ' open' : ''}`} aria-label="Primary">
            {variant === 'landing' ? (
              <>
                <a href="#personas" onClick={() => setOpen(false)}>
                  Who it's for
                </a>
                <a href="#how" onClick={() => setOpen(false)}>
                  How it works
                </a>
                <a href="#proof" onClick={() => setOpen(false)}>
                  Success stories
                </a>
                <a href="#pricing" onClick={() => setOpen(false)}>
                  Pricing
                </a>
                <Link to="/blogs" onClick={() => setOpen(false)}
                   className="btn btn-ghost">
                  Blog
                </Link>
                <button 
                  onClick={() => { setOpen(false); openSignIn(); }} 
                  className="btn btn-ghost"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => { setOpen(false); openSelectRole(); }} 
                  className="btn btn-primary cta"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                <Link to="/#personas">Who it's for</Link>
                <Link to="/#faq">FAQ</Link>
                <Link to="/#pricing">Pricing</Link>
                <Link to="/blogs">Blog</Link>
                <button 
                  onClick={() => { setOpen(false); openSignIn(); }} 
                  className="btn btn-ghost"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => { setOpen(false); openSelectRole(); }} 
                  className="btn btn-primary cta"
                >
                  Create account
                </button>
              </>
            )}
          </nav>
        )}

        {/* ── Authenticated nav ──────────────────────────────── */}
        {isAuthenticated && (
          <nav className={`nav${open ? ' open' : ''}`} aria-label="Primary">
            {/* Mobile menu links */}
            <Link to="/blogs" onClick={() => setOpen(false)}
               className="btn btn-ghost">
              Blog
            </Link>

            {/* User icon + profile dropdown (desktop) */}
            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((v) => !v);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Profile menu"
                title={user?.name || 'Profile'}
              >
                <UserCircle size={30} color="var(--indigo)" />
              </button>

              <ProfileDropdown
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
              />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;