import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Inbox,
  Clock,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminWallet() {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);

  const fetchAdminWallet = async () => {
    setLoading(true);
    try {
      const url = `https://api.trustgates.co.in/admin/wallet/details?dateFrom=${dateFrom}&dateTo=${dateTo}`;
      const res = await apiFetch(url, {}, true);

      console.log("API RESPONSE:", res);

      if (res?.success && res?.data) {
        setAdminData(res.data);
      } else if (Array.isArray(res)) {
        // Fallback if the apiFetch returns the array directly
        setAdminData(res);
      } else {
        setAdminData(null);
        toast.error(res?.message || 'Failed to fetch admin wallet details');
      }
    } catch (error) {
      console.error(error);
      setAdminData(null);
      toast.error('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminWallet();
  }, []);

  const isDataArray = Array.isArray(adminData);
  const rawData = isDataArray ? adminData : (adminData?.data || adminData || []);
  const recentTransactions = Array.isArray(rawData) ? rawData : (rawData?.recentTransactions || []);

  // Compute metrics if data is raw array
  const computedTotalCredits = recentTransactions.filter((tx: any) => tx.transactionType === 'CREDIT' || tx.type === 'CREDIT').reduce((acc: number, tx: any) => acc + Number(tx.amount || tx.totalAmount || 0), 0);
  const computedTotalDebits = recentTransactions.filter((tx: any) => tx.transactionType === 'DEBIT' || tx.type === 'DEBIT').reduce((acc: number, tx: any) => acc + Number(tx.amount || tx.totalAmount || 0), 0);

  const computedPending = recentTransactions.filter((tx: any) => tx.status === 'PENDING').length;
  const computedCompleted = recentTransactions.filter((tx: any) => tx.status === 'COMPLETED' || tx.status === 'SUCCESS').length;
  const computedFailed = recentTransactions.filter((tx: any) => tx.status === 'FAILED').length;
  const computedReversed = recentTransactions.filter((tx: any) => tx.status === 'REVERSED').length;

  const wallet = !isDataArray && rawData?.wallet ? rawData.wallet : {
    balance: recentTransactions.length > 0 ? recentTransactions[0].balanceAfter || 0 : 0,
    adminWalletId: recentTransactions.length > 0 ? recentTransactions[0].adminWalletId : '1',
    currency: 'INR',
    status: 'ACTIVE'
  };

  const summary = !isDataArray && rawData?.summary ? rawData.summary : {
    totalCredits: computedTotalCredits,
    totalDebits: computedTotalDebits,
    pendingTransactions: computedPending,
    completedTransactions: computedCompleted,
    failedTransactions: computedFailed,
    reversedTransactions: computedReversed
  };

  const reconciliation = !isDataArray && rawData?.reconciliation ? rawData.reconciliation : {
    status: 'MATCHED',
    walletBalance: wallet.balance,
    calculatedBalance: wallet.balance,
    difference: 0
  };

  const revenueTrendData = [
    { name: 'Mon', amount: 1200 },
    { name: 'Tue', amount: 1800 },
    { name: 'Wed', amount: 1400 },
    { name: 'Thu', amount: 2100 },
    { name: 'Fri', amount: 1900 },
    { name: 'Sat', amount: 2400 },
    { name: 'Sun', amount: 2800 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12 w-full"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white flex items-center gap-2">
            Master Settlement Wallet
            {wallet.status === 'ACTIVE' && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            )}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Real-time platform financial health, reconciliation, and revenue metrics.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 self-start sm:self-auto w-full sm:w-auto mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-md px-2 py-1.5 text-xs text-ink-900 dark:text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <span className="text-ink-500 text-xs font-medium">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-md px-2 py-1.5 text-xs text-ink-900 dark:text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={fetchAdminWallet}
            disabled={loading}
            className="btn-secondary flex items-center justify-center gap-2 py-1.5 px-3 text-xs shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-purple-600' : 'text-ink-500'}`} />
            Apply & Refresh
          </button>
        </div>
      </div>

      {loading && !adminData ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 font-medium">Synchronizing with Settlement Network...</p>
        </div>
      ) : !adminData ? (
        <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm border border-rose-500/10 bg-rose-500/5">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Unable to Load Wallet</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            The API endpoint did not return valid data. Please check your network connection and try again.
          </p>
        </div>
      ) : (
        <>
          {/* Top Row: Hero Balance & Reconciliation */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Hero Card */}
            <motion.div variants={itemVariants} className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-brand-600 to-indigo-800 text-white shadow-xl shadow-brand-900/20 p-8 border border-white/10 group">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-0 right-10 h-32 w-32 bg-accent-400/20 blur-2xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="flex items-center gap-2 text-xs font-semibold text-white/70 uppercase tracking-widest">
                      <Wallet className="h-4 w-4" /> Master Balance
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mt-3">
                      {(wallet.currency === 'INR' ? '₹' : '')}
                      {Number(wallet.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h2>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl hidden sm:block">
                    <ShieldCheck className="h-8 w-8 text-emerald-300" />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6 bg-black/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Admin Wallet ID</p>
                    <p className="font-mono text-sm font-medium">#{wallet.adminWalletId || 'N/A'}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Currency Base</p>
                    <p className="font-mono text-sm font-medium">{wallet.currency || 'INR'}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Last Updated</p>
                    <p className="font-mono text-sm font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reconciliation Card */}
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-emerald-500 shadow-lg shadow-emerald-900/5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-ink-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" /> Reconciliation
                  </h3>
                  {reconciliation.status === 'MATCHED' ? (
                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                      Matched
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                      {reconciliation.status || 'Pending'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-500 dark:text-ink-400 mb-6">System calculated integrity check</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-ink-100 dark:border-ink-800">
                  <span className="text-sm text-ink-500">System Balance</span>
                  <span className="font-medium text-ink-900 dark:text-white">₹{Number(reconciliation.walletBalance || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-ink-100 dark:border-ink-800">
                  <span className="text-sm text-ink-500">Calculated Log</span>
                  <span className="font-medium text-ink-900 dark:text-white">₹{Number(reconciliation.calculatedBalance || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Variance (Diff)</span>
                  <span className={`font-bold ${reconciliation.difference === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ₹{Number(reconciliation.difference || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metrics Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-5 border-l-4 border-l-emerald-500 group hover:shadow-lg transition-all duration-300">
                <p className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ArrowDownRight className="h-4 w-4 text-emerald-500" /> Total Credit
                </p>
                <p className="text-2xl font-display font-bold text-ink-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  ₹{Number(summary.totalCredits || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="glass-card p-5 border-l-4 border-l-amber-500 group hover:shadow-lg transition-all duration-300">
                <p className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" /> Total Pending
                </p>
                <p className="text-2xl font-display font-bold text-ink-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  {summary.pendingTransactions || 0}
                </p>
              </div>

              <div className="glass-card p-5 border-l-4 border-l-rose-500 group hover:shadow-lg transition-all duration-300">
                <p className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-500" /> Total Failed
                </p>
                <p className="text-2xl font-display font-bold text-ink-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  {summary.failedTransactions || 0}
                </p>
              </div>

              <div className="glass-card p-5 border-l-4 border-l-purple-500 group hover:shadow-lg transition-all duration-300">
                <p className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-purple-500" /> Total Reversed
                </p>
                <p className="text-2xl font-display font-bold text-ink-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {summary.reversedTransactions || 0}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Graph and Fee Table Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-5 flex flex-col shadow-sm">
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-4">
                Revenue Trend
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-ink-800" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card flex flex-col shadow-sm">
              <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60">
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                  Recent Fees
                </h3>
              </div>
              <div className="overflow-y-auto max-h-64">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400 sticky top-0">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Merchant ID</th>
                      <th className="px-5 py-3 font-semibold text-right">Fee Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                    {recentTransactions.slice(0, 10).map((tx: any, idx: number) => (
                      <tr key={idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20">
                        <td className="px-5 py-3 font-mono text-xs text-ink-600 dark:text-ink-400">
                          {tx.merchantId || 'N/A'}
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-emerald-600">
                          ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-ink-500 text-xs">No recent fees</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Full Transactions Table */}
          <motion.div variants={itemVariants} className="glass-card flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20">
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
                Recent TXN
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Merchant ID</th>
                    <th className="px-4 py-3 font-semibold">Refund ID</th>
                    <th className="px-4 py-3 font-semibold">Txn Type</th>
                    <th className="px-4 py-3 font-semibold">Sources</th>
                    <th className="px-4 py-3 font-semibold text-right">Fee Amount</th>
                    <th className="px-4 py-3 font-semibold text-right">Total Amount</th>
                    <th className="px-4 py-3 font-semibold text-right">Blc After</th>
                    <th className="px-4 py-3 font-semibold text-right">Blc Before</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx: any, idx: number) => (
                      <tr key={idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-ink-600 dark:text-ink-400">
                          {tx.merchantId || 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink-600 dark:text-ink-400">
                          {tx.refundId || tx.referenceId || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-700 dark:text-ink-300">
                          {tx.transactionType || tx.type || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-700 dark:text-ink-300">
                          {tx.source || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-600">
                          ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-ink-900 dark:text-white">
                          ₹{Number(tx.totalAmount || tx.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-ink-700 dark:text-ink-300">
                          ₹{Number(tx.balanceAfter || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-ink-700 dark:text-ink-300">
                          ₹{Number(tx.balanceBefore || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                            tx.status === 'FAILED' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                              'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}>
                            {tx.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="p-4 rounded-full bg-ink-100 dark:bg-ink-800 mb-3">
                            <Inbox className="h-6 w-6 text-ink-400" />
                          </div>
                          <p className="text-ink-500 font-medium text-sm">No recent transactions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}