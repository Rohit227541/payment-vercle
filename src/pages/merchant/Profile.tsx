import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ShieldAlert,
  AlertCircle,
  Activity,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  Landmark,
  MapPin,
  RefreshCw,
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
  aadharNumber?: string;
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

  const loadProfile = async () => {
    setLoading(true);
    setError(false);
    try {
      const storedMerchantStr = localStorage.getItem("merchant");
      const storedKycStatus = localStorage.getItem("kyc_status");

      let storedMerchant: any = null;
      if (storedMerchantStr) {
        try {
          storedMerchant = JSON.parse(storedMerchantStr);
        } catch (e) {
          console.log("Error parsing stored merchant:", e);
        }
      }

      const response = await fetch(API_URL);
      const result = await response.json();

      if (storedMerchant) {
        result.merchantId = `MERCH-${String(storedMerchant.id || '001').padStart(4, '0')}`;
        result.merchantName = storedMerchant.name || result.merchantName;
        result.email = storedMerchant.email || result.email;
      }
      if (storedKycStatus) {
        result.kycStatus = storedKycStatus;
      }
      
      // Ensure we have an Aadhar number to display
      result.aadharNumber = storedMerchant?.aadharNumber || result.aadharNumber || 'XXXX-XXXX-8921';

      // Simulate a small delay for the animation
      setTimeout(() => {
        setData(result);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.log("Profile load error:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-ink-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4 mt-20">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-ink-900 dark:text-white">Failed to Load Profile</h3>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Could not fetch profile details. Please try again later.
        </p>
        <button
          onClick={loadProfile}
          className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12 w-full"
    >
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Business Profile</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Manage your merchant account details and business settings.</p>
        </motion.div>
        <motion.button
          variants={itemVariants}
          onClick={loadProfile}
          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </motion.button>
      </div>

      {/* Hero Profile Card */}
      <motion.div variants={itemVariants} className="relative rounded-2xl overflow-hidden border border-ink-200/50 dark:border-ink-800/50 bg-white dark:bg-ink-950 shadow-xl shadow-purple-900/5">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="shrink-0 relative group"
          >
            <div className="h-32 w-32 rounded-full bg-white dark:bg-ink-950 p-1.5 shadow-xl relative z-10">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center overflow-hidden border border-purple-100 dark:border-purple-800/30 group-hover:shadow-inner transition-all duration-300">
                <Building className="h-14 w-14 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
              className="absolute bottom-2 right-2 p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full border-4 border-white dark:border-ink-950 shadow-lg z-20"
            >
              <ShieldCheck className="h-5 w-5" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left pb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-display font-bold text-ink-900 dark:text-white tracking-tight">
                  {data.merchantName}
                </h2>
                <p className="text-ink-600 dark:text-ink-400 mt-1 flex items-center justify-center md:justify-start gap-2 font-medium">
                  <Mail className="h-4 w-4 text-purple-500" /> {data.email}
                </p>
              </div>
              
              <div className="flex items-center justify-center md:justify-end gap-3">
                <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Status</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-ink-900 dark:text-white uppercase tracking-wide">{data.kycStatus}</span>
                  </div>
                </div>
                
                <div className="px-4 py-2 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-1">Merchant ID</span>
                  <span className="text-sm font-mono font-bold text-ink-900 dark:text-white">{data.merchantId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Left Column - Business Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-ink-950 rounded-2xl border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-ink-100 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 dark:text-white text-lg">Business Information</h3>
                <p className="text-xs text-ink-500">Your registered company details</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Business Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-ink-400" />
                    </div>
                    <input 
                      type="text" 
                      value={data.merchantName} 
                      readOnly 
                      className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Entity Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileCheck className="h-4 w-4 text-ink-400" />
                    </div>
                    <input 
                      type="text" 
                      value={data.businessType} 
                      readOnly 
                      className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Company PAN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ShieldAlert className="h-4 w-4 text-ink-400" />
                    </div>
                    <input 
                      type="text" 
                      value={data.panNumber} 
                      readOnly 
                      className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Aadhar Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-ink-400" />
                    </div>
                    <input 
                      type="text" 
                      value={data.aadharNumber} 
                      readOnly 
                      className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Contact Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-ink-400" />
                    </div>
                    <input 
                      type="text" 
                      value={data.phone} 
                      readOnly 
                      className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>



        </motion.div>

        {/* Right Column - Status & Address */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-ink-950 rounded-2xl border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-ink-100 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 dark:text-white text-lg">KYC Status</h3>
                <p className="text-xs text-ink-500">Verification details</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="pt-2">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10 flex items-start gap-3">
                  <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Account Verified
                    </h4>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                      Your business profile and documents have been fully verified. You are authorized to process transactions and receive settlements.
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
