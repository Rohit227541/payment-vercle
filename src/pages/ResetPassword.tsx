import { useEffect, useState } from "react";
import {
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
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
  Loader2,
} from "lucide-react";

import AuthShell from "../components/auth/AuthShell";
import { API_BASE_URL } from "../config";

type PasswordFormData = {
  password: string;
  confirm: string;
};

type OtpFormData = {
  otp: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  remainingAttempts?: number;
  retryAfter?: number;
};

export default function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  // ==========================================================
  // STEP
  // 1 = Password
  // 2 = OTP
  // 3 = Success
  // ==========================================================

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ==========================================================
  // PASSWORD
  // ==========================================================

  const [savedPassword, setSavedPassword] =
    useState("");

  const [savedConfirmPassword, setSavedConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // ==========================================================
  // TOKEN VALIDATION
  // ==========================================================

  const [isValidating, setIsValidating] =
    useState(true);

  const [isTokenValid, setIsTokenValid] =
    useState(false);

  const [tokenError, setTokenError] =
    useState("");

  // ==========================================================
  // LOADING STATES
  // ==========================================================

  const [sendingOtp, setSendingOtp] =
    useState(false);

  const [verifyingOtp, setVerifyingOtp] =
    useState(false);

  // ==========================================================
  // ERRORS
  // ==========================================================

  const [passwordError, setPasswordError] =
    useState("");

  const [otpError, setOtpError] =
    useState("");

  // ==========================================================
  // RESEND OTP
  // ==========================================================

  const [resendCooldown, setResendCooldown] =
    useState(60);

  const [resendSuccess, setResendSuccess] =
    useState(false);

  // ==========================================================
  // PASSWORD FORM
  // ==========================================================

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    watch: watchPass,
    formState: {
      errors: errorsPass,
    },
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      confirm: "",
    },
    mode: "onBlur",
  });

  const passwordVal =
    watchPass("password");

  // ==========================================================
  // OTP FORM
  // ==========================================================

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: {
      errors: errorsOtp,
    },
    reset: resetOtpField,
  } = useForm<OtpFormData>({
    defaultValues: {
      otp: "",
    },
    mode: "onBlur",
  });

  // ==========================================================
  // VALIDATE RESET TOKEN
  //
  // POST /validate-reset-token?token=...
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const validateResetToken = async () => {
      // ------------------------------------------------------
      // Token missing
      // ------------------------------------------------------

      if (!token) {
        if (mounted) {
          setTokenError(
            "Password reset token is missing."
          );

          setIsTokenValid(false);
          setIsValidating(false);
        }

        return;
      }

      // ------------------------------------------------------
      // API URL missing
      // ------------------------------------------------------

      if (!API_BASE_URL) {
        if (mounted) {
          setTokenError(
            "Backend API URL is not configured."
          );

          setIsTokenValid(false);
          setIsValidating(false);
        }

        return;
      }

      try {
        setIsValidating(true);
        setTokenError("");

        // ----------------------------------------------------
        // Validate reset token
        // ----------------------------------------------------

        const response = await fetch(
          `${API_BASE_URL}/validate-reset-token?token=${encodeURIComponent(
            token
          )}`,
          {
            method: "POST",

            headers: {
              Accept: "application/json",
            },
          }
        );

        let result: ApiResponse = {};

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "Invalid response received from server."
          );
        }

        // ----------------------------------------------------
        // Invalid token
        // ----------------------------------------------------

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "The password reset link is invalid or has expired."
          );
        }

        // ----------------------------------------------------
        // Valid token
        // ----------------------------------------------------

        if (mounted) {
          setIsTokenValid(true);
          setTokenError("");
        }

      } catch (error: unknown) {
        console.log(
          "Validate Reset Token Error:",
          error
        );

        if (mounted) {
          setIsTokenValid(false);

          if (error instanceof TypeError) {
            setTokenError(
              "Unable to connect to the backend server."
            );
          } else if (error instanceof Error) {
            setTokenError(error.message);
          } else {
            setTokenError(
              "Unable to verify reset link."
            );
          }
        }
      } finally {
        if (mounted) {
          setIsValidating(false);
        }
      }
    };

    validateResetToken();

    return () => {
      mounted = false;
    };
  }, [token]);

  // ==========================================================
  // OTP RESEND COUNTDOWN
  // ==========================================================

  useEffect(() => {
    if (
      step !== 2 ||
      resendCooldown <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step, resendCooldown]);

  // ==========================================================
  // SEND PASSWORD RESET OTP
  //
  // POST /request-password-change
  //
  // THIS API:
  // 1. validates reset session
  // 2. generates OTP
  // 3. stores hashed OTP in Redis
  // 4. sends OTP email
  // ==========================================================

  const sendPasswordResetOtp =
    async () => {
      if (!API_BASE_URL) {
        throw new Error(
          "Backend API URL is not configured."
        );
      }

      if (!token) {
        throw new Error(
          "Password reset token is missing."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/request-password-change`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

      let result: ApiResponse = {};

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to send password reset OTP."
        );
      }

      return result;
    };

  // ==========================================================
  // STEP 1
  //
  // Password
  //      ↓
  // Continue
  //      ↓
  // /request-password-change
  //      ↓
  // OTP EMAIL
  //      ↓
  // STEP 2
  // ==========================================================

  const onPassSubmit = async (
    data: PasswordFormData
  ) => {
    setPasswordError("");
    setOtpError("");
    setResendSuccess(false);

    try {
      setSendingOtp(true);

      // ------------------------------------------------------
      // Save password locally
      // ------------------------------------------------------

      setSavedPassword(data.password);

      setSavedConfirmPassword(data.confirm);

      // ------------------------------------------------------
      // SEND OTP
      // ------------------------------------------------------

      await sendPasswordResetOtp();

      // ------------------------------------------------------
      // Reset OTP form
      // ------------------------------------------------------

      resetOtpField();

      // ------------------------------------------------------
      // Start resend cooldown
      // ------------------------------------------------------

      setResendCooldown(60);

      // ------------------------------------------------------
      // Move to OTP step
      // ------------------------------------------------------

      setStep(2);

    } catch (error: unknown) {
      console.log(
        "Request Password Change Error:",
        error
      );

      if (error instanceof Error) {
        setPasswordError(
          error.message
        );
      } else {
        setPasswordError(
          "Unable to send OTP. Please try again."
        );
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // ==========================================================
  // STEP 2
  //
  // OTP
  //    ↓
  // Reset Password
  //    ↓
  // /verify-password-reset
  // ==========================================================

  const onOtpSubmit = async (
    data: OtpFormData
  ) => {
    setOtpError("");
    setResendSuccess(false);

    if (!API_BASE_URL) {
      setOtpError(
        "Backend API URL is not configured."
      );

      return;
    }

    if (!token) {
      setOtpError(
        "Password reset token is missing."
      );

      return;
    }

    if (!savedPassword) {
      setOtpError(
        "Password information is missing. Please start the reset process again."
      );

      setStep(1);

      return;
    }

    try {
      setVerifyingOtp(true);

      // ------------------------------------------------------
      // Verify OTP + Reset Password
      // ------------------------------------------------------

      const response = await fetch(
        `${API_BASE_URL}/verify-password-reset`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            token,

            otp: data.otp.trim(),

            // IMPORTANT:
            // Backend expects these exact names
            newPassword:
              savedPassword,

            confirmPassword:
              savedConfirmPassword,
          }),
        }
      );

      let result: ApiResponse = {};

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      // ------------------------------------------------------
      // Backend error
      // ------------------------------------------------------

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Password reset failed."
        );
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      setStep(3);

    } catch (error: unknown) {
      console.log(
        "Verify Password Reset Error:",
        error
      );

      if (error instanceof Error) {
        setOtpError(
          error.message
        );
      } else {
        setOtpError(
          "Invalid OTP or password reset failed."
        );
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ==========================================================
  // RESEND OTP
  //
  // POST /request-password-change
  // ==========================================================

  const handleOtpResend =
    async () => {
      if (
        resendCooldown > 0 ||
        sendingOtp ||
        verifyingOtp
      ) {
        return;
      }

      setOtpError("");
      setResendSuccess(false);

      try {
        setSendingOtp(true);

        // ----------------------------------------------------
        // Generate and send NEW OTP
        // ----------------------------------------------------

        await sendPasswordResetOtp();

        // ----------------------------------------------------
        // Reset OTP field
        // ----------------------------------------------------

        resetOtpField();

        // ----------------------------------------------------
        // Reset timer
        // ----------------------------------------------------

        setResendCooldown(60);

        setResendSuccess(true);

      } catch (error: unknown) {
        console.log(
          "Resend OTP Error:",
          error
        );

        if (error instanceof Error) {
          setOtpError(
            error.message
          );
        } else {
          setOtpError(
            "Unable to resend OTP."
          );
        }
      } finally {
        setSendingOtp(false);
      }
    };

  // ==========================================================
  // TOKEN VALIDATION LOADING
  // ==========================================================

  if (isValidating) {
    return (
      <AuthShell
        title="Verifying Reset Link"
        subtitle="Please wait while we validate your security credentials."
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <Loader2 className="h-10 w-10 animate-spin text-brand-500" />

          <p className="text-sm text-ink-500 dark:text-ink-400">
            Verifying reset link...
          </p>
        </div>
      </AuthShell>
    );
  }

  // ==========================================================
  // INVALID TOKEN
  // ==========================================================

  if (
    !token ||
    !isTokenValid
  ) {
    return (
      <AuthShell
        title="Invalid Reset Link"
        subtitle={
          tokenError ||
          "The password reset link is invalid or has expired."
        }
        footer={
          <Link
            to="/forgot-password"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            Request a new reset link
          </Link>
        }
      >
        <div className="space-y-5 py-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <p className="text-sm leading-6 text-ink-500 dark:text-ink-400">
            {tokenError ||
              "This reset link is invalid or expired. Please request a new password reset link."}
          </p>

          <Link
            to="/forgot-password"
            className="btn-primary flex w-full items-center justify-center py-3.5 shadow-lg shadow-brand-500/20"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <AuthShell
      title="Reset Your Password"
      subtitle={
        step === 1
          ? "Enter your new secure password."
          : step === 2
          ? "Enter the OTP sent to your registered email."
          : "Your password has been changed successfully."
      }
      footer={
        step !== 3 ? (
          <>
            Cancel and{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              go to login
            </Link>
          </>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {/* ====================================================
            STEP 1 — PASSWORD
        ==================================================== */}

        {step === 1 && (
          <motion.form
            key="password"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            onSubmit={handleSubmitPass(
              onPassSubmit
            )}
            className="space-y-5"
          >
            {/* ERROR */}

            {passwordError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400"
              >
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Unable to Continue
                  </p>

                  <p className="mt-1 break-words text-xs">
                    {passwordError}
                  </p>
                </div>
              </motion.div>
            )}

            {/* NEW PASSWORD */}

            <div>
              <label
                className="label"
                htmlFor="password"
              >
                New Password
              </label>

              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={sendingOtp}
                  className={`input w-full py-3.5 pl-11 pr-11 text-sm ${
                    errorsPass.password
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerPass(
                    "password",
                    {
                      required:
                        "Password is required",

                      minLength: {
                        value: 8,
                        message:
                          "Password must be at least 8 characters long",
                      },

                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,

                        message:
                          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
                      },
                    }
                  )}
                />

                <button
                  type="button"
                  disabled={sendingOtp}
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-ink-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>

              {errorsPass.password && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {errorsPass.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                className="label"
                htmlFor="confirm"
              >
                Confirm New Password
              </label>

              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />

                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={sendingOtp}
                  className={`input w-full py-3.5 pl-11 text-sm ${
                    errorsPass.confirm
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerPass(
                    "confirm",
                    {
                      required:
                        "Please confirm your new password",

                      validate: (value) =>
                        value === passwordVal ||
                        "Passwords do not match",
                    }
                  )}
                />
              </div>

              {errorsPass.confirm && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {errorsPass.confirm.message}
                </p>
              )}
            </div>

            {/* PASSWORD REQUIREMENTS */}

            <div className="rounded-2xl border border-ink-200/70 bg-ink-50/50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs leading-5 text-ink-500 dark:text-ink-400">
                Password must contain at least 8
                characters, one uppercase letter, one
                lowercase letter, one number and one
                special character.
              </p>
            </div>

            {/* CONTINUE */}

            <button
              type="submit"
              disabled={sendingOtp}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3.5 font-semibold shadow-lg shadow-brand-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-ink-400">
              A verification OTP will be sent to your
              registered email.
            </p>
          </motion.form>
        )}

        {/* ====================================================
            STEP 2 — OTP
        ==================================================== */}

        {step === 2 && (
          <motion.form
            key="otp"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            onSubmit={handleSubmitOtp(
              onOtpSubmit
            )}
            className="space-y-5"
          >
            {/* OTP ERROR */}

            {otpError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400"
              >
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Verification Failed
                  </p>

                  <p className="mt-1 break-words text-xs">
                    {otpError}
                  </p>
                </div>
              </motion.div>
            )}

            {/* RESEND SUCCESS */}

            {resendSuccess && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    OTP Sent
                  </p>

                  <p className="mt-1 text-xs">
                    A new verification OTP has been
                    sent to your registered email.
                  </p>
                </div>
              </motion.div>
            )}

            {/* OTP INPUT */}

            <div>
              <label
                className="label mb-3 block text-center"
                htmlFor="otp"
              >
                Enter 6-Digit Verification OTP
              </label>

              <div className="group relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="123456"
                  disabled={
                    sendingOtp ||
                    verifyingOtp
                  }
                  className={`input w-full py-3.5 pl-11 text-center text-lg font-bold tracking-[0.75em] ${
                    errorsOtp.otp
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : ""
                  }`}
                  {...registerOtp("otp", {
                    required:
                      "Reset OTP is required",

                    pattern: {
                      value: /^[0-9]{6}$/,

                      message:
                        "OTP must be exactly 6 digits",
                    },
                  })}
                  onInput={(event) => {
                    event.currentTarget.value =
                      event.currentTarget.value.replace(
                        /\D/g,
                        ""
                      );
                  }}
                />
              </div>

              {errorsOtp.otp && (
                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                  {errorsOtp.otp.message}
                </p>
              )}
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={
                  sendingOtp ||
                  verifyingOtp
                }
                onClick={() => {
                  setOtpError("");
                  setResendSuccess(false);
                  setStep(1);
                }}
                className="btn-outline flex-1 py-3.5"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={
                  sendingOtp ||
                  verifyingOtp
                }
                className="btn-primary flex flex-[2] items-center justify-center gap-2 py-3.5 font-semibold shadow-lg shadow-brand-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* RESEND OTP */}

            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={
                  resendCooldown > 0 ||
                  sendingOtp ||
                  verifyingOtp
                }
                onClick={handleOtpResend}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  resendCooldown > 0 ||
                  sendingOtp ||
                  verifyingOtp
                    ? "cursor-not-allowed text-ink-400"
                    : "text-brand-600 hover:underline dark:text-brand-300"
                }`}
              >
                <RefreshCw
                  className={`h-3 w-3 ${
                    sendingOtp
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {sendingOtp
                  ? "Sending OTP..."
                  : resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </div>

            <p className="text-center text-xs leading-5 text-ink-400">
              The OTP expires in 10 minutes.
            </p>
          </motion.form>
        )}

        {/* ====================================================
            STEP 3 — SUCCESS
        ==================================================== */}

        {step === 3 && (
          <motion.div
            key="success"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.25,
            }}
            className="space-y-5 py-5 text-center"
          >
            {/* SUCCESS ICON */}

            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            {/* TITLE */}

            <div>
              <h3 className="text-xl font-bold text-ink-900 dark:text-white">
                Password Reset Successful
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-400">
                Your password has been changed
                successfully. You can now login with your
                new password.
              </p>
            </div>

            {/* LOGIN */}

            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  replace: true,
                })
              }
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3.5 font-semibold shadow-lg shadow-brand-500/20"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}