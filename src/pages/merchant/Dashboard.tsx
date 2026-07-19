import { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface DashboardData {
  stats: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    refundCount: number;
    chargebacks: number;
    todayRevenue: string;
    monthlyRevenue: string;
    availableBalance: string;
    settledAmount: string;
  };
  recentTransactions: Array<{
    transactionId: string;
    orderId: string;
    paymentId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: string;
    currency: string;
    paymentMethod: string;
    transactionStatus: string;
    gatewayResponse: string;
    createdDate: string;
    settlementDate: string;
  }>;
}

export default function MerchantDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);

    if (!API_BASE_URL) {
      try {
        const response = await fetch("/mock-merchant-dashboard.json");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to load mock dashboard:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const [summaryResponse, todayAnalyticsResponse, monthAnalyticsResponse, recentResponse, refundsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/summary`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/payment-analytics?period=today`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/payment-analytics?period=this_month`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/recent-transactions?limit=10`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/refunds?limit=1`, { method: "GET", headers })
      ]);

      if (!summaryResponse.ok || !todayAnalyticsResponse.ok || !monthAnalyticsResponse.ok || !recentResponse.ok || !refundsResponse.ok) {
        throw new Error("One or more dashboard API calls failed");
      }

      const [summaryRes, todayAnalyticsRes, monthAnalyticsRes, recentRes, refundsRes] = await Promise.all([
        summaryResponse.json(),
        todayAnalyticsResponse.json(),
        monthAnalyticsResponse.json(),
        recentResponse.json(),
        refundsResponse.json()
      ]);

      const summary = summaryRes.data || {};
      const todayAnalytics = todayAnalyticsRes.data || {};
      const monthAnalytics = monthAnalyticsRes.data || {};
      const recentTx = recentRes.data?.transactions || [];
      const totalRefunds = refundsRes.data?.pagination?.total_records || 0;

      const formattedStats = {
        totalTransactions: Number(summary.total_transactions || 0),
        successfulTransactions: Number(summary.successful_transactions || 0),
        failedTransactions: Number(summary.failed_transactions || 0),
        pendingTransactions: Number(summary.pending_transactions || 0),
        refundCount: Number(totalRefunds),
        chargebacks: Number(summary.chargebacks || 0),
        todayRevenue: `₹${Number(todayAnalytics.successful_revenue || 0).toFixed(2)}`,
        monthlyRevenue: `₹${Number(monthAnalytics.successful_revenue || 0).toFixed(2)}`,
        availableBalance: `₹${Number(summary.available_balance || 0).toFixed(2)}`,
        settledAmount: `₹${Number(summary.settled_amount || 0).toFixed(2)}`,
      };

      const formattedTransactions = recentTx.map((t: any) => ({
        transactionId: String(t.transaction_id),
        orderId: String(t.order_id || 'N/A'),
        paymentId: String(t.provider_payment_id || 'N/A'),
        customerName: t.customer_name || 'N/A',
        customerEmail: t.customer_email || 'N/A',
        customerPhone: 'N/A',
        amount: Number(t.amount || 0).toFixed(2),
        currency: t.currency === 'INR' ? '₹' : (t.currency || '₹'),
        paymentMethod: t.payment_method || 'N/A',
        transactionStatus: t.status || 'PENDING',
        gatewayResponse: t.payment_provider || 'N/A',
        createdDate: new Date(t.created_at).toLocaleString(),
        settlementDate: 'N/A',
      }));

      setData({
        stats: formattedStats,
        recentTransactions: formattedTransactions
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Dashboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage your business payments and settlements</p>
        </div>
        <button
          onClick={loadDashboard}
          className="btn-secondary self-start sm:self-center flex items-center gap-2 py-2 px-3 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading dashboard data...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Dashboard</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch dashboard metrics. Please check your API URL config or try again.
          </p>
          <button
            onClick={loadDashboard}
            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state / Success states */}
      {!loading && !error && (!data || !data.stats) && (
        <div className="glass-card p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">No Merchant Data</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No gateway logs or settlements were found for this merchant account.
          </p>
        </div>
      )}

      {/* Data View */}
      {!loading && !error && data && data.stats && (
        <>
          {/* Stats Grid - 10 Summary Cards */}
          <div>
            <h3 className="font-display text-sm font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-4">
              Dashboard Summary (Particulars)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { l: "Total Transactions", v: data.stats.totalTransactions, icon: CreditCard, c: 'from-brand-500 to-brand-600' },
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
                <div key={s.l} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-500 dark:text-ink-400 font-medium leading-snug">{s.l}</p>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${s.c} text-white`}>
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold text-ink-900 dark:text-white mt-2">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar & filter placeholder */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full"
              />
            </div>
            <div className="text-xs text-ink-400">
              Showing Page {page} (Pagination Placeholder)
            </div>
          </div>

          {/* Transactions Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Transaction ID</th>
                    <th className="px-5 py-3 font-medium">Order ID</th>
                    <th className="px-5 py-3 font-medium">Payment ID</th>
                    <th className="px-5 py-3 font-medium">Customer Name</th>
                    <th className="px-5 py-3 font-medium">Contact Details</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Gateway Response</th>
                    <th className="px-5 py-3 font-medium">Created Date</th>
                    <th className="px-5 py-3 font-medium">Settlement Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {data.recentTransactions.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{t.transactionId}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{t.orderId}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{t.paymentId}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">{t.customerName}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="text-sm text-ink-900 dark:text-white leading-tight">{t.customerEmail}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{t.customerPhone}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">{t.currency}{t.amount}</td>
                      <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300 whitespace-nowrap">{t.paymentMethod}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.transactionStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          t.transactionStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>{t.transactionStatus}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-ink-500 dark:text-ink-400 max-w-xs truncate">{t.gatewayResponse}</td>
                      <td className="px-5 py-3.5 text-ink-500 dark:text-ink-400 whitespace-nowrap">{t.createdDate}</td>
                      <td className="px-5 py-3.5 text-ink-500 dark:text-ink-400 whitespace-nowrap">{t.settlementDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Placeholder */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">
              <span className="text-xs text-ink-500">Page {page} of 1</span>
              <div className="flex gap-2">
                <button disabled className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 opacity-50 cursor-not-allowed">
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <button disabled className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 opacity-50 cursor-not-allowed">
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
