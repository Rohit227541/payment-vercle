import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MerchantProvider } from './context/MerchantContext';
import { AdminProvider } from './context/AdminContext';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PricingPage from './pages/PricingPage';
import Developers from './pages/Developers';
import ProductsPage from './pages/ProductsPage';
import SolutionsPage from './pages/SolutionsPage';
import Partners from './pages/Partners';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Resources from './pages/Resources';
import SecurityPage from './pages/SecurityPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import LegalPage from './pages/LegalPage';
import MerchantLayout from './layouts/MerchantLayout';
import AdminLayout from './layouts/AdminLayout';

// Merchant Pages
import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantWallet from './pages/merchant/Wallet';
import MerchantPayin from './pages/merchant/Payin';
import MerchantApiManagement from './pages/merchant/ApiManagement';
import MerchantRefunds from './pages/merchant/Payout';
import MerchantDailyReports from './pages/merchant/DailyReports';
import MerchantMonthlyReports from './pages/merchant/MonthlyReports';
import MerchantCharges from './pages/merchant/Charges';

import MerchantWebhook from './pages/merchant/Webhook';
import MerchantProfile from './pages/merchant/Profile';
import MerchantSettings from './pages/merchant/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminWallet from './pages/admin/AdminWallet';
import AdminFeeManagement from './pages/admin/FeeManagement';
import AdminMerchants from './pages/admin/Merchants';
import AdminApiManagement from './pages/admin/ApiManagement';
import AdminTransactions from './pages/admin/Transactions';
import AdminPaymentMethods from './pages/admin/PaymentMethods';

import AdminRefunds from './pages/admin/Refunds';
import AdminReports from './pages/admin/Reports';
import AdminCharges from './pages/admin/Charges';
import AdminSettings from './pages/admin/Settings';
import AdminLogin from './pages/admin/AdminLogin';
import TotalTransactions from './pages/admin/transactions/TotalTransactions';
import UpiTransactions from './pages/admin/transactions/UpiTransactions';
import NetBankingTransactions from './pages/admin/transactions/NetBankingTransactions';
import CardTransactions from './pages/admin/transactions/CardTransactions';
import EmiTransactions from './pages/admin/transactions/EmiTransactions';
import PayLaterTransactions from './pages/admin/transactions/PayLaterTransactions';
import WalletTransactions from './pages/admin/transactions/WalletTransactions';

import AddMerchant from './pages/admin/merchants/AddMerchant';
import VerifyKycMerchant from './pages/admin/merchants/VerifyKycMerchant';

import ActivateApproveMerchant from './pages/admin/merchants/ActivateApproveMerchant';


import KeyManagement from './pages/admin/KeyManagement';

import DailyReports from './pages/admin/reports/DailyReports';
import MonthlyReports from './pages/admin/reports/MonthlyReports';
import MerchantReports from './pages/admin/reports/MerchantReports';

import AdminProfile from './pages/admin/AdminProfile';
const termsSections = [
  { heading: '1. Acceptance of Terms', body: 'By accessing or using Trustgates Gateway services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.' },
  { heading: '2. Merchant Responsibilities', body: 'You are responsible for the accuracy of the information provided during onboarding and for complying with all applicable laws and regulations in your jurisdiction.' },
  { heading: '3. Fees and Billing', body: 'Trustgates charges transaction fees as published on our pricing page. Fees are deducted from settlements before they are transferred to your bank account.' },
  { heading: '4. Acceptable Use', body: 'You may not use Trustgates for illegal activities, fraudulent transactions, or to process payments for prohibited goods and services as defined in our acceptable use policy.' },
  { heading: '5. Account Suspension', body: 'We reserve the right to suspend or terminate accounts that violate these terms, exhibit suspicious activity, or pose a risk to the platform.' },
  { heading: '6. Limitation of Liability', body: 'Trustgates shall not be liable for indirect, incidental, or consequential damages arising from the use of our services, except as required by law.' },
  { heading: '7. Changes to Terms', body: 'We may update these terms from time to time. Continued use of the services after changes constitutes acceptance of the revised terms.' },
];

const privacySections = [
  { heading: '1. Information We Collect', body: 'We collect business and contact information provided during onboarding, transaction data processed through our platform, and technical data such as device and usage information.' },
  { heading: '2. How We Use Information', body: 'We use your information to provide and improve our services, prevent fraud, comply with legal obligations, and communicate with you about your account.' },
  { heading: '3. Data Security', body: 'We protect your data with 256-bit SSL encryption, tokenization, and PCI DSS Level 1 compliant infrastructure. Card data is never stored on your servers.' },
  { heading: '4. Data Sharing', body: 'We share data only with payment networks, issuing banks, and regulators as necessary to process transactions and comply with the law. We never sell your data.' },
  { heading: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data, and to export your data in a portable format, subject to applicable law.' },
  { heading: '6. Cookies', body: 'We use cookies to operate and improve our website. See our Cookie Policy for details on the cookies we use and how to manage them.' },
  { heading: '7. Contact', body: 'For privacy enquiries, contact our Data Protection Officer at privacy@trustgates.io.' },
];

const refundSections = [
  { heading: '1. Refund Eligibility', body: 'Merchants can issue full or partial refunds for captured transactions within 180 days of the original payment. Refunds are subject to the original payment method.' },
  { heading: '2. Refund Processing Time', body: 'Refunds typically appear on the customer\'s statement within 5–10 business days, depending on the issuing bank and payment method.' },
  { heading: '3. Refund Fees', body: 'Trustgates does not charge a fee for processing refunds. However, the original transaction fee is non-refundable unless otherwise stated in your agreement.' },
  { heading: '4. Chargebacks', body: 'Customers may initiate chargebacks directly with their bank. Merchants can submit evidence to dispute chargebacks through the dashboard.' },
  { heading: '5. Settlement Adjustments', body: 'Refunds are deducted from your upcoming settlement. If the settlement balance is insufficient, the amount is recovered from your next settlement.' },
];

const cookieSections = [
  { heading: '1. What Are Cookies', body: 'Cookies are small text files stored on your device that help websites remember your preferences and improve your experience.' },
  { heading: '2. Cookies We Use', body: 'We use essential cookies for site functionality, analytics cookies to understand usage, and preference cookies to remember your settings such as theme.' },
  { heading: '3. Managing Cookies', body: 'You can control and delete cookies through your browser settings. Disabling essential cookies may affect site functionality.' },
  { heading: '4. Third-Party Cookies', body: 'We may use trusted third-party services that set their own cookies for analytics and support. These are governed by their respective privacy policies.' },
];

function MerchantProtectedRoute() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function AdminProtectedRoute() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
  const role = localStorage.getItem('role') || localStorage.getItem('admin_role');
  const isAdmin = role === 'admin' || localStorage.getItem('isAdmin') === 'true';
  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}

