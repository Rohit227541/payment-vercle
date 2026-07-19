import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Download,
  Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Transaction {
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
}

export default function MerchantTransactions() {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadTransactions = async () => {
    setLoading(true);
    setError(false);

    if (!API_BASE_URL) {
      try {
        const response = await fetch("/mock-merchant-transactions.json");
        const result = await response.json();
        setData(result);
        setTotalPages(1);
        setTotalRecords(result.length);
      } catch (err) {
        console.error("Failed to load mock transactions:", err);
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

      let url = `${API_BASE_URL}/recent-transactions?page=${page}&limit=10`;

      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }

      if (statusFilter && statusFilter !== "ALL") {
        url += `&status=${encodeURIComponent(statusFilter)}`;
      }

      if (startDate) {
        url += `&start_date=${encodeURIComponent(startDate)}`;
      }

      if (endDate) {
        url += `&end_date=${encodeURIComponent(endDate)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load transactions");
      }

      const transactions = result.data?.transactions || [];
      const formatted = transactions.map((t: any) => ({
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

      setData(formatted);
      setTotalPages(result.data?.pagination?.total_pages || 1);
      setTotalRecords(result.data?.pagination?.total_records || 0);
    } catch (err: any) {
      console.error("Failed to load transactions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const headers = [
      "Transaction ID", "Order ID", "Payment ID", "Customer Name", 
      "Customer Email", "Customer Phone", "Amount", "Currency", 
      "Payment Method", "Status", "Gateway Response", "Created Date", "Settlement Date"
    ];
    const rows = data.map(t => [
      t.transactionId, t.orderId, t.paymentId, t.customerName,
      t.customerEmail, t.customerPhone, t.amount, t.currency,
      t.paymentMethod, t.transactionStatus, t.gatewayResponse, t.createdDate, t.settlementDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, startDate, endDate, debouncedSearch]);

  useEffect(() => {
    loadTransactions();
  }, [page, statusFilter, startDate, endDate, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Track and manage all customer payments</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={loadTransactions}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={exportToCSV} className="btn-primary flex items-center gap-2 py-2 px-3 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading transactions...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Transactions</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch transaction database. Please check your API URL configuration or try again.
          </p>
          <button
            onClick={loadTransactions}
            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
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
          <h3 className="font-semibold text-ink-900 dark:text-white">No Transactions Found</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 font-normal">
            No transactions have been processed on this merchant account yet.
          </p>
        </div>
      )}

      {/* Main transactions view */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Filters Bar */}
          <div className="grid gap-3 sm:flex items-center justify-between bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search by Payment ID, Order ID, or Customer Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-brand-500/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-full sm:w-36"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>

              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 ${showDatePicker ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5" /> Date Range
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 top-full mt-2 z-10 flex items-center gap-1 bg-white dark:bg-ink-900 p-3 rounded-xl border border-ink-200 dark:border-ink-800 shadow-xl">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950"
                    />
                    <span className="text-ink-400 text-xs">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="glass-card overflow-hidden">
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
                  {data.map((t) => (
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">
              <span className="text-xs text-ink-500">Page {page} of {totalPages} (Total: {totalRecords})</span>
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
        </>
      )}
    </div>
  );
}
