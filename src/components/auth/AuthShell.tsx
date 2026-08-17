import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUpRight, CheckCircle2, CreditCard, Sparkles, Activity } from 'lucide-react';
import type { ReactNode } from 'react';

// Floating transaction bubbles data for the premium side panel animation
const mockTransactions = [
  { id: 1, name: 'Aarav Mehta', method: 'UPI', amount: '₹2,499', delay: 0 },
  { id: 2, name: 'Sara Williams', method: 'Visa', amount: '₹8,990', delay: 1.5 },
  { id: 3, name: 'Priya Nair', method: 'RuPay', amount: '₹3,200', delay: 3 },
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 dark:border-ink-800/80 bg-white/60 dark:bg-ink-950/40 backdrop-blur-3xl shadow-card dark:shadow-card-dark lg:grid-cols-12">
      {/* Visual Fintech Left Branding Panel */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-10 text-white lg:flex lg:col-span-5 overflow-hidden">
        {/* Animated Grid & Glow Backgrounds */}
        <div className="pointer-events-none absolute inset-0 bg-grid-dark bg-[size:30px_30px] opacity-15" />
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-2.5 shrink-0 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur border border-white/20 shadow-glow transition group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="3" />
              <path d="M7 11h6M7 14h4" />
              <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            PayFlow<span className="text-accent-300">.</span>
          </span>
        </Link>

        {/* Animated Visual Simulator Container */}
        <div className="relative my-8 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-white/10 border border-white/20 rounded-full px-2.5 py-0.5">
              <Sparkles className="h-3 w-3 text-accent-300 animate-pulse" /> Sandbox Active
            </span>
            <h3 className="font-display text-2xl font-bold leading-tight">
              Enterprise-grade payments simplified.
            </h3>
          </div>

          {/* Premium Floating Balance Card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-card space-y-3">
            <div className="flex justify-between items-center text-xs text-white/70">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-accent-300" /> Active Settlement</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                99.98% Success
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Settled Volume (Today)</p>
              <p className="text-xl font-bold font-display tracking-tight mt-0.5">₹14,82,940.50</p>
            </div>
            <div className="h-[2px] bg-white/10 rounded" />
            <div className="flex justify-between text-[11px] text-white/70">
              <span>Next settlement: T+15m</span>
              <span className="flex items-center text-accent-300">Payouts <ArrowUpRight className="h-3 w-3 ml-0.5" /></span>
            </div>
          </div>

          {/* Animated Transactions Feed */}
          <div className="space-y-2.5 relative">
            {mockTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: tx.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 5,
                }}
                className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-accent-500/20 text-accent-300 flex items-center justify-center font-bold">
                    {tx.method[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{tx.name}</p>
                    <p className="text-[9px] text-white/40">{tx.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{tx.amount}</p>
                  <p className="text-[9px] text-emerald-400 flex items-center justify-end gap-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Captured
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative space-y-3">
          <ul className="space-y-2 text-xs text-white/80">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-300" /> PCI DSS Level 1 Certified
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent-300" /> RuPay, Visa, UPI split ready
            </li>
          </ul>
          <p className="text-[10px] text-white/40">© {new Date().getFullYear()} PayFlow Gateway Inc.</p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
