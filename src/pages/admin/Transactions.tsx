import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Download,
  Calendar,
  Building
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';



interface SystemTransaction {
  transactionId: string;
  merchantName: string;
  merchantCode: string;
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
}

interface AdminTransactionsProps {
  title?: string;
  endpoint?: string;
}

export default function AdminTransactions({ title = "System Transactions", endpoint = "/admin/transactions" }: AdminTransactionsProps) {
  const [data, setData] = useState<SystemTransaction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadTransactions = async () => {
    setLoading(true);
    setError(false);
    try {
      let apiEndpoint = `${endpoint}?page=${page}&limit=50`;
      if (searchQuery) apiEndpoint += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter && statusFilter !== 'ALL') apiEndpoint += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await apiFetch(apiEndpoint, {}, true);
      if (res.success && res.data) {
        const txns = Array.isArray(res.data) ? res.data : (
          res.data.transactions || 
          res.data.netBanking || 
          res.data.upi || 
          res.data.wallets || 
          res.data.cards || 
          res.data.emi || 
          res.data.paylater || 
          []
        );
        const formatted = txns.map((t: any) => ({
          transactionId: String(t.transaction_id || t.transactionId || t.id || 'N/A'),
          merchantName: t.merchant_name || t.merchantName || `Merchant #${t.merchant_id || 'Unknown'}`,
          merchantCode: t.merchant_code || t.merchantCode || `MER${t.merchant_id || ''}`,
          orderId: t.order_id || t.orderId || 'N/A',
          paymentId: t.provider_payment_id || t.paymentId || 'N/A',
          customerName: t.customer_name || t.customerName || 'N/A',
          customerEmail: t.customer_email || t.customerEmail || 'N/A',
          customerPhone: t.customer_phone || t.customerPhone || 'N/A',
          currency: t.currency === 'INR' || !t.currency ? '₹' : t.currency,
          amount: Number(t.amount || 0).toLocaleString(),
          paymentMethod: t.payment_method || t.paymentMethod || 'UPI',
          transactionStatus: t.status || 'PENDING',
          gatewayResponse: t.gateway_response || t.gatewayResponse || 'Captured successfully',
          createdDate: t.created_at || t.createdAt ? new Date(t.created_at || t.createdAt).toLocaleString() : 'N/A',
          settlementDate: t.settled_at || t.settledAt ? new Date(t.settled_at || t.settledAt).toLocaleDateString() : 'Pending'
        }));
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log('Failed to load transactions:', err);
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const headers = [
      "Transaction ID", "Merchant Name", "Merchant Code", "Order ID", "Payment ID", 
      "Customer Name", "Customer Email", "Customer Phone", "Amount", "Currency", 
      "Payment Method", "Status", "Gateway Response", "Created Date", "Settlement Date"
    ];
    const rows = data.map(t => [
      t.transactionId, t.merchantName, t.merchantCode, t.orderId, t.paymentId,
      t.customerName, t.customerEmail, t.customerPhone, t.amount, t.currency,
      t.paymentMethod, t.transactionStatus, t.gatewayResponse, t.createdDate, t.settlementDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">{title}</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">System-wide transaction database ledger logs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadTransactions}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
          <button onClick={exportToCSV} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-3 text-xs inline-flex items-center gap-2 transition">
            <Download className="h-3.5 w-3.5" /> Export Ledger
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading platform transactions...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load System Transactions</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch transaction log database. Please verify API connection or try again.
          </p>
          <button
            onClick={loadTransactions}
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
          <h3 className="font-semibold text-ink-900 dark:text-white">No System Transactions</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No system-wide transactions logs have been recorded yet.
          </p>
        </div>
      )}

      {/* Main transactions view */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-4 flex flex-col gap-1 border border-purple-500/20 bg-purple-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Total Txns</span>
              <span className="text-2xl font-bold text-ink-900 dark:text-white">{data.length}</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 border border-amber-500/20 bg-amber-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Pending</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.filter(t => t.transactionStatus === 'PENDING').length}</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Success</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{data.filter(t => t.transactionStatus === 'SUCCESS').length}</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 border border-rose-500/20 bg-rose-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Failed</span>
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{data.filter(t => t.transactionStatus === 'FAILED').length}</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 border border-blue-500/20 bg-blue-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Success Rate</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.length > 0 ? ((data.filter(t => t.transactionStatus === 'SUCCESS').length / data.length) * 100).toFixed(1) + '%' : '0%'}
              </span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 border border-indigo-500/20 bg-indigo-500/5">
              <span className="text-xs text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Avg Amount</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ₹{data.length > 0 ? (data.reduce((acc, t) => acc + (parseFloat(t.amount.replace(/,/g, '')) || 0), 0) / data.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid gap-3 sm:flex items-center justify-between bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search by Payment ID, Order ID, or Merchant Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-full sm:w-36 focus:ring-purple-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>

              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center ${showDatePicker ? 'border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5" /> Date range
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

          {/* Ledger Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Transaction ID</th>
                    <th className="px-5 py-3 font-medium">Merchant Info</th>
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
                  {data.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{t.transactionId}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-purple-500" />
                          <div>
                            <p className="font-semibold text-ink-900 dark:text-white leading-none">{t.merchantName}</p>
                            <p className="text-[10px] text-ink-400 mt-0.5 font-mono leading-none">{t.merchantCode}</p>
                          </div>
                        </div>
                      </td>
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
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          t.transactionStatus === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
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
