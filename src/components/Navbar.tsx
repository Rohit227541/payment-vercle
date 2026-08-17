import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { navLinks } from '../data/content';
import Button from './ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-card dark:shadow-card-dark' : 'bg-transparent'
      }`}
    >
      <nav className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 lg:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="3" />
              <path d="M7 11h6M7 14h4" />
              <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-900 dark:text-white">
            PayFlow<span className="text-brand-500">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-1 xl:flex">
          {navLinks.map((l) => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-300'
                      : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right section */}
        <div className="hidden items-center gap-2 xl:flex">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60 transition"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="btn-ghost text-base px-4 py-2">Merchant Login</Link>
          <Button to="/signup" className="text-base px-5 py-2.5">Get Started</Button>
        </div>

        {/* Mobile menu buttons */}
        <div className="flex items-center gap-1 xl:hidden">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60 transition"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800/60 transition"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-200/60 dark:border-ink-800/60 glass xl:hidden"
          >
            <div className="px-4 sm:px-6 py-4">
              <ul className="grid gap-0.5">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium ${
                          isActive ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300' : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800/60'
                        }`
                      }
                    >
                      {l.label}
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-50" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2">
                <Button to="/login" variant="secondary" className="w-full text-base py-3">Merchant Login</Button>
                <Button to="/signup" className="w-full text-base py-3">Create Merchant Account</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}