import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, FileText, AlertCircle, DollarSign, Activity, Users, FileSpreadsheet } from 'lucide-react';
import { apiFetch } from '../../../services/api.service';

interface MonthlySummary {
  month: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  totalRevenue: number;
  successRate: number;
  activeMerchants: number;
  newMerchants: number;
}

interface TopMerchant {
  merchantId: string;
  merchantName: string;
  volume: number;
  totalTransactions: number;
  successRate: number;
}

export default function MonthlyReports() {
  const [month, setMonth] = useState<string>(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const [yearStr, monthStr] = month.split('-');
      const m = parseInt(monthStr, 10);
      const y = parseInt(yearStr, 10);

      const summaryRes = await apiFetch(`/admin/report/monthly?month=${m}&year=${y}`, {}, true);
      if (summaryRes.success && summaryRes.data && summaryRes.data.summary) {
        setSummary(summaryRes.data.summary);
      } else {
        setSummary(null);
      }

      const merchantsRes = await apiFetch(`/admin/report/monthly/top-merchants?month=${m}&year=${y}`, {}, true);
      if (merchantsRes.success && merchantsRes.data) {
        setTopMerchants(Array.isArray(merchantsRes.data) ? merchantsRes.data : []);
      } else {
        setTopMerchants([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load monthly report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [month]);

  const handleExport = async (format: string) => {
    setExportLoading(format);
    try {
      const [yearStr, monthStr] = month.split('-');
      const m = parseInt(monthStr, 10);
      const y = parseInt(yearStr, 10);

      const res = await apiFetch(`/admin/report/monthly/export`, {
        method: 'POST',
        body: JSON.stringify({ month: m, year: y, format })
      }, true);
      
      if (res.success && res.data?.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      } else {
        alert(res.message || 'Export failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Export error.');
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Monthly Reports</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">View and export aggregated platform activity for a specific month.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input 
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button 
            onClick={fetchMonthlyReport}
            className="p-2.5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 text-ink-600 dark:text-ink-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            disabled={exportLoading !== null}
            className="bg-white hover:bg-ink-50 dark:bg-ink-900 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 border border-ink-200 dark:border-ink-800 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {exportLoading === 'CSV' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} CSV
          </button>
          <button 
            onClick={() => handleExport('EXCEL')}
            disabled={exportLoading !== null}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {exportLoading === 'EXCEL' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />} Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            disabled={exportLoading !== null}
            className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {exportLoading === 'PDF' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-rose-600 bg-rose-500/10 rounded-xl border border-rose-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider text-xs">Total Monthly Volume</h3>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            {loading ? <div className="h-8 w-32 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : `₹${(summary?.totalVolume || 0).toLocaleString()}`}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider text-xs">Total Monthly Revenue</h3>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-900 dark:text-white mt-4">
            <span className="text-lg text-ink-400 mr-1">₹</span>{loading ? <div className="h-8 w-32 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : summary?.totalRevenue?.toLocaleString()}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider text-xs">Active Merchants</h3>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            {loading ? <div className="h-8 w-24 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : summary?.activeMerchants || 0}
          </div>
          <p className="text-xs text-ink-500 mt-2">+{summary?.newMerchants || 0} new this month</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider text-xs">Total Transactions</h3>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            {loading ? <div className="h-8 w-24 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : (summary?.totalTransactions || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider text-xs">Success Rate</h3>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            {loading ? <div className="h-8 w-24 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : `${(summary?.successRate || 0).toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Top Merchants Table */}
      <div className="glass-card overflow-hidden mt-8">
        <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Top Performing Merchants</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
              <tr>
                <th className="px-5 py-3 font-medium">Merchant Name</th>
                <th className="px-5 py-3 font-medium">Total Volume</th>
                <th className="px-5 py-3 font-medium">Transactions</th>
                <th className="px-5 py-3 font-medium">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-4 w-full bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : topMerchants.length > 0 ? (
                topMerchants.map((m, idx) => (
                  <tr key={m.merchantId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">{m.merchantName}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-ink-900 dark:text-white">
                      ₹{m.volume?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 text-ink-600 dark:text-ink-400">
                      {m.totalTransactions?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (m.successRate || 0) > 85 ? 'bg-emerald-500' : 
                              (m.successRate || 0) > 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(Math.max(m.successRate || 0, 0), 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 w-10">
                          {(m.successRate || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-ink-500">
                    No merchant activity found for {month}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
