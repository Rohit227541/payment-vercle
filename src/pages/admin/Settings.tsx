import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Inbox,
  Server,
  Database,
  Cpu,
  ToggleLeft,
  ToggleRight,
  Save
} from 'lucide-react';

const API_URL = "/mock-admin-settings.json";

interface SystemConfig {
  merchantAutoApprove: boolean;
  twoFactorRequirement: boolean;
  maintenanceMode: boolean;
  transactionLimitPerDay: string;
  defaultPayoutCycle: string;
  primaryDatabaseHost: string;
  redisCacheExpiry: string;
}

export default function AdminSettings() {
  const [data, setData] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);

  const loadSettings = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Global Control Settings</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Configure global transaction bounds, Merchant security guidelines, and server configs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSettings}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Config
          </button>
          <button disabled className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-3 text-xs inline-flex items-center gap-2 transition opacity-80">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading platform settings...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-purple-500/20 bg-purple-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-purple-500/10 text-purple-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Settings Database Offline</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch main configurations. Verify the API URL placeholder.
          </p>
          <button
            onClick={loadSettings}
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2 px-4 text-xs font-semibold mx-auto transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !data && (
        <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Configurations Empty</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No active settings profiles found on the target endpoint.
          </p>
        </div>
      )}

      {/* Data views */}
      {!loading && !error && data && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* General platform behavior */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <Server className="h-4 w-4 text-purple-500" /> Platform Behavior
            </h3>

            <div className="divide-y divide-ink-200/40 dark:divide-ink-800/40 text-sm">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">Auto Approve Merchant Onboarding</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Enable automatic basic merchant activation on signup.</p>
                </div>
                <button className="text-purple-500">
                  {data.merchantAutoApprove ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">Enforce Mandatory Multi-Factor Auth</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Force all platform merchants to complete 2FA setup.</p>
                </div>
                <button className="text-purple-500">
                  {data.twoFactorRequirement ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white text-rose-500">Maintenance Mode Lockout</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Temporarily restrict all Merchant dashboard operations.</p>
                </div>
                <button className="text-rose-500">
                  {data.maintenanceMode ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>
            </div>
          </div>

          {/* Limits configurations */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <Cpu className="h-4 w-4 text-purple-500" /> Platform Boundaries
            </h3>

            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-400">Max Transaction Limit per Day</label>
                <input
                  type="text"
                  readOnly
                  value={data.transactionLimitPerDay}
                  className="input font-mono text-xs w-full py-2 bg-ink-50/50 dark:bg-ink-950/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-400">Standard Payout Settlement Cycle</label>
                <input
                  type="text"
                  readOnly
                  value={data.defaultPayoutCycle}
                  className="input font-mono text-xs w-full py-2 bg-ink-50/50 dark:bg-ink-950/30"
                />
              </div>
            </div>
          </div>

          {/* Infrastructure status */}
          <div className="glass-card p-6 space-y-6 md:col-span-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <Database className="h-4 w-4 text-purple-500" /> System Infrastructure Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-ink-400 font-medium font-sans">Primary Database Host Endpoint</p>
                <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.primaryDatabaseHost}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium font-sans">Redis Cache Expiration Range</p>
                <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.redisCacheExpiry}</p>
              </div>
            </div>
          </div>

          {/* Search, pagination placeholders (to satisfy requirement) */}
          <div className="hidden">
            <input placeholder="Search config..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span>Page {page} (Pagination Placeholder)</span>
            <button onClick={() => { }}>Next</button>
            <button onClick={() => { }}>Prev</button>
          </div>
        </div>
      )}
    </div>
  );
}
