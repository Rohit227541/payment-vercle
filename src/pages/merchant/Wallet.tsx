import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  DollarSign,
  Inbox,
  FileText,
  Tag
} from 'lucide-react';
import walletService, { WalletOverviewData, WalletLedgerItem, WalletAnalyticsData } from '../../services/wallet.service';

export default function MerchantWallet() {
  const [overview, setOverview] = useState<WalletOverviewData | null>(null);
  const [analytics, setAnalytics] = useState<WalletAnalyticsData | null>(null);
  const [ledger, setLedger] = useState<WalletLedgerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  const loadWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, analyticsRes, ledgerRes] = await Promise.allSettled([
        walletService.getOverview(),
        walletService.getAnalytics(),
        walletService.getLedger(1, 50)
      ]);

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value);
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value);
      }
      if (ledgerRes.status === 'fulfilled') {
        setLedger(ledgerRes.value);
      }

      if (overviewRes.status === 'rejected' && ledgerRes.status === 'rejected') {
        throw new Error('Failed to load wallet metrics from backend service.');
      }
    } catch (err: any) {
      console.log('Wallet Loading Error:', err);
      setError(err?.message || 'Unable to connect to wallet service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const filteredLedger = useMemo(() => {
    return ledger.filter(item => {
      const matchesType = filterType === 'ALL' || item.type?.toUpperCase() === filterType;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        String(item.transactionId || '').toLowerCase().includes(query) ||
        String(item.referenceId || '').toLowerCase().includes(query) ||
        (item.source || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [ledger, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredLedger.length / pageSize) || 1;
  const paginatedLedger = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLedger.slice(start, start + pageSize);
  }, [filteredLedger, page, pageSize]);

  // Balance Distribution Percentages
  const available = overview?.availableBalance || 0;
  const pending = overview?.pendingBalance || 0;
  const blocked = overview?.blockedBalance || 0;
  const grandTotal = available + pending + blocked || 1;

  const availablePct = ((available / grandTotal) * 100).toFixed(1);
  const pendingPct = ((pending / grandTotal) * 100).toFixed(1);
  const blockedPct = ((blocked / grandTotal) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Wallet</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Real-time balance, totals & wallet ledger transactions from Backend service
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadWalletData}
            disabled={loading}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Wallet
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading wallet services & ledger entries...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Wallet Connection Notice</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{error}</p>
          <button
            onClick={loadWalletData}
            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Content View */}
      {!loading && (
        <>
          {/* Main Balance Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Available Balance Hero Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-5 relative overflow-hidden bg-gradient-to-br from-brand-600/90 to-accent-600 text-white shadow-xl">
              <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
                <Wallet className="h-36 w-36" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">Available Balance</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 backdrop-blur-md">
                  <Wallet className="h-4 w-4 text-white" />
                </span>
              </div>
              <div className="mt-4">
                <p className="font-display text-3xl font-extrabold tracking-tight">
                  ₹{available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-brand-100 mt-1">Ready for payout settlement</p>
              </div>
            </motion.div>

            {/* 2. Pending Balance */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="glass-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Pending Balance</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                  ₹{pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-ink-400 mt-1">Under settlement verification cycle</p>
              </div>
            </motion.div>

            {/* 3. Blocked / Reserve Balance */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Blocked / Reserved</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
                  <ShieldAlert className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                  ₹{blocked.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-ink-400 mt-1">Held for dispute or chargeback reserve</p>
              </div>
            </motion.div>
          </div>

          {/* Totals Summary Row */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-400">Total Settled Payouts</p>
                <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{(overview?.totalSettled || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-400">Gross Received</p>
                <p className="font-display text-lg font-bold text-ink-900 dark:text-white mt-0.5">
                  ₹{(overview?.totalReceived || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-400">Total Refunded</p>
                <p className="font-display text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  ₹{(overview?.totalRefunded || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
                <TrendingUp className="h-4 w-4 rotate-180" />
              </span>
            </div>
          </motion.div>

          {/* Analytics Overview & Allocation Grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            
            {/* Source Analytics Graph (Visual bar representation) */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink-800 dark:text-white">Funds by Source</span>
                <span className="font-mono text-ink-400">Total volume</span>
              </div>
              <div className="space-y-4 pt-2">
                {analytics?.sourceAnalytics && analytics.sourceAnalytics.length > 0 ? (
                  analytics.sourceAnalytics.map((src, i) => {
                    const maxVal = Math.max(...analytics.sourceAnalytics!.map(s => Number(s.total_amount || s.amount || 0)));
                    const val = Number(src.total_amount || src.amount || 0);
                    const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs text-ink-600 dark:text-ink-300">
                          <span className="capitalize">{src.source || src.name}</span>
                          <span className="font-semibold">₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="w-full bg-ink-100 dark:bg-ink-800/50 h-2.5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.5 + (i*0.1) }} className="h-full bg-brand-500 rounded-full" />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-ink-400 border border-dashed border-ink-200 dark:border-ink-800 rounded-lg">
                    No source analytics available
                  </div>
                )}
              </div>
            </motion.div>

            {/* Allocation Progress Bar */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="glass-card p-5 space-y-4 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-ink-800 dark:text-white">Wallet Balance Allocation</span>
                <span className="font-mono text-ink-400">Currency: {overview?.currency || 'INR'}</span>
              </div>
              <div className="w-full bg-ink-100 dark:bg-ink-800/60 h-4 rounded-full overflow-hidden flex border border-ink-200/40 dark:border-ink-800/40 shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${availablePct}%` }} transition={{ duration: 0.8, delay: 0.6 }} className="h-full bg-brand-500 rounded-l-full relative" title={`Available: ${availablePct}%`} />
                <motion.div initial={{ width: 0 }} animate={{ width: `${pendingPct}%` }} transition={{ duration: 0.8, delay: 0.6 }} className="h-full bg-amber-500 relative" title={`Pending: ${pendingPct}%`} />
                <motion.div initial={{ width: 0 }} animate={{ width: `${blockedPct}%` }} transition={{ duration: 0.8, delay: 0.6 }} className="h-full bg-rose-500 rounded-r-full relative" title={`Blocked: ${blockedPct}%`} />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-ink-600 dark:text-ink-300 pt-4">
                <div className="flex items-center gap-1.5 bg-ink-50 dark:bg-ink-900 px-3 py-1.5 rounded-full">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <span className="font-medium">Available ({availablePct}%)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-ink-50 dark:bg-ink-900 px-3 py-1.5 rounded-full">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  <span className="font-medium">Pending ({pendingPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-ink-50 dark:bg-ink-900 px-3 py-1.5 rounded-full">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span className="font-medium">Blocked ({blockedPct}%)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Wallet Ledger History Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search by Txn ID, Ref, description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="input pl-10 py-1.5 text-sm w-full"
                />
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1 bg-ink-100 dark:bg-ink-800 p-1 rounded-lg">
                {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filterType === type
                        ? 'bg-white dark:bg-ink-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-ink-500 dark:text-ink-400 hover:text-ink-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Ledger Table Card */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-500" /> Wallet Ledger Entries
                </h3>
                <span className="text-xs text-ink-400 font-mono">Showing {filteredLedger.length} ledger logs</span>
              </div>

              {paginatedLedger.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                      <tr>
                        <th className="px-5 py-3 font-medium">Type</th>
                        <th className="px-5 py-3 font-medium">Txn ID</th>
                        <th className="px-5 py-3 font-medium">Source / Ref</th>
                        <th className="px-5 py-3 font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Balance Before</th>
                        <th className="px-5 py-3 font-medium">Balance After</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                      {paginatedLedger.map((item, idx) => {
                        const isCredit = item.type?.toUpperCase() === 'CREDIT';
                        return (
                          <tr key={item.transactionId || idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isCredit
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                                {isCredit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                                {item.type}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">
                              #{item.transactionId}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-ink-800 dark:text-ink-200">
                              <p className="font-semibold">{item.source || 'SYSTEM'}</p>
                              {item.referenceId && (
                                <p className="text-[11px] text-ink-400 flex items-center gap-1 mt-0.5">
                                  <Tag className="h-3 w-3" /> {item.referenceType || 'REF'}: {item.referenceId}
                                </p>
                              )}
                            </td>
                            <td className={`px-5 py-3.5 font-semibold text-sm whitespace-nowrap ${
                              isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {isCredit ? '+' : '-'}₹{Number(item.amount || 0).toFixed(2)}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">
                              {item.balanceBefore !== undefined ? `₹${Number(item.balanceBefore).toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-ink-900 dark:text-white font-semibold whitespace-nowrap">
                              {item.balanceAfter !== undefined ? `₹${Number(item.balanceAfter).toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                item.status === 'COMPLETED' || item.status === 'SUCCESS'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <Inbox className="h-10 w-10 mx-auto text-ink-400" />
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200">No wallet ledger transactions found.</p>
                  <p className="text-xs text-ink-400">Wallet credits and debits from backend will log here live.</p>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">
                <span className="text-xs text-ink-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
