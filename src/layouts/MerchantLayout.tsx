import { useState, useEffect } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useMerchant } from '../context/MerchantContext';

import {
  Wallet,
  RotateCcw,
  Key,
  Webhook,
  Percent,
  FileText,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  PlusCircle,
  ListFilter,
  ArrowLeftRight,
  Calendar,
  CalendarDays,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

export default function MerchantLayout() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    name,
    email,
    logout,
    accountStatus,
    kycStatus,
    approvalStatus,
  } = useMerchant();

  // ==========================================================
  // NORMALIZE MERCHANT STATUS
  // ==========================================================

  const normalizedAccountStatus = String(
    accountStatus || ''
  )
    .trim()
    .toUpperCase();

  const normalizedKycStatus = String(
    kycStatus || ''
  )
    .trim()
    .toUpperCase();

  const normalizedApprovalStatus = String(
    approvalStatus || ''
  )
    .trim()
    .toUpperCase();

  // ==========================================================
  // MERCHANT IS FULLY APPROVED ONLY WHEN ALL CONDITIONS MATCH
  // ==========================================================

  const isApproved =
    normalizedAccountStatus === 'ACTIVE' &&
    normalizedKycStatus === 'APPROVED' &&
    normalizedApprovalStatus === 'APPROVED';

  const isUnderReview = !isApproved;

  // ==========================================================
  // REFUND / PAYOUT DROPDOWN
  // ==========================================================

  const isRefundRoute =
    location.pathname.startsWith('/merchant/refund');

  const [refundDropdownOpen, setRefundDropdownOpen] =
    useState(isRefundRoute);

  // ==========================================================
  // REPORTS DROPDOWN
  // ==========================================================

  const isReportsRoute =
    location.pathname.startsWith('/merchant/reports');

  const [reportsDropdownOpen, setReportsDropdownOpen] =
    useState(isReportsRoute);

  // ==========================================================
  // KEEP DROPDOWNS OPEN ON THEIR ROUTES
  // ==========================================================

  useEffect(() => {
    if (isRefundRoute) {
      setRefundDropdownOpen(true);
    }

    if (isReportsRoute) {
      setReportsDropdownOpen(true);
    }
  }, [
    location.pathname,
    isRefundRoute,
    isReportsRoute,
  ]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    await logout();

    navigate('/login');
  };

  // ==========================================================
  // USER DISPLAY
  // ==========================================================

  const displayName =
    name ||
    email ||
    'Merchant';

  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'MP';

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-200">

      {/* ======================================================
          MOBILE DRAWER BACKDROP
      ====================================================== */}

      {open && (
        <div
          className="fixed inset-0 z-35 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col justify-between shrink-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >

        <div className="flex flex-col flex-1 min-h-0">

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="flex h-16 items-center justify-between px-5 shrink-0">

            <Link
              to="/"
              className="flex items-center gap-2.5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-md shadow-brand-500/10">

                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="13"
                    rx="3"
                  />

                  <path d="M7 11h6M7 14h4" />

                  <circle
                    cx="17"
                    cy="14"
                    r="1.4"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>

              </span>

              <span className="font-display text-base font-bold text-ink-900 dark:text-white">
                PayFlow{' '}

                <span className="text-xs text-brand-500 font-semibold px-1 py-0.5 rounded bg-brand-500/10 ml-1">
                  Merchant
                </span>
              </span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-ink-500 p-1 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

            {/* ==================================================
                DASHBOARD
            ================================================== */}

            <Link
              to="/merchant/dashboard"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                  '/merchant/dashboard' ||
                location.pathname === '/merchant'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <BarChart3 className="h-4 w-4" />

              Dashboard
            </Link>

            {/* ==================================================
                PAYIN
            ================================================== */}

            <Link
              to="/merchant/payin"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/payin'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" />

              Payin
            </Link>

            {/* ==================================================
                PAYOUT
            ================================================== */}

            <div className="space-y-1">

              <button
                type="button"
                onClick={() =>
                  setRefundDropdownOpen(
                    !refundDropdownOpen
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isRefundRoute
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
                }`}
              >

                <div className="flex items-center gap-3">

                  <RotateCcw
                    className={`h-4 w-4 ${
                      isRefundRoute
                        ? 'text-brand-600 dark:text-brand-300'
                        : ''
                    }`}
                  />

                  <span>
                    Payout
                  </span>

                </div>

                <ChevronDown
                  className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${
                    refundDropdownOpen
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />

              </button>

              {refundDropdownOpen && (
                <div className="pl-6 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 border-l-2 border-brand-500/20 ml-4">

                  {/* Payout Request */}

                  <Link
                    to="/merchant/refund-request"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                      location.pathname ===
                        '/merchant/refund-request' ||
                      location.pathname ===
                        '/merchant/refunds/request'
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20 font-semibold'
                        : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800/60 hover:text-ink-900 dark:hover:text-white'
                    }`}
                  >
                    <PlusCircle className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      Payout request
                    </span>
                  </Link>

                  {/* View Payout */}

                  <Link
                    to="/merchant/refunds"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                      location.pathname ===
                        '/merchant/refunds' ||
                      location.pathname ===
                        '/merchant/refunds/view'
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20 font-semibold'
                        : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800/60 hover:text-ink-900 dark:hover:text-white'
                    }`}
                  >
                    <ListFilter className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      View payout
                    </span>
                  </Link>

                </div>
              )}

            </div>

            {/* ==================================================
                WALLET
            ================================================== */}

            <Link
              to="/merchant/wallet"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/wallet'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <Wallet className="h-4 w-4" />

              Wallet
            </Link>

            {/* ==================================================
                API MANAGEMENT
            ================================================== */}

            <Link
              to="/merchant/api-management"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/api-management'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <Key className="h-4 w-4" />

              Api management
            </Link>

            {/* ==================================================
                WEBHOOK
            ================================================== */}

            <Link
              to="/merchant/webhook"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/webhook'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <Webhook className="h-4 w-4" />

              Webhook
            </Link>

            {/* ==================================================
                CHARGES
            ================================================== */}

            <Link
              to="/merchant/charges"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/charges'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <Percent className="h-4 w-4" />

              Charges
            </Link>

            {/* ==================================================
                REPORTS
            ================================================== */}

            <div className="space-y-1">

              <button
                type="button"
                onClick={() =>
                  setReportsDropdownOpen(
                    !reportsDropdownOpen
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isReportsRoute
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
                }`}
              >

                <div className="flex items-center gap-3">

                  <FileText
                    className={`h-4 w-4 ${
                      isReportsRoute
                        ? 'text-brand-600 dark:text-brand-300'
                        : ''
                    }`}
                  />

                  <span>
                    Reports
                  </span>

                </div>

                <ChevronDown
                  className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${
                    reportsDropdownOpen
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />

              </button>

              {reportsDropdownOpen && (
                <div className="pl-6 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 border-l-2 border-brand-500/20 ml-4">

                  {/* Daily Reports */}

                  <Link
                    to="/merchant/reports/daily"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                      location.pathname ===
                      '/merchant/reports/daily'
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20 font-semibold'
                        : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800/60 hover:text-ink-900 dark:hover:text-white'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      Daily reports
                    </span>
                  </Link>

                  {/* Monthly Reports */}

                  <Link
                    to="/merchant/reports/monthly"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                      location.pathname ===
                      '/merchant/reports/monthly'
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20 font-semibold'
                        : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800/60 hover:text-ink-900 dark:hover:text-white'
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                    <span>
                      Monthly reports
                    </span>
                  </Link>

                </div>
              )}

            </div>

            {/* ==================================================
                PROFILE
            ================================================== */}

            <Link
              to="/merchant/profile"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname ===
                '/merchant/profile'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60'
              }`}
            >
              <User className="h-4 w-4" />

              Profile
            </Link>

          </nav>
        </div>

        {/* ====================================================
            LOGOUT
        ==================================================== */}

        <div className="border-t border-ink-200/60 dark:border-ink-800/60 p-3 shrink-0">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition"
          >
            <LogOut className="h-4 w-4" />

            Logout
          </button>

        </div>

      </aside>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* ====================================================
            NAVBAR
        ==================================================== */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-200/60 dark:border-ink-800/60 bg-white/70 dark:bg-ink-900/60 backdrop-blur-xl px-5">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-ink-600 dark:text-ink-300 p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden sm:block">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

              <input
                type="text"
                placeholder="Search transactions…"
                className="input pl-10 py-1.5 text-sm w-64 focus:ring-brand-500/20"
              />

            </div>

          </div>

          <div className="flex items-center gap-4">

            <button className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60">

              <Bell className="h-4 w-4" />

              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />

            </button>

            <div className="flex items-center gap-2">

              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-bold text-white uppercase shadow-md shadow-brand-500/10">
                {initials}
              </span>

              <div className="hidden sm:block text-left">

                <p className="text-sm font-semibold text-ink-900 dark:text-white leading-tight">
                  {displayName}
                </p>

                <p className="text-[11px] text-ink-500 dark:text-ink-400">
                  Merchant User
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ====================================================
            DYNAMIC PAGE
        ==================================================== */}

        <main className="flex-1 relative overflow-hidden flex flex-col">

          <div
            className={`flex-1 p-5 sm:p-7 overflow-y-auto transition-all duration-300 ${
              isUnderReview
                ? 'filter blur-md pointer-events-none select-none opacity-40'
                : ''
            }`}
          >

            <Outlet />

          </div>

          {/* ==================================================
              UNDER REVIEW OVERLAY
          ================================================== */}

          {isUnderReview && (

            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/10 dark:bg-ink-950/10 pointer-events-auto">

              <div className="glass-card max-w-md w-full p-8 text-center space-y-4 shadow-2xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border border-amber-500/20">

                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/10 text-amber-500">

                  <ShieldCheck className="h-8 w-8" />

                </div>

                <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">
                  Account Under Review
                </h3>

                <p className="text-sm text-ink-600 dark:text-ink-300">
                  Your request is under review.
                  It will take 4 to 48 hours for
                  admin approval. You will gain
                  full access to the dashboard
                  once approved.
                </p>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}