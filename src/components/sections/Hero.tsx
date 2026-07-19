import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

const floatingCards = [
  { label: 'UPI', top: '8%', left: '4%', delay: 0, color: 'from-violet-500 to-fuchsia-500' },
  { label: 'Visa', top: '14%', right: '6%', delay: 0.6, color: 'from-blue-600 to-indigo-600' },
  { label: 'MasterCard', top: '46%', left: '0%', delay: 1.2, color: 'from-orange-500 to-red-500' },
  { label: 'RuPay', top: '52%', right: '2%', delay: 0.3, color: 'from-emerald-500 to-teal-500' },
  { label: 'Wallet', bottom: '8%', left: '12%', delay: 0.9, color: 'from-amber-500 to-orange-500' },
  { label: 'Bank Transfer', bottom: '6%', right: '14%', delay: 1.5, color: 'from-cyan-500 to-blue-500' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-light bg-[size:44px_44px] opacity-60 dark:bg-grid-dark" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-1/4 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="container-px grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-5">
            <ShieldCheck className="h-3.5 w-3.5" /> PCI DSS Level 1 · 99.99% Uptime
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl">
            Accept Payments Online with{' '}
            <span className="gradient-text">Enterprise-Level Security</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-500 dark:text-ink-300">
            Accept Credit Cards, UPI, Net Banking, Wallets and International Payments with our secure Payment Gateway — built for modern businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/signup" withArrow>Start Accepting Payments</Button>
            <Button to="/developers" variant="outline">
              <BookOpen className="h-4 w-4" /> View Documentation
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500 dark:text-ink-400">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No setup fee</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Live in minutes</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 150+ countries</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          <div className="relative">
            {floatingCards.map((c) => (
              <motion.div
                key={c.label}
                className={`absolute z-20 flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs font-semibold shadow-card dark:shadow-card-dark ${c.color}`}
                style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5 + c.delay, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
              >
                <span className="h-2 w-2 rounded-full bg-white/90" />
                <span className="text-white">{c.label}</span>
              </motion.div>
            ))}

            <div className="glass-card relative z-10 overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Today's revenue</p>
                  <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">₹4,82,940</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" /> +18.2%
                </span>
              </div>

              <div className="mt-5 flex h-32 items-end gap-2">
                {[40, 65, 50, 80, 60, 95, 70, 88, 55, 78, 92, 68].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-accent-400"
                  />
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { l: 'Success rate', v: '99.2%' },
                  { l: 'Transactions', v: '1,284' },
                  { l: 'Refunds', v: '12' },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-ink-50 dark:bg-ink-900/60 p-3">
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">{s.l}</p>
                    <p className="font-display text-sm font-bold text-ink-900 dark:text-white">{s.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { name: 'UPI · Aarav M.', amt: '₹2,499', status: 'Captured' },
                  { name: 'Card · Sara W.', amt: '₹8,990', status: 'Captured' },
                  { name: 'Net Banking · Rohan K.', amt: '₹1,299', status: 'Pending' },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between rounded-xl bg-ink-50 dark:bg-ink-900/60 px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-ink-800 dark:text-ink-100">{t.name}</p>
                      <p className="text-[11px] text-ink-500 dark:text-ink-400">{t.status}</p>
                    </div>
                    <span className="font-display text-sm font-bold text-ink-900 dark:text-white">{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand-500/20 via-transparent to-accent-500/20 blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
