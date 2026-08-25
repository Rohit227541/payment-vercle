import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, FileText, AlertCircle, Search, DollarSign, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { apiFetch } from '../../../services/api.service';

interface DailySummary {
  date: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  totalRevenue: number;
  successRate: number;
}

interface DailyTransaction {
  transactionId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function DailyReports() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [transactions, setTransactions] = useState<DailyTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchDailyReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const summaryRes = await apiFetch(`/admin/report/daily?date=${date}`, {}, true);
      if (summaryRes.success && summaryRes.data && summaryRes.data.summary) {
        setSummary(summaryRes.data.summary);
      } else {
        setSummary(null);
      }

      const txnsRes = await apiFetch(`/admin/report/daily/transactions?date=${date}&page=${page}&limit=50`, {}, true);
      if (txnsRes.success && txnsRes.data) {
        setTransactions(Array.isArray(txnsRes.data.transactions) ? txnsRes.data.transactions : (Array.isArray(txnsRes.data) ? txnsRes.data : []));
      } else {
        setTransactions([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load daily report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
  }, [date, page]);

  const handleExport = async (format: string) => {
    setExportLoading(format);
    try {
      const res = await apiFetch(`/admin/report/daily/export`, {
        method: 'POST',
        body: JSON.stringify({ date, format })
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
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Daily Reports</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">View and export platform activity for a specific day.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input 
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button 
            onClick={fetchDailyReport}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume', value: `₹${(summary?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { label: 'Total Revenue', value: `₹${(summary?.totalGatewayFee || 0).toLocaleString()}`, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Total Txns', value: summary?.totalTransactions || 0, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'Success Rate', value: `${(summary?.successRate || 0)}%`, icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-500/10' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-ink-900 dark:text-white mt-2">
              {loading ? <div className="h-8 w-24 bg-ink-200 dark:bg-ink-800 rounded animate-pulse" /> : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Daily Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
              <tr>
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 w-full bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((t, idx) => (
                  <tr key={t.transactionId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{t.transactionId}</td>
                    <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">{t.merchantName}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-ink-900 dark:text-white">
                      {t.currency} {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-ink-600 dark:text-ink-400">
                      {t.paymentMethod}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600' :
                        t.status === 'FAILED' ? 'bg-rose-500/10 text-rose-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-ink-500 dark:text-ink-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-ink-500">
                    No transactions found for {date}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        {transactions.length >= 50 && (
          <div className="p-4 border-t border-ink-200 dark:border-ink-800 flex justify-end">
            <button
              onClick={() => setPage(page + 1)}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Load Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
