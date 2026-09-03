import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, LogOut, ShieldAlert, AlertCircle } from 'lucide-react';
import { useMerchant } from '../context/MerchantContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const {
    email,
    isEmailVerified,
    kycStatus,
    submitKyc,
    loading,
    error,
    clearError,
    logout,
  } = useMerchant();

  const navigate = useNavigate();

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  const [aadhaarDoc, setAadhaarDoc] = useState<File | null>(null);
  const [panDoc, setPanDoc] = useState<File | null>(null);

  const emailFromStorage = localStorage.getItem("merchant_email") || localStorage.getItem("merchantEmail") || "";
  const effectiveEmail = email || emailFromStorage;
  const verify = localStorage.getItem("is_email_verified")
  const isVerifiedFromStorage =(verify === "true");
  const effectiveIsEmailVerified = isEmailVerified || isVerifiedFromStorage;
  const normalizedKycStatus = String(kycStatus || localStorage.getItem("kyc_status") || "").toUpperCase();

  if (!effectiveEmail) {
    return (
      <div className="container-px py-16 flex items-center justify-center min-h-[70vh]">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">KYC Session Expired</h3>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Please register your business account before submitting KYC details.
          </p>
          <Link to="/signup" className="btn-primary w-full justify-center py-3">
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  if (!effectiveIsEmailVerified) {
    return (
      <div className="container-px py-16 flex items-center justify-center min-h-[70vh]">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/10 text-amber-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">Email Verification Required</h3>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Please verify your email address before starting your KYC onboarding process.
          </p>
          <Link to="/verify-email" className="btn-primary w-full justify-center py-3">
            Verify Email
          </Link>
        </div>
      </div>
    );
  }

  if (normalizedKycStatus === 'SUBMITTED' || normalizedKycStatus === 'APPROVED' || normalizedKycStatus === 'ACTIVE') {
    return (
      <div className="container-px py-20 flex items-center justify-center min-h-[85vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-2xl w-full p-8 sm:p-12 text-center space-y-8"
        >
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-glow shadow-emerald-500/15">
            <FileCheck className="h-12 w-12" />
          </div>
          <div className="space-y-3">
            <h1 className="heading text-3xl font-display">KYC Submitted Successfully</h1>
            <p className="subheading mx-auto text-ink-500 dark:text-ink-400 max-w-lg">
              Thank you for completing your merchant activation steps. Our compliance team is verifying your details.
            </p>
          </div>
          
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/merchant/dashboard" className="btn-secondary px-6">
              Go to Dashboard
            </Link>
            <button
              onClick={logout}
              className="btn-outline px-6 text-rose-600 hover:text-rose-500 hover:border-rose-500/20"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!aadhaarNumber || !panNumber || !aadhaarDoc || !panDoc) {
       alert("Please fill all fields and upload both documents.");
       return;
    }

    const formData = new FormData();
    formData.append('aadhaar_number', aadhaarNumber.trim());
    formData.append('pan_number', panNumber.toUpperCase().trim());
    formData.append('aadhaar_document', aadhaarDoc);
    formData.append('pan_document', panDoc);

    try {
      await submitKyc(formData);
      navigate("/merchant/dashboard", { replace: true });
    } catch (err) {
      console.log('KYC submission error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="container-px py-10 lg:py-16">
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-200/60 dark:border-ink-800/60 pb-6">
          <div className="space-y-1">
            <span className="eyebrow">KYC Onboarding</span>
            <h1 className="heading text-3xl font-display">Verify Your Identity</h1>
            <p className="subheading text-xs max-w-none">Complete your KYC to access the dashboard.</p>
          </div>
          <button
            onClick={logout}
            className="self-start sm:self-center btn-ghost py-2.5 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFinalSubmit} className="glass-card p-6 sm:p-8 space-y-6">
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Aadhaar Number <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="12 digit Aadhaar number" 
                className="input-field" 
                maxLength={12}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">PAN Card Number <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="10 digit PAN (e.g. ABCDE1234F)" 
                className="input-field uppercase" 
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Upload Aadhaar Image <span className="text-rose-500">*</span></label>
              <div className="relative group border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-xl p-6 text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors bg-ink-50/50 dark:bg-ink-900/30">
                <input 
                  type="file" 
                  required
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileChange(e, setAadhaarDoc)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Upload className="h-6 w-6 text-brand-500" />
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
                    {aadhaarDoc ? aadhaarDoc.name : "Click or drag to upload Aadhaar"}
                  </p>
                  <p className="text-xs text-ink-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Upload PAN Card Image <span className="text-rose-500">*</span></label>
              <div className="relative group border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-xl p-6 text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors bg-ink-50/50 dark:bg-ink-900/30">
                <input 
                  type="file" 
                  required
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileChange(e, setPanDoc)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Upload className="h-6 w-6 text-brand-500" />
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
                    {panDoc ? panDoc.name : "Click or drag to upload PAN"}
                  </p>
                  <p className="text-xs text-ink-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary py-3 px-8 w-full sm:w-auto"
            >
              {loading ? "Uploading..." : "KYC Document Upload"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
