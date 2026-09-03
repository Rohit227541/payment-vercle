import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AuthShell from '../../components/auth/AuthShell';

type AdminLoginFormData = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, loading, error, clearAdminError } = useAdmin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    clearAdminError();
    try {
      const result = await adminLogin({
        email: data.email.trim(),
        password: data.password.trim(),
      });
      console.log('Login Response:', result);

      if (result?.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('adminToken', result.accessToken);
      }
      if (result?.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('refresh_token', result.refreshToken);
        localStorage.setItem('adminRefreshToken', result.refreshToken);
      }
      localStorage.setItem('role', 'admin');
      localStorage.setItem('admin_role', 'admin');
      localStorage.setItem('isAdmin', 'true');

      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.log('Admin Login Error:', err);
    }
  };

  return (
    <AuthShell
      title="Admin Portal Login"
      subtitle="Authorized access only. Sign in to Trustgates administrative console."
      footer={
        <p className="text-xs text-ink-400 text-center">
          Super Admin Console • Trustgates Operations & Audit Control
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Authentication Failed</p>
              <p className="mt-0.5 text-xs text-rose-500">{error}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-700 dark:text-ink-300">
            Admin Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="admin@paymentgateway.com"
              {...register('email', {
                required: 'Admin email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`input pl-10 text-sm ${errors.email ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-ink-700 dark:text-ink-300">
              Admin Master Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              {...register('password', {
                required: 'Password is required',
              })}
              className={`input pl-10 pr-10 text-sm ${errors.password ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Authenticating Admin...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" /> Sign In to Admin Console <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
