import React, { useState, useEffect } from 'react';
import {
  Webhook,
  Plus,
  Trash2,
  Edit2,
  Play,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  RefreshCw,
  Power,
  PowerOff,
  Database,
  Check
} from 'lucide-react';
import {
  getWebhooks, createWebhook, updateWebhook, deleteWebhook,
  getWebhookLogs, retryWebhook, WebhookConfig, WebhookLog
} from '../../services/webhook.service';

const AVAILABLE_EVENTS = [
  { id: 'payment.success', label: 'Payment Success' },
  { id: 'payment.failed', label: 'Payment Failed' },
  { id: 'refund.processed', label: 'Refund Processed' },
  { id: 'refund.failed', label: 'Refund Failed' },
];

export default function MerchantWebhook() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'config' | 'logs'>('config');

  const fetchAllWebhooks = async () => {
    setLoading(true);
    try {
      const res = await getWebhooks();
      if (res.success && res.data) {
        setWebhooks(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load webhooks.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await getWebhookLogs(50, 0);
      if (res.success) {
        setLogs(Array.isArray(res.data?.logs) ? res.data.logs : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWebhooks();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]
    );
  };

  const openNewForm = () => {
    setEditingId(null);
    setUrlInput('');
    setSelectedEvents([]);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setUrlInput('');
    setSelectedEvents([]);
    setEditingId(null);
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput || selectedEvents.length === 0) {
      setError('Please provide a URL and select at least one event.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (editingId) {
        const res = await updateWebhook(editingId, { webhookUrl: urlInput, events: selectedEvents });
        if (res.success) {
          setSuccessMsg('Webhook updated successfully.');
          fetchAllWebhooks();
          closeForm();
        } else {
          setError(res.message || 'Failed to update webhook.');
        }
      } else {
        const res = await createWebhook(urlInput, selectedEvents);
        if (res.success) {
          setSuccessMsg('Webhook created successfully.');
          fetchAllWebhooks();
          closeForm();
        } else {
          setError(res.message || 'Failed to create webhook.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (webhook: WebhookConfig) => {
    const newStatus = webhook.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await updateWebhook(webhook.webhookId, { status: newStatus });
      if (res.success) {
        setSuccessMsg(`Webhook status changed to ${newStatus}`);
        fetchAllWebhooks();
      } else {
        setError(res.message || 'Failed to update status.');
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    try {
      const res = await deleteWebhook(id);
      if (res.success) {
        setSuccessMsg('Webhook deleted successfully.');
        fetchAllWebhooks();
      } else {
        setError(res.message || 'Failed to delete webhook.');
      }
    } catch (err) {
      setError('Failed to delete webhook.');
    }
  };

  const handleRetryLog = async (logId: number) => {
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await retryWebhook(logId);
      if (res.success) {
        setSuccessMsg('Webhook retry triggered successfully.');
        fetchLogs();
      } else {
        setError(res.message || 'Failed to retry webhook.');
      }
    } catch (err) {
      setError('Failed to retry webhook.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-white flex items-center gap-2.5">
            <Webhook className="h-6 w-6 text-brand-500" />
            Webhooks
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Configure real-time event notifications sent directly to your server.
          </p>
        </div>
        {!isFormOpen && activeTab === 'config' && (
          <button
            onClick={openNewForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-500/20 transition"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-ink-100 dark:bg-ink-900 rounded-xl w-max">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'config'
              ? 'bg-white dark:bg-ink-950 text-ink-900 dark:text-white shadow-sm'
              : 'text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-200/50 dark:hover:bg-ink-800'
          }`}
        >
          <Database className="h-4 w-4" />
          Configurations
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-ink-950 text-ink-900 dark:text-white shadow-sm'
              : 'text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-200/50 dark:hover:bg-ink-800'
          }`}
        >
          <Activity className="h-4 w-4" />
          Delivery Logs
        </button>
      </div>

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

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Create/Edit Form */}
          {isFormOpen && (
            <div className="rounded-2xl border border-brand-500/30 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-xl shadow-brand-500/5 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-4">
                {editingId ? 'Edit Webhook' : 'Create New Webhook'}
              </h2>
              <form onSubmit={handleSaveWebhook} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-server.com/webhook"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    required
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">
                    Events to Subscribe
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_EVENTS.map(ev => (
                      <label
                        key={ev.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          selectedEvents.includes(ev.id)
                            ? 'border-brand-500 bg-brand-500/5'
                            : 'border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 hover:border-brand-500/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedEvents.includes(ev.id)}
                          onChange={() => handleEventToggle(ev.id)}
                        />
                        <div className={`h-4 w-4 rounded-md border flex items-center justify-center ${
                          selectedEvents.includes(ev.id)
                            ? 'border-brand-500 bg-brand-500 text-white'
                            : 'border-ink-300 dark:border-ink-700 bg-white dark:bg-ink-900'
                        }`}>
                          {selectedEvents.includes(ev.id) && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm font-medium text-ink-700 dark:text-ink-300">
                          {ev.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100 dark:border-ink-800">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Webhook'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Webhooks */}
          {loading ? (
            <div className="py-12 flex items-center justify-center text-ink-400 gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading Webhooks...
            </div>
          ) : webhooks.length === 0 && !isFormOpen ? (
            <div className="bg-white dark:bg-ink-900/60 backdrop-blur-xl rounded-2xl border border-ink-200 dark:border-ink-800 p-12 text-center shadow-sm">
              <Webhook className="h-12 w-12 text-ink-300 dark:text-ink-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">No Webhooks Configured</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto mb-6">
                You haven't configured any webhooks yet. Add an endpoint to start receiving real-time event notifications.
              </p>
              <button
                onClick={openNewForm}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" />
                Add Your First Webhook
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((wh) => (
                <div key={wh.webhookId} className="bg-white dark:bg-ink-900/60 backdrop-blur-xl rounded-2xl border border-ink-200/60 dark:border-ink-800/60 p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${wh.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-ink-500/10 text-ink-500'}`}>
                          <Webhook className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-ink-900 dark:text-white break-all">
                            {wh.webhookUrl}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              wh.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>
                              {wh.status}
                            </span>
                            <span className="text-xs text-ink-400 flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {wh.failureCount} Failures
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {wh.events.map(ev => (
                          <span key={ev} className="px-2.5 py-1 rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-xs font-mono text-ink-600 dark:text-ink-400">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:pl-4 md:border-l border-ink-100 dark:border-ink-800">
                      <button
                        onClick={() => handleToggleStatus(wh)}
                        title={wh.status === 'ACTIVE' ? 'Pause Webhook' : 'Activate Webhook'}
                        className={`p-2 rounded-xl transition ${
                          wh.status === 'ACTIVE' 
                            ? 'text-amber-500 hover:bg-amber-500/10' 
                            : 'text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                      >
                        {wh.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setUrlInput(wh.webhookUrl);
                          setSelectedEvents(wh.events);
                          setEditingId(wh.webhookId);
                          setIsFormOpen(true);
                        }}
                        title="Edit Webhook"
                        className="p-2 text-ink-500 hover:text-brand-500 hover:bg-brand-500/10 rounded-xl transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(wh.webhookId)}
                        title="Delete Webhook"
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery Logs Tab */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" />
              Recent Deliveries
            </h2>
            <button onClick={fetchLogs} className="p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition">
              <RefreshCw className={`h-4 w-4 ${logsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-600 dark:text-ink-300">
              <thead className="bg-ink-50 dark:bg-ink-950 text-ink-500 font-semibold border-b border-ink-100 dark:border-ink-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">HTTP Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800 font-mono">
                {logsLoading && logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-400 font-sans">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-400 font-sans italic">
                      No webhook deliveries found.
                    </td>
                  </tr>
                ) : logs.map((log) => (
                  <tr key={log.logId} className="hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition">
                    <td className="py-3 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.deliveryStatus === 'SUCCESS' ? (
                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/> Success</span>
                      ) : log.deliveryStatus === 'FAILED' ? (
                        <span className="text-rose-500 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5"/> Failed</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold">{log.responseCode || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      {log.deliveryStatus === 'FAILED' && (
                        <button
                          onClick={() => handleRetryLog(log.logId)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 transition flex items-center gap-1 ml-auto"
                        >
                          <Play className="h-3 w-3" />
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
