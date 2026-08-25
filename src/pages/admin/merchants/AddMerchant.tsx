import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../services/api.service';
import { API_BASE_URL } from '../../../config';
import {
  ArrowLeft, Store, User, Mail, Phone, Globe, Lock,
  CheckCircle, AlertCircle, Loader2, KeyRound, Upload, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddMerchant() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [merchantId, setMerchantId] = useState<string | null>(null);

  // ============================
  // Step 1: Signup Details
  // ============================
  const [formData, setFormData] = useState({
    businessName: '',
    merchantName: '',
    email: '',
    phone: '',
    website: '',
    password: '',
  });

  // ============================
  // Step 2: OTP Verification
  // ============================
  const [otp, setOtp] = useState('');

  // ============================
  // Step 3: KYC Details
  // ============================
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarDoc, setAadhaarDoc] = useState<File | null>(null);
  const [panDoc, setPanDoc] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create Merchant (Admin Route)
      const res = await apiFetch('/admin/merchant/create-merchant', {
        method: 'POST',
        body: JSON.stringify(formData),
      }, true);

      if (res.success && res.data) {
        // Set Merchant ID (different backends might return id or merchantId or merchant_id)
        setMerchantId(res.data.id || res.data.merchantId || res.data.merchant_id || res.data._id);

        // Send OTP (Merchant Route)
        const otpResponse = await apiFetch('/merchant/send-otp', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email }),
        }, false);

        if (!otpResponse.success) {
          throw new Error(otpResponse.message || 'Failed to send OTP to merchant');
        }

        setStep(2);
      } else {
        setError(res.message || 'Failed to create merchant');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verify Email (Merchant Route)
      const response = await apiFetch('/merchant/verifyEmail', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, otp }),
      }, false);

      if (!response.success) {
        throw new Error(response.message || 'OTP verification failed');
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantId) {
      setError("Merchant ID missing.");
      return;
    }

    if (!aadhaarNumber || !panNumber || !aadhaarDoc || !panDoc) {
      setError("Please fill all KYC fields and upload documents.");
      return;
    }

    setLoading(true);
    setError(null);

    const kycFormData = new FormData();
    kycFormData.append('aadhaar_number', aadhaarNumber.trim());
    kycFormData.append('pan_number', panNumber.toUpperCase().trim());
    kycFormData.append('aadhaar_document', aadhaarDoc);
    kycFormData.append('pan_document', panDoc);

    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const baseUrl = API_BASE_URL.replace(/\/merchant\/?$/, ''); // get base URL

      // Admin KYC Upload Route
      const response = await fetch(`${baseUrl}/merchant/upload-merchant-kyc`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`

        },
        body: kycFormData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error?.message || 'KYC submission failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/merchants/view');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'KYC submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/merchants/view')}
            className="flex items-center text-ink-500 hover:text-ink-700 dark:hover:text-ink-300 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Merchants
          </button>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Onboard New Merchant</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Complete the multi-step process to fully onboard a new merchant.</p>
        </div>

        {/* Step Indicator */}
        {!success && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === i ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : step > i ? 'bg-emerald-500 text-white' : 'bg-ink-200 dark:bg-ink-800 text-ink-500'}`}>
                  {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                </div>
                {i < 3 && <div className={`h-1 w-8 rounded-full ml-2 ${step > i ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'}`} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card p-6 md:p-8">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <FileCheck className="h-12 w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-ink-900 dark:text-white">Merchant Fully Onboarded!</h3>
                <p className="text-ink-500 mt-2">The merchant account and KYC have been successfully registered. Redirecting...</p>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStep1Submit}
              className="space-y-6"
            >
              <div className="border-b border-ink-200 dark:border-ink-800 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Step 1: Account Details</h2>
                <p className="text-sm text-ink-500">Enter the basic business information to create the account.</p>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Business Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="e.g. Acme Corp Ltd"
                        required
                        minLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Owner / Contact Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="text"
                        name="merchantName"
                        value={formData.merchantName}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="e.g. Jane Doe"
                        required
                        minLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Website URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="merchant@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="10-digit mobile number"
                        pattern="^[6-9]\d{9}$"
                        title="Please enter a valid 10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1">Temporary Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input pl-10 w-full"
                        placeholder="Secure Password"
                        required
                        minLength={12}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"
                        title="Must contain at least 12 characters, uppercase, lowercase, number, and special character."
                      />
                    </div>
                    <p className="text-xs text-ink-500 mt-1">Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-ink-200 dark:border-ink-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/merchants/view')}
                  className="btn-secondary px-6 py-2.5"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Proceeding...</>
                  ) : 'Next: Email Verification'}
                </button>
              </div>
            </motion.form>
          ) : step === 2 ? (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStep2Submit}
              className="space-y-6 max-w-md mx-auto py-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-ink-900 dark:text-white">Step 2: Verify Email</h2>
                <p className="text-sm text-ink-500 mt-2">We sent a verification code to <span className="font-semibold text-ink-900 dark:text-white">{formData.email}</span></p>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 text-center">Enter 6-Digit OTP</label>
                <div className="relative group">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError(null);
                    }}
                    placeholder="123456"
                    required
                    className="input pl-11 text-center tracking-[0.5em] text-lg font-bold w-full py-4"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setError("Cannot go back. OTP has been sent.");
                  }}
                  className="btn-secondary px-6 py-2.5 opacity-50 cursor-not-allowed"
                  disabled={true}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8 py-2.5 flex items-center gap-2"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                  ) : 'Verify & Continue'}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStep3Submit}
              className="space-y-6"
            >
              <div className="border-b border-ink-200 dark:border-ink-800 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Step 3: KYC Details</h2>
                <p className="text-sm text-ink-500">Provide Aadhaar and PAN documents for merchant identity verification.</p>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Aadhaar Number *</label>
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => {
                      setAadhaarNumber(e.target.value);
                      setError(null);
                    }}
                    placeholder="12 digit Aadhaar number"
                    className="input w-full"
                    maxLength={12}
                    pattern="\d{12}"
                    title="Must be a 12 digit number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">PAN Card Number *</label>
                  <input
                    type="text"
                    required
                    value={panNumber}
                    onChange={(e) => {
                      setPanNumber(e.target.value);
                      setError(null);
                    }}
                    placeholder="10 digit PAN (e.g. ABCDE1234F)"
                    className="input uppercase w-full"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Upload Aadhaar Image *</label>
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
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Upload PAN Card Image *</label>
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

              <div className="pt-6 border-t border-ink-200 dark:border-ink-800 flex justify-end gap-3">
                <button
                  type="submit"
                  className="btn-primary px-8 py-2.5 flex items-center gap-2 w-full md:w-auto justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                  ) : 'Complete KYC'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
