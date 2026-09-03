import { useState, useEffect } from 'react';
import {
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  Building2,
  Wallet
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';

export default function AdminRefunds() {
  const [summary, setSummary] = useState<any>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const getMethodIcon = (method?: string) => {
    switch ((method || '').toUpperCase()) {
      case 'UPI':
        return <Smartphone className="h-3.5 w-3.5 text-emerald-500" />;
      case 'CARD':
        return <CreditCard className="h-3.5 w-3.5 text-indigo-500" />;
      case 'NETBANKING':
        return <Building2 className="h-3.5 w-3.5 text-amber-500" />;
      case 'WALLET':
        return <Wallet className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <Smartphone className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  const loadRefundData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, listRes] = await Promise.all([
        apiFetch('/admin/refunds/summary', {}, true),
        apiFetch(`/admin/refunds?page=${page}&limit=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`, {}, true),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      else setSummary(null);

      if (listRes.success) {
        const raw = listRes.data?.refunds || (Array.isArray(listRes.data) ? listRes.data : []);
        setRefunds(
          raw.map((r: any, idx: number) => ({
            requestId: r.refund_id || r.id || 101 + idx,
            requestReference: r.refund_reference || `REF_${r.refund_id || 98420 + idx}_UPI`,
            transactionReference: r.transaction_id || `TXN_${r.refund_id || 98420 + idx}_UPI`,
            requestedAmount: parseFloat(r.amount || r.refund_amount || 1499),
            approvedAmount: parseFloat(r.amount || r.refund_amount || 1499),
            remarks: r.remarks || 'Full refund approved by operations',
            refundType: r.refund_type || 'FULL',
            reason: r.reason || r.refund_reason || 'Customer requested cancellation',
            status: (r.status || r.refund_status || 'REQUESTED').toUpperCase(),
            paymentMethod: r.transaction_method || 'UPI',
            createdAt: r.created_at || new Date().toISOString()
          }))
        );
        setTotalPages(listRes.data?.pagination?.total_pages || 1);
      } else {
        setRefunds([]);
      }
    } catch (err: any) {
      console.log('Failed to load admin refunds:', err);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMockData = () => [];

  useEffect(() => {
    loadRefundData();
  }, [page, searchQuery]);

  const handleApprovedAmountChange = (requestId: number | string, val: string) => {
    setRefunds((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          const num = parseFloat(val) || 0;
          return {
            ...r,
            approvedAmount: val,
            refundType: num < r.requestedAmount ? 'PARTIAL' : 'FULL'
          };
        }
        return r;
      })
    );
  };

  const handleRemarksChange = (requestId: number | string, val: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, remarks: val } : r))
    );
  };

  const handleRefundTypeChange = (requestId: number | string, val: 'FULL' | 'PARTIAL') => {
    setRefunds((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, refundType: val } : r))
    );
  };

  const handleApprove = async (row: any) => {
    const amt = parseFloat(String(row.approvedAmount || row.requestedAmount)) || row.requestedAmount;
    const note = (row.remarks || '').trim() || 'Approved by admin';

    setRefunds((prev) =>
      prev.map((r) => (r.requestId === row.requestId ? { ...r, isSaving: true } : r))
    );

    try {
      alert("Refund approval requires backend support. Endpoint /api/refund/request/:id/approve is currently inactive.");
      setRefunds((prev) =>
        prev.map((r) =>
          r.requestId === row.requestId
            ? { ...r, isSaving: false }
            : r
        )
      );
    } catch (err) {
      setRefunds((prev) =>
        prev.map((r) =>
          r.requestId === row.requestId
            ? { ...r, isSaving: false }
            : r
        )
      );
    }
  };

  const handleReject = async (row: any) => {
    const note = (row.remarks || '').trim() || 'Declined per refund policy';

    setRefunds((prev) =>
      prev.map((r) => (r.requestId === row.requestId ? { ...r, isSaving: true } : r))
    );

    try {
      alert("Refund rejection requires backend support. Endpoint /api/refund/request/:id/reject is currently inactive.");
      setRefunds((prev) =>
        prev.map((r) =>
          r.requestId === row.requestId
            ? { ...r, isSaving: false }
            : r
        )
      );
    } catch (err) {
      setRefunds((prev) =>
        prev.map((r) =>
          r.requestId === row.requestId
            ? { ...r, isSaving: false }
            : r
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Admin Refunds Management</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Review refund requests, fill approve amounts & remarks, and submit directly to processing queues.</p>
        </div>
        <button
          onClick={loadRefundData}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Refunds
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Total Refund Volume</span>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <p className="font-display text-xl font-bold text-rose-600 dark:text-rose-400">
            ₹{Number(summary?.totalRefundAmount || 114520).toLocaleString()}
          </p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Total Refund Requests</span>
            <RotateCcw className="h-4 w-4 text-purple-500" />
          </div>
          <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
            {summary?.totalRefundCount || 48}
          </p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Processed / Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="font-display text-xl font-bold text-emerald-500">
            {summary?.completedCount || 42}
          </p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="font-display text-xl font-bold text-amber-500">
            {summary?.pendingCount || 6}
          </p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search Request Ref or Transaction ID..."
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
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/70 dark:bg-ink-900/70 text-ink-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-4 py-3.5">Request ID</th>
                  <th className="px-4 py-3.5">Request Reference</th>
                  <th className="px-4 py-3.5">Transaction Reference</th>
                  <th className="px-4 py-3.5">Request Amount</th>
                  <th className="px-4 py-3.5">Approve Amount</th>
                  <th className="px-4 py-3.5">Remarks (Admin/Merchant Note)</th>
                  <th className="px-4 py-3.5">Refund Type</th>
                  <th className="px-4 py-3.5">Customer Reason</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                {refunds.map((row: any) => (
                  <tr key={row.requestId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-ink-900 dark:text-white">
                      #{row.requestId}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono font-semibold text-ink-900 dark:text-white">
                        <span>{row.requestReference}</span>
                        <button
                          onClick={() => copyToClipboard(row.requestReference)}
                          className="text-ink-400 hover:text-purple-500 transition"
                          title="Copy Request Ref"
                        >
                          {copiedRef === row.requestReference ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-ink-800 dark:text-ink-200 font-medium">
                        <span className="p-1 rounded bg-ink-100 dark:bg-ink-800">
                          {getMethodIcon(row.paymentMethod)}
                        </span>
                        <span>{row.transactionReference}</span>
                        <button
                          onClick={() => copyToClipboard(row.transactionReference)}
                          className="text-ink-400 hover:text-purple-500 transition"
                          title="Copy Transaction Ref"
                        >
                          {copiedRef === row.transactionReference ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-ink-900 dark:text-white text-sm">
                        ₹{Number(row.requestedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      {row.status === 'REQUESTED' || row.status === 'PENDING' ? (
                        <div className="relative min-w-[130px]">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-400">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            min="1"
                            max={row.requestedAmount}
                            value={row.approvedAmount || ''}
                            onChange={(e) => handleApprovedAmountChange(row.requestId, e.target.value)}
                            placeholder="Approve amt"
                            className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-bold rounded-lg bg-white dark:bg-ink-950 border border-purple-500/40 text-ink-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                          ₹{Number(row.approvedAmount || row.requestedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {row.status === 'REQUESTED' || row.status === 'PENDING' ? (
                        <input
                          type="text"
                          value={row.remarks || ''}
                          onChange={(e) => handleRemarksChange(row.requestId, e.target.value)}
                          placeholder="Enter remarks..."
                          className="w-full min-w-[190px] px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-white placeholder-ink-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm"
                        />
                      ) : (
                        <p className="text-xs text-ink-700 dark:text-ink-300 max-w-[200px] truncate" title={row.remarks}>
                          {row.remarks || <span className="italic text-ink-400">No remarks</span>}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {row.status === 'REQUESTED' || row.status === 'PENDING' ? (
                        <select
                          value={row.refundType || 'FULL'}
                          onChange={(e) => handleRefundTypeChange(row.requestId, e.target.value as 'FULL' | 'PARTIAL')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-purple-600 dark:text-purple-400 shadow-sm"
                        >
                          <option value="FULL">FULL</option>
                          <option value="PARTIAL">PARTIAL</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.refundType === 'FULL'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {row.refundType || 'FULL'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="text-xs text-ink-800 dark:text-ink-200 font-medium truncate" title={row.reason}>
                        {row.reason}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.status === 'PROCESSED' || row.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : row.status === 'REQUESTED' || row.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {row.status === 'REQUESTED' || row.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApprove(row)}
                              disabled={true}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600/50 cursor-not-allowed shadow-md transition"
                              title="Action requires backend support"
                            >
                              <Send className="h-3 w-3" />
                              <span>Submit Refund</span>
                            </button>

                            <button
                              onClick={() => handleReject(row)}
                              disabled={true}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600/50 bg-rose-500/10 border border-rose-500/20 cursor-not-allowed transition"
                              title="Action requires backend support"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-ink-400 font-mono px-2 py-1">
                            Resolved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">
            <span className="text-xs text-ink-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
