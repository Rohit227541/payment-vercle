import React, { useState } from 'react';
import { Search, Key, Shield, Plus, RefreshCw, Trash2, AlertCircle, CheckCircle2, Lock, Copy, Terminal, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../services/api.service';

interface ApiCredentialItem {
  credentialId: string;
  merchantId: string;
  publicKey: string;
  environment: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED';
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ApiCredential() {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchantCode, setMerchantCode] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<ApiCredentialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{ type: 'generate' | 'regenerate' | 'revoke'; id?: string } | null>(null);

  const fetchCredentials = async (merchantId: string = searchTerm) => {
    if (!merchantId.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setConfirmAction(null);
    setMerchantCode(null);

    try {
      const res = await apiFetch(`/admin/api/${merchantId.trim()}`, {}, true);
      if (res.success && res.data) {
        setMerchantCode(res.data.merchantCode || null);
        setCredentials(Array.isArray(res.data.credentials) ? res.data.credentials : []);
      } else {
        setCredentials([]);
        setError(res.message || 'No credentials found for this merchant.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch credentials');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCredentials();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async () => {
    setActionLoading('generate');
    try {
      const res = await apiFetch(`/admin/api/generate/${searchTerm}`, { method: 'POST' }, true);
      if (res.success) {
        setSuccess('API Credentials generated successfully.');
        fetchCredentials();
      } else {
        setError(res.message || 'Failed to generate credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const handleStatusChange = async (cred: ApiCredentialItem) => {
    const newStatus = cred.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setActionLoading(`status-${cred.credentialId}`);
    try {
      const res = await apiFetch(`/admin/api/status/${cred.credentialId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      }, true);
      
      if (res.success) {
        setSuccess(`Status changed to ${newStatus}`);
        setCredentials(credentials.map(c => c.credentialId === cred.credentialId ? { ...c, status: newStatus } : c));
      } else {
        setError(res.message || 'Failed to change status.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (credentialId: string) => {
    setActionLoading(`regenerate-${credentialId}`);
    try {
      const res = await apiFetch(`/admin/api/regenerate/${credentialId}`, { method: 'POST' }, true);
      if (res.success) {
        setSuccess('API Credentials regenerated successfully. The new Secret Key is only shown once to the merchant.');
        fetchCredentials();
      } else {
        setError(res.message || 'Failed to regenerate credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const handleRevoke = async (credentialId: string) => {
    setActionLoading(`revoke-${credentialId}`);
    try {
      const res = await apiFetch(`/admin/api/revoke/${credentialId}`, { method: 'POST' }, true);
      if (res.success) {
        setSuccess('API Credentials revoked successfully.');
        fetchCredentials();
      } else {
        setError(res.message || 'Failed to revoke credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Terminal className="h-6 w-6 text-purple-600" />
            Merchant API Credentials
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Manage, regenerate, and revoke API keys for specific merchants.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">Error</h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">&times;</button>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Success</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="glass-card p-6 border-l-4 border-l-purple-500">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Merchant ID to view credentials..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !searchTerm.trim()}
            className="bg-ink-900 dark:bg-white text-white dark:text-ink-900 hover:bg-ink-800 dark:hover:bg-ink-100 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Lookup
          </button>
        </form>
      </div>

      {/* Results Section */}
      {merchantCode && credentials.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-between items-end mb-2 px-1">
            <div>
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">Active Credentials</h3>
              <p className="text-xs text-ink-500">Merchant Code: <span className="font-mono bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded text-ink-700 dark:text-ink-300">{merchantCode}</span></p>
            </div>
            <button 
              onClick={() => setConfirmAction({ type: 'generate' })}
              className="text-xs bg-purple-50 dark:bg-purple-500/10 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-500/20 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="h-3.5 w-3.5" /> New Keypair
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <div 
                key={cred.credentialId} 
                className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  cred.status === 'ACTIVE' 
                    ? 'bg-white/60 dark:bg-ink-900/60 border-ink-200 dark:border-ink-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5' 
                    : cred.status === 'REVOKED'
                    ? 'bg-rose-50/30 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/50 opacity-80'
                    : 'bg-ink-50/50 dark:bg-ink-900/30 border-ink-200 dark:border-ink-800 opacity-90'
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  cred.status === 'ACTIVE' ? 'bg-emerald-500' : cred.status === 'REVOKED' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />

                <div className="p-5 pl-7">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          cred.environment === 'LIVE' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {cred.environment} ENV
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          cred.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : cred.status === 'REVOKED' ? 'bg-rose-500/10 text-rose-600' : 'bg-ink-500/10 text-ink-600'
                        }`}>
                          {cred.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-400 font-mono mt-1">ID: {cred.credentialId}</p>
                    </div>

                    {cred.status !== 'REVOKED' && (
                      <div className="flex bg-ink-100 dark:bg-ink-800 rounded-lg p-1">
                        <button 
                          onClick={() => handleStatusChange(cred)}
                          disabled={actionLoading === `status-${cred.credentialId}`}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                            cred.status === 'ACTIVE' ? 'text-amber-600 hover:bg-amber-500/10' : 'text-emerald-600 hover:bg-emerald-500/10'
                          }`}
                        >
                          {cred.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                        <div className="w-px bg-ink-200 dark:bg-ink-700 my-1 mx-0.5" />
                        <button 
                          onClick={() => setConfirmAction({ type: 'regenerate', id: cred.credentialId })}
                          className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-blue-600 hover:bg-blue-500/10 transition-colors"
                        >
                          Regenerate
                        </button>
                        <div className="w-px bg-ink-200 dark:bg-ink-700 my-1 mx-0.5" />
                        <button 
                          onClick={() => setConfirmAction({ type: 'revoke', id: cred.credentialId })}
                          className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors"
                        >
                          Revoke
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1">Public Key</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono bg-ink-50 dark:bg-ink-950/50 px-3 py-2 rounded-lg border border-ink-100 dark:border-ink-800 truncate text-ink-700 dark:text-ink-300 select-all">
                          {cred.publicKey}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(cred.publicKey, `pub-${cred.credentialId}`)}
                          className="p-2 bg-ink-50 dark:bg-ink-900 rounded-lg border border-ink-100 dark:border-ink-800 text-ink-400 hover:text-purple-500 hover:border-purple-200 transition-colors"
                          title="Copy Public Key"
                        >
                          {copiedKey === `pub-${cred.credentialId}` ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-ink-400 border-t border-ink-100 dark:border-ink-800/50 pt-3">
                    <span>Created: {new Date(cred.createdAt).toLocaleDateString()}</span>
                    {cred.lastUsedAt ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last used: {new Date(cred.lastUsedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>Never used</span>
                    )}
                  </div>
                </div>

                {/* Inline Confirmation Overlays */}
                <AnimatePresence>
                  {(confirmAction?.type === 'regenerate' || confirmAction?.type === 'revoke') && confirmAction.id === cred.credentialId && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 dark:bg-ink-900/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <Lock className={`h-8 w-8 mb-3 ${confirmAction.type === 'revoke' ? 'text-rose-500' : 'text-amber-500'}`} />
                      <h4 className="font-semibold text-ink-900 dark:text-white mb-1">
                        {confirmAction.type === 'revoke' ? 'Revoke Credentials?' : 'Regenerate API Keys?'}
                      </h4>
                      <p className="text-xs text-ink-500 mb-4 max-w-[250px]">
                        {confirmAction.type === 'revoke' 
                          ? 'This instantly invalidates the keypair. API requests using it will fail.' 
                          : 'Generates a new Secret Key. The old Secret Key will stop working immediately.'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setConfirmAction(null)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300 hover:bg-ink-200 transition"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => confirmAction.type === 'revoke' ? handleRevoke(cred.credentialId) : handleRegenerate(cred.credentialId)}
                          disabled={actionLoading !== null}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition ${
                            confirmAction.type === 'revoke' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
                          }`}
                        >
                          {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Yes, {confirmAction.type === 'revoke' ? 'Revoke' : 'Regenerate'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generate Initial Credentials Modal */}
      <AnimatePresence>
        {confirmAction?.type === 'generate' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-md border border-ink-200 dark:border-ink-800 shadow-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2">Generate New Keypair</h3>
              <p className="text-sm text-ink-500 mb-6">
                Are you sure you want to generate a new set of API credentials for Merchant <span className="font-mono font-bold text-ink-700 dark:text-ink-300">{merchantCode || searchTerm}</span>?
              </p>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={actionLoading === 'generate'}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
                >
                  {actionLoading === 'generate' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Generate Keys
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {credentials.length === 0 && !loading && searchTerm && !error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-8">
          <div className="h-16 w-16 rounded-full bg-ink-50 dark:bg-ink-800/50 flex items-center justify-center text-ink-300 mb-4 border border-ink-100 dark:border-ink-800">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="text-ink-900 dark:text-white font-bold text-lg mb-2">No API Credentials Found</h3>
          <p className="text-sm text-ink-500 max-w-sm mb-6">
            This merchant hasn't generated any API keys yet. You can generate the initial keypair to allow them to integrate with the payment gateway.
          </p>
          <button 
            onClick={() => setConfirmAction({ type: 'generate' })}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Generate First Keypair
          </button>
        </motion.div>
      )}
    </div>
  );
}
