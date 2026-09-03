import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Wallet,
  DollarSign,
  BarChart3,
  Activity,
  XCircle
} from 'lucide-react';
import {
  merchantDashboardService,
  DashboardSummaryData,
  DashboardAnalyticsData,
  MerchantRecentTransaction,
  WalletDashboardData,
  RefundDashboardData
} from '../../services/dashboard.service';

export default function MerchantDashboard() {
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsData | null>(null);
  const [recentTx, setRecentTx] = useState<MerchantRecentTransaction[]>([]);
  const [wallet, setWallet] = useState<WalletDashboardData | null>(null);
  const [refunds, setRefunds] = useState<RefundDashboardData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        summaryRes,
        analyticsRes,
        recentRes,
        walletRes,
        refundsRes
      ] = await Promise.allSettled([
        merchantDashboardService.getSummary(),
        merchantDashboardService.getAnalytics(),
        merchantDashboardService.getRecentTransactions(20),
        merchantDashboardService.getWalletOverview(),
        merchantDashboardService.getRefundOverview()
      ]);

      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      if (recentRes.status === 'fulfilled') setRecentTx(recentRes.value);
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value);
      if (refundsRes.status === 'fulfilled') setRefunds(refundsRes.value);

      if (
        summaryRes.status === 'rejected' &&
        analyticsRes.status === 'rejected' &&
        recentRes.status === 'rejected'
      ) {
        throw new Error('Failed to fetch dashboard data from server.');
      }
    } catch (err: any) {
      console.log('Merchant Dashboard Loading Error:', err);
      setError(err?.message || 'Error loading dashboard metrics. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return recentTx;
    const query = searchQuery.toLowerCase();
    return recentTx.filter(t =>
      String(t.transactionId).toLowerCase().includes(query) ||
      String(t.orderId || '').toLowerCase().includes(query) ||
      (t.customerName || '').toLowerCase().includes(query) ||
      (t.paymentMethod || '').toLowerCase().includes(query) ||
      (t.status || '').toLowerCase().includes(query)
    );
  }, [recentTx, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  // Data helper for Revenue Trend Graph
  const revenuePoints = useMemo(() => {
    const trend = analytics?.revenueTrend || [];
    if (trend.length === 0) {
      return [
        { label: 'Mon', value: 0 },
        { label: 'Tue', value: 0 },
        { label: 'Wed', value: 0 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ];
    }
    return trend.map((t: any) => ({
      label: t.date ? t.date.substring(5) : t.period || 'Day',
      value: Number(t.revenue || t.total_revenue || 0)
    }));
  }, [analytics]);

  const maxRevenue = useMemo(() => {
    const max = Math.max(...revenuePoints.map(p => p.value), 100);
    return max;
  }, [revenuePoints]);

  // Data helper for Status / Method Distribution Graph
  const statusItems = useMemo(() => {
    const dist = analytics?.transactionStatusDistribution || [];
    const total = summary?.totalTransactions || dist.reduce((acc, curr: any) => acc + Number(curr.count || curr.total_transactions || 0), 0) || 1;

    if (dist.length === 0) {
      return [
        { label: 'SUCCESS', count: summary?.successfulTransactions || 0, color: 'bg-emerald-500', barGradient: 'from-emerald-500 to-emerald-400' },
        { label: 'PENDING', count: summary?.pendingTransactions || 0, color: 'bg-amber-500', barGradient: 'from-amber-500 to-amber-400' },
        { label: 'FAILED', count: summary?.failedTransactions || 0, color: 'bg-rose-500', barGradient: 'from-rose-500 to-rose-400' },
      ].map(item => ({
        ...item,
        percentage: ((item.count / (summary?.totalTransactions || 1)) * 100).toFixed(1)
      }));
    }

    return dist.map((item: any) => {
      const st = String(item.status || item.label || 'UNKNOWN').toUpperCase();
      const cnt = Number(item.count || item.total_transactions || 0);
      const color = st === 'SUCCESS' ? 'bg-emerald-500' : st === 'PENDING' ? 'bg-amber-500' : 'bg-rose-500';
      const barGradient = st === 'SUCCESS' ? 'from-emerald-500 to-emerald-400' : st === 'PENDING' ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';
      return {
        label: st,
        count: cnt,
        percentage: ((cnt / total) * 100).toFixed(1),
        color,
        barGradient
      };
    });
  }, [analytics, summary]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Dashboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Live overview of your payments, refunds & analytics</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="btn-secondary self-start sm:self-center flex items-center gap-2 py-2 px-3 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading dashboard analytics & statistics...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Dashboard Connection Notice</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{error}</p>
          <button
            onClick={loadDashboardData}
            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Dashboard Content */}
      {!loading && (
        <>
          {/* 1. Particulars Summary Section */}
          <div>
            <h3 className="font-display text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-4">
              Particulars Summary
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  label: "Total Pay In",
                  val: `₹${(summary?.totalPayIn ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: TrendingUp,
                  gradient: 'from-emerald-500 to-emerald-600'
                },

                {
                  label: "Total Pay Out",
                  val: `₹${(summary?.totalPayOut ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: DollarSign,
                  gradient: 'from-blue-500 to-blue-600'
                },

                {
                  label: "Total Transactions",
                  val: summary?.totalTransactions ?? 0,
                  icon: CreditCard,
                  gradient: 'from-brand-500 to-brand-600'
                },

                {
                  label: "Successful",
                  val: summary?.successfulTransactions ?? 0,
                  icon: CheckCircle2,
                  gradient: 'from-emerald-500 to-emerald-600'
                },

                {
                  label: "Failed",
                  val: summary?.failedTransactions ?? 0,
                  icon: AlertCircle,
                  gradient: 'from-rose-500 to-rose-600'
                },

                {
                  label: "Pending",
                  val: summary?.pendingTransactions ?? 0,
                  icon: RefreshCw,
                  gradient: 'from-amber-500 to-amber-600'
                },

                {
                  label: "Refund Count",
                  val: summary?.refundCount ?? 0,
                  icon: RefreshCw,
                  gradient: 'from-violet-500 to-violet-600'
                },

                {
                  label: "Chargebacks",
                  val: summary?.chargebacks ?? 0,
                  icon: AlertCircle,
                  gradient: 'from-orange-500 to-orange-600'
                },

                {
                  label: "Available Balance",
                  val: `₹${(
                    wallet?.availableBalance ??
                    summary?.availableBalance ??
                    0
                  ).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: Wallet,
                  gradient: 'from-blue-500 to-blue-600'
                },

                {
                  label: "Success Rate",
                  val: `${(
                    summary?.successRate ??
                    Number(analytics?.successRate ?? 0)
                  ).toFixed(2)}%`,
                  icon: TrendingUp,
                  gradient: 'from-teal-500 to-teal-600'
                },

                {
                  label: "Avg Transaction",
                  val: `₹${(
                    summary?.avgTransaction ??
                    analytics?.averageTransactionAmount ??
                    0
                  ).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: DollarSign,
                  gradient: 'from-cyan-500 to-cyan-600'
                },
                {
                  label: "Settled Amount",
                  val: `₹${(
                    summary?.settledAmount ?? 0
                  ).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: Wallet,
                  gradient: 'from-indigo-500 to-indigo-600'
                },

                {
                  label: "Refunded Amount",
                  val: `₹${(
                    summary?.refundedAmount ?? 0
                  ).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`,
                  icon: RefreshCw,
                  gradient: 'from-rose-500 to-rose-600'
                },

                {
                  label: "Cancelled",
                  val: summary?.cancelledTransactions ?? 0,
                  icon: XCircle,
                  gradient: 'from-slate-500 to-slate-600'
                },
              ].map((s) => (
                <div key={s.label} className="glass-card p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-500 dark:text-ink-400 font-medium leading-snug">{s.label}</p>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${s.gradient} text-white`}>
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold text-ink-900 dark:text-white mt-2">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. GRAPHS SECTION (Directly Below Particulars Summary) */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Graph 1: Revenue Trend Chart */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white">Revenue Trend Graph</h3>
                    <p className="text-xs text-ink-400">Daily revenue performance</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Total: ₹{revenuePoints.reduce((sum, p) => sum + p.value, 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Line Chart Container */}
              <div className="pt-2">
                <div className="h-48 w-full flex relative border-b border-ink-200/60 dark:border-ink-800/60">
                  {/* Subtle Background Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-ink-400 w-full" />
                    <div className="border-b border-dashed border-ink-400 w-full" />
                    <div className="border-b border-dashed border-ink-400 w-full" />
                  </div>

                  {/* SVG Line */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="url(#lineGradient)"
                      stroke="none"
                      points={`0,100 ${revenuePoints.map((p, i) => `${((i + 0.5) / revenuePoints.length) * 100},${100 - (p.value / Math.max(1, maxRevenue)) * 100}`).join(' ')} 100,100`}
                    />
                    <polyline
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={revenuePoints.map((p, i) => `${((i + 0.5) / revenuePoints.length) * 100},${100 - (p.value / Math.max(1, maxRevenue)) * 100}`).join(' ')}
                    />
                  </svg>

                  {/* Data Points / Tooltips */}
                  <div className="absolute inset-0 flex">
                    {revenuePoints.map((point, idx) => {
                      const heightPercent = Math.max(0, Math.min(100, (point.value / Math.max(1, maxRevenue)) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          <div
                            style={{ bottom: `${heightPercent}%` }}
                            className="absolute w-2.5 h-2.5 bg-white dark:bg-ink-900 border-2 border-brand-500 rounded-full translate-y-1/2 hover:scale-150 transition-transform z-10 cursor-pointer"
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                              {point.label}: ₹{point.value.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-2 pt-2 text-[10px] font-medium text-ink-400 uppercase">
                  {revenuePoints.map((point, idx) => (
                    <span key={idx} className="flex-1 text-center truncate px-0.5">
                      {point.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Graph 2: Transaction Status Breakdown (Vertical Bar Graph) */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white">Transaction Status Breakdown</h3>
                    <p className="text-xs text-ink-400">Vertical bar comparison by status</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {statusItems.length} Statuses
                </span>
              </div>

              {/* Vertical Bar Chart Container */}
              <div className="pt-2">
                <div className="h-48 w-full flex items-end justify-around gap-4 px-4 relative border-b border-ink-200/60 dark:border-ink-800/60">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-ink-400 w-full" />
                    <div className="border-b border-dashed border-ink-400 w-full" />
                    <div className="border-b border-dashed border-ink-400 w-full" />
                  </div>

                  {statusItems.map((st, idx) => {
                    const maxCount = Math.max(...statusItems.map(s => s.count), 1);
                    const heightPercent = Math.max(15, Math.min(100, (st.count / maxCount) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end max-w-[64px]">
                        {/* Top Label / Count Badge */}
                        <span className="text-[11px] font-bold text-ink-800 dark:text-white mb-1.5 font-mono">
                          {st.count} <span className="text-[9px] text-ink-400">({st.percentage}%)</span>
                        </span>

                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                          {st.label}: {st.count} txns ({st.percentage}%)
                        </div>

                        {/* Vertical Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full bg-gradient-to-t ${st.barGradient} rounded-t-md transition-all duration-300 shadow-md hover:brightness-110`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Category Labels */}
                <div className="flex justify-around px-4 pt-2.5 text-[11px] font-bold text-ink-600 dark:text-ink-300 uppercase">
                  {statusItems.map((st, idx) => (
                    <span key={idx} className="flex-1 text-center truncate px-1 flex items-center justify-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${st.color}`} />
                      {st.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Payment Methods Badges */}
              {analytics?.paymentMethodDistribution && analytics.paymentMethodDistribution.length > 0 && (
                <div className="pt-3 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Methods Share:</span>
                  <div className="flex flex-wrap gap-2">
                    {analytics.paymentMethodDistribution.map((pm, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 font-mono font-medium">
                        {pm.payment_method || 'UPI'}: {pm.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Wallet Overview Cards */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-500" /> Wallet Details
              </h3>
              <span className="text-xs text-ink-400 font-mono">
                Currency: {wallet?.currency || 'INR'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-ink-50/50 dark:bg-ink-900/50 rounded-lg">
                <p className="text-ink-400 font-medium">Pending Balance</p>
                <p className="text-base font-bold text-ink-900 dark:text-white mt-1">
                  ₹{(wallet?.pendingBalance ?? summary?.pendingBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-ink-50/50 dark:bg-ink-900/50 rounded-lg">
                <p className="text-ink-400 font-medium">Blocked Balance</p>
                <p className="text-base font-bold text-ink-900 dark:text-white mt-1">
                  ₹{(wallet?.blockedBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-ink-50/50 dark:bg-ink-900/50 rounded-lg">
                <p className="text-ink-400 font-medium">Total Received</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{(wallet?.totalReceived ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-ink-50/50 dark:bg-ink-900/50 rounded-lg">
                <p className="text-ink-400 font-medium">Total Refunded</p>
                <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
                  ₹{(wallet?.totalRefunded ?? summary?.refundedAmount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Search Bar & Transactions Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search by Txn ID, Order ID, Customer..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="input pl-10 py-1.5 text-sm w-full"
                />
              </div>
              <div className="text-xs text-ink-400">
                Showing {filteredTransactions.length} recent transactions
              </div>
            </div>

            {/* Table Card */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Recent Transactions</h3>
                <span className="text-xs text-ink-500 dark:text-ink-400 font-mono">Live Logs</span>
              </div>

              {paginatedTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                      <tr>
                        <th className="px-5 py-3 font-medium">Transaction Ref</th>
                        <th className="px-5 py-3 font-medium">Order ID</th>
                        <th className="px-5 py-3 font-medium">Customer Name</th>
                        <th className="px-5 py-3 font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Currency</th>
                        <th className="px-5 py-3 font-medium">Payment Method</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                      {paginatedTransactions.map((t, idx) => (
                        <tr key={t.transactionId || idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                          <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">
                            {t.transactionReference || t.transactionId}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">
                            {t.orderId || 'N/A'}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">
                            {t.customerName || 'N/A'}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">
                            {Number(t.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300 whitespace-nowrap uppercase text-xs font-mono">
                            {t.currency || 'INR'}
                          </td>
                          <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300 whitespace-nowrap uppercase text-xs">
                            {t.paymentMethod || t.paymentType || 'N/A'}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.status === 'SUCCESS' || t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Inbox className="h-8 w-8 mx-auto text-ink-400" />
                  <p className="text-sm text-ink-600 dark:text-ink-300">No transactions match your query.</p>
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
          </div>
        </>
      )}
    </div>
  );
}
