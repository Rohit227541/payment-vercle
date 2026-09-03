import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Inbox,
  PieChart,
  Activity,
  Users
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';

interface AdminDashboardData {
  stats: any;
  recentTransactions: any[];
  topMerchants: any[];
  recentMerchants: any[];
  volumeData: any[];
  paymentMethodsData: any[];
  statusData: any[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const typeParam = `?type=PAYIN&startDate=${formatDate(thirtyDaysAgo)}&endDate=${formatDate(today)}`;

      // Fetch all dashboard data concurrently
      const [
        summaryRes,
        volumeRes,
        methodsRes,
        statusRes,
        recentRes,
        merchantsRes,
        recentMerchantsRes
      ] = await Promise.all([
        apiFetch(`/admin/dashboard/summary${typeParam}`, {}, true),
        apiFetch(`/admin/analytics/revenue-trend${typeParam}`, {}, true),
        apiFetch(`/admin/analytics/payment-methods${typeParam}`, {}, true),
        apiFetch(`/admin/analytics/status${typeParam}`, {}, true),
        apiFetch(`/admin/dashboard/recent-transactions${typeParam}`, {}, true),
        apiFetch(`/admin/dashboard/top-merchants${typeParam}`, {}, true),
        apiFetch(`/admin/merchant/get-merchant?limit=5`, {}, true)
      ]);

      console.log("=== API RESPONSE: SUMMARY ===", summaryRes);
      console.log("=== API RESPONSE: VOLUME ===", volumeRes);
      console.log("=== API RESPONSE: METHODS ===", methodsRes);
      console.log("=== API RESPONSE: STATUS ===", statusRes);
      console.log("=== API RESPONSE: RECENT ===", recentRes);
      console.log("=== API RESPONSE: MERCHANTS ===", merchantsRes);

      if (summaryRes.success && summaryRes.data) {
        const stats = summaryRes.data.summary || {};

        // Format Volume Data for Line Chart (from revenue-trend)
        const rawVolume = volumeRes.success && volumeRes.data?.revenueTrend ? volumeRes.data.revenueTrend : [];
        const formattedVolume = Array.isArray(rawVolume) ? rawVolume.map((v: any) => ({
          date: v.date || v.created_at || 'N/A',
          volume: Number(v.revenue || v.amount || 0)
        })) : [];

        // Format Payment Methods for Pie Chart (from analytics/payment-methods)
        const rawMethods = methodsRes.success && methodsRes.data?.paymentMethods ? methodsRes.data.paymentMethods : [];
        const formattedMethods = Array.isArray(rawMethods) ? rawMethods.map((m: any) => ({
          name: m.paymentMethod || m.method || m.payment_method || 'Unknown',
          value: Number(m.totalTransactions || m.count || m.total || 0)
        })) : [];

        // Format Status Data (from analytics/status)
        const rawStatus = statusRes.success && statusRes.data?.statuses ? statusRes.data.statuses : [];

        // Recent Transactions
        const rawRecentTxns = recentRes.success ? (recentRes.data?.transactions || recentRes.data || []) : [];
        const recentTxns = Array.isArray(rawRecentTxns) ? rawRecentTxns.slice(0, 5) : [];

        // Top Merchants
        const rawTopMerchants = merchantsRes.success ? (merchantsRes.data?.merchants || merchantsRes.data?.topMerchants || merchantsRes.data || []) : [];
        const topMerchants = Array.isArray(rawTopMerchants) ? rawTopMerchants.slice(0, 5) : [];

        // Recent Merchants
        const rawRecentMerchantsList = recentMerchantsRes.success ? (recentMerchantsRes.data?.merchants || recentMerchantsRes.data || []) : [];
        const recentMerchantsList = Array.isArray(rawRecentMerchantsList) ? rawRecentMerchantsList.slice(0, 5) : [];

        setData({
          stats: {
            totalTransactions: Number(stats.totalTransactions || 0),
            successfulTransactions: Number(stats.successfulTransactions || 0),
            failedTransactions: Number(stats.failedTransactions || 0),
            pendingTransactions: Number(stats.pendingTransactions || 0),
            refundCount: Number(stats.refundCount || 0),
            chargebacks: Number(stats.chargebackTransactions || stats.chargebacks || 0),
            todayRevenue: `₹${Number(stats.todaysRevenue || stats.todayRevenue || 0).toLocaleString()}`,
            monthlyRevenue: `₹${Number(stats.monthlyRevenue || 0).toLocaleString()}`,
            availableBalance: `₹${Number(stats.availableBalance || 0).toLocaleString()}`,
            settledAmount: `₹${Number(stats.settledAmount || 0).toLocaleString()}`,
          },
          recentTransactions: recentTxns,
          topMerchants: topMerchants,
          recentMerchants: recentMerchantsList,
          volumeData: formattedVolume,
          paymentMethodsData: formattedMethods,
          statusData: Array.isArray(rawStatus) ? rawStatus : []
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Admin Operations Control</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Platform-wide statistics, analytics, and metrics</p>
        </div>
        <button
          onClick={loadDashboard}
          className="btn-secondary self-start sm:self-center flex items-center gap-2 py-2 px-3 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading comprehensive system metrics...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Connection Error</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 font-normal">
            Failed to gather system operational logs. Please verify the backend API endpoints.
          </p>
          <button
            onClick={loadDashboard}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && (!data || !data.stats) && (
        <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">No System Data</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No system statistics are loaded for this administrator dashboard.
          </p>
        </div>
      )}

      {/* Data views */}
      {!loading && !error && data && data.stats && (
        <>
          {/* Stats Grid - 10 Summary Cards */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display text-sm font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-4">
              Dashboard Summary (Particulars)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { l: "Total Transactions", v: data.stats.totalTransactions, icon: CreditCard, c: 'from-purple-500 to-purple-600' },
                { l: 'Successful Transactions', v: data.stats.successfulTransactions, icon: CheckCircle2, c: 'from-emerald-500 to-emerald-600' },
                { l: 'Failed Transactions', v: data.stats.failedTransactions, icon: AlertCircle, c: 'from-rose-500 to-rose-600' },
                { l: 'Pending Transactions', v: data.stats.pendingTransactions, icon: RefreshCw, c: 'from-amber-500 to-amber-600' },
                { l: 'Refund Count', v: data.stats.refundCount, icon: RefreshCw, c: 'from-violet-500 to-violet-600' },
                { l: 'Chargebacks', v: data.stats.chargebacks, icon: AlertCircle, c: 'from-orange-500 to-orange-600' },
                { l: "Today's Revenue", v: data.stats.todayRevenue, icon: TrendingUp, c: 'from-cyan-500 to-cyan-600' },
                { l: 'Monthly Revenue', v: data.stats.monthlyRevenue, icon: TrendingUp, c: 'from-teal-500 to-teal-600' },
                { l: 'Available Balance', v: data.stats.availableBalance, icon: TrendingUp, c: 'from-blue-500 to-blue-600' },
                { l: 'Settled Amount', v: data.stats.settledAmount, icon: CheckCircle2, c: 'from-indigo-500 to-indigo-600' },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border border-ink-200/60 dark:border-ink-800/60 p-5 rounded-2xl shadow-xl shadow-purple-900/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-ink-500 dark:text-ink-400 font-bold uppercase tracking-wider">{s.l}</p>
                    <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${s.c} text-white shadow-lg`}>
                      <s.icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="font-display text-2xl font-black text-ink-900 dark:text-white tracking-tight">{s.v}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border border-ink-200/60 dark:border-ink-800/60 rounded-3xl p-6 lg:col-span-2 shadow-xl shadow-purple-900/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Transaction Volume</h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.volumeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', color: '#111827', fontWeight: 600 }}
                      formatter={(value: any) => [`₹${value}`, 'Volume']}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} fill="url(#colorVolume)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border border-ink-200/60 dark:border-ink-800/60 rounded-3xl p-6 shadow-xl shadow-purple-900/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <PieChart className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Payment Methods</h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={data.paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.paymentMethodsData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', color: '#111827', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Tables Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border border-ink-200/60 dark:border-ink-800/60 rounded-3xl overflow-hidden shadow-xl shadow-purple-900/5">
              <div className="p-6 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Txn ID</th>
                      <th className="px-5 py-3 font-medium">Merchant</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Method</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                    {data.recentTransactions.length > 0 ? (
                      data.recentTransactions.map((tx: any, idx: number) => (
                        <tr key={idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{tx.transaction_id || tx.id || 'N/A'}</td>
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{tx.merchant_name || tx.merchantName || 'N/A'}</td>
                          <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">₹{tx.amount || 0}</td>
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{tx.payment_method || tx.paymentMethod || 'N/A'}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600' :
                                tx.status === 'FAILED' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                              }`}>
                              {tx.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-ink-500 text-xs">No recent transactions available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Merchants */}
            <div className="bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border border-ink-200/60 dark:border-ink-800/60 rounded-3xl overflow-hidden shadow-xl shadow-purple-900/5 flex flex-col">
              <div className="p-6 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Top Merchants</h3>
                </div>
                <span className="px-3 py-1 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs font-bold rounded-full">By Volume</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Merchant ID</th>
                      <th className="px-5 py-3 font-medium">Merchant Name</th>
                      <th className="px-5 py-3 font-medium">Volume</th>
                      <th className="px-5 py-3 font-medium">Txn Count</th>
                      <th className="px-5 py-3 font-medium">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                    {data.topMerchants.length > 0 ? (
                      data.topMerchants.map((m: any, idx: number) => {
                        const successRate = m.totalTransactions > 0
                          ? (m.successfulTransactions / m.totalTransactions) * 100
                          : m.success_rate ? Number(m.success_rate) : 0;
                          
                        return (
                          <tr key={idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                            <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{m.merchantId || m.id || 'N/A'}</td>
                            <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">{m.businessName || m.merchantName || 'N/A'}</td>
                            <td className="px-5 py-3.5 font-medium text-emerald-600">₹{m.revenue || m.volume || 0}</td>
                            <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300">{m.totalTransactions || m.transaction_count || 0}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 w-24 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      successRate > 85 ? 'bg-emerald-500' : 
                                      successRate > 60 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min(Math.max(successRate, 0), 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 w-10">
                                  {successRate.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-ink-500 text-xs">No merchant data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Merchants */}
            <div className="glass-card overflow-hidden lg:col-span-2">
              <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Recent Merchants</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Merchant ID</th>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Business Type</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                    {data.recentMerchants.length > 0 ? (
                      data.recentMerchants.map((m: any, idx: number) => (
                        <tr key={idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{m.createdAt || m.created_at ? new Date(m.createdAt || m.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{m.merchantId || m.id || 'N/A'}</td>
                          <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">{m.businessName || m.merchantName || 'N/A'}</td>
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{m.email || 'N/A'}</td>
                          <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-ink-300">{m.businessType || m.business_type || 'N/A'}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${m.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' :
                                m.accountStatus === 'INACTIVE' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                              }`}>
                              {m.accountStatus || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-ink-500 text-xs">No recent merchants found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
