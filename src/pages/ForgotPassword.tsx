import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import { useMerchant } from "../context/MerchantContext";
import { API_BASE_URL } from "../config";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPassword() {
  const { loading, error, clearError } = useMerchant();
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    setSuccess(false);

    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Forgot password failed");
      }

      setEmailSent(data.email);

      setSuccess(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle={
        success
          ? "Reset link sent. Check your inbox."
          : "Enter your email to receive a reset link."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
          >
            Back to login
          </Link>
        </>
      }
    >
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            A password reset link has been sent to your registered email
            address:{" "}
            <strong className="text-ink-900 dark:text-white">
              {emailSent}
            </strong>
            .
          </p>
          <p className="text-xs text-ink-400">
            Please check your inbox. The reset link may take a few minutes to
            arrive.
          </p>
          <Link
            to="/login"
            className="btn-primary mt-6 w-full justify-center py-3.5 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
          >
            Back to login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Request Failed</p>
                <p className="mt-0.5 text-xs text-rose-500">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">
              Business Email
            </label>
            <div className="relative group">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@business.com"
                className={`input pl-11 py-3.5 text-sm ${
                  errors.email ? "border-rose-500 focus:ring-rose-500/20" : ""
                }`}
                {...register("email", {
                  required: "Business email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center flex items-center gap-2 py-3.5 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 font-semibold"
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
                Sending Reset Link...
              </span>
            ) : (
              <>
                Send Reset Link <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
