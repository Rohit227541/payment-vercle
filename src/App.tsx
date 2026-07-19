import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MerchantProvider } from './context/MerchantContext';
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
import Dashboard from './pages/Dashboard';
import MerchantLayout from './layouts/MerchantLayout';
import AdminLayout from './layouts/AdminLayout';

// Merchant Pages
import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantTransactions from './pages/merchant/Transactions';
import MerchantReports from './pages/merchant/Reports';
import MerchantCharges from './pages/merchant/Charges';
import MerchantProfile from './pages/merchant/Profile';
import MerchantSettings from './pages/merchant/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMerchants from './pages/admin/Merchants';
import AdminTransactions from './pages/admin/Transactions';
import AdminReports from './pages/admin/Reports';
import AdminCharges from './pages/admin/Charges';
import AdminSettings from './pages/admin/Settings';
const termsSections = [
  { heading: '1. Acceptance of Terms', body: 'By accessing or using PayFlow Gateway services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.' },
  { heading: '2. Merchant Responsibilities', body: 'You are responsible for the accuracy of the information provided during onboarding and for complying with all applicable laws and regulations in your jurisdiction.' },
  { heading: '3. Fees and Billing', body: 'PayFlow charges transaction fees as published on our pricing page. Fees are deducted from settlements before they are transferred to your bank account.' },
  { heading: '4. Acceptable Use', body: 'You may not use PayFlow for illegal activities, fraudulent transactions, or to process payments for prohibited goods and services as defined in our acceptable use policy.' },
  { heading: '5. Account Suspension', body: 'We reserve the right to suspend or terminate accounts that violate these terms, exhibit suspicious activity, or pose a risk to the platform.' },
  { heading: '6. Limitation of Liability', body: 'PayFlow shall not be liable for indirect, incidental, or consequential damages arising from the use of our services, except as required by law.' },
  { heading: '7. Changes to Terms', body: 'We may update these terms from time to time. Continued use of the services after changes constitutes acceptance of the revised terms.' },
];

const privacySections = [
  { heading: '1. Information We Collect', body: 'We collect business and contact information provided during onboarding, transaction data processed through our platform, and technical data such as device and usage information.' },
  { heading: '2. How We Use Information', body: 'We use your information to provide and improve our services, prevent fraud, comply with legal obligations, and communicate with you about your account.' },
  { heading: '3. Data Security', body: 'We protect your data with 256-bit SSL encryption, tokenization, and PCI DSS Level 1 compliant infrastructure. Card data is never stored on your servers.' },
  { heading: '4. Data Sharing', body: 'We share data only with payment networks, issuing banks, and regulators as necessary to process transactions and comply with the law. We never sell your data.' },
  { heading: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data, and to export your data in a portable format, subject to applicable law.' },
  { heading: '6. Cookies', body: 'We use cookies to operate and improve our website. See our Cookie Policy for details on the cookies we use and how to manage them.' },
  { heading: '7. Contact', body: 'For privacy enquiries, contact our Data Protection Officer at privacy@payflow.io.' },
];

const refundSections = [
  { heading: '1. Refund Eligibility', body: 'Merchants can issue full or partial refunds for captured transactions within 180 days of the original payment. Refunds are subject to the original payment method.' },
  { heading: '2. Refund Processing Time', body: 'Refunds typically appear on the customer\'s statement within 5–10 business days, depending on the issuing bank and payment method.' },
  { heading: '3. Refund Fees', body: 'PayFlow does not charge a fee for processing refunds. However, the original transaction fee is non-refundable unless otherwise stated in your agreement.' },
  { heading: '4. Chargebacks', body: 'Customers may initiate chargebacks directly with their bank. Merchants can submit evidence to dispute chargebacks through the dashboard.' },
  { heading: '5. Settlement Adjustments', body: 'Refunds are deducted from your upcoming settlement. If the settlement balance is insufficient, the amount is recovered from your next settlement.' },
];

const cookieSections = [
  { heading: '1. What Are Cookies', body: 'Cookies are small text files stored on your device that help websites remember your preferences and improve your experience.' },
  { heading: '2. Cookies We Use', body: 'We use essential cookies for site functionality, analytics cookies to understand usage, and preference cookies to remember your settings such as theme.' },
  { heading: '3. Managing Cookies', body: 'You can control and delete cookies through your browser settings. Disabling essential cookies may affect site functionality.' },
  { heading: '4. Third-Party Cookies', body: 'We may use trusted third-party services that set their own cookies for analytics and support. These are governed by their respective privacy policies.' },
];

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider>
      <MerchantProvider>
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Merchant Panel Routes */}
              <Route element={<MerchantLayout />}>
                <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                <Route path="/merchant/transactions" element={<MerchantTransactions />} />
                <Route path="/merchant/reports" element={<MerchantReports />} />
                <Route path="/merchant/charges" element={<MerchantCharges />} />
                <Route path="/merchant/profile" element={<MerchantProfile />} />
                <Route path="/merchant/settings" element={<MerchantSettings />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/merchants" element={<AdminMerchants />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/charges" element={<AdminCharges />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MerchantProvider>
    </ThemeProvider>
  );
}
