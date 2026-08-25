import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Percent,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  QrCode,
  Landmark,
  RotateCcw,
  Key,
  ChevronDown,
  User,
  Wallet,
} from "lucide-react";

import { useAdmin } from "../context/AdminContext";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/wallet", icon: Wallet, label: "Admin Wallet" },
  {
    label: "Transaction API",
    icon: CreditCard,
    children: [
      { path: "/admin/transactions/total", label: "Total transaction" },
      { path: "/admin/transactions/upi", label: "Total upi transaction" },
      {
        path: "/admin/transactions/netbanking",
        label: "Total net banking transaction",
      },
      { path: "/admin/transactions/card", label: "Total card transaction" },
      { path: "/admin/transactions/emi", label: "Total EMI transaction" },
      {
        path: "/admin/transactions/paylater",
        label: "Total Pay Later transaction",
      },
      {
        path: "/admin/transactions/wallet",
        label: "Total Wallet transaction",
      },
    ],
  },
  {
    label: "Merchant Management",
    icon: Users,
    children: [
      { path: "/admin/merchants/view", label: "View merchant" },
      { path: "/admin/merchants/activate-approve", label: "Activate & Approve" },
      { path: "/admin/merchants/add", label: "Add merchant" },
      { path: "/admin/merchants/verify-kyc", label: "Verify KYC" },

    ],
  },

  { path: "/admin/key-management", icon: Settings, label: "Key Management" },
  {
    label: "Reports",
    icon: FileText,
    children: [
      { path: "/admin/reports/daily", label: "Daily reports" },
      { path: "/admin/reports/monthly", label: "Monthly reports" },
    ],
  },
  { path: "/admin/profile", icon: User, label: "Profile" },
];

const SidebarItem = ({
  item,
  location,
  setOpen,
}: {
  item: any;
  location: any;
  setOpen: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((child: any) => location.pathname === child.path);

  useEffect(() => {
    if (isActive && hasChildren) setIsOpen(true);
  }, [isActive, hasChildren]);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            isActive || isOpen
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-300"
              : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60"
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            {item.label}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="ml-7 space-y-1">
            {item.children.map((child: any) => (
              <Link
                key={child.label}
                to={child.path}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === child.path
                    ? "text-purple-600 dark:text-purple-300 bg-purple-500/5"
                    : "text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800/40 hover:text-ink-900 dark:hover:text-ink-100"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        location.pathname === item.path
          ? "bg-purple-500/10 text-purple-600 dark:text-purple-300"
          : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60"
      }`}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdmin();
  
  // Load admin details from token or localStorage instead of mock file
  const [profile, setProfile] = useState<{
    adminName: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // In a real app, you might decode the JWT here
    // For now, if AdminContext has logged them in, we can safely set a generic profile
    const role = localStorage.getItem('role') || localStorage.getItem('admin_role') || 'Admin';
    setProfile({
      adminName: 'System Admin',
      role: role.charAt(0).toUpperCase() + role.slice(1)
    });
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-35 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-ink-200/60 dark:border-ink-800/60 bg-white dark:bg-ink-900/60 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col justify-between shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex h-16 items-center justify-between px-5 shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="6" width="18" height="13" rx="3" />
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
                PayFlow{" "}
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1 py-0.5 rounded bg-purple-500/10 ml-1">
                  Admin
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

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                location={location}
                setOpen={setOpen}
              />
            ))}
          </nav>
        </div>

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
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
                placeholder="Search merchants, transactions…"
                className="input pl-10 py-1.5 text-sm w-64 focus:ring-purple-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
            </button>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-sm font-bold text-white uppercase shadow-md shadow-purple-500/10">
                {profile
                  ? profile.adminName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                  : "AD"}
              </span>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-ink-900 dark:text-white leading-tight">
                  {profile ? profile.adminName : "Loading..."}
                </p>
                <p className="text-[11px] text-ink-500 dark:text-ink-400">
                  {profile ? profile.role : "Super Administrator"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
