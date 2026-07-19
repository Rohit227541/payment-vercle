import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Edit2
} from 'lucide-react';

const API_URL = "/mock-admin-charges.json";

interface SystemChargeConfig {
  merchant_id: string;
  payment_method: string;
  fee_type: string;
  fixed_fee: string;
  percentage_fee: string;
  min_fee: string;
  max_fee: string;
  gst_percentage: string;
  effective_from: string;
  effective_to: string;
  status: string;
}

export default function AdminCharges() {
  const [data, setData] = useState<SystemChargeConfig[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);

  const loadCharges = async () => {
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

  useEffect(() => {
    loadCharges();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Platform Billing Console</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">View pricing schedules, platform fees, and tax configurations</p>
        </div>
        <button
          onClick={loadCharges}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Charges
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading fee schedule...</p>
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
            Failed to gather system operational logs. Please verify the placeholder API URL.
          </p>
          <button
            onClick={loadCharges}
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
          <h3 className="font-semibold text-ink-900 dark:text-white">No Charge Setup</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No fee rules have been configured for this platform.
          </p>
        </div>
      )}

      {/* Main view */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Search bar & filter placeholder */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            <div className="text-xs text-ink-400">
              Showing Page {page} of 1
            </div>
          </div>

          {/* Charges Grid Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Merchant ID</th>
                    <th className="px-5 py-3 font-medium">Payment Method</th>
                    <th className="px-5 py-3 font-medium">Fee Type</th>
                    <th className="px-5 py-3 font-medium">Fixed Fee</th>
                    <th className="px-5 py-3 font-medium">Percentage Fee</th>
                    <th className="px-5 py-3 font-medium">Min Fee</th>
                    <th className="px-5 py-3 font-medium">Max Fee</th>
                    <th className="px-5 py-3 font-medium">GST (%)</th>
                    <th className="px-5 py-3 font-medium">Effective From</th>
                    <th className="px-5 py-3 font-medium">Effective To</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {data.map((c) => (
                    <tr key={c.payment_method} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{c.merchant_id}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white">{c.payment_method}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-500">{c.fee_type}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{c.fixed_fee}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{c.percentage_fee}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-400">{c.min_fee}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-400">{c.max_fee}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-400">{c.gst_percentage}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-500">{c.effective_from}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-500">{c.effective_to}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-ink-100 text-ink-500'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button disabled className="btn-secondary py-1 px-2 text-xs flex-inline items-center gap-1 opacity-70">
                          <Edit2 className="h-3.5 w-3.5" /> Modify
                        </button>
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
