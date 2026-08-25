import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, FileText, AlertCircle, Search, Store, Calendar, TrendingUp } from 'lucide-react';
import { apiFetch } from '../../../services/api.service';

interface MerchantSummary {
  merchant_id: string;
  merchant_name: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  revenue: number;
  successRate: number;
}

export default function MerchantReports() {
  const [merchantId, setMerchantId] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days ago
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [summary, setSummary] = useState<MerchantSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchantReport = async () => {
    if (!searchTrigger) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/admin/report/merchant?merchantId=${searchTrigger}&startDate=${startDate}&endDate=${endDate}`, {}, true);
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        setSummary(null);
        setError(res.message || 'No report found for this merchant in the selected date range.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load merchant report data.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantReport();
  }, [searchTrigger, startDate, endDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (merchantId.trim()) {
      setSearchTrigger(merchantId.trim());
    }
  };

  const handleExport = async () => {
    if (!searchTrigger) return;
    setExportLoading(true);
    try {
      const res = await apiFetch(`/admin/report/merchant/export`, {
        method: 'POST',
        body: JSON.stringify({ merchantId: searchTrigger, startDate, endDate })
      }, true);
      
      if (res.success && res.data?.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      } else {
        alert(res.message || 'Export failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Export error.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Reports</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Generate and export performance reports for specific merchants.</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wider">
              Merchant ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Enter Merchant ID (e.g. MERCH-12345)"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full bg-white dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wider">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wider">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !merchantId.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Generate'}
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-rose-600 bg-rose-500/10 rounded-xl border border-rose-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          <div className="flex items-center justify-between glass-card p-4 rounded-xl border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">{summary.merchant_name || 'Merchant Report'}</h2>
                <p className="text-xs text-ink-500 font-mono">ID: {summary.merchant_id || searchTrigger}</p>
              </div>
            </div>
            
            <button 
              onClick={handleExport}
              disabled={exportLoading}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {exportLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
              Export Data
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider block mb-2">Processed Volume</span>
              <div className="text-2xl font-bold text-ink-900 dark:text-white">
                ₹{(summary.totalVolume || 0).toLocaleString()}
              </div>
            </div>

            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider block mb-2">Total Txns</span>
              <div className="text-2xl font-bold text-ink-900 dark:text-white">
                {(summary.totalTransactions || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="glass-card p-5 border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/5">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-2">Successful</span>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {(summary.successfulTransactions || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="glass-card p-5 border border-rose-500/20 bg-rose-50/30 dark:bg-rose-900/5">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-2">Failed</span>
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                {(summary.failedTransactions || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider block mb-1">Generated Revenue</span>
                  <div className="text-3xl font-display font-bold text-purple-600 dark:text-purple-400">
                    ₹{(summary.revenue || 0).toLocaleString()}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
             </div>
             
             <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider block mb-1">Success Rate</span>
                  <div className="text-3xl font-display font-bold text-blue-600 dark:text-blue-400">
                    {(summary.successRate || 0).toFixed(1)}%
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
             </div>
          </div>
        </div>
      )}

      {!summary && !loading && !searchTrigger && !error && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-ink-900 dark:text-white font-semibold mb-2">Search to Generate Report</h3>
          <p className="text-sm text-ink-500 max-w-sm">
            Enter a Merchant ID and select a date range to generate a comprehensive performance report.
          </p>
        </div>
      )}
    </div>
  );
}
