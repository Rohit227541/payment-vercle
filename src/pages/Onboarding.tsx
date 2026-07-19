import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Landmark,
  Upload,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  FileText,
  FileCheck,
  LogOut,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useMerchant } from '../context/MerchantContext';
import { Link } from 'react-router-dom';

type BusinessInfoData = {
  businessName: string;
  businessType: string;
  businessCategory: string;
  businessPan: string;
  gstin?: string;
  aadhaarNumber: string;
};

type AddressData = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type BankDetailsData = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountType: string;
};

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

  const [step, setStep] = useState(1);
  const [kycData, setKycData] = useState<{
    businessInfo?: BusinessInfoData;
    address?: AddressData;
    bankDetails?: BankDetailsData;
  }>({});

  const [files, setFiles] = useState<{
    panDoc: File | null;
    aadhaarDoc: File | null;
    gstDoc: File | null;
    chequeDoc: File | null;
  }>({
    panDoc: null,
    aadhaarDoc: null,
    gstDoc: null,
    chequeDoc: null,
  });

  const [fileErrors, setFileErrors] = useState<{
    panDoc?: string;
    aadhaarDoc?: string;
    chequeDoc?: string;
  }>({});

  const [agreeTerms, setAgreeTerms] = useState(false);

  const steps = [
    { num: 1, label: 'Business Profile', desc: 'Company registration details', icon: Building2 },
    { num: 2, label: 'Registered Address', desc: 'State and tax jurisdiction', icon: MapPin },
    { num: 3, label: 'Settlement Bank', desc: 'Account for daily payouts', icon: Landmark },
    { num: 4, label: 'Document Vault', desc: 'Government verified IDs', icon: Upload },
    { num: 5, label: 'Review & Activate', desc: 'Declaration and submit', icon: ShieldCheck },
  ];

  if (!email) {
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

  if (!isEmailVerified) {
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

  // Submitted Success Screen
  if (kycStatus === 'submitted') {
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
          
          {/* Timeline Process */}
          <div className="max-w-md mx-auto text-left space-y-4 rounded-2xl bg-ink-50/50 dark:bg-ink-900/30 border border-ink-200/50 dark:border-ink-800/60 p-6">
            <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white mb-2">Onboarding Timeline</h4>
            <div className="relative border-l border-brand-500/30 pl-5 space-y-5">
              <div className="relative">
                <span className="absolute -left-7.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white text-[9px] font-bold">✓</span>
                <p className="text-xs font-semibold text-ink-900 dark:text-white">Business Verification Submitted</p>
                <p className="text-[10px] text-ink-400">Completed today</p>
              </div>
              <div className="relative">
                <span className="absolute -left-7.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white text-[9px] font-bold">●</span>
                <p className="text-xs font-semibold text-ink-900 dark:text-white">Admin Document Review</p>
                <p className="text-[10px] text-ink-400">Underway (takes 24-48 business hours)</p>
              </div>
              <div className="relative opacity-60">
                <span className="absolute -left-7.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-ink-200 dark:bg-ink-800 text-ink-400 text-[9px] font-bold">3</span>
                <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Production Dashboard Enabled</p>
                <p className="text-[10px] text-ink-400">API keys ready to activate</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <a href={import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174'} className="btn-secondary px-6">
              Go to Dashboard
            </a>
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

  const handleFinalSubmit = async () => {
    clearError();
    if (!agreeTerms) return;

    const formData = new FormData();
    const { businessPan, aadhaarNumber, gstin, ...businessInfoRest } = kycData.businessInfo || {};

    const payload = {
      ...businessInfoRest,
      ...kycData.address,
      ...kycData.bankDetails,
    };
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (businessPan) formData.append('pan_number', businessPan.toUpperCase().trim());
    if (aadhaarNumber) formData.append('aadhaar_number', aadhaarNumber.trim());
    if (gstin) formData.append('gstin', gstin.toUpperCase().trim());

    if (files.panDoc) formData.append('pan_document', files.panDoc);
    if (files.aadhaarDoc) formData.append('aadhaar_document', files.aadhaarDoc);
    if (files.gstDoc) formData.append('gst_document', files.gstDoc);
    if (files.chequeDoc) formData.append('cancelled_cheque', files.chequeDoc);

    try {
      await submitKyc(formData);
    } catch (err) {
      console.error('KYC submission error:', err);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="container-px py-10 lg:py-16">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-200/60 dark:border-ink-800/60 pb-6">
          <div className="space-y-1">
            <span className="eyebrow">Onboarding Wizard</span>
            <h1 className="heading text-3xl font-display">Verify Your Business</h1>
            <p className="subheading text-xs max-w-none">Complete KYC to start collecting live cards and UPI settlements.</p>
          </div>
          <button
            onClick={logout}
            className="self-start sm:self-center btn-ghost py-2.5 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stepper Checklist: Left column (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4 sticky top-24">
            <div className="rounded-3xl bg-white/40 dark:bg-ink-950/40 border border-ink-200/60 dark:border-ink-800/60 p-6 backdrop-blur space-y-5">
              <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white">KYC Checklist</h4>
              <div className="space-y-1">
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isActive = step === s.num;
                  const isCompleted = step > s.num;
                  return (
                    <button
                      key={s.num}
                      disabled={s.num > step && !isCompleted}
                      onClick={() => setStep(s.num)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl p-3 text-left transition ${
                        isActive
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/10'
                          : 'text-ink-500 dark:text-ink-400 hover:bg-ink-100/50 dark:hover:bg-ink-900/30 border border-transparent'
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold shrink-0 transition ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-glow shadow-emerald-500/10'
                            : isActive
                            ? 'bg-brand-600 text-white shadow-glow shadow-brand-500/10'
                            : 'bg-ink-100 dark:bg-ink-800 text-ink-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className={`text-xs font-bold leading-none ${isActive ? 'text-brand-700 dark:text-brand-200' : 'text-ink-800 dark:text-ink-300'}`}>
                          {s.label}
                        </p>
                        <p className="text-[10px] text-ink-400 mt-1">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-brand-500/15 bg-brand-500/5 p-4 text-xs text-ink-600 dark:text-brand-300 flex gap-2">
              <HelpCircle className="h-5 w-5 text-brand-500 shrink-0" />
              <span>Need help? Contact PayFlow merchant support available 24/7 at support@payflow.io.</span>
            </div>
          </aside>

          {/* Stepper Progress Ribbon (Mobile/Tablet only) */}
          <div className="block lg:hidden col-span-1 border border-ink-200/60 dark:border-ink-800/60 bg-white/40 dark:bg-ink-950/40 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-ink-900 dark:text-white">
              <span>Progress</span>
              <span>Step {step} of {steps.length}</span>
            </div>
            <div className="mt-2 h-2 w-full bg-ink-200 dark:bg-ink-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all duration-300" style={{ width: `${(step / steps.length) * 100}%` }} />
            </div>
            <p className="text-xs  mt-1.5 font-semibold text-brand-600 dark:text-brand-300 flex items-center gap-1.5">
              {(() => {
                const ActiveIcon = steps[step - 1].icon;
                return <ActiveIcon className="h-3.5 w-3.5" />;
              })()}
              {steps[step - 1].label}
            </p>
          </div>

          {/* Right Form Card Block */}
          <main className="lg:col-span-8 space-y-6">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Verification Error</p>
                  <p className="mt-0.5 text-xs text-rose-500">{error}</p>
                </div>
              </div>
            )}

            <div className="glass-card p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <BusinessInfoForm
                    defaultValues={kycData.businessInfo}
                    onSubmit={(data) => {
                      setKycData((prev) => ({ ...prev, businessInfo: data }));
                      nextStep();
                    }}
                  />
                )}
                {step === 2 && (
                  <AddressForm
                    defaultValues={kycData.address}
                    onBack={prevStep}
                    onSubmit={(data) => {
                      setKycData((prev) => ({ ...prev, address: data }));
                      nextStep();
                    }}
                  />
                )}
                {step === 3 && (
                  <BankDetailsForm
                    defaultValues={kycData.bankDetails}
                    onBack={prevStep}
                    onSubmit={(data) => {
                      setKycData((prev) => ({ ...prev, bankDetails: data }));
                      nextStep();
                    }}
                  />
                )}
                {step === 4 && (
                  <DocumentUploadForm
                    files={files}
                    errors={fileErrors}
                    setFiles={setFiles}
                    setErrors={setFileErrors}
                    onBack={prevStep}
                    onSubmit={() => {
                      const errs: typeof fileErrors = {};
                      if (!files.panDoc) errs.panDoc = 'PAN card document is required';
                      if (!files.aadhaarDoc) errs.aadhaarDoc = 'Aadhaar Card copy is required';
                      if (!files.chequeDoc) errs.chequeDoc = 'Cancelled cheque copy is required';

                      if (Object.keys(errs).length > 0) {
                        setFileErrors(errs);
                      } else {
                        setFileErrors({});
                        nextStep();
                      }
                    }}
                  />
                )}
                {step === 5 && (
                  <ReviewForm
                    data={kycData}
                    files={files}
                    onBack={prevStep}
                    agree={agreeTerms}
                    setAgree={setAgreeTerms}
                    onSubmit={handleFinalSubmit}
                    loading={loading}
                  />
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Step 1: Business Information Form
   ========================================================================== */
function BusinessInfoForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: BusinessInfoData;
  onSubmit: (data: BusinessInfoData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInfoData>({ defaultValues });

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLP',
    'Private Limited Company',
    'Public Limited Company',
    'NGO / Trust',
  ];

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="border-b border-ink-200/60 dark:border-ink-800/60 pb-4">
        <h3 className="text-xl font-bold font-display text-ink-900 dark:text-white">Business Profile</h3>
        <p className="text-xs text-ink-500 mt-1">Please provide the details registered with government filings.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Business Name */}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="businessName">Registered Business Name</label>
          <input
            id="businessName"
            type="text"
            placeholder="Acme Solutions Pvt Ltd"
            className={`input ${errors.businessName ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
            {...register('businessName', { required: 'Business name is required' })}
          />
          {errors.businessName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label className="label" htmlFor="businessType">Business Entity Type</label>
          <select
            id="businessType"
            className={`input ${errors.businessType ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
            {...register('businessType', { required: 'Please select an entity type' })}
          >
            <option value="">Select Type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.businessType.message}
            </p>
          )}
        </div>

        {/* Business Category */}
        <div>
          <label className="label" htmlFor="businessCategory">Industry Category</label>
          <input
            id="businessCategory"
            type="text"
            placeholder="E-commerce, SaaS, Retail, etc."
            className={`input ${errors.businessCategory ? 'border-rose-500' : ''}`}
            {...register('businessCategory', { required: 'Industry category is required' })}
          />
          {errors.businessCategory && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.businessCategory.message}
            </p>
          )}
        </div>

        {/* Business PAN */}
        <div>
          <label className="label" htmlFor="businessPan">Business/Personal PAN</label>
          <input
            id="businessPan"
            type="text"
            placeholder="ABCDE1234F"
            maxLength={10}
            className={`input uppercase ${errors.businessPan ? 'border-rose-500' : ''}`}
            {...register('businessPan', {
              required: 'PAN card number is required',
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
                message: 'Invalid PAN card format (e.g. ABCDE1234F)',
              },
            })}
          />
          {errors.businessPan && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.businessPan.message}
            </p>
          )}
        </div>

        {/* GSTIN */}
        <div>
          <label className="label" htmlFor="gstin">GSTIN (Optional)</label>
          <input
            id="gstin"
            type="text"
            placeholder="29ABCDE1234F1Z5"
            maxLength={15}
            className={`input uppercase ${errors.gstin ? 'border-rose-500' : ''}`}
            {...register('gstin', {
              pattern: {
                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
                message: 'Invalid GSTIN format',
              },
            })}
          />
          {errors.gstin && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.gstin.message}
            </p>
          )}
        </div>

        {/* Aadhaar Number */}
        <div>
          <label className="label" htmlFor="aadhaarNumber">Aadhaar Number</label>
          <input
            id="aadhaarNumber"
            type="text"
            placeholder="12-digit Aadhaar"
            maxLength={12}
            className={`input ${errors.aadhaarNumber ? 'border-rose-500' : ''}`}
            {...register('aadhaarNumber', {
              required: 'Aadhaar number is required',
              pattern: {
                value: /^[0-9]{12}$/,
                message: 'Aadhaar must be exactly 12 digits',
              },
            })}
          />
          {errors.aadhaarNumber && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.aadhaarNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-ink-200/60 dark:border-ink-800/60 flex justify-end">
        <button type="submit" className="btn-primary px-6 flex items-center gap-2 shadow-lg shadow-brand-500/10">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================================================
   Step 2: Business Address Form
   ========================================================================== */
function AddressForm({
  defaultValues,
  onBack,
  onSubmit,
}: {
  defaultValues?: AddressData;
  onBack: () => void;
  onSubmit: (data: AddressData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressData>({
    defaultValues: defaultValues || { country: 'India' },
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="border-b border-ink-200/60 dark:border-ink-800/60 pb-4">
        <h3 className="text-xl font-bold font-display text-ink-900 dark:text-white">Registered Address</h3>
        <p className="text-xs text-ink-500 mt-1">Provide your primary workspace or registered headquarters address.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="addressLine1">Address Line 1</label>
          <input
            id="addressLine1"
            type="text"
            placeholder="Office / Building Name, Suite No."
            className={`input ${errors.addressLine1 ? 'border-rose-500' : ''}`}
            {...register('addressLine1', { required: 'Address Line 1 is required' })}
          />
          {errors.addressLine1 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="addressLine2">Address Line 2 (Optional)</label>
          <input
            id="addressLine2"
            type="text"
            placeholder="Street Address, Locality"
            className="input"
            {...register('addressLine2')}
          />
        </div>

        {/* City */}
        <div>
          <label className="label" htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Bengaluru"
            className={`input ${errors.city ? 'border-rose-500' : ''}`}
            {...register('city', { required: 'City is required' })}
          />
          {errors.city && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.city.message}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="label" htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            placeholder="Karnataka"
            className={`input ${errors.state ? 'border-rose-500' : ''}`}
            {...register('state', { required: 'State is required' })}
          />
          {errors.state && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.state.message}
            </p>
          )}
        </div>

        {/* Pin Code */}
        <div>
          <label className="label" htmlFor="pincode">Pin Code</label>
          <input
            id="pincode"
            type="text"
            maxLength={6}
            placeholder="560103"
            className={`input ${errors.pincode ? 'border-rose-500' : ''}`}
            {...register('pincode', {
              required: 'Pin Code is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Invalid 6-digit pin code',
              },
            })}
          />
          {errors.pincode && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.pincode.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="label" htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            className={`input ${errors.country ? 'border-rose-500' : ''}`}
            {...register('country', { required: 'Country is required' })}
          />
          {errors.country && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-ink-200/60 dark:border-ink-800/60 flex gap-3">
        <button type="button" onClick={onBack} className="btn-outline px-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="submit" className="btn-primary flex-1 justify-center shadow-lg shadow-brand-500/10">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================================================
   Step 3: Bank Details Form
   ========================================================================== */
function BankDetailsForm({
  defaultValues,
  onBack,
  onSubmit,
}: {
  defaultValues?: BankDetailsData;
  onBack: () => void;
  onSubmit: (data: BankDetailsData) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BankDetailsData>({ defaultValues });

  const accountNumber = watch('accountNumber');

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="border-b border-ink-200/60 dark:border-ink-800/60 pb-4">
        <h3 className="text-xl font-bold font-display text-ink-900 dark:text-white">Settlement Bank</h3>
        <p className="text-xs text-ink-500 mt-1">Specify where PayFlow should route your daily sales payouts.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Account Name */}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="accountName">Beneficiary Account Name</label>
          <input
            id="accountName"
            type="text"
            placeholder="As matching business/proprietor PAN registration"
            className={`input ${errors.accountName ? 'border-rose-500' : ''}`}
            {...register('accountName', { required: 'Beneficiary account name is required' })}
          />
          {errors.accountName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.accountName.message}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="label" htmlFor="bankName">Bank Name</label>
          <input
            id="bankName"
            type="text"
            placeholder="e.g. HDFC Bank, ICICI Bank"
            className={`input ${errors.bankName ? 'border-rose-500' : ''}`}
            {...register('bankName', { required: 'Bank name is required' })}
          />
          {errors.bankName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.bankName.message}
            </p>
          )}
        </div>

        {/* Account Type */}
        <div>
          <label className="label" htmlFor="accountType">Account Type</label>
          <select
            id="accountType"
            className="input"
            {...register('accountType', { required: 'Account type is required' })}
          >
            <option value="Current">Current Account</option>
            <option value="Savings">Savings Account</option>
          </select>
          {errors.accountType && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.accountType.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="label" htmlFor="accountNumber">Account Number</label>
          <input
            id="accountNumber"
            type="password"
            placeholder="••••••••••••"
            className={`input ${errors.accountNumber ? 'border-rose-500' : ''}`}
            {...register('accountNumber', {
              required: 'Account number is required',
              minLength: { value: 9, message: 'Minimum 9 digits required' },
            })}
          />
          {errors.accountNumber && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Confirm Account Number */}
        <div>
          <label className="label" htmlFor="confirmAccountNumber">Confirm Account Number</label>
          <input
            id="confirmAccountNumber"
            type="text"
            placeholder="Retype account number"
            className={`input ${errors.confirmAccountNumber ? 'border-rose-500' : ''}`}
            {...register('confirmAccountNumber', {
              required: 'Please confirm your account number',
              validate: (val) => val === accountNumber || 'Account numbers do not match',
            })}
          />
          {errors.confirmAccountNumber && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.confirmAccountNumber.message}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="ifscCode">IFSC Code</label>
          <input
            id="ifscCode"
            type="text"
            placeholder="HDFC0000123"
            maxLength={11}
            className={`input uppercase ${errors.ifscCode ? 'border-rose-500' : ''}`}
            {...register('ifscCode', {
              required: 'IFSC Code is required',
              pattern: {
                value: /^[A-Z]{4}0[A-Z0-9]{6}$/i,
                message: 'Invalid IFSC code format (e.g. HDFC0000123)',
              },
            })}
          />
          {errors.ifscCode && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {errors.ifscCode.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-ink-200/60 dark:border-ink-800/60 flex gap-3">
        <button type="button" onClick={onBack} className="btn-outline px-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="submit" className="btn-primary flex-1 justify-center shadow-lg shadow-brand-500/10">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================================================
   Step 4: Document Upload Form
   ========================================================================== */
function DocumentUploadForm({
  files,
  errors,
  setFiles,
  setErrors,
  onBack,
  onSubmit,
}: {
  files: {
    panDoc: File | null;
    aadhaarDoc: File | null;
    gstDoc: File | null;
    chequeDoc: File | null;
  };
  errors: {
    panDoc?: string;
    aadhaarDoc?: string;
    chequeDoc?: string;
  };
  setFiles: React.Dispatch<React.SetStateAction<typeof files>>;
  setErrors: React.Dispatch<React.SetStateAction<typeof errors>>;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    if (file) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const uploadSlots = [
    { key: 'panDoc' as const, label: 'PAN Card Copy (Company/Personal)', desc: 'Upload front scan matching PAN number', required: true },
    { key: 'aadhaarDoc' as const, label: 'Aadhaar Card Copy', desc: 'Scan with visible address and signature', required: true },
    { key: 'gstDoc' as const, label: 'GST Registration Certificate', desc: 'Required for private and public companies', required: false },
    { key: 'chequeDoc' as const, label: 'Cancelled Cheque Copy', desc: 'Cheque matching settlement account details', required: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="border-b border-ink-200/60 dark:border-ink-800/60 pb-4">
        <h3 className="text-xl font-bold font-display text-ink-900 dark:text-white">Document Upload</h3>
        <p className="text-xs text-ink-500 mt-1">Upload verified files to fulfill regulatory compliance standards.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {uploadSlots.map((slot) => (
          <div key={slot.key} className="space-y-2">
            <div>
              <label className="label flex justify-between items-center !mb-0">
                <span>
                  {slot.label}{' '}
                  {slot.required ? (
                    <span className="text-rose-500 font-bold">*</span>
                  ) : (
                    <span className="text-[10px] text-ink-400 font-normal ml-1 bg-ink-100 dark:bg-ink-800 rounded px-1.5 py-0.5">Optional</span>
                  )}
                </span>
              </label>
              <p className="text-[10px] text-ink-400 mt-0.5">{slot.desc}</p>
            </div>

            {/* Upload Zone widget */}
            <div
              className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                errors[slot.key as keyof typeof errors]
                  ? 'border-rose-500 bg-rose-500/5'
                  : files[slot.key]
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-glow shadow-emerald-500/5'
                  : 'border-ink-200 dark:border-ink-800 hover:border-brand-500 dark:hover:border-brand-400 bg-ink-50/50 dark:bg-ink-950/20'
              }`}
            >
              {files[slot.key] ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-ink-900 dark:text-white truncate max-w-xs px-2">
                    {files[slot.key]!.name}
                  </p>
                  <p className="text-[10px] text-ink-400">
                    {(files[slot.key]!.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFileChange(slot.key, null)}
                    className="mt-2 text-xs font-bold text-rose-500 hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/5 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-ink-700 dark:text-ink-300">
                    Drag and drop file here
                  </p>
                  <p className="text-[10px] text-ink-400 mt-1">PDF, PNG, or JPG up to 10MB</p>
                  <button type="button" className="btn-ghost !text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-3 border border-ink-200 dark:border-ink-850 px-3 py-1.5 rounded-lg bg-white dark:bg-ink-900/40">
                    Browse Files
                  </button>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(slot.key, file);
                    }}
                  />
                </div>
              )}
            </div>
            {errors[slot.key as keyof typeof errors] && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {errors[slot.key as keyof typeof errors]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-ink-200/60 dark:border-ink-800/60 flex gap-3">
        <button type="button" onClick={onBack} className="btn-outline px-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onSubmit} className="btn-primary flex-1 justify-center">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   Step 5: Review & Submit Form
   ========================================================================== */
function ReviewForm({
  data,
  files,
  onBack,
  agree,
  setAgree,
  onSubmit,
  loading,
}: {
  data: {
    businessInfo?: BusinessInfoData;
    address?: AddressData;
    bankDetails?: BankDetailsData;
  };
  files: {
    panDoc: File | null;
    aadhaarDoc: File | null;
    gstDoc: File | null;
    chequeDoc: File | null;
  };
  onBack: () => void;
  agree: boolean;
  setAgree: (agree: boolean) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const { businessInfo, address, bankDetails } = data;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="border-b border-ink-200/60 dark:border-ink-800/60 pb-4">
        <h3 className="text-xl font-bold font-display text-ink-900 dark:text-white">Review Submission</h3>
        <p className="text-xs text-ink-500 mt-1">Verify all inputs and document attachments before triggering activation.</p>
      </div>

      <div className="space-y-5 text-xs sm:text-sm">
        {/* Section 1: Business Details */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/80 p-5 bg-ink-50/20 dark:bg-ink-900/10 space-y-4">
          <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <span className="p-1 rounded-lg bg-brand-500/10 text-brand-500"><Building2 className="h-4 w-4" /></span>
            Business Profile
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-ink-400 block mb-0.5">Registered Name</span>
              <span className="font-semibold text-ink-900 dark:text-white">{businessInfo?.businessName}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Entity Type</span>
              <span className="font-semibold text-ink-900 dark:text-white">{businessInfo?.businessType}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Industry Category</span>
              <span className="font-semibold text-ink-900 dark:text-white">{businessInfo?.businessCategory}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Business PAN</span>
              <span className="font-semibold uppercase text-ink-900 dark:text-white">{businessInfo?.businessPan}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Aadhaar Number</span>
              <span className="font-semibold text-ink-900 dark:text-white">{businessInfo?.aadhaarNumber}</span>
            </div>
            {businessInfo?.gstin && (
              <div>
                <span className="text-ink-400 block mb-0.5">GSTIN</span>
                <span className="font-semibold uppercase text-ink-900 dark:text-white">{businessInfo?.gstin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Address Details */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/80 p-5 bg-ink-50/20 dark:bg-ink-900/10 space-y-4">
          <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <span className="p-1 rounded-lg bg-brand-500/10 text-brand-500"><MapPin className="h-4 w-4" /></span>
            Registered Office Address
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="sm:col-span-2">
              <span className="text-ink-400 block mb-0.5">Headquarters Address</span>
              <span className="font-semibold text-ink-900 dark:text-white">
                {address?.addressLine1}
                {address?.addressLine2 ? `, ${address?.addressLine2}` : ''}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">City, State & Pin</span>
              <span className="font-semibold text-ink-900 dark:text-white">
                {address?.city}, {address?.state} - {address?.pincode}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Country</span>
              <span className="font-semibold text-ink-900 dark:text-white">{address?.country}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Bank Details */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/80 p-5 bg-ink-50/20 dark:bg-ink-900/10 space-y-4">
          <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <span className="p-1 rounded-lg bg-brand-500/10 text-brand-500"><Landmark className="h-4 w-4" /></span>
            Payout Destination Account
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-ink-400 block mb-0.5">Beneficiary Account Name</span>
              <span className="font-semibold text-ink-900 dark:text-white">{bankDetails?.accountName}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Bank Name</span>
              <span className="font-semibold text-ink-900 dark:text-white">{bankDetails?.bankName}</span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">Account Details</span>
              <span className="font-semibold text-ink-900 dark:text-white">
                {bankDetails?.accountNumber} ({bankDetails?.accountType})
              </span>
            </div>
            <div>
              <span className="text-ink-400 block mb-0.5">IFSC Routing Code</span>
              <span className="font-semibold uppercase text-ink-900 dark:text-white">{bankDetails?.ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Uploaded Files */}
        <div className="rounded-2xl border border-ink-200/60 dark:border-ink-800/80 p-5 bg-ink-50/20 dark:bg-ink-900/10 space-y-3">
          <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-brand-500/10 text-brand-500"><Upload className="h-4 w-4" /></span>
            Uploaded Documentation
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { label: 'PAN Card Copy', val: files.panDoc },
              { label: 'Aadhaar Card Copy', val: files.aadhaarDoc },
              { label: 'GST Registration Certificate', val: files.gstDoc },
              { label: 'Cancelled Cheque copy', val: files.chequeDoc },
            ].map((f, i) => (
              <div key={i} className="flex justify-between border-b border-ink-200/30 dark:border-ink-800/40 py-2.5 last:border-0 items-center">
                <span className="text-ink-550 dark:text-ink-450 font-medium">{f.label}</span>
                <span className="font-semibold text-ink-900 dark:text-white max-w-xs truncate flex items-center gap-1.5">
                  {f.val ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {f.val.name}
                    </>
                  ) : (
                    <span className="text-ink-400 font-normal italic">Not uploaded</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Declaration check box */}
        <div className="pt-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded border-ink-300 dark:border-ink-800 text-brand-600 focus:ring-brand-500 bg-transparent cursor-pointer"
            />
            <span className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed transition group-hover:text-ink-900 dark:group-hover:text-ink-200">
              I hereby declare that all the information and uploaded documents provided in this merchant KYC form are true, accurate, and valid to the best of my knowledge. I understand that any false declaration will lead to account suspension or legal action.
            </span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-ink-200/60 dark:border-ink-800/60 flex gap-3">
        <button type="button" disabled={loading} onClick={onBack} className="btn-outline px-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          disabled={!agree || loading}
          onClick={onSubmit}
          className="btn-primary flex-1 justify-center flex items-center gap-2 py-3.5 shadow-lg shadow-brand-500/20"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting KYC...
            </span>
          ) : (
            <>
              Submit KYC details <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
