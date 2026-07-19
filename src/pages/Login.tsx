import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert, Sparkles, Shield, Landmark, User } from 'lucide-react';
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
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDirectDemoLogin = (role: 'admin' | 'merchant' | 'client') => {
    if (role === 'admin') {
      localStorage.setItem("token", "demo-admin-token");
      localStorage.setItem("role", "admin");
      localStorage.setItem("admin", JSON.stringify({
        adminId: "ADM-001",
        adminName: "Aditya Sharma",
        email: "aditya.sharma@payflow.io",
        role: "Super Administrator"
      }));
      localStorage.setItem("merchant", JSON.stringify({
        name: "Aditya Sharma",
        email: "admin@payflow.io"
      }));
      navigate("/admin/dashboard");
    } else if (role === 'merchant') {
      localStorage.setItem("token", "demo-merchant-token");
      localStorage.setItem("role", "merchant");
      localStorage.setItem("merchant_name", "ShopKart Solutions India");
      localStorage.setItem("merchant_email", "payments@shopkart.in");
      localStorage.setItem("is_email_verified", "true");
      localStorage.setItem("kyc_status", "approved");
      localStorage.setItem("merchant", JSON.stringify({
        name: "Aarav Mehta",
        email: "payments@shopkart.in"
      }));
      navigate("/merchant/dashboard");
    } else {
      localStorage.setItem("token", "demo-client-token");
      localStorage.setItem("role", "client");
      localStorage.setItem("merchant_name", "Aarav Mehta");
      localStorage.setItem("merchant_email", "client@payflow.io");
      localStorage.setItem("is_email_verified", "true");
      localStorage.setItem("kyc_status", "approved");
      localStorage.setItem("merchant", JSON.stringify({
        name: "Aarav Mehta",
        email: "client@payflow.io"
      }));
      navigate("/dashboard");
    }
  };

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
    setLocalError(null);

    const isDemoEmail = ['admin@payflow.io', 'merchant@payflow.io', 'client@payflow.io'].includes(data.email.toLowerCase());

    if (!API_BASE_URL || isDemoEmail) {
      const emailLower = data.email.toLowerCase();

      if (emailLower === 'admin@payflow.io') {
        if (data.password !== 'admin123') {
          setLocalError("Invalid password for Admin. Please use 'admin123'.");
          return;
        }
        handleDirectDemoLogin('admin');
        return;
      }

      if (emailLower === 'merchant@payflow.io') {
        if (data.password !== 'merchant123') {
          setLocalError("Invalid password for Merchant. Please use 'merchant123'.");
          return;
        }
        handleDirectDemoLogin('merchant');
        return;
      }

      if (emailLower === 'client@payflow.io') {
        if (data.password !== 'client123') {
          setLocalError("Invalid password for Client. Please use 'client123'.");
          return;
        }
        handleDirectDemoLogin('client');
        return;
      }

      if (!API_BASE_URL) {
        setLocalError("Demo Mode - Please use one of the Quick Demo Login credentials below.");
        return;
      }
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

      localStorage.setItem("token", result.token || "demo-token");
      localStorage.setItem("role", result.role || "client");
      localStorage.setItem(
        "merchant",
        JSON.stringify(result.merchant)
      );

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
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLocalError(err.message || "An unexpected login error occurred.");
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
        {(localError || error) && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Login Failed</p>
              <p className="mt-0.5 text-xs text-rose-500">{localError || error}</p>
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

      <div className="mt-8 pt-6 border-t border-ink-200/60 dark:border-ink-800/60 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
          <h4 className="font-display text-sm font-semibold text-ink-800 dark:text-ink-200">
            Quick Demo Login
          </h4>
        </div>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Click any profile below to instantly log in with static mock data:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              role: 'admin' as const,
              title: 'Administrator',
              email: 'admin@payflow.io',
              pass: 'admin123',
              badge: 'System Admin',
              badgeCls: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
              hoverCls: 'hover:border-purple-500/40 hover:bg-purple-500/5',
              icon: Shield,
            },
            {
              role: 'merchant' as const,
              title: 'Merchant',
              email: 'merchant@payflow.io',
              pass: 'merchant123',
              badge: 'Store Manager',
              badgeCls: 'bg-brand-500/10 text-brand-600 dark:text-brand-450 border-brand-500/20',
              hoverCls: 'hover:border-brand-500/40 hover:bg-brand-500/5',
              icon: Landmark,
            },

          ].map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => handleDirectDemoLogin(item.role)}
              className={`flex flex-col text-left p-3 rounded-xl border border-ink-200 dark:border-ink-800/80 bg-white/40 dark:bg-ink-900/30 backdrop-blur-sm transition duration-200 select-none group outline-none focus:ring-2 focus:ring-brand-500/20 ${item.hoverCls}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-xs text-ink-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors">
                  {item.title}
                </span>
                <item.icon className="h-3.5 w-3.5 text-ink-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <span className={`inline-block mt-1 text-[9px] font-semibold border rounded-md px-1.5 py-0.5 w-max ${item.badgeCls}`}>
                {item.badge}
              </span>
              <div className="mt-2 space-y-0.5 text-[10px] text-ink-500 dark:text-ink-400">
                <p className="truncate">Email: <span className="font-mono text-ink-700 dark:text-ink-300">{item.email}</span></p>
                <p>Pass: <span className="font-mono text-ink-700 dark:text-ink-300">{item.pass}</span></p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
