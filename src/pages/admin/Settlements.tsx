import { useState, useEffect } from 'react';
import {
  Landmark,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar,
  DollarSign
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';

export default function AdminSettlements() {
  const [summary, setSummary] = useState<any>(null);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadSettlementData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Admin Settlements API is not yet implemented in the backend.
      // Settlements are distinct from wallets.
      throw new Error('Settlement endpoints are not active in backend.');
    } catch (err: any) {
      console.log('Failed to load admin settlements:', err);
      setError('Settlement functionality is currently unavailable (Pending Backend API).');
      setSettlements([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettlementData();
  }, [page, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Admin Settlements Control</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Monitor platform payouts, merchant bank transfers, and fees</p>
        </div>
        <button
          onClick={loadSettlementData}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Payouts
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Total Settled Payouts</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
              ₹{Number(summary.totalSettledAmount || summary.settledAmount || 0).toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Pending Settlements</span>
              <Landmark className="h-4 w-4 text-amber-500" />
            </div>
            <p className="font-display text-xl font-bold text-amber-600">
              ₹{Number(summary.pendingAmount || 0).toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Platform Gateway Commission</span>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
            <p className="font-display text-xl font-bold text-purple-600 dark:text-purple-400">
              ₹{Number(summary.totalGatewayFee || 0).toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Tax Deductions (TDS/GST)</span>
              <Calendar className="h-4 w-4 text-cyan-500" />
            </div>
            <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
              ₹{Number(summary.totalTaxDeductions || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Main Table View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading settlements directory...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Error Loading Settlements</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{error}</p>
          <button onClick={loadSettlementData} className="btn-primary py-2 px-4 text-xs font-semibold mx-auto">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search Settlement ID or Merchant ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            <span className="text-xs text-ink-400">Page {page} of {totalPages}</span>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Settlement ID</th>
                    <th className="px-5 py-3 font-medium">Merchant ID</th>
                    <th className="px-5 py-3 font-medium">Gross Amount</th>
                    <th className="px-5 py-3 font-medium">Gateway Fee</th>
                    <th className="px-5 py-3 font-medium">Net Payout</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Payout Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {settlements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-xs text-ink-400">
                        <Inbox className="h-8 w-8 mx-auto mb-2 text-ink-300" />
                        No settlements found in system records.
                      </td>
                    </tr>
                  ) : (
                    settlements.map((s: any, idx: number) => (
                      <tr key={s.settlement_id || idx} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                        <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{s.settlement_id || `SET-${idx}`}</td>
                        <td className="px-5 py-3.5 text-xs text-ink-900 dark:text-white font-medium">{s.merchant_id || 'System'}</td>
                        <td className="px-5 py-3.5 text-ink-900 dark:text-white font-medium">₹{Number(s.gross_amount || 0).toFixed(2)}</td>
                        <td className="px-5 py-3.5 text-rose-500">₹{Number(s.gateway_fee || 0).toFixed(2)}</td>
                        <td className="px-5 py-3.5 font-semibold text-emerald-500">₹{Number(s.net_amount || 0).toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            s.settlement_status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {s.settlement_status || 'SETTLED'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-ink-400">
                          {s.settlement_date ? new Date(s.settlement_date).toLocaleString() : 'Done'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">
              <span className="text-xs text-ink-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
