import { useState, useEffect } from 'react';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ShieldAlert,
  Server
} from 'lucide-react';

import {
  getApiCredentials,
  regenerateApiCredentials,
  updateApiStatus,
  getWhitelistIps,
  addIpToWhitelist,
  deleteIpFromWhitelist
} from '../../services/apiManagement.service';
import { apiFetch } from '../../services/api.service';

interface ApiCredential {
  id: string | number;
  apiKey: string;
  secretKey: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED';
  webhookUrl?: string;
  createdAt?: string;
}

interface WhitelistedIp {
  id: string | number;
  ipAddress: string;
  label?: string;
  status: string;
  createdAt?: string;
}

export default function ApiManagement() {
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Key States
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [newSecretKey, setNewSecretKey] = useState<string | null>(null);


  // Whitelist IP States
  const [whitelistedIps, setWhitelistedIps] = useState<WhitelistedIp[]>([]);
  const [newIp, setNewIp] = useState<string>('');
  const [newIpLabel, setNewIpLabel] = useState<string>('');
  const [isAddingIp, setIsAddingIp] = useState<boolean>(false);

  // 1. Fetch API Credentials directly on this page
  const fetchCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApiCredentials();
      console.log("getApiCredentials response:", res);
      if (res && res.success && res.data) {
        let creds = Array.isArray(res.data) ? res.data : [res.data];
        console.log("Raw creds array:", creds);
        // Map backend fields to frontend interface
        creds = creds.map(c => ({
          ...c,
          id: c.credentialId || c.id,
          apiKey: c.publicKey || c.apiKey,
          secretKey: c.secretKey || ''
        }));
        console.log("Mapped creds:", creds);
        
        setCredentials(creds);
        
        const active = creds.find(c => c.status === 'ACTIVE') || creds[0];
        if (active && active.id !== undefined) {
          fetchWhitelist(active.id);
        }
      } else {
        console.log("Failed or no data. Response was:", res);
        setCredentials([]);
      }
    } catch (err: any) {
      console.log('API Credentials fetch error:', err);
      setError('Failed to load API credentials.');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Whitelisted IPs directly on this page
  const fetchWhitelist = async (credentialId: string | number) => {
    try {
      console.log(`Fetching whitelist for credentialId: ${credentialId}`);
      const res = await getWhitelistIps(credentialId);
      console.log('getWhitelistIps response:', res);
      if (res && res.success && res.data) {
        let ips = Array.isArray(res.data) ? res.data : [];
        console.log('Raw IPs array:', ips);
        // Map backend fields to frontend interface
        ips = ips.map((ip: any) => ({
          ...ip,
          id: ip.whitelistId || ip.id
        }));
        console.log('Mapped IPs:', ips);
        setWhitelistedIps(ips);
      } else {
        console.log('No data or success false for whitelist:', res);
        setWhitelistedIps([]);
      }
    } catch (err) {
      console.log('No whitelisted IPs loaded:', err);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const activeCred = credentials.find(c => c.status === 'ACTIVE') || credentials[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(fieldName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 3. Regenerate API Keys directly on this page
  const handleRegenerateKeys = async () => {
    if (!activeCred) return;
    if (!window.confirm('Are you sure you want to regenerate your API Keys? Old keys will stop working immediately.')) {
      return;
    }
    setIsRegenerating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await regenerateApiCredentials(activeCred.id);
      if (res && res.success) {
        setSuccessMsg('API Credentials regenerated successfully!');
        if (res.data && res.data.secretKey) {
          setNewSecretKey(res.data.secretKey);
        }
        await fetchCredentials();
      } else {
        setError(res?.message || 'Failed to regenerate credentials');
      }
    } catch (err: any) {
      setError('An error occurred while regenerating keys.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // 4. Toggle Key Status directly on this page
  const handleToggleStatus = async (cred: ApiCredential) => {
    const newStatus = cred.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await updateApiStatus(cred.id, newStatus);
      if (res && res.success) {
        setSuccessMsg(`Key status updated to ${newStatus}`);
        fetchCredentials();
      } else {
        setError(res?.message || 'Failed to update key status');
      }
    } catch (err) {
      setError('An error occurred while updating status.');
    }
  };



  // 6. Add Whitelisted IP directly on this page
  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim() || !activeCred) return;
    setIsAddingIp(true);
    try {
      const res = await addIpToWhitelist(activeCred.id, newIp, newIpLabel);
      if (res && res.success) {
        setSuccessMsg('IP added to whitelist!');
        fetchWhitelist(activeCred.id);
        setNewIp('');
        setNewIpLabel('');
      } else {
        setError(res?.message || 'Failed to add IP');
      }
    } catch (err) {
      setError('An error occurred while whitelisting IP.');
      setNewIpLabel('');
    } finally {
      setIsAddingIp(false);
    }
  };

  // 7. Delete Whitelisted IP directly on this page
  const handleDeleteIp = async (whitelistId: string | number) => {
    try {
      const res = await deleteIpFromWhitelist(whitelistId);
      if (res && res.success) {
        setWhitelistedIps(prev => prev.filter(item => item.id !== whitelistId));
        setSuccessMsg('IP removed from whitelist');
      } else {
        setError(res?.message || 'Failed to remove IP');
      }
    } catch (err) {
      setError('Failed to remove IP');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-white flex items-center gap-2.5">
            <Key className="h-6 w-6 text-brand-500" />
            API Management
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Manage your Live API Access Keys, Secret Tokens, Webhooks & IP Whitelisting
          </p>
        </div>

        {/* Top Actions */}
        <button
          onClick={handleRegenerateKeys}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-500/20 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate API Keys'}
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Section: API Access Keys Card */}
      <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-500" />
              API Access Keys
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
              Use these keys to authenticate your server-side & client-side payment requests.
            </p>
          </div>

          {activeCred && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              activeCred.status === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              <span className={`h-2 w-2 rounded-full ${activeCred.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {activeCred.status}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-ink-400 gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading API Credentials...
          </div>
        ) : activeCred ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Public Live Key */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider">
                Public Live Key
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={activeCred.apiKey}
                  className="w-full font-mono text-sm px-3.5 py-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white pr-10 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(activeCred.apiKey, 'apiKey')}
                  className="absolute right-2.5 p-1.5 text-ink-500 hover:text-brand-500 transition rounded-lg hover:bg-ink-200/50 dark:hover:bg-ink-800"
                  title="Copy Public Key"
                >
                  {copiedKey === 'apiKey' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-ink-400">Shareable in front-end checkout scripts.</p>
            </div>

            {/* Secret Token Key */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center justify-between">
                <span>Secret Token Key</span>
                <span className="text-[10px] text-rose-500 font-medium">Keep Confidential</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showSecret && newSecretKey ? 'text' : 'password'}
                  readOnly
                  value={newSecretKey || "********************************"}
                  className="w-full font-mono text-sm px-3.5 py-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white pr-20 focus:outline-none"
                />
                {newSecretKey && (
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-1.5 text-ink-500 hover:text-brand-500 transition rounded-lg hover:bg-ink-200/50 dark:hover:bg-ink-800"
                      title={showSecret ? 'Hide Secret' : 'Show Secret'}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(newSecretKey, 'secretKey')}
                      className="p-1.5 text-ink-500 hover:text-brand-500 transition rounded-lg hover:bg-ink-200/50 dark:hover:bg-ink-800"
                      title="Copy Secret Key"
                    >
                      {copiedKey === 'secretKey' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
              <p className={`text-[11px] ${newSecretKey ? 'text-rose-500 font-medium' : 'text-ink-400'}`}>
                {newSecretKey 
                  ? "Please copy your new secret key now. It will not be shown again after page refresh!"
                  : "Secret key is hidden for security. Regenerate to get a new one."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* API Credentials Active / Inactive List */}
      <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-800 pb-3">
          <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Server className="h-4 w-4 text-brand-500" />
            API Keys Status & History
          </h2>
          <span className="text-xs text-ink-500">Showing all generated credentials</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink-600 dark:text-ink-300">
            <thead className="bg-ink-50 dark:bg-ink-950 text-ink-500 font-semibold border-b border-ink-100 dark:border-ink-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Public Live Key</th>
                <th className="py-3 px-4">Secret Token</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-mono">
              {credentials.map((cred) => (
                <tr key={cred.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-ink-900 dark:text-white">
                    {cred.apiKey}
                  </td>
                  <td className="py-3.5 px-4 text-ink-500">
                    ********************************
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px] ${
                      cred.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {cred.status === 'ACTIVE' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {cred.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => handleToggleStatus(cred)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        cred.status === 'ACTIVE'
                          ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                    >
                      {cred.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IP Whitelisting Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* IP Whitelisting */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand-500" />
            IP Address Whitelist
          </h2>
          <p className="text-xs text-ink-500">
            Restrict API calls exclusively to authorized server IP addresses.
          </p>

          <form onSubmit={handleAddIp} className="flex gap-2">
            <input
              type="text"
              placeholder="IP (e.g. 192.168.1.1)"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAddingIp || !newIp}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 hover:opacity-90 transition flex items-center gap-1 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {whitelistedIps.length === 0 ? (
              <p className="text-xs text-ink-400 italic">No IP restrictions active. All IP addresses allowed.</p>
            ) : (
              whitelistedIps.map((ip) => (
                <div key={ip.id} className="flex items-center justify-between p-2.5 rounded-xl bg-ink-50 dark:bg-ink-950 text-xs font-mono">
                  <span>{ip.ipAddress}</span>
                  <button
                    onClick={() => handleDeleteIp(ip.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
