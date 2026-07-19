import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  KeyRound,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import { useMerchant } from "../context/MerchantContext";
import { API_BASE_URL } from "../config";

type VerifyEmailFormData = {
  code: string;
};

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { email,loading, error, clearError } =
    useMerchant();
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    defaultValues: {
      code: "",
    },
  });

  // Cooldown timer for OTP Resend
  useEffect(() => {
    if (resendCooldown === 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    clearError();

    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verifyEmail`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: localStorage.getItem("merchantEmail"),

          otp: data.code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      localStorage.setItem("is_email_verified", "true");

      navigate("/onboarding");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResend = async () => {
    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {
      setResendSuccess(false);

      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: localStorage.getItem("merchantEmail"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Resend OTP failed");
      }

      setResendSuccess(true);

      setResendCooldown(30);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!email) {
    return (
      <AuthShell
        title="Session Expired"
        subtitle="Verification session expired. Please sign up again."
        footer={
          <Link
            to="/signup"
            className="font-semibold text-brand-600 dark:text-brand-300 hover:underline flex items-center gap-1 justify-center"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Signup
          </Link>
        }
      >
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Please register a new merchant account to receive a verification
            OTP.
          </p>
          <Link
            to="/signup"
            className="btn-primary w-full justify-center py-3.5 shadow-lg shadow-brand-500/20"
          >
            Register Now
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify Your Email"
      subtitle={`We have sent a verification code to ${email}`}
      footer={
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-ink-500">
            Entered the wrong email?{" "}
            <Link
              to="/signup"
              className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
            >
              Change email
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Verification Failed</p>
              <p className="mt-0.5 text-xs text-rose-500">{error}</p>
            </div>
          </div>
        )}

        {resendSuccess && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <div className="flex-1">
              <p className="font-semibold">OTP Sent</p>
              <p className="mt-0.5 text-xs text-emerald-500">
                A new verification code has been sent to your email.
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="label text-center block mb-3" htmlFor="code">
            Enter 6-Digit OTP Code
          </label>
          <div className="relative group">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              id="code"
              type="text"
              maxLength={6}
              placeholder="123456"
              className={`input pl-11 text-center tracking-[0.75em] text-lg font-bold ${
                errors.code ? "border-rose-500 focus:ring-rose-500/20" : ""
              }`}
              {...register("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Verification code must be a 6-digit number",
                },
              })}
            />
          </div>
          {errors.code && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Submit Verification Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center flex items-center gap-2 py-3.5 shadow-lg shadow-brand-500/20"
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
              Verify Email <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Resend Code Action */}
        <div className="text-center pt-2">
          <button
            type="button"
            disabled={resendCooldown > 0 || loading}
            onClick={handleResend}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              resendCooldown > 0
                ? "text-ink-400 cursor-not-allowed"
                : "text-brand-600 dark:text-brand-300 hover:underline"
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
