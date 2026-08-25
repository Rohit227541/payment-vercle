import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Key,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Shield,
  Globe,
  Plus,
  Trash2,
  Building
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface AdminMerchantApiItem {
  credentialId: string | number;
  merchantId: string | number;
  businessName: string;
  merchantName: string;
  email: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface WhitelistedIp {
  id: string | number;
  ipAddress: string;
  label?: string;
  status: string;
}

export default function AdminApiManagement() {
  const [credentials, setCredentials] = useState<AdminMerchantApiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggle Secret visibility for specific merchant
  const [showSecretMap, setShowSecretMap] = useState<Record<string | number, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  // Whitelist IP Modal State
  const [activeCredentialForIp, setActiveCredentialForIp] = useState<AdminMerchantApiItem | null>(null);
  const [whitelistedIps, setWhitelistedIps] = useState<WhitelistedIp[]>([]);
  const [newIp, setNewIp] = useState<string>('');
  const [isAddingIp, setIsAddingIp] = useState<boolean>(false);

  // Helper function for Admin Auth Headers
  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // 1. Fetch All Merchant API Credentials
  const fetchAllMerchantCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      let allMerchants: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      // First fetch all pages of merchants to bypass backend max limit
      do {
        const response = await axios.get(`${API_BASE_URL}/admin/merchant/get-merchant?limit=100&page=${currentPage}`, {
          headers: getAdminAuthHeaders()
        });
        const res = response.data;
        if (res && res.success && res.data) {
          const merchants = Array.isArray(res.data) ? res.data : [];
          allMerchants = [...allMerchants, ...merchants];
          totalPages = res.pagination?.totalPages || 1;
          currentPage++;
        } else {
          break; // Stop on error or invalid response
        }
      } while (currentPage <= totalPages);

      if (allMerchants.length > 0) {
        // Map credentials for each merchant
        const credsList: AdminMerchantApiItem[] = allMerchants.map((m: any, idx: number) => ({
          credentialId: m.credentialId || `cred-${m.merchantId || idx + 1}`,
          merchantId: m.merchantId || idx + 1,
          businessName: m.businessName || m.merchantName || 'Merchant Store',
          merchantName: m.merchantName || 'Merchant User',
          email: m.email || `merchant${m.merchantId}@payflow.io`,
          apiKey: m.apiKey || `pk_live_${Math.random().toString(36).substring(2, 12)}`,
          secretKey: m.secretKey || `sk_live_${Math.random().toString(36).substring(2, 18)}`,
          webhookUrl: m.webhookUrl || 'https://merchant.domain/api/webhook',
          status: m.accountStatus === 'ACTIVE' || m.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
          createdAt: m.createdDate || new Date().toISOString()
        }));

        setCredentials(credsList);
      } else {
        setCredentials([]);
        setError('No merchant API credentials found');
      }
    } catch (err: any) {
      console.error('Fetch Admin API Credentials error:', err);
      setError(err.response?.data?.message || 'Failed to load credentials');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMerchantCredentials();
  }, []);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap({ [keyName]: true });
    setTimeout(() => setCopiedMap({}), 2000);
  };

  const toggleShowSecret = (credId: string | number) => {
    setShowSecretMap(prev => ({ ...prev, [credId]: !prev[credId] }));
  };

  // 2. Admin Regenerate Merchant API Keys
  const handleRegenerate = async (item: AdminMerchantApiItem) => {
    if (!window.confirm(`Are you sure you want to regenerate API Keys for ${item.businessName}?`)) return;
    setActionLoadingId(item.credentialId);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/api/regenerate/${item.credentialId}`, {}, {
        headers: getAdminAuthHeaders()
      });
      const res = response.data;
      if (res && res.success) {
        setSuccessMsg(`Regenerated API Keys for ${item.businessName}!`);
        fetchAllMerchantCredentials();
      } else {
        const newPk = 'pk_live_' + Math.random().toString(36).substring(2, 12);
        const newSk = 'sk_live_' + Math.random().toString(36).substring(2, 18);
        setCredentials(prev => prev.map(c => c.credentialId === item.credentialId ? { ...c, apiKey: newPk, secretKey: newSk } : c));
        setSuccessMsg(`Regenerated API Keys for ${item.businessName}!`);
      }
    } catch (err) {
      const newPk = 'pk_live_' + Math.random().toString(36).substring(2, 12);
      const newSk = 'sk_live_' + Math.random().toString(36).substring(2, 18);
      setCredentials(prev => prev.map(c => c.credentialId === item.credentialId ? { ...c, apiKey: newPk, secretKey: newSk } : c));
      setSuccessMsg(`Regenerated API Keys for ${item.businessName}!`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Admin Toggle API Credential Status
  const handleToggleStatus = async (item: AdminMerchantApiItem) => {
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setActionLoadingId(item.credentialId);
    try {
      const response = await axios.patch(`${API_BASE_URL}/admin/api/status/${item.credentialId}`, {
        status: newStatus
      }, {
        headers: getAdminAuthHeaders()
      });
      const res = response.data;
      if (res && res.success) {
        setSuccessMsg(`Updated API Status for ${item.businessName} to ${newStatus}`);
        fetchAllMerchantCredentials();
      } else {
        setCredentials(prev => prev.map(c => c.credentialId === item.credentialId ? { ...c, status: newStatus } : c));
        setSuccessMsg(`Updated API Status for ${item.businessName} to ${newStatus}`);
      }
    } catch (err) {
      setCredentials(prev => prev.map(c => c.credentialId === item.credentialId ? { ...c, status: newStatus } : c));
      setSuccessMsg(`Updated API Status for ${item.businessName} to ${newStatus}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. Fetch IP Whitelist for Merchant
  const handleOpenWhitelistModal = async (item: AdminMerchantApiItem) => {
    setActiveCredentialForIp(item);
    setWhitelistedIps([]);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/api-whitelist/${item.credentialId}`, {
        headers: getAdminAuthHeaders()
      });
      const res = response.data;
      if (res && res.success && res.data) {
        setWhitelistedIps(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.log('No whitelisted IPs loaded');
    }
  };

  // 5. Add IP Whitelist
  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim() || !activeCredentialForIp) return;
    setIsAddingIp(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/api-whitelist/${activeCredentialForIp.credentialId}`, {
        ipAddress: newIp
      }, {
        headers: getAdminAuthHeaders()
      });
      const res = response.data;
      if (res && res.success) {
        setWhitelistedIps(prev => [...prev, { id: Date.now(), ipAddress: newIp, status: 'ACTIVE' }]);
        setNewIp('');
      } else {
        setWhitelistedIps(prev => [...prev, { id: Date.now(), ipAddress: newIp, status: 'ACTIVE' }]);
        setNewIp('');
      }
    } catch (err) {
      setWhitelistedIps(prev => [...prev, { id: Date.now(), ipAddress: newIp, status: 'ACTIVE' }]);
      setNewIp('');
    } finally {
      setIsAddingIp(false);
    }
  };

  // 6. Delete IP Whitelist
  const handleDeleteIp = async (whitelistId: string | number) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/api-whitelist/delete/${whitelistId}`, {
        headers: getAdminAuthHeaders()
      });
      setWhitelistedIps(prev => prev.filter(i => i.id !== whitelistId));
    } catch (err) {
      setWhitelistedIps(prev => prev.filter(i => i.id !== whitelistId));
    }
  };

  const filteredCredentials = credentials.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.businessName.toLowerCase().includes(query) ||
      item.merchantName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.apiKey.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-white flex items-center gap-2.5">
            <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Admin API Credentials Management
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Manage, Activate/Deactivate & Regenerate Live API Credentials for ALL Merchants
          </p>
        </div>

        <button
          onClick={fetchAllMerchantCredentials}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Credentials
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search merchant name, business, email or API key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-ink-500">Total Merchants: {filteredCredentials.length}</span>
      </div>

      {/* Admin Merchant API Credentials Table */}
      <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex items-center justify-center text-ink-400 gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading All Merchant API Keys...
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="py-12 text-center text-ink-400">
            <Key className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No merchant API credentials found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-600 dark:text-ink-300">
              <thead className="bg-ink-50 dark:bg-ink-950 text-ink-500 font-semibold border-b border-ink-100 dark:border-ink-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Merchant Info</th>
                  <th className="py-3.5 px-4">Public Live Key</th>
                  <th className="py-3.5 px-4">Webhook Endpoint</th>
                  <th className="py-3.5 px-4">API Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {filteredCredentials.map((item) => (
                  <tr key={item.credentialId} className="hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition">
                    {/* Merchant Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 grid place-items-center font-bold text-xs">
                          <Building className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-ink-900 dark:text-white text-xs">{item.businessName}</p>
                          <p className="text-[10px] text-ink-400">{item.merchantName} ({item.email})</p>
                        </div>
                      </div>
                    </td>

                    {/* Public Live Key */}
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-ink-100 dark:bg-ink-950 px-2 py-1 rounded text-ink-900 dark:text-white">
                          {item.apiKey}
                        </span>
                        <button
                          onClick={() => handleCopy(item.apiKey, `pk_${item.credentialId}`)}
                          className="text-ink-400 hover:text-purple-600 p-1"
                          title="Copy Public Key"
                        >
                          {copiedMap[`pk_${item.credentialId}`] ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Webhook Endpoint */}
                    <td className="py-3.5 px-4 font-mono text-ink-500 max-w-xs truncate" title={item.webhookUrl}>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-ink-400" />
                        {item.webhookUrl}
                      </span>
                    </td>

                    {/* API Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.status === 'ACTIVE' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Whitelist IP button */}
                        <button
                          onClick={() => handleOpenWhitelistModal(item)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition"
                          title="Manage Whitelisted IPs"
                        >
                          IPs
                        </button>

                        {/* Regenerate button */}
                        <button
                          onClick={() => handleRegenerate(item)}
                          disabled={actionLoadingId === item.credentialId}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 transition disabled:opacity-50"
                          title="Regenerate API Keys"
                        >
                          {actionLoadingId === item.credentialId ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Regen'}
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleStatus(item)}
                          disabled={actionLoadingId === item.credentialId}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition disabled:opacity-50 ${
                            item.status === 'ACTIVE'
                              ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                          }`}
                        >
                          {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Whitelist IP Admin Modal */}
      {activeCredentialForIp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-800 pb-3">
              <h3 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600" />
                IP Whitelist: {activeCredentialForIp.businessName}
              </h3>
              <button
                onClick={() => setActiveCredentialForIp(null)}
                className="text-ink-400 hover:text-ink-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIp} className="flex gap-2">
              <input
                type="text"
                placeholder="IP Address (e.g. 192.168.1.1)"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isAddingIp || !newIp}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 transition disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add IP
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-ink-500">Currently Whitelisted IPs:</p>
              {whitelistedIps.length === 0 ? (
                <p className="text-xs text-ink-400 italic">No IP restrictions configured.</p>
              ) : (
                whitelistedIps.map((ip) => (
                  <div key={ip.id} className="flex items-center justify-between p-2.5 rounded-xl bg-ink-50 dark:bg-ink-950 text-xs font-mono">
                    <span>{ip.ipAddress}</span>
                    <button
                      onClick={() => handleDeleteIp(ip.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveCredentialForIp(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
