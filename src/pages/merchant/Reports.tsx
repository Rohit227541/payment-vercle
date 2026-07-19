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
import { API_BASE_URL } from '../../config';

interface Settlement {
  settlement_id: string;
  transaction_id: string;
  merchant_id: string;
  gross_amount: string;
  gateway_fee: string;
  gst: string;
  tds: string;
  net_amount: string;
  settlement_status: string;
  settlement_date: string;
  created_at: string;
}

export default function MerchantReports() {
  const [data, setData] = useState<Settlement[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadReports = async () => {
    setLoading(true);
    setError(false);

    if (!API_BASE_URL) {
      try {
        const mockSettlements = [
          {
            settlement_id: "SET-94820",
            transaction_id: "TXN-94820",
            merchant_id: "MERCH-001",
            gross_amount: "2499.00",
            gateway_fee: "49.98",
            gst: "9.00",
            tds: "2.50",
            net_amount: "2437.52",
            settlement_status: "SETTLED",
            settlement_date: "2026-07-18T18:00:00.000Z",
            created_at: "2026-07-18T10:24:00.000Z"
          },
          {
            settlement_id: "SET-94821",
            transaction_id: "TXN-94821",
            merchant_id: "MERCH-001",
            gross_amount: "8990.00",
            gateway_fee: "179.80",
            gst: "32.36",
            tds: "8.99",
            net_amount: "8768.85",
            settlement_status: "SETTLED",
            settlement_date: "2026-07-18T18:00:00.000Z",
            created_at: "2026-07-18T09:51:00.000Z"
          },
          {
            settlement_id: "SET-94823",
            transaction_id: "TXN-94823",
            merchant_id: "MERCH-001",
            gross_amount: "5499.00",
            gateway_fee: "109.98",
            gst: "19.80",
            tds: "5.50",
            net_amount: "5363.72",
            settlement_status: "SETTLED",
            settlement_date: "2026-07-18T06:00:00.000Z",
            created_at: "2026-07-17T18:40:00.000Z"
          }
        ];
        setData(mockSettlements);
        setTotalPages(1);
      } catch (err) {
        console.error("Failed to load mock reports:", err);
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

      let url = `${API_BASE_URL}/settlements?page=${page}&limit=10`;

      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (startDate) {
        url += `&start_date=${encodeURIComponent(startDate)}`;
      }
      if (endDate) {
        url += `&end_date=${encodeURIComponent(endDate)}`;
      }

      const response = await fetch(url, { method: "GET", headers });
      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data?.settlements || []);
        setTotalPages(result.data?.pagination?.total_pages || 1);
      } else {
        throw new Error(result.message || "Failed to fetch settlements");
      }
    } catch (err) {
      console.error("Fetch Settlements Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (reportId: string, format: string) => {
    alert(`Exporting report ID: ${reportId} in ${format} format.`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadReports();
  }, [page, debouncedSearch, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Reports & Audits</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Generate, view, and export platform and merchant reports</p>
        </div>
        <button
          onClick={loadReports}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Reports
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading reports registry...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Reports</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 font-normal">
            Unable to connect to the reports services endpoint. Verify the configured API URL.
          </p>
          <button
            onClick={loadReports}
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
          <h3 className="font-semibold text-ink-900 dark:text-white">No Reports Generated</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No system reports are currently archived for this account.
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
                placeholder="Search reports by ID or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-brand-500/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center ${showDatePicker ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5" /> Date Selection
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 top-full mt-2 z-10 flex items-center gap-1 bg-white dark:bg-ink-900 p-3 rounded-xl border border-ink-200 dark:border-ink-800 shadow-xl">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950 focus:ring-brand-500/20"
                    />
                    <span className="text-ink-400 text-xs">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input py-1 px-2 text-xs w-32 bg-ink-50 dark:bg-ink-950 focus:ring-brand-500/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settlements Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Settlement Logs</h3>
              <span className="text-xs text-ink-400">Page {page} of {totalPages}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Settlement ID</th>
                    <th className="px-5 py-3 font-medium">Transaction ID</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Gross Amount</th>
                    <th className="px-5 py-3 font-medium">Gateway Fee</th>
                    <th className="px-5 py-3 font-medium">GST & TDS</th>
                    <th className="px-5 py-3 font-medium">Net Payout</th>
                    <th className="px-5 py-3 font-medium">Settlement Date</th>
                    <th className="px-5 py-3 font-medium text-right">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {data.map((s) => (
                    <tr key={s.settlement_id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{s.settlement_id}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{s.transaction_id}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          s.settlement_status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          s.settlement_status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {s.settlement_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-900 dark:text-white font-medium">₹{Number(s.gross_amount).toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-rose-500">₹{Number(s.gateway_fee).toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-ink-500 text-xs">
                        <div>GST: ₹{Number(s.gst).toFixed(2)}</div>
                        <div className="mt-0.5">TDS: ₹{Number(s.tds).toFixed(2)}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-500">₹{Number(s.net_amount).toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-ink-550 dark:text-ink-450 text-xs whitespace-nowrap">
                        {s.settlement_date ? new Date(s.settlement_date).toLocaleString() : 'PENDING'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={() => handleExport(s.settlement_id, "CSV")} className="btn-secondary py-1 px-1.5 text-xs">CSV</button>
                        <button onClick={() => handleExport(s.settlement_id, "PDF")} className="btn-secondary py-1 px-1.5 text-xs">PDF</button>
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
        </>
      )}
    </div>
  );
}
