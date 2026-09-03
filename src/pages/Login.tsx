import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import { useMerchant } from '../context/MerchantContext';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    loading,
    error,
    clearError,
  } = useMerchant();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();

    try {
      // ==========================================
      // LOGIN
      // ==========================================

      const result = await login({
        email: data.email,
        password: data.password,
      });

      console.log('Full Login Response:', result);

      // ==========================================
      // MERCHANT DATA
      // Backend response:
      //
      // {
      //   success: true,
      //   accessToken: "...",
      //   refreshToken: "...",
      //   merchant: {
      //     emailVerified: true,
      //     approvalStatus: "APPROVED",
      //     kycStatus: "APPROVED",
      //     accountStatus: "ACTIVE"
      //   }
      // }
      // ==========================================

      const merchant = result?.merchant;

      if (!merchant) {
        throw new Error(
          'Merchant information was not returned by the server.'
        );
      }

      // ==========================================
      // GET LOGIN STATUS
      // ==========================================

      const emailVerified = Boolean(
        merchant.emailVerified
      );

      const approvalStatus = String(
        merchant.approvalStatus || ''
      ).toUpperCase();

      const kycStatus = String(
        merchant.kycStatus || ''
      ).toUpperCase();

      const accountStatus = String(
        merchant.accountStatus || ''
      ).toUpperCase();

      // ==========================================
      // DEBUG
      // ==========================================

      console.log('Merchant Login Status:', {
        emailVerified,
        approvalStatus,
        kycStatus,
        accountStatus,
      });

      // ==========================================
      // STORE STATUS LOCALLY
      // ==========================================

      localStorage.setItem(
        'is_email_verified',
        String(emailVerified)
      );

      localStorage.setItem(
        'approval_status',
        approvalStatus
      );

      localStorage.setItem(
        'kyc_status',
        kycStatus
      );

      localStorage.setItem(
        'account_status',
        accountStatus
      );

      // ==========================================
      // STORE MERCHANT INFORMATION
      // ==========================================

      localStorage.setItem(
        'merchant',
        JSON.stringify(merchant)
      );

      // ==========================================
      // 1. EMAIL NOT VERIFIED
      // ==========================================

      if (!emailVerified) {
        navigate('/verify-email', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 2. KYC NOT SUBMITTED
      // ==========================================

      if (
        !kycStatus ||
        kycStatus === 'NOT_SUBMITTED'
      ) {
        navigate('/onboarding', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 3. KYC REJECTED
      // ==========================================

      if (kycStatus === 'REJECTED') {
        navigate('/onboarding', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 4. KYC PENDING
      // ==========================================

      if (kycStatus === 'PENDING') {
        navigate('/onboarding', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 5. KYC APPROVED BUT ADMIN APPROVAL PENDING
      // ==========================================

      if (
        kycStatus === 'APPROVED' &&
        approvalStatus !== 'APPROVED'
      ) {
        navigate('/approval-pending', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 6. ACCOUNT NOT ACTIVE
      // ==========================================

      if (accountStatus !== 'ACTIVE') {
        navigate('/approval-pending', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // 7. FULLY APPROVED MERCHANT
      // ==========================================

      if (
        emailVerified &&
        kycStatus === 'APPROVED' &&
        approvalStatus === 'APPROVED' &&
        accountStatus === 'ACTIVE'
      ) {
        navigate('/merchant/dashboard', {
          replace: true,
        });

        return;
      }

      // ==========================================
      // FALLBACK
      // ==========================================

      navigate('/merchant/dashboard', {
        replace: true,
      });

    } catch (err: any) {
      console.log(
        'Login failed:',
        err
      );
    }
  };

  return (
    <AuthShell
      title="Merchant Login"
      subtitle="Welcome back. Sign in to your Trustgates dashboard."
      footer={
        <>
          New to Trustgates?{' '}
          <Link
            to="/signup"
            className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
          >
            Register now
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* ==========================================
            LOGIN ERROR
        ========================================== */}

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">

            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />

            <div className="flex-1">

              <p className="font-semibold">
                Login Failed
              </p>

              <p className="mt-0.5 text-xs text-rose-500">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* ==========================================
            BUSINESS EMAIL
        ========================================== */}

        <div>

          <label
            className="label"
            htmlFor="email"
          >
            Business Email
          </label>

          <div className="relative">

            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

            <input
              id="email"
              type="email"
              placeholder="you@business.com"
              autoComplete="email"
              className={`input pl-10 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : ''
              }`}
              {...register('email', {
                required:
                  'Business email is required',

                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                  message:
                    'Invalid email address format',
                },
              })}
            />

          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.email.message}
            </p>
          )}

        </div>

        {/* ==========================================
            PASSWORD
        ========================================== */}

        <div>

          <div className="flex items-center justify-between">

            <label
              className="label"
              htmlFor="password"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-600 dark:text-brand-300 hover:underline"
            >
              Forgot password?
            </Link>

          </div>

          <div className="relative">

            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

            <input
              id="password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="••••••••"
              autoComplete="current-password"
              className={`input pl-10 pr-10 ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : ''
              }`}
              {...register('password', {
                required:
                  'Password is required',
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password.message}
            </p>
          )}

        </div>

        {/* ==========================================
            REMEMBER ME
        ========================================== */}

        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">

          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
            defaultChecked
          />

          Remember me

        </label>

        {/* ==========================================
            LOGIN BUTTON
        ========================================== */}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4v4z"
                />
              </svg>

              Logging in...

            </span>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4" />
            </>
          )}

        </button>

      </form>
    </AuthShell>
  );
}