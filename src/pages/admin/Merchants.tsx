import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  CheckCircle2,
  Eye
} from 'lucide-react';

const API_URL = "/mock-admin-merchants.json";

interface Merchant {
  merchantId: string;
  businessName: string;
  merchantName: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  kycStatus: string;
  approvalStatus: string;
  apiKey: string;
  secretKey: string;
  accountStatus: string;
  createdDate: string;
}

export default function AdminMerchants() {
  const [data, setData] = useState<Merchant[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadMerchants = async () => {
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

  const approveMerchant = async (merchantId: string) => {
    try {
      // Direct API call to approve merchant
      const response = await fetch(`${API_URL.replace('.json', '')}/approve/${merchantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert(`Merchant ID ${merchantId} approved successfully.`);
        loadMerchants();
      } else {
        alert("Failed to approve merchant.");
      }
    } catch (err) {
      console.error(err);
      alert(`API action triggered to approve merchant ID: ${merchantId}`);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Management</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Approve registrations, inspect KYC files, and suspend accounts</p>
        </div>
        <button
          onClick={loadMerchants}
          className="btn-secondary self-start sm:self-center flex items-center gap-2 py-2 px-3 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading merchant registry...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Merchants</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch merchant records from platform database. Verify the API URL.
          </p>
          <button
            onClick={loadMerchants}
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
          <h3 className="font-semibold text-ink-900 dark:text-white">Registry Empty</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 font-normal">
            No merchant accounts have registered on the system yet.
          </p>
        </div>
      )}

      {/* Main merchants view */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Filters Bar */}
          <div className="grid gap-3 sm:flex items-center justify-between bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search by Merchant ID, Email, or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-full sm:w-36 focus:ring-purple-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="PENDING">Pending Approval</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Merchants Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Merchant ID</th>
                    <th className="px-5 py-3 font-medium">Business Name</th>
                    <th className="px-5 py-3 font-medium">Merchant Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Website</th>
                    <th className="px-5 py-3 font-medium">Business Type</th>
                    <th className="px-5 py-3 font-medium">KYC Status</th>
                    <th className="px-5 py-3 font-medium">Approval Status</th>
                    <th className="px-5 py-3 font-medium">API Key</th>
                    <th className="px-5 py-3 font-medium">Secret Key</th>
                    <th className="px-5 py-3 font-medium">Account Status</th>
                    <th className="px-5 py-3 font-medium">Created Date</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {data.map((m) => (
                    <tr key={m.merchantId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{m.merchantId}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">{m.businessName}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-900 dark:text-white whitespace-nowrap">{m.merchantName}</td>
                      <td className="px-5 py-3.5 text-sm text-ink-900 dark:text-white whitespace-nowrap">{m.email}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-400 whitespace-nowrap">{m.phone}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-500 whitespace-nowrap">{m.website}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-500 whitespace-nowrap">{m.businessType}</td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
                          m.kycStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>{m.kycStatus}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
                          m.approvalStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>{m.approvalStatus}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{m.apiKey}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{m.secretKey}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          m.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          m.accountStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>{m.accountStatus}</span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-500 dark:text-ink-400 whitespace-nowrap">{m.createdDate}</td>
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button disabled className="btn-secondary py-1 px-2 text-xs flex-inline items-center gap-1 opacity-70">
                          <Eye className="h-3.5 w-3.5" /> Inspect
                        </button>
                        <button
                          onClick={() => approveMerchant(m.merchantId)}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 rounded-xl py-1 px-2 text-xs inline-flex items-center gap-1 transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
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
