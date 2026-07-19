import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import { useMerchant } from "../context/MerchantContext";
import { API_BASE_URL } from "../config";

type PasswordFormData = {
  password: string;
  confirm: string;
};

type OtpFormData = {
  otp: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const { loading, error, clearError } = useMerchant();

  const [step, setStep] = useState(1); // 1: Password inputs, 2: OTP entry, 3: Success
  const [savedPassword, setSavedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Token Validation State
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  // Validate Token on Mount
  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    const checkTokenValidity = async () => {
      if (!API_BASE_URL) {
        setIsTokenValid(true);
        setIsValidating(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/validate-reset-token?token=${encodeURIComponent(token)}`, {
          method: "POST"
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setIsTokenValid(true);
        } else {
          setTokenError(result.message || "The password reset link is invalid or has expired.");
        }
      } catch (err) {
        setTokenError("Unable to verify the reset token. Please check your connection.");
      } finally {
        setIsValidating(false);
      }
    };

    checkTokenValidity();
  }, [token]);

  // OTP resend timer
  useEffect(() => {
    if (step !== 2 || resendCooldown === 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCooldown]);

  // React Hook Form for Step 1
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    watch: watchPass,
    formState: { errors: errorsPass },
  } = useForm<PasswordFormData>({
    defaultValues: { password: "", confirm: "" },
  });

  const passwordVal = watchPass("password");

  // React Hook Form for Step 2
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset: resetOtpField,
  } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  const onPassSubmit = (data: PasswordFormData) => {
    clearError();
    setSavedPassword(data.password);
    setStep(2);
    setResendCooldown(60); // start OTP cooldown
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    clearError();
    setResendSuccess(false);

    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/verify-password-reset`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: token,

            password: savedPassword,

            otp: data.otp,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Password reset failed");
      }

      setStep(3);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOtpResend = async () => {
    clearError();
    setResendSuccess(false);

    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/request-password-change`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: token,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP resend failed");
      }

      setResendSuccess(true);

      setResendCooldown(60);

      resetOtpField();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Loading state while verifying token
  if (isValidating) {
    return (
      <AuthShell
        title="Verifying Reset Link"
        subtitle="Please wait while we validate your security credentials."
      >
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-ink-500 dark:text-ink-400">Verifying link validity...</p>
        </div>
      </AuthShell>
    );
  }

  // If token is missing or invalid, show an error shell
  if (!token || !isTokenValid) {
    return (
      <AuthShell
        title="Invalid Reset Link"
        subtitle={tokenError || "The password reset link is invalid or has expired."}
        footer={
          <Link
            to="/forgot-password"
            className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
          >
            Request new reset link
          </Link>
        }
      >
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/10 text-rose-500 animate-bounce">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {tokenError || "This reset link is missing a security token or is expired. Please request a new link to proceed."}
          </p>
          <Link
            to="/forgot-password"
            className="btn-primary w-full justify-center py-3.5 shadow-lg shadow-brand-500/20"
          >
            Go back
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset Your Password"
      subtitle={
        step === 1
          ? "Enter your new secure password."
          : step === 2
          ? "Enter the OTP sent to verify this request."
          : "Your password has been changed."
      }
      footer={
        step !== 3 && (
          <>
            Cancel and{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
            >
              go to login
            </Link>
          </>
        )
      }
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="pass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmitPass(onPassSubmit)}
            className="space-y-4"
          >
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20 border-l-4">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Reset Failed</p>
                  <p className="mt-0.5 text-xs text-rose-500">{error}</p>
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="label" htmlFor="password">
                New Password
              </label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input pl-11 pr-11 py-3.5 text-sm ${
                    errorsPass.password
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerPass("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message:
                        "Must include a letter, a number, and a special character (@$!%*#?&)",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errorsPass.password && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {errorsPass.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="confirm">
                Confirm New Password
              </label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  className={`input pl-11 py-3.5 text-sm ${
                    errorsPass.confirm
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerPass("confirm", {
                    required: "Please confirm your new password",
                    validate: (val) =>
                      val === passwordVal || "Passwords do not match",
                  })}
                />
              </div>
              {errorsPass.confirm && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {errorsPass.confirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center flex items-center gap-2 mt-6 py-3.5 shadow-lg shadow-brand-500/20"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmitOtp(onOtpSubmit)}
            className="space-y-4"
          >
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Reset Failed</p>
                  <p className="mt-0.5 text-xs text-rose-500">{error}</p>
                </div>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <div className="flex-1">
                  <p className="font-semibold">OTP Sent</p>
                  <p className="mt-0.5 text-xs text-emerald-500">
                    A new reset verification OTP has been sent to your email.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="label text-center" htmlFor="otp">
                Enter 6-Digit Verification OTP
              </label>
              <div className="relative group">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className={`input pl-11 text-center tracking-[0.75em] text-lg font-bold ${
                    errorsOtp.otp
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerOtp("otp", {
                    required: "Reset OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be exactly 6 digits",
                    },
                  })}
                />
              </div>
              {errorsOtp.otp && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {errorsOtp.otp.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline flex-1 py-3.5"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-[2] justify-center flex items-center gap-2 py-3.5 shadow-lg shadow-brand-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    Reset Password <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* OTP Resend Timer */}
            <div className="text-center pt-2">
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleOtpResend}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  resendCooldown > 0
                    ? "text-ink-400 cursor-not-allowed"
                    : "text-brand-600 dark:text-brand-300 hover:underline"
                }`}
              >
                <RefreshCw
                  className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                />
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-4"
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-glow shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">
              Password Reset Successful
            </h3>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Your password has been changed. You can now use your new password
              to sign in.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary mt-6 w-full justify-center py-3.5 shadow-lg shadow-brand-500/20"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
