import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  UserCheck,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Mail,
  Smartphone,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function MerchantSettings() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Business General Settings
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'My Payment Shop',
    supportEmail: 'support@myshop.com',
    supportPhone: '+91 9876543210',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +05:30)'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyReport: true,
    refundAlerts: true,
    settlementAlerts: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30' // minutes
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg('Merchant Settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-brand-500" />
            Merchant Account Settings
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Configure your business profile, notification preferences & security settings
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General Business Profile Settings */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-100 dark:border-ink-800 pb-3">
            <UserCheck className="h-4 w-4 text-brand-500" />
            Business Profile & Localization
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-ink-700 dark:text-ink-300">Display Business Name</label>
              <input
                type="text"
                value={businessSettings.businessName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-ink-400" /> Customer Support Email
              </label>
              <input
                type="email"
                value={businessSettings.supportEmail}
                onChange={(e) => setBusinessSettings({ ...businessSettings, supportEmail: e.target.value })}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5 text-ink-400" /> Support Phone Number
              </label>
              <input
                type="text"
                value={businessSettings.supportPhone}
                onChange={(e) => setBusinessSettings({ ...businessSettings, supportPhone: e.target.value })}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-ink-700 dark:text-ink-300">Default Currency</label>
                <select
                  value={businessSettings.currency}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, currency: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none font-semibold"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-ink-400" /> Timezone
                </label>
                <select
                  value={businessSettings.timezone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, timezone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none font-semibold"
                >
                  <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST)</option>
                  <option value="UTC (+00:00)">UTC (+00:00)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Security & Session Settings */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-100 dark:border-ink-800 pb-3">
            <Shield className="h-4 w-4 text-brand-500" />
            Security & Login Protection
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-ink-100 dark:border-ink-800">
              <div>
                <p className="font-bold text-ink-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-ink-500 text-[11px] mt-0.5">Require OTP verification upon merchant login.</p>
              </div>
              <button
                type="button"
                onClick={() => setSecuritySettings({ ...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth })}
                className="text-brand-500 hover:text-brand-600 transition"
              >
                {securitySettings.twoFactorAuth ? (
                  <ToggleRight className="h-8 w-8 text-brand-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-ink-400" />
                )}
              </button>
            </div>

            <div>
              <label className="font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-ink-400" /> Auto Session Timeout
              </label>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white mt-1 focus:outline-none font-semibold"
              >
                <option value="15">15 Minutes of inactivity</option>
                <option value="30">30 Minutes of inactivity</option>
                <option value="60">1 Hour of inactivity</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Notifications & Alert Preferences (Full Width) */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-100 dark:border-ink-800 pb-3">
            <Bell className="h-4 w-4 text-brand-500" />
            Notifications & System Alerts
          </h2>

          <div className="divide-y divide-ink-100 dark:divide-ink-800 text-xs">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-ink-900 dark:text-white text-sm">Email Transaction Alerts</p>
                <p className="text-ink-500 text-[11px]">Receive emails for successful payment notifications.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                className="text-brand-500 transition"
              >
                {notifications.emailAlerts ? <ToggleRight className="h-8 w-8 text-brand-500" /> : <ToggleLeft className="h-8 w-8 text-ink-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-ink-900 dark:text-white text-sm">Daily Settlement Email Summary</p>
                <p className="text-ink-500 text-[11px]">Get daily summary reports of settled amounts & payouts.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, dailyReport: !notifications.dailyReport })}
                className="text-brand-500 transition"
              >
                {notifications.dailyReport ? <ToggleRight className="h-8 w-8 text-brand-500" /> : <ToggleLeft className="h-8 w-8 text-ink-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-ink-900 dark:text-white text-sm">Refund Request Notifications</p>
                <p className="text-ink-500 text-[11px]">Receive alerts when new refund requests are initiated or processed.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, refundAlerts: !notifications.refundAlerts })}
                className="text-brand-500 transition"
              >
                {notifications.refundAlerts ? <ToggleRight className="h-8 w-8 text-brand-500" /> : <ToggleLeft className="h-8 w-8 text-ink-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-ink-900 dark:text-white text-sm">SMS Payout Notifications</p>
                <p className="text-ink-500 text-[11px]">Get instant SMS alerts for high-value payouts.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })}
                className="text-brand-500 transition"
              >
                {notifications.smsAlerts ? <ToggleRight className="h-8 w-8 text-brand-500" /> : <ToggleLeft className="h-8 w-8 text-ink-400" />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
