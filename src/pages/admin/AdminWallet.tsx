import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../services/api.service';
import toast from 'react-hot-toast';

export default function AdminWallet() {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWallets = async (query = '') => {
    setLoading(true);
    try {
      // Fetch from the exact admin wallet routes backend
      const url = query ? `/admin/wallet/search?merchantId=${query}` : '/admin/wallet/search';
      const res = await apiFetch(url, {}, true);
      
      if (res.success && res.data) {
        setWallets(res.data.wallets || []);
      } else {
        setWallets([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load merchant wallets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWallets(searchTerm);
  };

  const handleBlockWallet = async (walletId: string, merchantId: string) => {
    try {
      const res = await apiFetch('/admin/wallet/block', { method: 'POST', body: JSON.stringify({ walletId, merchantId, reason: 'Admin Action' }) }, true);
      if (res.success) {
        toast.success('Wallet blocked successfully');
        fetchWallets(searchTerm);
      } else {
        toast.error('Failed to block wallet');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleUnblockWallet = async (walletId: string, merchantId: string) => {
    try {
      const res = await apiFetch('/admin/wallet/unblock', { method: 'POST', body: JSON.stringify({ walletId, merchantId, reason: 'Admin Action' }) }, true);
      if (res.success) {
        toast.success('Wallet unblocked successfully');
        fetchWallets(searchTerm);
      } else {
        toast.error('Failed to unblock wallet');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Wallets</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">View and manage merchant wallet balances.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-ink-950 p-4 rounded-3xl border border-ink-200/60 dark:border-ink-800/60 shadow-xl shadow-purple-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 w-full max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search by Merchant ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-ink-50/50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-sm text-ink-900 dark:text-white placeholder-ink-400"
          />
        </form>
        <button 
          onClick={() => fetchWallets(searchTerm)}
          disabled={loading}
          className="btn-primary py-2.5 px-6 whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Wallets Table */}
      <div className="bg-white dark:bg-ink-950 rounded-3xl border border-ink-200/60 dark:border-ink-800/60 shadow-xl shadow-purple-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
              <tr>
                <th className="px-6 py-4 font-medium">Merchant</th>
                <th className="px-6 py-4 font-medium text-right">Available Balance</th>
                <th className="px-6 py-4 font-medium text-right">Reserved Balance</th>
                <th className="px-6 py-4 font-medium text-right">Blocked Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">
              {loading && wallets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                      <p className="text-sm text-ink-500">Loading wallets...</p>
                    </div>
                  </td>
                </tr>
              ) : wallets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-500 flex flex-col items-center">
                     <AlertCircle className="h-8 w-8 text-ink-300 mb-2" />
                     <p>No wallets found.</p>
                  </td>
                </tr>
              ) : (
                wallets.map((wallet) => (
                  <tr key={wallet.walletId} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl">
                          <Wallet className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 dark:text-white">{wallet.merchantName || 'N/A'}</p>
                          <p className="text-xs text-ink-500 font-mono">{wallet.merchantId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      ₹{(wallet.balances?.available || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-amber-600">
                      ₹{(wallet.balances?.reserved || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-rose-600">
                      ₹{(wallet.balances?.blocked || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        wallet.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' :
                        wallet.status === 'BLOCKED' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {wallet.status === 'ACTIVE' && <CheckCircle className="h-3.5 w-3.5" />}
                        {wallet.status === 'BLOCKED' && <Ban className="h-3.5 w-3.5" />}
                        {wallet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {wallet.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => handleBlockWallet(wallet.walletId, wallet.merchantId)}
                            className="text-xs font-semibold bg-rose-500/10 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors"
                          >
                            Block
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUnblockWallet(wallet.walletId, wallet.merchantId)}
                            className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
                          >
                            Unblock
                          </button>
                        )}
                        <button className="text-xs font-semibold bg-purple-500/10 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-colors">
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
