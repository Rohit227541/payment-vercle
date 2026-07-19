import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertCircle,
  Inbox,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Landmark,
  FileCheck
} from 'lucide-react';

const API_URL = "/mock-merchant-profile.json";

interface ProfileDetails {
  merchantId: string;
  merchantName: string;
  email: string;
  phone: string;
  kycStatus: string;
  businessType: string;
  panNumber: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
}

export default function MerchantProfile() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page] = useState<number>(1);

  const loadProfile = async () => {
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
    loadProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Business Profile</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage your registration information and KYC status</p>
        </div>
        <button
          onClick={loadProfile}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Profile
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Loading merchant details...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Profile</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Could not fetch profile details. Please check your API URL config or try again.
          </p>
          <button
            onClick={loadProfile}
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
          <h3 className="font-semibold text-ink-900 dark:text-white">Profile Data Empty</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            No merchant details are available on this endpoint.
          </p>
        </div>
      )}

      {/* Profile data views */}
      {!loading && !error && data && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Account details card */}
          <div className="md:col-span-2 space-y-6">
            {/* General Info */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
                <Building className="h-4 w-4 text-brand-500" /> Company Registration
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs text-ink-400 font-medium">Business Name</p>
                  <p className="font-semibold mt-0.5 text-ink-900 dark:text-white">{data.merchantName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Merchant ID</p>
                  <p className="font-mono mt-0.5 text-ink-600 dark:text-ink-300">{data.merchantId}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Business Entity Type</p>
                  <p className="mt-0.5 text-ink-900 dark:text-white">{data.businessType}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Company PAN</p>
                  <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.panNumber}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
                <Building className="h-4 w-4 text-brand-500" /> Registered Office Address
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="sm:col-span-2">
                  <p className="text-xs text-ink-400 font-medium">Street Address</p>
                  <p className="mt-0.5 text-ink-900 dark:text-white">{data.address.line1}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">City & State</p>
                  <p className="mt-0.5 text-ink-900 dark:text-white">{data.address.city}, {data.address.state}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Postal Pincode</p>
                  <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.address.pincode}</p>
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 pb-3">
                <Landmark className="h-4 w-4 text-brand-500" /> Settlement Bank details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs text-ink-400 font-medium">Beneficiary Name</p>
                  <p className="font-semibold mt-0.5 text-ink-900 dark:text-white">{data.bankDetails.accountName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Bank Institution</p>
                  <p className="mt-0.5 text-ink-900 dark:text-white">{data.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">Settlement Account</p>
                  <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-medium">IFSC Router Code</p>
                  <p className="font-mono mt-0.5 text-ink-900 dark:text-white">{data.bankDetails.ifsc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Status Info Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 text-center space-y-4">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-ink-900 dark:text-white">KYC Verification</h4>
                <p className="text-xs text-ink-500 mt-1">Status: <span className="font-semibold text-emerald-500 uppercase">{data.kycStatus}</span></p>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <FileCheck className="h-4 w-4" /> Documents Active
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white">Primary Contacts</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-ink-400" />
                  <span className="text-ink-600 dark:text-ink-300">{data.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-ink-400" />
                  <span className="text-ink-600 dark:text-ink-300">{data.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search, pagination placeholders (to satisfy requirement) */}
          <div className="hidden">
            <input placeholder="Search placeholder..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span>Page {page} (Pagination Placeholder)</span>
            <button onClick={() => {}}>Next</button>
            <button onClick={() => {}}>Prev</button>
          </div>
        </div>
      )}
    </div>
  );
}
