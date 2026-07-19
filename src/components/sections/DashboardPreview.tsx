import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, RefreshCw, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const txns = [
  { name: 'Aarav Mehta', method: 'UPI', amt: '₹2,499', status: 'Captured', icon: ArrowUpRight },
  { name: 'Sara Williams', method: 'Visa', amt: '₹8,990', status: 'Captured', icon: ArrowUpRight },
  { name: 'Rohan Kapoor', method: 'Net Banking', amt: '₹1,299', status: 'Pending', icon: RefreshCw },
  { name: 'Lena Fischer', method: 'MasterCard', amt: '₹5,499', status: 'Captured', icon: ArrowUpRight },
  { name: 'David Chen', method: 'Wallet', amt: '₹649', status: 'Refunded', icon: ArrowDownRight },
];

export default function DashboardPreview() {
  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="Merchant Dashboard"
          title={<>A dashboard you'll <span className="gradient-text">actually love</span></>}
          subtitle="Real-time revenue, transactions, settlements and analytics — all in one place."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 glass-card overflow-hidden p-5 sm:p-7"
        >
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl bg-ink-50 dark:bg-ink-900/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">Total Revenue</p>
                  <p className="font-display text-3xl font-bold text-ink-900 dark:text-white">₹48,29,400</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" /> +18.2%
                </span>
              </div>
              <div className="mt-6 flex h-44 items-end gap-2">
                {[40, 65, 50, 80, 60, 95, 70, 88, 55, 78, 92, 68, 84, 72, 96, 60, 82, 90, 74, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: 'easeOut' }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-accent-400"
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-xs text-ink-400 dark:text-ink-500">
                <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { l: "Today's Payments", v: '₹4,82,940', icon: Wallet, c: 'from-brand-500 to-brand-600' },
                { l: 'Settlement', v: '₹3,98,210', icon: CheckCircle2, c: 'from-emerald-500 to-teal-500' },
                { l: 'Success Rate', v: '99.2%', icon: TrendingUp, c: 'from-accent-500 to-cyan-500' },
                { l: 'Refunds', v: '₹12,480', icon: RefreshCw, c: 'from-amber-500 to-orange-500' },
              ].map((s) => (
                <div key={s.l} className="flex items-center gap-4 rounded-2xl bg-ink-50 dark:bg-ink-900/60 p-4">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${s.c} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{s.l}</p>
                    <p className="font-display text-lg font-bold text-ink-900 dark:text-white">{s.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-ink-50 dark:bg-ink-900/60 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-semibold text-ink-900 dark:text-white">Recent Transactions</h4>
              <span className="text-xs text-ink-500 dark:text-ink-400">Payment Analytics</span>
            </div>
            <div className="mt-4 space-y-2">
              {txns.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-xl bg-white dark:bg-ink-950/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{t.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      t.status === 'Captured' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : t.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>{t.status}</span>
                    <span className="font-display text-sm font-bold text-ink-900 dark:text-white">{t.amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
