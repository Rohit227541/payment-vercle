import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, Repeat, Wallet, RefreshCw, FileText, Settings, LogOut,
  TrendingUp, ArrowUpRight, ArrowDownRight, Search, Bell, Menu, X, CheckCircle2, Globe,
} from 'lucide-react';

const nav = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: CreditCard, label: 'Payments' },
  { icon: Repeat, label: 'Subscriptions' },
  { icon: Wallet, label: 'Payouts' },
  { icon: RefreshCw, label: 'Refunds' },
  { icon: FileText, label: 'Invoices' },
  { icon: Settings, label: 'Settings' },
];

const txns = [
  { id: 'pay_M3kq9X', name: 'Aarav Mehta', email: 'aarav@shopkart.in', method: 'UPI', amount: '₹2,499', status: 'Captured', date: '07 Jul, 10:24' },
  { id: 'pay_M3kp2L', name: 'Sara Williams', email: 'sara@saasify.co', method: 'Visa', amount: '₹8,990', status: 'Captured', date: '07 Jul, 09:51' },
  { id: 'pay_M3kn8P', name: 'Rohan Kapoor', email: 'rohan@edupay.com', method: 'Net Banking', amount: '₹1,299', status: 'Pending', date: '07 Jul, 09:12' },
  { id: 'pay_M3kl4R', name: 'Lena Fischer', email: 'lena@globemart.de', method: 'MasterCard', amount: '₹5,499', status: 'Captured', date: '06 Jul, 18:40' },
  { id: 'pay_M3kj1T', name: 'David Chen', email: 'david@quickship.io', method: 'Wallet', amount: '₹649', status: 'Refunded', date: '06 Jul, 16:22' },
  { id: 'pay_M3kh7V', name: 'Priya Nair', email: 'priya@healthbridge.in', method: 'RuPay', amount: '₹3,200', status: 'Captured', date: '06 Jul, 14:08' },
  { id: 'pay_M3kg3W', name: 'Marcus Lee', email: 'marcus@novapay.com', method: 'Amex', amount: '₹12,499', status: 'Captured', date: '06 Jul, 11:35' },
];

const statusCls: Record<string, string> = {
  Captured: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Refunded: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M7 11h6M7 14h4" /><circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" /></svg>
            </span>
            <span className="font-display text-sm font-bold text-ink-900 dark:text-white">PayFlow</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-ink-500"><X className="h-5 w-5" /></button>
        </div>
        <nav className="px-3 py-4">
          {nav.map((n) => (
            <button key={n.label} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              n.active ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
            }`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-ink-200/60 dark:border-ink-800/60 p-3">
          <Link to="/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60">
            <LogOut className="h-4 w-4" /> Logout
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-200/60 dark:border-ink-800/60 bg-white/70 dark:bg-ink-900/60 backdrop-blur-xl px-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden text-ink-600 dark:text-ink-300"><Menu className="h-5 w-5" /></button>
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input placeholder="Search transactions…" className="input pl-10 py-2 text-sm w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60">
              <Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-bold text-white">AM</span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-ink-900 dark:text-white">Aarav Mehta</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">ShopKart</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-7">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Welcome back, Aarav</h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">Here's what's happening with your business today.</p>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { l: "Today's Revenue", v: '₹4,82,940', d: '+18.2%', up: true, icon: TrendingUp, c: 'from-brand-500 to-brand-600' },
              { l: 'Transactions', v: '1,284', d: '+12.4%', up: true, icon: CreditCard, c: 'from-accent-500 to-cyan-500' },
              { l: 'Success Rate', v: '99.2%', d: '+0.3%', up: true, icon: CheckCircle2, c: 'from-emerald-500 to-teal-500' },
              { l: 'Refunds', v: '₹12,480', d: '-4.1%', up: false, icon: RefreshCw, c: 'from-amber-500 to-orange-500' },
            ].map((s, i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.c} text-white`}><s.icon className="h-5 w-5" /></span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{s.d}
                  </span>
                </div>
                <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">{s.l}</p>
                <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">{s.v}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Revenue Overview</h3>
                <span className="text-xs text-ink-500 dark:text-ink-400">Last 20 days</span>
              </div>
              <div className="mt-5 flex h-48 items-end gap-1.5">
                {[40, 65, 50, 80, 60, 95, 70, 88, 55, 78, 92, 68, 84, 72, 96, 60, 82, 90, 74, 88].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: 0.3 + i * 0.03 }} className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-accent-400" />
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass-card p-5">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Payment Methods</h3>
              <div className="mt-5 space-y-4">
                {[
                  { m: 'UPI', v: 48, c: 'bg-violet-500' },
                  { m: 'Cards', v: 32, c: 'bg-brand-500' },
                  { m: 'Net Banking', v: 12, c: 'bg-accent-500' },
                  { m: 'Wallets', v: 8, c: 'bg-amber-500' },
                ].map((p) => (
                  <div key={p.m}>
                    <div className="flex justify-between text-sm"><span className="text-ink-600 dark:text-ink-300">{p.m}</span><span className="font-semibold text-ink-900 dark:text-white">{p.v}%</span></div>
                    <div className="mt-1.5 h-2 rounded-full bg-ink-100 dark:bg-ink-800"><div className={`h-2 rounded-full ${p.c}`} style={{ width: `${p.v}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-ink-50 dark:bg-ink-900/60 p-3 text-xs text-ink-500 dark:text-ink-400">
                <Globe className="h-4 w-4 text-brand-500" /> Accepting payments from 24 countries
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="glass-card mt-5 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Recent Transactions</h3>
              <button className="text-sm font-semibold text-brand-600 dark:text-brand-300">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Payment ID</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.id} className="border-b border-ink-200/40 dark:border-ink-800/40 hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{t.id}</td>
                      <td className="px-5 py-3.5"><p className="font-medium text-ink-900 dark:text-white">{t.name}</p><p className="text-xs text-ink-500 dark:text-ink-400">{t.email}</p></td>
                      <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300">{t.method}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white">{t.amount}</td>
                      <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusCls[t.status]}`}>{t.status}</span></td>
                      <td className="px-5 py-3.5 text-ink-500 dark:text-ink-400">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
