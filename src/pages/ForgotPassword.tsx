import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
} from "lucide-react";

import AuthShell from "../components/auth/AuthShell";
import { API_BASE_URL } from "../config";

type ForgotPasswordFormData = {
  email: string;
};

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
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /*
  ============================================================
  RESET TOKEN
  ============================================================
  */

  const token = searchParams.get("token") || "";

  /*
  ============================================================
  STEP
  ============================================================

  NO TOKEN
      0 = Forgot password email form
      1 = Reset link sent

  TOKEN EXISTS
      2 = Validate token / password form
      3 = OTP verification
      4 = Success
  */

  const [step, setStep] = useState<
    0 | 1 | 2 | 3 | 4
  >(token ? 2 : 0);

  /*
  ============================================================
  FORGOT PASSWORD
  ============================================================
  */

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  const [forgotError, setForgotError] = useState("");

  /*
  ============================================================
  RESET TOKEN
  ============================================================
  */

  const [isValidatingToken, setIsValidatingToken] =
    useState(!!token);

  const [isTokenValid, setIsTokenValid] =
    useState(false);

  const [tokenError, setTokenError] = useState("");

  /*
  ============================================================
  PASSWORD
  ============================================================
  */

  const [savedPassword, setSavedPassword] = useState("");
  const [savedConfirmPassword, setSavedConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  /*
  ============================================================
  OTP
  ============================================================
  */

  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] =
    useState(false);

  const [resendCooldown, setResendCooldown] =
    useState(60);

  const [resendSuccess, setResendSuccess] =
    useState(false);

  /*
  ============================================================
  FORGOT PASSWORD FORM
  ============================================================
  */

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  /*
  ============================================================
  PASSWORD FORM
  ============================================================
  */

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: {
      errors: passwordErrors,
    },
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      confirm: "",
    },
    mode: "onBlur",
  });

  const passwordValue =
    watchPassword("password");

  /*
  ============================================================
  OTP FORM
  ============================================================
  */

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    reset: resetOtp,
    formState: {
      errors: otpErrors,
    },
  } = useForm<OtpFormData>({
    defaultValues: {
      otp: "",
    },
    mode: "onBlur",
  });

  /*
  ============================================================
  STEP 0
  FORGOT PASSWORD
  ============================================================
  */

  const onForgotPassword = async (
    data: ForgotPasswordFormData
  ) => {
    setLoading(true);
    setForgotError("");

    const email = data.email
      .trim()
      .toLowerCase();

    try {
      if (!API_BASE_URL) {
        throw new Error(
          "Backend API URL is not configured."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email,
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

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to process password reset request."
        );
      }

      setEmailSent(email);
      setStep(1);
    } catch (error: unknown) {
      console.log(
        "Forgot Password Error:",
        error
      );

      if (error instanceof Error) {
        setForgotError(error.message);
      } else {
        setForgotError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  VALIDATE RESET TOKEN
  ============================================================
  */

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;

    const validateToken = async () => {
      try {
        setIsValidatingToken(true);
        setTokenError("");

        if (!API_BASE_URL) {
          throw new Error(
            "Backend API URL is not configured."
          );
        }

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

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "The password reset link is invalid or has expired."
          );
        }

        if (mounted) {
          setIsTokenValid(true);
          setStep(2);
        }
      } catch (error: unknown) {
        console.log(
          "Validate Reset Token Error:",
          error
        );

        if (mounted) {
          setIsTokenValid(false);

          if (error instanceof Error) {
            setTokenError(error.message);
          } else {
            setTokenError(
              "Unable to verify reset link."
            );
          }
        }
      } finally {
        if (mounted) {
          setIsValidatingToken(false);
        }
      }
    };

    validateToken();

    return () => {
      mounted = false;
    };
  }, [token]);

  /*
  ============================================================
  SEND PASSWORD RESET OTP
  ============================================================

  THIS IS THE ONLY API USED TO SEND RESET OTP.

  POST /request-password-change
  ============================================================
  */

  const requestPasswordChange = async (
    password: string,
    confirmPassword: string
  ) => {
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
          newPassword: password,
          confirmPassword,
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

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "Unable to send password reset OTP."
      );
    }

    return result;
  };

  /*
  ============================================================
  STEP 2
  PASSWORD SUBMIT
  ============================================================
  */

  const onPasswordSubmit = async (
    data: PasswordFormData
  ) => {
    setPasswordError("");
    setOtpError("");
    setResendSuccess(false);

    try {
      setSendingOtp(true);

      /*
      Save password temporarily for OTP verification
      */

      setSavedPassword(data.password);
      setSavedConfirmPassword(data.confirm);

      /*
      ONLY PASSWORD RESET OTP API
      */

      await requestPasswordChange(
        data.password,
        data.confirm
      );

      resetOtp();

      setResendCooldown(60);

      setStep(3);
    } catch (error: unknown) {
      console.log(
        "Password Reset OTP Error:",
        error
      );

      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError(
          "Unable to send OTP. Please try again."
        );
      }
    } finally {
      setSendingOtp(false);
    }
  };

  /*
  ============================================================
  STEP 3
  VERIFY PASSWORD RESET OTP
  ============================================================

  POST /verify-password-reset
  ============================================================
  */

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
        "Password information is missing. Please start again."
      );

      setStep(2);
      return;
    }

    try {
      setVerifyingOtp(true);

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
            newPassword: savedPassword,
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

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Password reset failed."
        );
      }

      setStep(4);
    } catch (error: unknown) {
      console.log(
        "Verify Password Reset Error:",
        error
      );

      if (error instanceof Error) {
        setOtpError(error.message);
      } else {
        setOtpError(
          "Invalid OTP or password reset failed."
        );
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  /*
  ============================================================
  RESEND OTP
  ============================================================

  IMPORTANT:

  NO /resend-otp
  NO verifyEmail
  NO VerifyEmail.tsx

  SAME /request-password-change
  ============================================================
  */

  const handleResendOtp = async () => {
    if (
      resendCooldown > 0 ||
      sendingOtp ||
      verifyingOtp
    ) {
      return;
    }

    setOtpError("");
    setResendSuccess(false);

    if (
      !savedPassword ||
      !savedConfirmPassword
    ) {
      setOtpError(
        "Password information is missing. Please start the reset process again."
      );

      setStep(2);
      return;
    }

    try {
      setSendingOtp(true);

      await requestPasswordChange(
        savedPassword,
        savedConfirmPassword
      );

      resetOtp();

      setResendCooldown(60);
      setResendSuccess(true);
    } catch (error: unknown) {
      console.log(
        "Resend Password Reset OTP Error:",
        error
      );

      if (error instanceof Error) {
        setOtpError(error.message);
      } else {
        setOtpError(
          "Unable to resend OTP."
        );
      }
    } finally {
      setSendingOtp(false);
    }
  };

  /*
  ============================================================
  OTP COUNTDOWN
  ============================================================
  */

  useEffect(() => {
    if (
      step !== 3 ||
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

  /*
  ============================================================
  TOKEN VALIDATION LOADING
  ============================================================
  */

  if (
    token &&
    isValidatingToken
  ) {
    return (
      <AuthShell
        title="Verifying Reset Link"
        subtitle="Please wait while we validate your password reset request."
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

  /*
  ============================================================
  INVALID TOKEN
  ============================================================
  */

  if (
    token &&
    !isValidatingToken &&
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
              "This reset link is invalid or expired."}
          </p>

          <Link
            to="/forgot-password"
            className="btn-primary flex w-full items-center justify-center py-3.5"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  /*
  ============================================================
  MAIN UI
  ============================================================
  */

  return (
    <AuthShell
      title={
        step === 0
          ? "Forgot Password"
          : step === 1
          ? "Reset Link Sent"
          : step === 2
          ? "Reset Your Password"
          : step === 3
          ? "Verify OTP"
          : "Password Reset Successful"
      }
      subtitle={
        step === 0
          ? "Enter your registered business email to reset your password."
          : step === 1
          ? "Check your inbox to continue."
          : step === 2
          ? "Enter your new secure password."
          : step === 3
          ? "Enter the OTP sent to your registered email."
          : "Your password has been changed successfully."
      }
      footer={
        step !== 4 ? (
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

        {/* ==================================================
            STEP 0
            FORGOT PASSWORD
        ================================================== */}

        {step === 0 && (
          <motion.form
            key="forgot"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            onSubmit={handleSubmitEmail(
              onForgotPassword
            )}
            className="space-y-5"
            noValidate
          >
            {forgotError && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Request Failed
                  </p>

                  <p className="mt-1 break-words text-xs">
                    {forgotError}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label
                className="label"
                htmlFor="email"
              >
                Business Email
              </label>

              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@business.com"
                  disabled={loading}
                  className={`input w-full py-3.5 pl-11 text-sm ${
                    emailErrors.email
                      ? "border-rose-500"
                      : ""
                  }`}
                  {...registerEmail(
                    "email",
                    {
                      required:
                        "Business email is required",

                      pattern: {
                        value:
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                        message:
                          "Please enter a valid email address",
                      },
                    }
                  )}
                />
              </div>

              {emailErrors.email && (
                <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-ink-400">
              For security reasons, we will not reveal
              whether an email address is registered.
            </p>
          </motion.form>
        )}

        {/* ==================================================
            STEP 1
            RESET LINK SENT
        ================================================== */}

        {step === 1 && (
          <motion.div
            key="sent"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="space-y-5 text-center"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink-900 dark:text-white">
                Reset Link Sent
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                If an account exists with this email,
                a password reset link has been sent.
              </p>
            </div>

            <div className="rounded-2xl border border-ink-200/70 bg-ink-50/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <p className="break-all text-sm font-semibold text-ink-900 dark:text-white">
                {emailSent}
              </p>
            </div>

            <p className="text-xs text-ink-400">
              Check your inbox and spam folder.
            </p>

            <p className="text-xs text-ink-400">
              The reset link expires in 10 minutes.
            </p>

            <Link
              to="/login"
              className="btn-primary flex w-full items-center justify-center gap-2 py-3.5"
            >
              Back to Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* ==================================================
            STEP 2
            NEW PASSWORD
        ================================================== */}

        {step === 2 && (
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
            onSubmit={handleSubmitPassword(
              onPasswordSubmit
            )}
            className="space-y-5"
          >
            {passwordError && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Unable to Continue
                  </p>

                  <p className="mt-1 text-xs">
                    {passwordError}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label
                className="label"
                htmlFor="password"
              >
                New Password
              </label>

              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500" />

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
                  className="input w-full py-3.5 pl-11 pr-11 text-sm"
                  {...registerPassword(
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
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>

              {passwordErrors.password && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                  {
                    passwordErrors.password
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label
                className="label"
                htmlFor="confirm"
              >
                Confirm New Password
              </label>

              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500" />

                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={sendingOtp}
                  className="input w-full py-3.5 pl-11 text-sm"
                  {...registerPassword(
                    "confirm",
                    {
                      required:
                        "Please confirm your new password",

                      validate: (value) =>
                        value === passwordValue ||
                        "Passwords do not match",
                    }
                  )}
                />
              </div>

              {passwordErrors.confirm && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                  {
                    passwordErrors.confirm
                      .message
                  }
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-ink-200/70 bg-ink-50/50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs leading-5 text-ink-500 dark:text-ink-400">
                Password must contain at least 8
                characters, one uppercase letter, one
                lowercase letter, one number and one
                special character.
              </p>
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 font-semibold disabled:opacity-70"
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
          </motion.form>
        )}

        {/* ==================================================
            STEP 3
            OTP
        ================================================== */}

        {step === 3 && (
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
            {otpError && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Verification Failed
                  </p>

                  <p className="mt-1 text-xs">
                    {otpError}
                  </p>
                </div>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-semibold">
                    OTP Sent
                  </p>

                  <p className="mt-1 text-xs">
                    A new verification OTP has been
                    sent to your registered email.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label
                className="label mb-3 block text-center"
                htmlFor="otp"
              >
                Enter 6-Digit Verification OTP
              </label>

              <div className="group relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />

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
                    otpErrors.otp
                      ? "border-rose-500"
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

              {otpErrors.otp && (
                <p className="mt-1.5 text-center text-xs text-rose-600 dark:text-rose-400">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

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
                  setStep(2);
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
                className="btn-primary flex-[2] flex items-center justify-center gap-2 py-3.5 font-semibold disabled:opacity-70"
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

            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={
                  resendCooldown > 0 ||
                  sendingOtp ||
                  verifyingOtp
                }
                onClick={handleResendOtp}
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

            <p className="text-center text-xs text-ink-400">
              The OTP expires in 10 minutes.
            </p>
          </motion.form>
        )}

        {/* ==================================================
            STEP 4
            SUCCESS
        ================================================== */}

        {step === 4 && (
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
            className="space-y-5 py-5 text-center"
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>

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

            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  replace: true,
                })
              }
              className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 font-semibold"
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