import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  AlertCircle,
  Search,
  X,
  Inbox,
  CheckCircle2,
  UserPlus,
  Power,
  Trash2,
  Edit,
  Eye,
  FileText,
  Key,
  Shield,
  Clock,
  Building
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { apiFetch } from '../../../services/api.service';
import { API_BASE_URL } from '../../../config';


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

export default function VerifyKycMerchant() {
  const { adminToken } = useAdmin();
  const [data, setData] = useState<MerchantItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [kycFilter, setKycFilter] = useState<string>("PENDING");
  const itemsPerPage = 10;

  // Add Merchant State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    businessName: '',
    merchantName: '',
    email: '',
    phone: '',
    website: ''
  });

  // Edit Merchant State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingMerchantId, setEditingMerchantId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    businessName: '',
    merchantName: '',
    email: '',
    phone: '',
    website: ''
  });

  // View Details & KYC Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [merchantDetails, setMerchantDetails] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'business' | 'kyc' | 'api'>('business');

  // Delete/Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => { },
    type: 'info'
  });

  const loadMerchants = async () => {
    setLoading(true);
    setError(false);
    try {
      let allMerchants: any[] = [];
      let fetchPage = 1;
      let fetchTotalPages = 1;

      do {
        const res = await apiFetch(`/admin/merchant/get-merchant?limit=100&page=${fetchPage}`, {}, true);
        if (res.success && Array.isArray(res.data)) {
          allMerchants = [...allMerchants, ...res.data];
          fetchTotalPages = res.pagination?.totalPages || 1;
          fetchPage++;
        } else {
          break; // Stop on error or invalid response
        }
      } while (fetchPage <= fetchTotalPages);

      if (allMerchants.length > 0) {
        const formatted = allMerchants.map((m: any) => ({
          merchantId: String(m.merchantId || m.merchant_id || m.merchantCode || m.merchant_code || m.id || ''),
          businessName: m.businessName || m.business_name || m.merchantName || m.merchant_name || 'N/A',
          merchantName: m.merchantName || m.merchant_name || 'N/A',
          email: m.email || 'N/A',
          phone: m.phone || 'N/A',
          website: m.website || 'N/A',
          businessType: m.businessType || m.business_type || 'N/A',
          kycStatus: m.kycStatus || m.kyc_status || 'PENDING',
          approvalStatus: m.approvalStatus || m.approval_status || 'PENDING',
          apiKey: m.merchantCode || m.merchant_code || 'N/A',
          secretKey: '••••••••',
          accountStatus: m.accountStatus || m.account_status || 'HOLD',
          createdDate: (m.createdAt || m.created_at) ? new Date(m.createdAt || m.created_at).toLocaleDateString() : 'N/A'
        }));
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Failed to fetch merchants:', err);
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantDetails = async (merchantId: string) => {
    setIsDetailsModalOpen(true);
    setDetailsLoading(true);
    setMerchantDetails(null);
    setVerificationNotes('');
    try {
      const res = await apiFetch(`/admin/merchant/get-merchant/${merchantId}`, {}, true);
      if (res.success && res.data) {
        setMerchantDetails(res.data);
      } else {
        throw new Error(res.message || 'Failed to load details');
      }
    } catch (err: any) {
      alert('Error fetching details: ' + (err.message || 'Something went wrong'));
      setIsDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAddMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/admin/merchant/create-merchant', {
        method: 'POST',
        body: JSON.stringify({
          businessName: formData.businessName,
          merchantName: formData.merchantName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          password: 'Password@123',
        }),
      }, true);

      if (!res.success) {
        throw new Error(res.message || 'Failed to create merchant');
      }

      alert(`Merchant added successfully!`);
      loadMerchants();
      setIsAddModalOpen(false);
      setFormData({ businessName: '', merchantName: '', email: '', phone: '', website: '' });
    } catch (err: any) {
      alert('Error creating merchant: ' + (err.message || 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (merchant: MerchantItem) => {
    setEditingMerchantId(merchant.merchantId);
    setEditFormData({
      businessName: merchant.businessName,
      merchantName: merchant.merchantName,
      email: merchant.email,
      phone: merchant.phone,
      website: merchant.website === 'N/A' ? '' : merchant.website,
    });
    setIsEditModalOpen(true);
  };

  const handleEditMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchantId) return;
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/admin/merchant/update-merchant/${editingMerchantId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          businessName: editFormData.businessName,
          merchantName: editFormData.merchantName,
          email: editFormData.email,
          phone: editFormData.phone,
          website: editFormData.website,
        }),
      }, true);

      if (!res.success) throw new Error(res.message || 'Failed to update merchant');

      alert(`Merchant updated successfully!`);
      loadMerchants();
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert('Error updating merchant: ' + (err.message || 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccountStatus = async (merchantId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'HOLD' : 'ACTIVE';
    try {
      const res = await apiFetch(`/admin/merchant/update-merchant-status/${merchantId}/account-status`, {
        method: 'PATCH',
        body: JSON.stringify({ accountStatus: newStatus }),
      }, true);
      if (res.success) {
        alert(`Account status updated to ${newStatus}`);
        loadMerchants();
        if (merchantDetails?.merchant?.merchantId === merchantId) {
          loadMerchantDetails(merchantId); // Refresh details if open
        }
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const approveMerchant = async (merchantId: string) => {
    try {
      const res = await apiFetch(`/admin/merchant/approve-merchant/${merchantId}`, {
        method: 'PATCH',
      }, true);
      if (res.success) {
        alert(`Merchant Approved successfully.`);
        loadMerchants();
        if (merchantDetails?.merchant?.merchantId === merchantId) {
          loadMerchantDetails(merchantId);
        }
      } else {
        throw new Error(res.message || 'Approval failed');
      }
    } catch (err: any) {
      alert('Error approving merchant: ' + err.message);
    }
  };

  const deleteMerchant = async (merchantId: string) => {
    try {
      const res = await apiFetch(`/admin/merchant/delete-merchant/${merchantId}`, {
        method: 'DELETE',
      }, true);
      if (res.success) {
        alert(`Merchant deleted successfully.`);
        loadMerchants();
      } else {
        throw new Error(res.message || 'Delete failed');
      }
    } catch (err: any) {
      alert('Error deleting merchant: ' + err.message);
    }
  };

  const verifyMerchantKyc = async (
    merchantId: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      const res = await apiFetch(
        `/admin/kyc/${merchantId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            action: status,
            verification_notes: verificationNotes
          }),
        },
        true
      );

      if (res.success) {
        alert(`KYC marked as ${status}.`);
        loadMerchants();
        loadMerchantDetails(merchantId);
      } else {
        throw new Error(
          res.message || 'KYC verification failed'
        );
      }
    } catch (err: any) {
      alert(
        'Error updating KYC: ' +
        err.message
      );
    }
  };

  const allowKycResubmission = async (merchantId: string) => {
    try {
      const res = await apiFetch(`/admin/merchant/allow-kyc-resubmission/${merchantId}/kyc`, {
        method: 'PATCH',
        body: JSON.stringify({ verificationNotes }),
      }, true);
      if (res.success) {
        alert(`KYC resubmission allowed.`);
        loadMerchants();
        loadMerchantDetails(merchantId);
      } else {
        throw new Error(res.message || 'Failed to allow resubmission');
      }
    } catch (err: any) {
      alert('Error allowing resubmission: ' + err.message);
    }
  };


  const confirmDelete = (merchantId: string, businessName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Merchant',
      message: `Are you sure you want to permanently delete merchant "${businessName}" (${merchantId})? This action cannot be undone.`,
      type: 'danger',
      action: () => {
        deleteMerchant(merchantId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const confirmStatusChange = (merchantId: string, businessName: string, currentStatus: string) => {
    const actionText = currentStatus === 'ACTIVE' ? 'suspend (HOLD)' : 'activate (ACTIVE)';
    setConfirmModal({
      isOpen: true,
      title: 'Change Account Status',
      message: `Are you sure you want to ${actionText} the account for "${businessName}"?`,
      type: 'warning',
      action: () => {
        toggleAccountStatus(merchantId, currentStatus);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const confirmApprove = (merchantId: string, businessName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Approve Merchant',
      message: `Are you sure you want to officially approve the registration for "${businessName}"?`,
      type: 'info',
      action: () => {
        approveMerchant(merchantId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const confirmKycAction = (merchantId: string, actionName: string, actionFn: () => void) => {
    setConfirmModal({
      isOpen: true,
      title: `Confirm KYC ${actionName}`,
      message: `Are you sure you want to ${actionName.toLowerCase()} the KYC for this merchant?`,
      type: actionName === 'Reject' ? 'danger' : 'info',
      action: () => {
        actionFn();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  const getDocUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;

    // The backend database often stores only the filename (e.g. pan_32_abc.png).
    // The static files are served at /uploads/kyc/ by the backend.
    const normalizedPath = path.replace(/^\/+/, '');
    const fullPath = normalizedPath.startsWith('uploads/')
      ? normalizedPath
      : `uploads/kyc/${normalizedPath}`;

    // Handle the case where API_BASE_URL contains a path (like /merchant)
    // We need to fetch from the root of the API server (e.g., https://api.trustgates.co.in/uploads/kyc/...)
    try {
      const url = new URL(API_BASE_URL);
      return `${url.origin}/${fullPath}`;
    } catch (e) {
      // Fallback if API_BASE_URL is relative
      return `${API_BASE_URL.replace(/\/+$/, '')}/${fullPath}`;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, kycFilter]);

  const filteredMerchants = data ? data.filter(m =>
    (kycFilter === 'ALL' || m.kycStatus === kycFilter) &&
    (m.merchantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const totalItems = filteredMerchants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMerchants = filteredMerchants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Verify Merchant KYC</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Review and verify KYC documents for registered merchants</p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={loadMerchants}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading merchant registry...</p>
        </div>
      )}

      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Merchants</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch merchant records from platform database. Verify the API URL.
          </p>
          <button onClick={loadMerchants} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition">
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && (!data || data.length === 0) && (
        <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">No Merchants Found</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">No merchant registrations exist in system records yet.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition">
            + Add First Merchant
          </button>
        </div>
      )}

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
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-full sm:w-40"
              >
                <option value="ALL">All KYC Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Merchants Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl shadow-xl shadow-purple-900/5 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/80 dark:bg-ink-900/80 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Merchant ID</th>
                    <th className="px-5 py-3 font-medium">Business / Owner</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 font-medium">Statuses</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
                  {currentMerchants.map((m) => (
                    <tr key={m.merchantId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300 whitespace-nowrap">{m.merchantId}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-ink-900 dark:text-white">{m.businessName}</p>
                        <p className="text-xs text-ink-500">{m.merchantName}</p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-ink-500">
                        <p className="text-ink-900 dark:text-white">{m.email}</p>
                        <p>{m.phone}</p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap space-y-1">
                        <div>
                          <span className="text-[10px] uppercase text-ink-400 mr-2 inline-block w-14">KYC</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${m.kycStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                            m.kycStatus === 'REJECTED' ? 'bg-rose-500/10 text-rose-600' :
                              'bg-amber-500/10 text-amber-600'
                            }`}>{m.kycStatus}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-ink-400 mr-2 inline-block w-14">Apprv.</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${m.approvalStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                            }`}>{m.approvalStatus}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-ink-400 mr-2 inline-block w-14">Acct.</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${m.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>{m.accountStatus}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => { setActiveTab('kyc'); loadMerchantDetails(m.merchantId); }}
                            className="p-2 rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-500/25 flex items-center gap-2 px-3 text-xs font-semibold hover:bg-purple-400 transition-colors"
                            title="Verify KYC"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Verify KYC
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && !loading && filteredMerchants.length > 0 && (
              <div className="p-4 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between bg-ink-50/50 dark:bg-ink-900/50">
                <span className="text-xs text-ink-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-ink-200 dark:border-ink-800 text-xs font-medium hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-50 text-ink-700 dark:text-ink-300 bg-white dark:bg-ink-900"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold px-2 text-ink-700 dark:text-ink-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-ink-200 dark:border-ink-800 text-xs font-medium hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-50 text-ink-700 dark:text-ink-300 bg-white dark:bg-ink-900"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Merchant Details & KYC Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/90 dark:bg-ink-950/90 backdrop-blur-2xl rounded-2xl w-full max-w-4xl border border-ink-200/50 dark:border-ink-800/50 shadow-2xl shadow-purple-900/10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-ink-200 dark:border-ink-800 p-5 shrink-0 bg-ink-50/50 dark:bg-ink-900/50">
                <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" /> Merchant Dossier
                </h3>
                <button onClick={() => setIsDetailsModalOpen(false)} className="p-1.5 text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-800 rounded-lg transition"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {detailsLoading ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-sm text-ink-500 font-medium">Fetching comprehensive records...</p>
                  </div>
                ) : !merchantDetails ? (
                  <div className="text-center py-20 text-rose-500 font-medium flex flex-col items-center gap-3">
                    <AlertCircle className="h-10 w-10 opacity-50" />
                    Failed to load details.
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-48 shrink-0 border-b md:border-b-0 md:border-r border-ink-200 dark:border-ink-800 p-4 space-y-1 bg-ink-50/30 dark:bg-ink-900/30">
                      <button
                        onClick={() => setActiveTab('business')}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'business' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'}`}
                      >
                        <Building className="h-4 w-4" /> Business Info
                      </button>
                      <button
                        onClick={() => setActiveTab('kyc')}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'kyc' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'}`}
                      >
                        <Shield className="h-4 w-4" /> KYC Docs
                      </button>
                      <button
                        onClick={() => setActiveTab('api')}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'api' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'}`}
                      >
                        <Key className="h-4 w-4" /> API Keys
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-5 md:p-6 flex-1 bg-white dark:bg-ink-950 overflow-y-auto">

                      {activeTab === 'business' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          {/* Status Badges */}
                          <div className="flex flex-wrap gap-3 p-4 bg-ink-50 dark:bg-ink-900/50 rounded-xl border border-ink-200/50 dark:border-ink-800/50">
                            <div className="flex-1 min-w-[120px]">
                              <p className="text-xs text-ink-500 mb-1">Account Status</p>
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${merchantDetails.merchant.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>{merchantDetails.merchant.accountStatus}</span>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <p className="text-xs text-ink-500 mb-1">Approval Status</p>
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${merchantDetails.merchant.approvalStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>{merchantDetails.merchant.approvalStatus}</span>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <p className="text-xs text-ink-500 mb-1">KYC Status</p>
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${merchantDetails.merchant.kycStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                                merchantDetails.merchant.kycStatus === 'REJECTED' ? 'bg-rose-500/10 text-rose-600' :
                                  'bg-amber-500/10 text-amber-600'
                                }`}>{merchantDetails.merchant.kycStatus}</span>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <p className="text-xs text-ink-500 mb-1">Email Verified</p>
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${merchantDetails.merchant.emailVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                }`}>{merchantDetails.merchant.emailVerified ? 'VERIFIED' : 'PENDING'}</span>
                            </div>
                          </div>

                          {/* Merchant Details Grid */}
                          <div>
                            <h4 className="font-semibold text-ink-900 dark:text-white mb-4">Core Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Merchant ID</p>
                                <p className="font-mono text-sm mt-1 dark:text-white">{merchantDetails.merchant.merchantCode}</p>
                              </div>
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Business Name</p>
                                <p className="font-semibold text-sm mt-1 dark:text-white">{merchantDetails.merchant.businessName}</p>
                              </div>
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Owner Name</p>
                                <p className="font-semibold text-sm mt-1 dark:text-white">{merchantDetails.merchant.merchantName}</p>
                              </div>
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Email Address</p>
                                <p className="font-semibold text-sm mt-1 dark:text-white">{merchantDetails.merchant.email}</p>
                              </div>
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Phone</p>
                                <p className="font-semibold text-sm mt-1 dark:text-white">{merchantDetails.merchant.phone}</p>
                              </div>
                              <div className="p-3.5 bg-ink-50/50 dark:bg-ink-900/50 rounded-xl border border-ink-100 dark:border-ink-800">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Website</p>
                                <p className="font-semibold text-sm mt-1 text-purple-600 truncate">{merchantDetails.merchant.website || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'kyc' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          {!merchantDetails.kyc ? (
                            <div className="p-10 text-center bg-ink-50 dark:bg-ink-800/50 rounded-2xl border border-dashed border-ink-300 dark:border-ink-700 text-ink-500">
                              <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
                              <p className="font-medium">No KYC documents submitted yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-4">
                                <div className="p-5 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-700 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                                  <div>
                                    <h5 className="font-bold text-sm text-ink-900 dark:text-white flex items-center gap-2 mb-1">PAN Details</h5>
                                    <p className="font-mono text-sm text-ink-600 dark:text-ink-300">{merchantDetails.kyc.pan_number}</p>
                                  </div>
                                  {merchantDetails.kyc.pan_document ? (
                                    <a href={getDocUrl(merchantDetails.kyc.pan_document)} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-4 text-xs">
                                      <FileText className="h-4 w-4 text-purple-500" /> View Document
                                    </a>
                                  ) : (
                                    <span className="text-xs text-ink-400 italic">Not uploaded</span>
                                  )}
                                </div>

                                <div className="p-5 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-700 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                                  <div>
                                    <h5 className="font-bold text-sm text-ink-900 dark:text-white flex items-center gap-2 mb-1">Aadhaar Details</h5>
                                    <p className="font-mono text-sm text-ink-600 dark:text-ink-300">{merchantDetails.kyc.aadhaar_number}</p>
                                  </div>
                                  {merchantDetails.kyc.aadhaar_document ? (
                                    <a href={getDocUrl(merchantDetails.kyc.aadhaar_document)} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-4 text-xs">
                                      <FileText className="h-4 w-4 text-purple-500" /> View Document
                                    </a>
                                  ) : (
                                    <span className="text-xs text-ink-400 italic">Not uploaded</span>
                                  )}
                                </div>
                              </div>

                              {/* KYC Actions */}
                              <div className="p-5 bg-ink-50 dark:bg-ink-900/50 rounded-2xl border border-ink-200/50 dark:border-ink-800/50">
                                <h5 className="font-bold text-sm text-ink-900 dark:text-white mb-4">Admin Action Console</h5>

                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-ink-700 dark:text-ink-300 mb-2">Verification Notes</label>
                                    <textarea
                                      value={verificationNotes}
                                      onChange={(e) => setVerificationNotes(e.target.value)}
                                      className="input w-full text-sm py-3"
                                      placeholder="Provide context for approval, rejection, or resubmission request..."
                                      rows={2}
                                    />
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <button
                                      onClick={() => confirmKycAction(merchantDetails.merchant.merchantId, 'Approve', () => verifyMerchantKyc(merchantDetails.merchant.merchantId, 'APPROVED'))}
                                      disabled={merchantDetails.merchant.kycStatus === 'APPROVED'}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 px-5 text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => confirmKycAction(merchantDetails.merchant.merchantId, 'Reject', () => verifyMerchantKyc(merchantDetails.merchant.merchantId, 'REJECTED'))}
                                      disabled={merchantDetails.merchant.kycStatus === 'REJECTED'}
                                      className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2 px-5 text-xs font-bold shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      onClick={() => confirmKycAction(merchantDetails.merchant.merchantId, 'Allow Resubmission', () => allowKycResubmission(merchantDetails.merchant.merchantId))}
                                      disabled={merchantDetails.kyc.kyc_resubmission_allowed === 1}
                                      className="bg-amber-500 hover:bg-amber-400 text-white rounded-xl py-2 px-5 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                      Request Resubmission
                                    </button>
                                  </div>

                                  {merchantDetails.kyc.verification_notes && (
                                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                                      <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">Previous Admin Notes:</p>
                                      <p className="text-sm text-amber-700 dark:text-amber-300">{merchantDetails.kyc.verification_notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'api' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          {merchantDetails.apiCredentials && merchantDetails.apiCredentials.length > 0 ? (
                            <div className="space-y-3">
                              {merchantDetails.apiCredentials.map((cred: any) => (
                                <div key={cred.credentialId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 shadow-sm">
                                  <div>
                                    <p className="font-mono text-sm font-semibold text-ink-900 dark:text-white mb-1.5">{cred.publicKey}</p>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cred.environment === 'PRODUCTION' ? 'bg-purple-500/10 text-purple-600' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'}`}>{cred.environment}</span>
                                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cred.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{cred.status}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3 sm:mt-0 text-right">
                                    <p className="text-xs font-medium text-ink-500 flex items-center justify-end gap-1.5"><Clock className="h-3.5 w-3.5" /> Last used: {cred.lastUsedAt ? new Date(cred.lastUsedAt).toLocaleString() : 'Never'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-10 text-center bg-ink-50 dark:bg-ink-800/50 rounded-2xl border border-dashed border-ink-300 dark:border-ink-700 text-ink-500">
                              <Key className="h-10 w-10 mx-auto mb-3 opacity-30" />
                              <p className="font-medium">No API credentials generated yet.</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/90 dark:bg-ink-950/90 backdrop-blur-2xl p-8 rounded-3xl max-w-md w-full border border-ink-200/50 dark:border-ink-800/50 shadow-2xl shadow-purple-900/20 space-y-5 text-center">
            <div className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${confirmModal.type === 'danger' ? 'bg-rose-500/10 text-rose-500' :
              confirmModal.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                'bg-purple-500/10 text-purple-500'
              }`}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{confirmModal.title}</h3>
              <p className="text-sm text-ink-500 mt-2">{confirmModal.message}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4">
              <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="btn-secondary py-2 px-4 text-xs font-semibold">Cancel</button>
              <button onClick={confirmModal.action} className={`rounded-xl py-2 px-5 text-xs font-semibold text-white shadow-lg transition ${confirmModal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' :
                confirmModal.type === 'warning' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' :
                  'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
                }`}>
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white/90 dark:bg-ink-950/90 backdrop-blur-2xl p-6 rounded-3xl max-w-md w-full border border-ink-200/50 dark:border-ink-800/50 shadow-2xl shadow-purple-900/20 space-y-5">
            <div className="flex items-center justify-between border-b border-ink-200/50 dark:border-ink-800/50 pb-4">
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Manually Add Merchant</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-ink-400 hover:text-ink-600 dark:hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddMerchantSubmit} className="space-y-4">
              <div className="space-y-3">
                <input type="text" required placeholder="Business Name" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="text" required placeholder="Owner Name" value={formData.merchantName} onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })} className="input py-2 px-3 text-xs w-full" />
                <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="url" placeholder="Website URL" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="input py-2 text-xs w-full" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-ink-200/50 dark:border-ink-800/50">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary py-2 px-4 text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white rounded-xl py-2 px-5 text-xs font-semibold flex gap-2 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                  {isSubmitting ? 'Creating...' : 'Create Merchant'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white/90 dark:bg-ink-950/90 backdrop-blur-2xl p-6 rounded-3xl max-w-md w-full border border-ink-200/50 dark:border-ink-800/50 shadow-2xl shadow-purple-900/20 space-y-5">
            <div className="flex items-center justify-between border-b border-ink-200/50 dark:border-ink-800/50 pb-4">
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Edit Merchant</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-ink-400 hover:text-ink-600 dark:hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditMerchantSubmit} className="space-y-4">
              <div className="space-y-3">
                <input type="text" required placeholder="Business Name" value={editFormData.businessName} onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="text" required placeholder="Owner Name" value={editFormData.merchantName} onChange={(e) => setEditFormData({ ...editFormData, merchantName: e.target.value })} className="input py-2 px-3 text-xs w-full" />
                <input type="email" required placeholder="Email Address" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="tel" required placeholder="Phone Number" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="input py-2 text-xs w-full" />
                <input type="url" placeholder="Website URL" value={editFormData.website} onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })} className="input py-2 text-xs w-full" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-ink-200/50 dark:border-ink-800/50">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary py-2 px-4 text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white rounded-xl py-2 px-5 text-xs font-semibold flex gap-2 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