function DashboardRedirect() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const role = localStorage.getItem('role') || localStorage.getItem('admin_role');
  const isAdmin = role === 'admin' || localStorage.getItem('isAdmin') === 'true';
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  const isEmailVerified = localStorage.getItem('is_email_verified') === 'true' || localStorage.getItem('is_email_verified') === '1';
  const kycStatus = (localStorage.getItem('kyc_status') || '').toUpperCase();
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  if (kycStatus === 'APPROVED' || kycStatus === 'ACTIVE') {
    return <Navigate to="/merchant/dashboard" replace />;
  }
  return <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <MerchantProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/terms" element={<LegalPage title="Terms of Service" eyebrow="Legal" updated="July 7, 2025" sections={termsSections} />} />
              <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" eyebrow="Legal" updated="July 7, 2025" sections={privacySections} />} />
              <Route path="/refund-policy" element={<LegalPage title="Refund Policy" eyebrow="Legal" updated="July 7, 2025" sections={refundSections} />} />
              <Route path="/cookie-policy" element={<LegalPage title="Cookie Policy" eyebrow="Legal" updated="July 7, 2025" sections={cookieSections} />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Dashboard Redirect Handler */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Merchant Panel Routes */}
            <Route element={<MerchantProtectedRoute />}>
              <Route element={<MerchantLayout />}>
                <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                <Route path="/merchant/payin" element={<MerchantPayin />} />
                <Route path="/merchant/wallet" element={<MerchantWallet />} />
                <Route path="/merchant/refunds" element={<MerchantRefunds />} />
                <Route path="/merchant/refunds/view" element={<MerchantRefunds />} />
                
                <Route path="/merchant/api-management" element={<MerchantApiManagement />} />
                <Route path="/merchant/webhook" element={<MerchantWebhook />} />
                <Route path="/merchant/charges" element={<MerchantCharges />} />
                <Route path="/merchant/reports/daily" element={<MerchantDailyReports />} />
                <Route path="/merchant/reports/monthly" element={<MerchantMonthlyReports />} />
                <Route path="/merchant/profile" element={<MerchantProfile />} />
                <Route path="/merchant/settings" element={<MerchantSettings />} />
              </Route>
            </Route>

            {/* Admin Panel Routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Transaction API */}
                <Route path="/admin/wallet" element={<AdminWallet />} />
                <Route path="/admin/fee-management" element={<AdminFeeManagement />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="/admin/transactions/total" element={<TotalTransactions />} />
                <Route path="/admin/transactions/upi" element={<UpiTransactions />} />
                <Route path="/admin/transactions/netbanking" element={<NetBankingTransactions />} />
                <Route path="/admin/transactions/card" element={<CardTransactions />} />
                <Route path="/admin/transactions/emi" element={<EmiTransactions />} />
                <Route path="/admin/transactions/paylater" element={<PayLaterTransactions />} />
                <Route path="/admin/transactions/wallet" element={<WalletTransactions />} />

                {/* Merchant Management */}
                <Route path="/admin/merchants" element={<AdminMerchants />} />
                <Route path="/admin/merchants/view" element={<AdminMerchants />} />
                <Route path="/admin/merchants/activate-approve" element={<ActivateApproveMerchant />} />
                <Route path="/admin/merchants/add" element={<AddMerchant />} />
                <Route path="/admin/merchants/verify-kyc" element={<VerifyKycMerchant />} />


                {/* Keys & API */}
                <Route path="/admin/api-management" element={<AdminApiManagement />} />

                <Route path="/admin/key-management" element={<KeyManagement />} />
                <Route path="/admin/payment-methods" element={<AdminPaymentMethods />} />
                
                {/* Reports */}
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/reports/daily" element={<DailyReports />} />
                <Route path="/admin/reports/monthly" element={<MonthlyReports />} />
                <Route path="/admin/reports/merchant" element={<MerchantReports />} />
                
                {/* Misc */}
                <Route path="/admin/refunds" element={<AdminRefunds />} />
                <Route path="/admin/charges" element={<AdminCharges />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </AdminProvider>
      </MerchantProvider>
    </ThemeProvider>
  );
}
