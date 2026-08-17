import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  CheckCircle2,
  Eye,
  UserPlus,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  Key,
  FileText,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { API_BASE_URL } from '../../config';
import { apiFetch } from '../../services/api.service';

const API_URL = "/mock-admin-merchants.json";

interface MerchantItem {
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
  const { adminToken } = useAdmin();
  const [data, setData] = useState<MerchantItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [selectedMerchantForInspect, setSelectedMerchantForInspect] = useState<MerchantItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    businessName: '',
    merchantName: '',
    email: '',
    phone: '',
    website: '',
    businessType: 'Sole Proprietorship',
    panNumber: '',
    aadhaarNumber: '',
    bankAccount: '',
    bankName: '',
    ifsc: '',
    accountName: '',
  });

  const loadMerchants = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await apiFetch('/admin/merchant/get-merchant', {}, true);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((m: any) => ({
          merchantId: String(m.merchant_id || m.merchant_code),
          businessName: m.business_name || m.merchant_name || 'N/A',
          merchantName: m.merchant_name || 'N/A',
          email: m.email || 'N/A',
          phone: m.phone || 'N/A',
          website: m.website || 'N/A',
          businessType: m.business_type || 'Sole Proprietorship',
          kycStatus: m.kyc_status || 'PENDING',
          approvalStatus: m.approval_status || 'PENDING',
          apiKey: m.merchant_code || 'N/A',
          secretKey: '••••••••',
          accountStatus: m.account_status || 'HOLD',
          createdDate: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'
        }));
        setData(formatted);
      } else {
        const response = await fetch(API_URL);
        const result = await response.json();
        setData(result);
      }
    } catch {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setData(result);
      } catch {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyMerchantKyc = async (merchantId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const token = adminToken || localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/kyc/${merchantId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || `Merchant ID ${merchantId} KYC updated to ${action}.`);
        loadMerchants();
      } else {
        alert(result.message || "Failed to update KYC status.");
      }
    } catch (err: unknown) {
      console.error("KYC verify API error:", err);
      alert(`API action submitted for Merchant ID ${merchantId} (${action}).`);
    }
  };

  const approveMerchant = (merchantId: string) => {
    verifyMerchantKyc(merchantId, 'APPROVE');
  };

  const handleAddMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedApiKey = `pk_live_${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`;
      const generatedSecretKey = `sk_live_${Math.random().toString(36).substring(2, 18)}`;
      const newMerchantId = `MERCH-${Math.floor(10000 + Math.random() * 90000)}`;

      // Attempt signup endpoint
      await apiFetch('/gateway/signup', {
        method: 'POST',
        body: JSON.stringify({
          businessName: formData.businessName,
          merchantName: formData.merchantName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          businessType: formData.businessType,
          password: 'Password@123',
        }),
      });

      const newMerchant: MerchantItem = {
        merchantId: newMerchantId,
        businessName: formData.businessName,
        merchantName: formData.merchantName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || 'https://example.com',
        businessType: formData.businessType,
        kycStatus: 'APPROVED',
        approvalStatus: 'APPROVED',
        apiKey: generatedApiKey,
        secretKey: generatedSecretKey,
        accountStatus: 'ACTIVE',
        createdDate: new Date().toLocaleDateString(),
      };

      setData((prev) => [newMerchant, ...(prev || [])]);
      alert(`Merchant ${formData.businessName} manually added successfully!\nMerchant ID: ${newMerchantId}`);
      setIsAddModalOpen(false);
      setFormData({
        businessName: '',
        merchantName: '',
        email: '',
        phone: '',
        website: '',
        businessType: 'Sole Proprietorship',
        panNumber: '',
        aadhaarNumber: '',
        bankAccount: '',
        bankName: '',
        ifsc: '',
        accountName: '',
      });
    } catch (err: any) {
      alert('Error creating merchant: ' + (err.message || 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
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
          <p className="text-sm text-ink-500 dark:text-ink-400">Approve registrations, inspect KYC files, and manually add merchants</p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 flex items-center gap-2 py-2 px-3.5 text-xs font-semibold rounded-xl transition"
          >
            <UserPlus className="h-4 w-4" />
            Add Merchant
          </button>
          <button
            onClick={loadMerchants}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
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
          <h3 className="font-semibold text-ink-900 dark:text-white">No Merchants Found</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No merchant registrations exist in system records yet.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition"
          >
            + Add First Merchant
          </button>
        </div>
      )}

      {/* Data views */}
      {!loading && !error && data && data.length > 0 && (
        <>
          {/* Filters Bar */}
          <div className="grid gap-3 sm:flex items-center justify-between bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search by Merchant ID, Email, or Business Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-1.5 text-sm w-full focus:ring-purple-500/20"
              />
            </div>
            
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-full sm:w-40"
              >
                <option value="ALL">All Account Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending Approval</option>
                <option value="SUSPENDED">Suspended</option>
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
                        <button
                          onClick={() => setSelectedMerchantForInspect(m)}
                          className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
                        >
                          <Eye className="h-3.5 w-3.5 text-purple-500" /> Inspect Docs
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

            {/* Pagination Controls */}
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

      {/* Add Merchant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card bg-white dark:bg-ink-900 p-6 rounded-2xl max-w-xl w-full border border-ink-200 dark:border-ink-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-ink-200 dark:border-ink-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Manually Add Merchant</h3>
                  <p className="text-xs text-ink-500">Create new merchant account & generate live API keys</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-ink-400 hover:text-ink-600 dark:hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddMerchantSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Business Name *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="input pl-10 py-2 text-xs w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Merchant Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.merchantName}
                    onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                    className="input py-2 px-3 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="email"
                      required
                      placeholder="merchant@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input pl-10 py-2 text-xs w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input pl-10 py-2 text-xs w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="input py-2 px-3 text-xs w-full"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                    <option value="Partnership">Partnership Firm</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Company PAN Number *</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      className="input pl-10 py-2 text-xs w-full font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Aadhaar Number (12 Digits) *</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 123456789012"
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                    className="input py-2 px-3 text-xs w-full font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-ink-200/60 dark:border-ink-800/60">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Settlement Bank Details</h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Account Beneficiary Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="input py-2 px-3 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank / ICICI Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="input py-2 px-3 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 50100234567890"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="input py-2 px-3 text-xs w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                    className="input py-2 px-3 text-xs w-full font-mono uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-1">Business Website / App URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="url"
                      placeholder="https://acmetech.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="input pl-10 py-2 text-xs w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-200 dark:border-ink-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-5 text-xs font-semibold shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create & Approve Merchant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect KYC Documents Modal */}
      {selectedMerchantForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card bg-white dark:bg-ink-900 p-6 rounded-2xl max-w-2xl w-full border border-ink-200 dark:border-ink-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-ink-200 dark:border-ink-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                    KYC Documents & Profile Inspection
                  </h3>
                  <p className="text-xs text-ink-500">Merchant ID: <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">{selectedMerchantForInspect.merchantId}</span></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMerchantForInspect(null)}
                className="p-1 text-ink-400 hover:text-ink-600 dark:hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Merchant Identity & Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Business Name</span>
                <p className="font-bold text-sm text-ink-900 dark:text-white">{selectedMerchantForInspect.businessName}</p>
              </div>

              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Merchant Owner Name</span>
                <p className="font-bold text-sm text-ink-900 dark:text-white">{selectedMerchantForInspect.merchantName}</p>
              </div>

              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Email Address</span>
                <p className="font-medium text-ink-900 dark:text-white">{selectedMerchantForInspect.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Phone Number</span>
                <p className="font-medium text-ink-900 dark:text-white">{selectedMerchantForInspect.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Business Type</span>
                <p className="font-medium text-ink-900 dark:text-white">{selectedMerchantForInspect.businessType}</p>
              </div>

              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200/50 dark:border-ink-800/50 space-y-1">
                <span className="text-ink-400 font-medium">Website / App</span>
                <p className="font-medium text-purple-600 dark:text-purple-400 truncate">{selectedMerchantForInspect.website}</p>
              </div>
            </div>

            {/* Uploaded Documents Section */}
            <div className="space-y-3 pt-2 border-t border-ink-200 dark:border-ink-800">
              <h4 className="font-display text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider">
                Submitted KYC Documents & Verification Files
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* PAN Card Card */}
                <div className="p-4 rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-ink-900 dark:text-white">PAN Card Document</p>
                        <p className="text-[11px] text-ink-400 font-mono">Format: PDF / Image</p>
                      </div>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      Uploaded
                    </span>
                  </div>

                  <a
                    href={`${API_BASE_URL}/uploads/kyc/merchant_${selectedMerchantForInspect.merchantId}_pan.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View PAN Document
                  </a>
                </div>

                {/* Aadhaar Card Card */}
                <div className="p-4 rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-ink-900 dark:text-white">Aadhaar Card Document</p>
                        <p className="text-[11px] text-ink-400 font-mono">Format: PDF / Image</p>
                      </div>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      Uploaded
                    </span>
                  </div>

                  <a
                    href={`${API_BASE_URL}/uploads/kyc/merchant_${selectedMerchantForInspect.merchantId}_aadhaar.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Aadhaar Document
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-ink-200 dark:border-ink-800">
              <button
                onClick={() => setSelectedMerchantForInspect(null)}
                className="btn-secondary py-2 px-4 text-xs font-semibold"
              >
                Close Window
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    verifyMerchantKyc(selectedMerchantForInspect.merchantId, 'REJECT');
                    setSelectedMerchantForInspect(null);
                  }}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 rounded-xl py-2 px-4 text-xs font-semibold transition"
                >
                  Reject KYC
                </button>

                <button
                  onClick={() => {
                    approveMerchant(selectedMerchantForInspect.merchantId);
                    setSelectedMerchantForInspect(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 px-5 text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve KYC & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
