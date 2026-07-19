import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import { useMerchant } from '../context/MerchantContext';
import { API_BASE_URL } from '../config';


type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { loading, error, clearError } = useMerchant();
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

    if (!API_BASE_URL) {
      alert("Demo Version - Backend is currently unavailable.");
      return;
    }

    try {

      const response = await fetch(`${API_BASE_URL}/gateway/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });


      const result = await response.json();


      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }


      console.log(result);


      // Save merchant data
      localStorage.setItem(
        "merchant",
        JSON.stringify(result.merchant)
      );


      // Save login details
      localStorage.setItem(
        "is_email_verified",
        String(result.is_email_verified || false)
      );


      localStorage.setItem(
        "kyc_status",
        result.kyc_status || ""
      );


      const isEmailVerified = result.is_email_verified;
      const kycStatus = result.kyc_status;


      if (!isEmailVerified) {

        navigate("/verify-email");

      } else if (!kycStatus) {

        navigate("/onboarding");

      } else {
        navigate("/dashboard")
      }


    } catch (err: any) {

      console.error("Login error:", err);
      alert(err.message);

    }
  };

  return (
    <AuthShell
      title="Merchant Login"
      subtitle="Welcome back. Sign in to your PayFlow dashboard."
      footer={
        <>
          New to PayFlow?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 dark:text-brand-300 hover:underline">
            Register now
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Login Failed</p>
              <p className="mt-0.5 text-xs text-rose-500">{error}</p>
            </div>
          </div>
        )}

        {/* Business Email */}
        <div>
          <label className="label" htmlFor="email">
            Business Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="email"
              type="email"
              placeholder="you@business.com"
              className={`input pl-10 ${errors.email ? 'border-rose-500 focus:ring-rose-500/30' : ''}`}
              {...register('email', {
                required: 'Business email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600 dark:text-brand-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input pl-10 pr-10 ${errors.password ? 'border-rose-500 focus:ring-rose-500/30' : ''}`}
              {...register('password', {
                required: 'Password is required',
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
            defaultChecked
          />
          Remember me
        </label>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 justify-center flex items-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Logging in...
            </span>
          ) : (
            <>
              Login <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
