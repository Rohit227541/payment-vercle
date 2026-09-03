import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Percent, Search, Settings2, Edit, Save, X, CreditCard,
  Smartphone, Globe, Wallet, Activity, ChevronLeft, ChevronRight,
  Building, Plus, Trash2, Eye
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';
import toast from 'react-hot-toast';

interface FeeRecord {
  feeId: number;
  merchantId: number;
  paymentMethod: string;
  feeType: 'FIXED' | 'PERCENTAGE' | 'HYBRID';
  fixedFee: number;
  percentageFee: number;
  minFee: number;
  maxFee: number;
  gstPercentage: number;
  status: 'ACTIVE' | 'INACTIVE';
  effectiveFrom: string;
}

export default function FeeManagement() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Data
  const [allMerchants, setAllMerchants] = useState<any[]>([]);
  const [allFees, setAllFees] = useState<FeeRecord[]>([]);

  // Modals state
  const [selectedMerchant, setSelectedMerchant] = useState<any | null>(null); // For View Fee Modal
  const [editingFee, setEditingFee] = useState<FeeRecord | Partial<FeeRecord> | null>(null); // For Add/Edit Fee Form
  const [selectedMerchantFees, setSelectedMerchantFees] = useState<FeeRecord[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feeRes, merchRes] = await Promise.all([
        apiFetch('https://api.trustgates.co.in/admin/fee-management?limit=100', {}, true),
        apiFetch('https://api.trustgates.co.in/admin/merchant/get-merchant?limit=100', {}, true)
      ]);

      if (merchRes?.success && merchRes?.data) {
        const mData = Array.isArray(merchRes.data) ? merchRes.data : (merchRes.data.data || []);
        setAllMerchants(mData);
      }

      if (feeRes?.success && feeRes?.data) {
        const feeData = Array.isArray(feeRes.data) ? feeRes.data : (feeRes.data.data || []);

        // Map snake_case database fields to our camelCase FeeRecord interface
        const mappedFees: FeeRecord[] = feeData.map((f: any) => ({
          feeId: f.fee_id || f.feeId,
          merchantId: f.merchant_id || f.merchantId,
          paymentMethod: f.payment_method || f.paymentMethod,
          feeType: f.fee_type || f.feeType,
          fixedFee: Number(f.fixed_fee || f.fixedFee || 0),
          percentageFee: Number(f.percentage_fee || f.percentageFee || 0),
          minFee: Number(f.min_fee || f.minFee || 0),
          maxFee: Number(f.max_fee || f.maxFee || 0),
          gstPercentage: Number(f.gst_percentage || f.gstPercentage || 18),
          status: f.status,
          effectiveFrom: f.effective_from || f.effectiveFrom
        }));

        setAllFees(mappedFees);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMerchantFees = async (merchantId: number) => {
    setLoadingFees(true);
    try {
      const res = await apiFetch(`https://api.trustgates.co.in/admin/fee-management/merchant/${merchantId}`, {}, true);
      if (res?.success && Array.isArray(res.data)) {
        const mappedFees: FeeRecord[] = res.data.map((f: any) => ({
          feeId: f.fee_id || f.feeId,
          merchantId: f.merchant_id || f.merchantId,
          paymentMethod: f.payment_method || f.paymentMethod,
          feeType: f.fee_type || f.feeType,
          fixedFee: Number(f.fixed_fee || f.fixedFee || 0),
          percentageFee: Number(f.percentage_fee || f.percentageFee || 0),
          minFee: Number(f.min_fee || f.minFee || 0),
          maxFee: Number(f.max_fee || f.maxFee || 0),
          gstPercentage: Number(f.gst_percentage || f.gstPercentage || 18),
          status: f.status,
          effectiveFrom: f.effective_from || f.effectiveFrom
        }));
        setSelectedMerchantFees(mappedFees);
      } else {
        setSelectedMerchantFees([]);
      }
    } catch (error) {
      setSelectedMerchantFees([]);
    } finally {
      setLoadingFees(false);
    }
  };

  const handleViewFee = (merchant: any) => {
    setSelectedMerchant(merchant);
    const mId = Number(merchant.merchant_id || merchant.merchantId);
    fetchMerchantFees(mId);
  };

  const handleCloseViewFee = () => {
    setSelectedMerchant(null);
    setEditingFee(null);
    setSelectedMerchantFees([]);
  };

  const handleDeleteFee = async (feeId: number) => {
    if (!window.confirm('Are you sure you want to delete this custom fee?')) return;

    try {
      const loadingToast = toast.loading('Deleting fee...');
      await apiFetch(`https://api.trustgates.co.in/admin/fee-management/${feeId}`, { method: 'DELETE' }, true);
      toast.dismiss(loadingToast);
      toast.success('Fee deleted successfully');

      const mId = Number(selectedMerchant?.merchant_id || selectedMerchant?.merchantId);
      if (mId) await fetchMerchantFees(mId);
      fetchData(); // Refresh summary cards
    } catch (err) {
      toast.error('Failed to delete fee');
    }
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee || !selectedMerchant) return;

    try {
      const loadingToast = toast.loading('Saving fee...');
      const mId = Number(selectedMerchant.merchant_id || selectedMerchant.merchantId);
      const payload = {
        merchantId: mId,
        paymentMethod: editingFee.paymentMethod,
        feeType: editingFee.feeType,
        fixedFee: Number(editingFee.fixedFee) || 0,
        percentageFee: Number(editingFee.percentageFee) || 0,
        minFee: Number(editingFee.minFee) || 0,
        maxFee: Number(editingFee.maxFee) || 0,
        status: editingFee.status || 'ACTIVE'
      };

      if (editingFee.feeId) {
        await apiFetch(`https://api.trustgates.co.in/admin/fee-management/${editingFee.feeId}`, { method: 'PUT', body: JSON.stringify(payload) }, true);
      } else {
        await apiFetch(`https://api.trustgates.co.in/admin/fee-management/`, { method: 'POST', body: JSON.stringify(payload) }, true);
      }

      toast.dismiss(loadingToast);
      toast.success('Fee saved successfully');
      setEditingFee(null);

      await fetchMerchantFees(mId); // Reload inner table directly
      fetchData(); // Refresh global data for summary cards
    } catch (err: any) {
      toast.error(err.message || 'Failed to save fee');
    }
  };

  const filteredMerchants = allMerchants.filter(m => {
    const search = searchTerm.toLowerCase();
    const id = String(m.merchant_id || m.merchantId || '');
    const name = String(m.business_name || m.businessName || '');
    const email = String(m.email || '');
    return id.includes(search) || name.includes(search) || email.includes(search);
  });

  const paginatedMerchants = filteredMerchants.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredMerchants.length / pageSize) || 1;

  // Merchant specific fees for the modal are now fetched from API directly
  const merchantFees = selectedMerchantFees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Fee Management</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Manage individual merchant transaction fees and overrides.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Standard UPI Rate", value: "1.00%", sub: "Default baseline fee", icon: Smartphone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Standard CC Rate", value: "2.00%", sub: "Default baseline fee", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Active Custom Fees", value: allFees.length, sub: "Across all merchants", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Merchants w/ Overrides", value: new Set(allFees.map(f => f.merchantId)).size, sub: "Merchants with custom rates", icon: Settings2, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((card, i) => (
          <div key={i} className="glass-card p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-display font-bold text-ink-900 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
                <p className="text-xs text-ink-500 mt-1">{card.sub}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full opacity-10 blur-xl ${card.bg.replace('/10', '')}`} />
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="glass-card flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-ink-200/60 dark:border-ink-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ink-50/50 dark:bg-ink-900/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Merchants Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <div className="h-8 w-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-sm text-ink-500">Loading merchants...</p>
            </div>
          ) : paginatedMerchants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="p-4 rounded-full bg-ink-100 dark:bg-ink-800 mb-3">
                <Percent className="h-8 w-8 text-ink-400" />
              </div>
              <h3 className="text-ink-900 dark:text-white font-semibold">No Merchants Found</h3>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-ink-500 dark:text-ink-400 border-b border-ink-200 dark:border-ink-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Merchant ID</th>
                  <th className="px-6 py-4 font-semibold">Merchant Name</th>
                  <th className="px-6 py-4 font-semibold">Merchant Email</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {paginatedMerchants.map((m) => {
                  const hasCustomFees = allFees.some(f => Number(f.merchantId) === Number(m.merchant_id || m.merchantId));
                  return (
                    <tr key={m.merchant_id || m.merchantId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-ink-600 dark:text-ink-400">
                        {m.merchant_id || m.merchantId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-ink-400" />
                          <span className="font-medium text-ink-900 dark:text-white">{m.business_name || m.businessName}</span>
                          {hasCustomFees && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Custom Fees</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-600 dark:text-ink-300">
                        {m.email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewFee(m)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:text-purple-400 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Fee
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && paginatedMerchants.length > 0 && (
          <div className="p-4 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between text-sm bg-ink-50/30 dark:bg-ink-900/10">
            <p className="text-ink-500">
              Showing <span className="font-medium text-ink-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="font-medium text-ink-900 dark:text-white">{Math.min(page * pageSize, filteredMerchants.length)}</span> of <span className="font-medium text-ink-900 dark:text-white">{filteredMerchants.length}</span> merchants
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-1 rounded-lg hover:bg-ink-200 dark:hover:bg-ink-800 disabled:opacity-50">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium px-2">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-1 rounded-lg hover:bg-ink-200 dark:hover:bg-ink-800 disabled:opacity-50">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Fee Modal */}
      <AnimatePresence>
        {selectedMerchant && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
              onClick={handleCloseViewFee}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-ink-950 rounded-2xl shadow-2xl border border-ink-200/50 dark:border-ink-800/50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-ink-100 dark:border-ink-800/60 flex items-center justify-between bg-ink-50/50 dark:bg-ink-900/20 shrink-0">
                <div>
                  <h3 className="font-display font-semibold text-lg text-ink-900 dark:text-white flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-purple-500" />
                    Fee Configuration: {selectedMerchant.business_name || selectedMerchant.businessName}
                  </h3>
                  <p className="text-xs text-ink-500 mt-1 font-mono">ID: {selectedMerchant.merchant_id || selectedMerchant.merchantId} | {selectedMerchant.email}</p>
                </div>
                <button onClick={handleCloseViewFee} className="p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {!editingFee ? (
                  <>
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => setEditingFee({ paymentMethod: 'UPI', feeType: 'PERCENTAGE', fixedFee: 0, percentageFee: 0, minFee: 0, maxFee: 0, status: 'ACTIVE' })}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-purple-500/20"
                      >
                        <Plus className="h-4 w-4" /> Add Custom Fee
                      </button>
                    </div>

                    {loadingFees ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="h-6 w-6 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                        <p className="text-sm text-ink-500">Loading fees...</p>
                      </div>
                    ) : merchantFees.length === 0 ? (
                      <div className="text-center py-10 bg-ink-50/50 dark:bg-ink-900/20 rounded-xl border border-dashed border-ink-200 dark:border-ink-800">
                        <Activity className="h-8 w-8 text-ink-300 mx-auto mb-2" />
                        <p className="text-sm text-ink-500">No custom fees configured.</p>
                        <p className="text-xs text-ink-400">This merchant is using global standard fees.</p>
                      </div>
                    ) : (
                      <div className="border border-ink-200 dark:border-ink-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-ink-50 dark:bg-ink-900/40 text-ink-500 dark:text-ink-400 border-b border-ink-200 dark:border-ink-800">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Payment Method</th>
                              <th className="px-4 py-3 font-semibold">Fee Type</th>
                              <th className="px-4 py-3 font-semibold text-right">Fee Rate/Amount</th>
                              <th className="px-4 py-3 font-semibold text-right">Min Fee</th>
                              <th className="px-4 py-3 font-semibold text-right">Max Fee</th>
                              <th className="px-4 py-3 font-semibold">Status</th>
                              <th className="px-4 py-3 font-semibold text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                            {merchantFees.map((f) => (
                              <tr key={f.feeId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20">
                                <td className="px-4 py-3 font-medium text-ink-900 dark:text-white">{f.paymentMethod}</td>
                                <td className="px-4 py-3">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                    {f.feeType}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-medium">
                                  {f.feeType === 'FIXED' ? `₹${f.fixedFee}` : `${f.percentageFee}%`}
                                </td>
                                <td className="px-4 py-3 text-right">{f.minFee > 0 ? `₹${f.minFee}` : '-'}</td>
                                <td className="px-4 py-3 text-right">{f.maxFee > 0 ? `₹${f.maxFee}` : '-'}</td>
                                <td className="px-4 py-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${f.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                                    {f.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setEditingFee(f)}
                                      className="p-1.5 rounded-lg text-ink-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                      title="Update"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFee(f.feeId)}
                                      className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSaveFee} className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-900 dark:text-white">
                        {editingFee.feeId ? 'Update Custom Fee' : 'Add Custom Fee'}
                      </h4>
                      <button type="button" onClick={() => setEditingFee(null)} className="text-sm text-ink-500 hover:text-ink-700">Back to List</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink-600 uppercase">Payment Method</label>
                        <select
                          value={editingFee.paymentMethod || ''}
                          onChange={(e) => setEditingFee({ ...editingFee, paymentMethod: e.target.value })}
                          disabled={!!editingFee.feeId}
                          className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                          required
                        >
                          <option value="UPI">UPI</option>
                          <option value="CARD">CARD</option>
                          <option value="NETBANKING">NETBANKING</option>
                          <option value="WALLET">WALLET</option>
                          <option value="EMI">EMI</option>
                          <option value="PAYLATER">PAYLATER</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink-600 uppercase">Fee Type</label>
                        <select
                          value={editingFee.feeType || 'PERCENTAGE'}
                          onChange={(e) => setEditingFee({ ...editingFee, feeType: e.target.value as any })}
                          className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                        >
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FIXED">Fixed (?)</option>
                          <option value="HYBRID">Hybrid (Both)</option>
                        </select>
                      </div>

                      {(editingFee.feeType === 'PERCENTAGE' || editingFee.feeType === 'HYBRID') && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-ink-600 uppercase">Percentage Fee (%)</label>
                          <input
                            type="number" step="0.01" min="0" required
                            value={editingFee.percentageFee || ''}
                            onChange={(e) => setEditingFee({ ...editingFee, percentageFee: parseFloat(e.target.value) || 0, fixedFee: editingFee.feeType === 'HYBRID' ? editingFee.fixedFee : 0 })}
                            className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                          />
                        </div>
                      )}

                      {(editingFee.feeType === 'FIXED' || editingFee.feeType === 'HYBRID') && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-ink-600 uppercase">Fixed Fee (?)</label>
                          <input
                            type="number" step="0.01" min="0" required
                            value={editingFee.fixedFee || ''}
                            onChange={(e) => setEditingFee({ ...editingFee, fixedFee: parseFloat(e.target.value) || 0, percentageFee: editingFee.feeType === 'HYBRID' ? editingFee.percentageFee : 0 })}
                            className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink-600 uppercase">Status</label>
                        <select
                          value={editingFee.status || 'ACTIVE'}
                          onChange={(e) => setEditingFee({ ...editingFee, status: e.target.value as any })}
                          className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink-600 uppercase">Min Fee (Optional)</label>
                        <input
                          type="number" step="0.01" min="0"
                          value={editingFee.minFee || 0}
                          onChange={(e) => setEditingFee({ ...editingFee, minFee: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink-600 uppercase">Max Fee (Optional)</label>
                        <input
                          type="number" step="0.01" min="0"
                          value={editingFee.maxFee || 0}
                          onChange={(e) => setEditingFee({ ...editingFee, maxFee: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-ink-100 dark:border-ink-800/50">
                      <button type="button" onClick={() => setEditingFee(null)} className="px-4 py-2 text-sm text-ink-600 bg-ink-100 rounded-lg">Cancel</button>
                      <button type="submit" className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Save Fee</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
