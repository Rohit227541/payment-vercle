import { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Landmark,
  Wallet,
  Calculator,
  Clock,
  RefreshCw,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';

type MethodTab = 'upi' | 'card' | 'netbanking' | 'wallet' | 'emi' | 'paylater';

export default function AdminPaymentMethods() {
  const [activeTab, setActiveTab] = useState<MethodTab>('upi');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const fetchMethodData = async (tab: MethodTab) => {
    setLoading(true);
    setError(null);
    try {
      let summaryUrl = `/admin/${tab}/summary`;
      let recentUrl = `/admin/${tab}/recent`;
      let analyticsUrl = `/admin/${tab}`;

      if (tab === 'card') analyticsUrl = '/admin/card/network';
      if (tab === 'upi') analyticsUrl = '/admin/upi/banks';
      if (tab === 'netbanking') analyticsUrl = '/admin/netbanking/banks';
      if (tab === 'wallet') analyticsUrl = '/admin/wallet/top';
      if (tab === 'emi') analyticsUrl = '/admin/emi/banks';
      if (tab === 'paylater') analyticsUrl = '/admin/paylater/providers';

      const [sumRes, recRes, anaRes] = await Promise.all([
        apiFetch(summaryUrl, {}, true),
        apiFetch(recentUrl, {}, true),
        apiFetch(analyticsUrl, {}, true),
      ]);

      if (sumRes.success) setSummaryData(sumRes.data);
      else setSummaryData(null);

      if (recRes.success) setRecentData(Array.isArray(recRes.data) ? recRes.data : recRes.data?.transactions || []);
      else setRecentData([]);

      if (anaRes.success) setAnalyticsData(anaRes.data);
      else setAnalyticsData(null);
    } catch (err: any) {
      console.log(`Failed to fetch ${tab} payment method data:`, err);
      setError(`Could not load ${tab.toUpperCase()} analytics data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethodData(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'upi', label: 'UPI Payments', icon: QrCode },
    { id: 'card', label: 'Cards (Credit/Debit)', icon: CreditCard },
    { id: 'netbanking', label: 'Net Banking', icon: Landmark },
    { id: 'wallet', label: 'Wallets', icon: Wallet },
    { id: 'emi', label: 'EMI Options', icon: Calculator },
    { id: 'paylater', label: 'Pay Later / BNPL', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Payment Method Analytics</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Deep-dive into performance metrics for each payment channel</p>
        </div>
        <button
          onClick={() => fetchMethodData(activeTab)}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analytics
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as MethodTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Fetching {activeTab.toUpperCase()} method metrics...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Analytics Unavailable</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{error}</p>
          <button onClick={() => fetchMethodData(activeTab)} className="btn-primary py-2 px-4 text-xs font-semibold mx-auto">
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Total Volume</span>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
                ₹{Number(summaryData?.totalAmount || summaryData?.volume || 0).toLocaleString()}
              </p>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Transaction Count</span>
                <BarChart2 className="h-4 w-4 text-blue-500" />
              </div>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
                {summaryData?.totalCount || summaryData?.count || 0}
              </p>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Success Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="font-display text-xl font-bold text-emerald-500">
                {summaryData?.successRate || '98.5%'}
              </p>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Active Channel</span>
                <CreditCard className="h-4 w-4 text-amber-500" />
              </div>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-white uppercase">
                {activeTab}
              </p>
            </div>
          </div>

          {/* Detailed Distribution / Analytics Panel */}
          {analyticsData && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white capitalize">
                {activeTab} Network & Provider Analytics Breakdown
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Array.isArray(analyticsData) ? (
                  analyticsData.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 text-xs flex justify-between items-center">
                      <span className="font-medium text-ink-700 dark:text-ink-300">{item.name || item.bank || item.provider || item.network || `Provider ${idx+1}`}</span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{item.count || item.share || 'Active'}</span>
                    </div>
                  ))
                ) : (
                  <pre className="text-xs font-mono p-3 bg-ink-900 text-ink-100 rounded-xl overflow-x-auto col-span-3">
                    {JSON.stringify(analyticsData, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Recent Channel Transactions */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white capitalize">
                Recent {activeTab} Activity Stream
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Transaction ID</th>
                    <th className="px-5 py-3 font-medium">Merchant</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {recentData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-xs text-ink-400">
                        No recent transactions recorded for {activeTab.toUpperCase()}.
                      </td>
                    </tr>
                  ) : (
                    recentData.map((t: any, index: number) => (
                      <tr key={t.transaction_id || index} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                        <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{t.transaction_id || t.id || `TXN-${index}`}</td>
                        <td className="px-5 py-3.5 text-xs text-ink-900 dark:text-white font-medium">{t.merchant_name || t.merchant_id || 'System'}</td>
                        <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white">₹{Number(t.amount || 0).toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                            {t.status || 'SUCCESS'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-ink-400">{t.created_at ? new Date(t.created_at).toLocaleString() : 'Recent'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
