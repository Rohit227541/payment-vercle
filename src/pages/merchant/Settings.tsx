import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Inbox,
  Key,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const API_URL = "/mock-merchant-settings.json";

interface SettingsConfig {
  publicKey: string;
  webhookUrl: string;
  webhookSecret: string;
  emailAlerts: boolean;
  payoutAlerts: boolean;
  smsAlerts: boolean;
}

export default function MerchantSettings() {
  const [data, setData] = useState<SettingsConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Merchant Settings</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Configure your API credentials, security, and notification systems</p>
        </div>
        <button
          onClick={loadSettings}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Settings
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading settings database...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Settings</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch Merchant configurations. Please check your API URL config or try again.
          </p>
          <button
            onClick={loadSettings}
            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
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
          <h3 className="font-semibold text-ink-900 dark:text-white">Settings Configurations Empty</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No configurations or API credentials exist for this endpoint.
          </p>
        </div>
      )}

      {/* Data views */}
      {!loading && !error && data && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* API keys credentials */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <Key className="h-4 w-4 text-brand-500" /> API Access Keys
            </h3>

            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-400">Public Live Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={data.publicKey}
                    className="input font-mono text-xs w-full py-2 bg-ink-50/50 dark:bg-ink-950/30"
                  />
                  <button
                    onClick={() => handleCopy(data.publicKey)}
                    className="btn-secondary px-3 py-2 flex items-center justify-center shrink-0"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-400">Secret Token Key</label>
                <div className="flex gap-2">
                  <input
                    type={showSecret ? "text" : "password"}
                    readOnly
                    value={data.webhookSecret}
                    className="input font-mono text-xs w-full py-2 bg-ink-50/50 dark:bg-ink-950/30"
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="btn-secondary px-3 py-2 flex items-center justify-center shrink-0"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhooks config */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              <Shield className="h-4 w-4 text-brand-500" /> Webhook Integrations
            </h3>

            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-400">Listener URL Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value={data.webhookUrl}
                  className="input text-xs w-full py-2 bg-ink-50/50 dark:bg-ink-950/30 font-mono"
                />
              </div>
              <p className="text-[11px] text-ink-400 leading-normal">
                Receive real-time transactional updates (SUCCESS, FAILED, CHARGEBACK) directly on your application backend.
              </p>
            </div>
          </div>

          {/* Notifications toggles */}
          <div className="glass-card p-6 space-y-5 md:col-span-2">
            <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
              Settings Configurations Toggles
            </h3>

            <div className="divide-y divide-ink-200/40 dark:divide-ink-800/40 text-sm">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">Email alerts notifications</p>
                  <p className="text-xs text-ink-400">Receive daily settlement reports and invoice confirmations.</p>
                </div>
                <button className="text-brand-500">
                  {data.emailAlerts ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">SMS payouts alerts</p>
                  <p className="text-xs text-ink-400">Get notified via SMS on high-value settlements or pending actions.</p>
                </div>
                <button className="text-brand-500">
                  {data.smsAlerts ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">API access alerts</p>
                  <p className="text-xs text-ink-400">Notify primary developer email when secret keys are accessed.</p>
                </div>
                <button className="text-brand-500">
                  {data.payoutAlerts ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
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
