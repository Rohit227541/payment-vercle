import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar
} from 'lucide-react';

const API_URL = "/mock-admin-reports.json";

interface PlatformSummaryReport {
  id: string;
  reportType: string;
  merchantName: string;
  period: string;
  totalVolume: string;
  transactionsCount: number;
  platformFees: string;
  taxCollected: string;
  netPayout: string;
}

export default function AdminReports() {
  const [data, setData] = useState<PlatformSummaryReport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadReports = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (reportId: string, format: string) => {
    alert(`Exporting report ID: ${reportId} in ${format} format.`);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Platform Reports</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Generate aggregated financial statements, fees audit sheets, and export spreadsheets</p>
        </div>
        <button
          onClick={loadReports}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Generating platform records...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Report Generation Failed</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch global transaction records. Verify the API URL placeholder endpoint.
          </p>
          <button
            onClick={loadReports}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && (!data || data.length === 0) && (
        <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">No Reports Generated</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 font-normal">
            No platform-wide aggregated reports have been generated yet.
          </p>
        </div>
      )}

      {/* Main reports view */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Filters Bar */}
          <div className="grid gap-3 sm:flex items-center justify-between bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search reports by ID or merchant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center ${showDatePicker ? 'border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5" /> Billing Period
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 top-full mt-2 z-10 flex items-center gap-1 bg-white dark:bg-ink-900 p-3 rounded-xl border border-ink-200 dark:border-ink-800 shadow-xl">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950 focus:ring-purple-500/20"
                    />
                    <span className="text-ink-400 text-xs">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950 focus:ring-purple-500/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Platform Reports Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Billing Period Ledger Aggregates</h3>
              <span className="text-xs text-ink-400">Page {page} of 1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Report ID</th>
                    <th className="px-5 py-3 font-medium">Report Type</th>
                    <th className="px-5 py-3 font-medium">Merchant / Scope</th>
                    <th className="px-5 py-3 font-medium">Period / Month</th>
                    <th className="px-5 py-3 font-medium">Total Volume</th>
                    <th className="px-5 py-3 font-medium">Txn Count</th>
                    <th className="px-5 py-3 font-medium">Platform Fee Net</th>
                    <th className="px-5 py-3 font-medium">Service Tax (GST)</th>
                    <th className="px-5 py-3 font-medium">Net Settlements</th>
                    <th className="px-5 py-3 font-medium text-right">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {data.map((r) => (
                    <tr key={r.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{r.id}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded px-2 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          {r.reportType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">{r.merchantName}</td>
                      <td className="px-5 py-3.5 text-ink-900 dark:text-white font-medium">{r.period}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{r.totalVolume}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{r.transactionsCount}</td>
                      <td className="px-5 py-3.5 font-semibold text-purple-600">{r.platformFees}</td>
                      <td className="px-5 py-3.5 text-ink-400 text-xs">{r.taxCollected}</td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-500">{r.netPayout}</td>
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={() => handleExport(r.id, "CSV")} className="btn-secondary py-1 px-1.5 text-xs">CSV</button>
                        <button onClick={() => handleExport(r.id, "PDF")} className="btn-secondary py-1 px-1.5 text-xs">PDF</button>
                        <button onClick={() => handleExport(r.id, "Excel")} className="btn-secondary py-1 px-1.5 text-xs">Excel</button>
                      </td>
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
