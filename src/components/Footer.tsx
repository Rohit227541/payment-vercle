import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { footerColumns } from '../data/content';

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/60 dark:bg-ink-950/60">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="container-px relative py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-[1.4fr_repeat(5,1fr)]"
        >
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="13" rx="3" />
                  <path d="M7 11h6M7 14h4" />
                  <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold text-ink-900 dark:text-white">PayFlow<span className="text-brand-500">.</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-500 dark:text-ink-400">
              Secure payments for modern businesses. Accept cards, UPI, wallets and international payments with one integration.
            </p>
            <div className="mt-5 space-y-2 text-sm text-ink-500 dark:text-ink-400">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-500" /> Prestige Tech Park, Bengaluru, India</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-500" /> hello@payflow.io</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-500" /> +91 80 0000 0000</p>
            </div>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-lg glass text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-300 hover:-translate-y-0.5 transition">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-ink-900 dark:text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-300 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200/60 dark:border-ink-800/60 pt-6 sm:flex-row">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            © {new Date().getFullYear()} PayFlow Gateway Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
