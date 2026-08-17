import {
  Zap, Smartphone, CreditCard, Globe, Route, ShieldCheck, Webhook, Link2,
  RefreshCw, Repeat, FileText, BarChart3, Coins, QrCode, Code2, PhoneCall,
  Wallet, Banknote, Layers, LayoutDashboard, Receipt, Landmark,
  Rocket, Building2, ShoppingBag, Cloud, GraduationCap, HeartPulse, HandHeart,
  Terminal, UserRound, Store, Lock, Cpu, Headset, Gauge,
  CheckCircle2, ShieldAlert, Activity, KeyRound, FileLock2,
} from 'lucide-react';

export const features = [
  { icon: Zap, title: 'Instant Settlement', desc: 'Get funds settled to your bank account within minutes, not days.' },
  { icon: Smartphone, title: 'UPI Payments', desc: 'Accept UPI payments from all major apps with deep-link support.' },
  { icon: CreditCard, title: 'Credit Card', desc: 'Process Visa, MasterCard, RuPay and Amex with one integration.' },
  { icon: Banknote, title: 'Debit Card', desc: 'Secure debit card processing with 3D Secure authentication.' },
  { icon: Globe, title: 'International Payments', desc: 'Accept payments from 150+ countries in multiple currencies.' },
  { icon: Route, title: 'Smart Routing', desc: 'AI-driven routing maximizes success rates across gateways.' },
  { icon: ShieldAlert, title: 'Fraud Detection', desc: 'Real-time risk scoring blocks fraudulent transactions instantly.' },
  { icon: ShieldCheck, title: 'PCI DSS Security', desc: 'Level 1 PCI DSS compliant infrastructure you can trust.' },
  { icon: Webhook, title: 'Webhook Support', desc: 'Reliable webhooks with automatic retries and event logs.' },
  { icon: Link2, title: 'Payment Links', desc: 'Generate and share links to collect payments anywhere.' },
  { icon: Repeat, title: 'Subscriptions', desc: 'Recurring billing engine with dunning and plan management.' },
  { icon: FileText, title: 'Invoices', desc: 'Send branded invoices and reconcile payments automatically.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time insights into revenue, success rates and trends.' },
  { icon: Coins, title: 'Multi Currency', desc: 'Settle in 100+ currencies with transparent FX rates.' },
  { icon: QrCode, title: 'QR Payments', desc: 'Dynamic QR codes for in-store and online collections.' },
  { icon: Code2, title: 'API Integration', desc: 'Clean REST APIs and SDKs for every major platform.' },
  { icon: Layers, title: 'Mobile SDK', desc: 'Native iOS and Android SDKs with drop-in checkout.' },
  { icon: RefreshCw, title: 'Refund Management', desc: 'Instant and partial refunds with full audit trails.' },
  { icon: PhoneCall, title: '24×7 Support', desc: 'Dedicated support engineers available around the clock.' },
];

export const products = [
  { icon: CreditCard, title: 'Payment Gateway', desc: 'Full-stack gateway for cards, UPI, wallets and net banking.' },
  { icon: Link2, title: 'Payment Links', desc: 'No-code link collection for invoices and remote sales.' },
  { icon: Repeat, title: 'Subscriptions', desc: 'Recurring billing with trials, add-ons and smart dunning.' },
  { icon: Landmark, title: 'Smart Collect', desc: 'Virtual UPI IDs and account numbers for reconciled collections.' },
  { icon: Wallet, title: 'Payouts', desc: 'Send bulk payouts to vendors, partners and customers.' },
  { icon: Banknote, title: 'Settlement', desc: 'Instant and scheduled settlements with split routing.' },
  { icon: Receipt, title: 'Billing', desc: 'Automated billing cycles with tax engine support.' },
  { icon: FileText, title: 'Invoice', desc: 'GST-compliant invoices with online payment links.' },
  { icon: Landmark, title: 'Virtual Accounts', desc: 'Unique virtual accounts per customer for reconciliation.' },
  { icon: QrCode, title: 'QR Payments', desc: 'Branded dynamic QR codes for fast in-store checkout.' },
  { icon: LayoutDashboard, title: 'Merchant Dashboard', desc: 'Unified dashboard for payments, settlements and analytics.' },
  { icon: Code2, title: 'API Suite', desc: 'REST, GraphQL and webhooks for every integration need.' },
];

export const solutions = [
  { icon: Rocket, title: 'For Startups', desc: 'Quick onboarding and no minimum commitments.' },
  { icon: Building2, title: 'For Enterprises', desc: 'Custom SLAs, dedicated infra and SSO.' },
  { icon: ShoppingBag, title: 'For Ecommerce', desc: 'Plugins for Shopify, WooCommerce and more.' },
  { icon: Cloud, title: 'For SaaS', desc: 'Usage-based billing and subscription automation.' },
  { icon: GraduationCap, title: 'For Education', desc: 'Fee collection and installment plans.' },
  { icon: HeartPulse, title: 'For Healthcare', desc: 'HIPAA-aware workflows and tokenized payments.' },
  { icon: HandHeart, title: 'For NGOs', desc: 'Donation flows with recurring giving support.' },
  { icon: Terminal, title: 'For Developers', desc: 'Sandbox, docs and SDKs that just work.' },
  { icon: UserRound, title: 'For Freelancers', desc: 'Payment links and instant payouts for solo work.' },
  { icon: Store, title: 'For Retail', desc: 'Omnichannel POS with QR and card acceptance.' },
];

export const whyChooseUs = [
  { icon: Lock, title: 'Enterprise Security', desc: 'PCI DSS Level 1, tokenization and end-to-end encryption.' },
  { icon: Activity, title: '99.99% Uptime', desc: 'Multi-region active-active architecture with failover.' },
  { icon: Gauge, title: 'Fast API', desc: 'Sub-100ms response times for checkout and capture.' },
  { icon: Code2, title: 'Easy Integration', desc: 'Drop-in checkout, SDKs and clear documentation.' },
  { icon: Headset, title: 'Dedicated Support', desc: '24×7 engineers and a named account manager.' },
  { icon: Zap, title: 'Instant Activation', desc: 'Go live in minutes with automated KYC.' },
  { icon: Cpu, title: 'AI Fraud Protection', desc: 'ML risk engine scores every transaction in real time.' },
  { icon: Globe, title: 'Global Payments', desc: '150+ countries, 100+ currencies, one integration.' },
  { icon: CheckCircle2, title: 'High Success Rate', desc: 'Smart routing and retries push success rates above 99%.' },
];

export const security = [
  { icon: ShieldCheck, title: 'PCI DSS Level 1', desc: 'Highest level of payment card industry compliance.' },
  { icon: Lock, title: '256-bit SSL', desc: 'Bank-grade TLS encryption on every connection.' },
  { icon: KeyRound, title: 'Tokenization', desc: 'Card details tokenized and vaulted, never on your servers.' },
  { icon: ShieldAlert, title: 'Fraud Detection', desc: 'Real-time ML scoring with velocity and device signals.' },
  { icon: Cpu, title: 'Risk Engine', desc: 'Configurable rules and adaptive risk thresholds.' },
  { icon: FileLock2, title: 'Encryption', desc: 'AES-256 at rest and in transit across all systems.' },
  { icon: CheckCircle2, title: 'Compliance', desc: 'SOC 2, ISO 27001 and GDPR ready by design.' },
];

export const paymentMethods = [
  { name: 'UPI', tag: 'Instant' },
  { name: 'Visa', tag: 'Cards' },
  { name: 'MasterCard', tag: 'Cards' },
  { name: 'RuPay', tag: 'Cards' },
  { name: 'American Express', tag: 'Cards' },
  { name: 'Wallets', tag: 'Digital' },
  { name: 'Net Banking', tag: 'Banking' },
  { name: 'EMI', tag: 'Credit' },
  { name: 'BNPL', tag: 'Credit' },
  { name: 'International Cards', tag: 'Global' },
];

export const stats = [
  { value: 50000, suffix: '+', label: 'Merchants' },
  { value: 10, suffix: 'M+', label: 'Transactions' },
  { value: 99.99, suffix: '%', label: 'Uptime' },
  { value: 150, suffix: '+', label: 'Countries' },
];

export const testimonials = [
  { name: 'Aarav Mehta', role: 'CEO, ShopKart', rating: 5, quote: 'PayFlow pushed our checkout success rate to 99.2%. Settlements land in minutes, and the dashboard is a joy to use.' },
  { name: 'Sara Williams', role: 'CFO, SaaSify', rating: 5, quote: 'Subscriptions and dunning just work. We cut involuntary churn by 23% in the first quarter after switching.' },
  { name: 'Rohan Kapoor', role: 'CTO, EduPay', rating: 5, quote: 'The API is clean, the docs are excellent, and webhooks are reliable. Our integration took two days, not two weeks.' },
  { name: 'Lena Fischer', role: 'Head of Payments, GlobeMart', rating: 5, quote: 'Smart routing alone paid for itself. International acceptance across 40 countries with one contract.' },
  { name: 'David Chen', role: 'Founder, QuickShip', rating: 5, quote: 'Onboarding was fully automated. We were live and accepting payments the same afternoon we signed up.' },
  { name: 'Priya Nair', role: 'VP Engineering, HealthBridge', rating: 5, quote: 'Tokenization and the risk engine give our compliance team peace of mind. Support is genuinely 24×7.' },
];

export const faqs = [
  { q: 'How long does merchant onboarding take?', a: 'Most merchants are live within a few hours. Our automated KYC verifies documents in real time, and you only need to complete business and bank verification before activation.' },
  { q: 'What payment methods are supported?', a: 'UPI, all major credit and debit cards (Visa, MasterCard, RuPay, Amex), 50+ net banking options, wallets, EMI, BNPL, and international cards across 150+ countries.' },
  { q: 'How fast are settlements?', a: 'Standard settlements are T+1. With Instant Settlement, funds reach your bank account within minutes of a successful transaction.' },
  { q: 'Do you charge a setup fee?', a: 'No. There are no setup fees, no annual maintenance fees, and no minimum commitments on the Starter and Business plans.' },
  { q: 'Is PayFlow PCI DSS compliant?', a: 'Yes. We are PCI DSS Level 1 certified, the highest level of compliance. All card data is tokenized and vaulted — it never touches your servers.' },
  { q: 'Can I accept international payments?', a: 'Yes. You can accept payments in 100+ currencies and settle in your preferred currency with transparent FX conversion rates.' },
  { q: 'Do you support subscriptions and recurring billing?', a: 'Absolutely. The Subscriptions product supports trials, add-ons, metered billing, and automated dunning to recover failed payments.' },
  { q: 'How does smart routing work?', a: 'Our AI engine analyzes each transaction in real time and routes it to the gateway most likely to succeed, factoring in issuer, BIN, amount and history.' },
  { q: 'What about refunds and chargebacks?', a: 'You can issue instant or partial refunds from the dashboard or API. Chargeback management tools let you submit evidence and track disputes end-to-end.' },
  { q: 'Do you provide webhooks?', a: 'Yes. Webhooks fire on every payment event with automatic retries, idempotency keys, and a searchable event log in the dashboard.' },
  { q: 'Is there a sandbox for testing?', a: 'Every account includes a full sandbox environment with test cards, simulated webhooks, and complete API access — no live charges, no limits.' },
  { q: 'Which platforms have SDKs?', a: 'We provide official SDKs for JavaScript, React, Node.js, Python, Java, Go, iOS, and Android, plus plugins for Shopify, WooCommerce and Magento.' },
  { q: 'How is fraud prevented?', a: 'Our ML risk engine scores every transaction using velocity, device fingerprinting, geolocation and behavioral signals. You can also add custom rules.' },
  { q: 'Can I export my data?', a: 'Yes. All transactions, settlements and reports are exportable as CSV, and the API provides full programmatic access to your data.' },
  { q: 'What kind of support do you offer?', a: 'All plans include 24×7 support via chat and email. Business and Enterprise plans add a dedicated account manager and priority SLAs.' },
  { q: 'Do you offer custom pricing?', a: 'Yes. For high-volume merchants, we offer volume-based custom pricing. Reach out to our sales team for a tailored quote.' },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: '2%',
    sub: 'per transaction',
    desc: 'Everything you need to start accepting payments online.',
    features: ['No setup fee', 'UPI, cards & net banking', 'Payment links', 'Standard T+1 settlement', 'Dashboard & analytics', 'Email support'],
    cta: 'Start for free',
    highlight: false,
  },
  {
    name: 'Business',
    price: '1.5%',
    sub: 'per transaction',
    desc: 'For growing businesses that need more power and control.',
    features: ['Everything in Starter', 'Subscriptions & invoices', 'Smart routing', 'Instant settlement', 'Webhooks & API suite', 'Priority chat support'],
    cta: 'Choose Business',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'talk to sales',
    desc: 'For high-volume merchants with advanced requirements.',
    features: ['Everything in Business', 'Custom pricing & SLA', 'Dedicated infra & SSO', 'AI fraud engine tuning', 'Named account manager', '24×7 phone support'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export const onboardingSteps = [
  { icon: FileText, title: 'Register', desc: 'Create your merchant account in minutes.' },
  { icon: KeyRound, title: 'Verify Email', desc: 'Confirm your email to secure your account.' },
  { icon: FileLock2, title: 'Upload KYC', desc: 'Submit business and identity documents.' },
  { icon: Building2, title: 'Business Verification', desc: 'We verify your business details automatically.' },
  { icon: Landmark, title: 'Bank Verification', desc: 'Link and verify your settlement bank account.' },
  { icon: CheckCircle2, title: 'Activate Account', desc: 'Go live and start accepting payments.' },
];

export const apiSteps = [
  { step: '1', title: 'Create an order', desc: 'Generate an order server-side with the amount and currency.' },
  { step: '2', title: 'Hand off to checkout', desc: 'Open the drop-in checkout with the order id.' },
  { step: '3', title: 'Verify the signature', desc: 'Verify the payment signature on your server before fulfilling.' },
  { step: '4', title: 'Listen for webhooks', desc: 'Subscribe to payment.captured events to reconcile state.' },
];

export const apiSample = `// Create an order
const order = await payflow.orders.create({
  amount: 49900,
  currency: 'INR',
  receipt: 'rcpt_001',
  notes: { order_id: 'ORD-7742' }
});

// Returns
{
  "id": "order_Lk8m2qNp9X",
  "entity": "order",
  "amount": 49900,
  "currency": "INR",
  "receipt": "rcpt_001",
  "status": "created",
  "created_at": 1735900000
}`;

export const apiResponse = `{
  "id": "pay_M3kq9XzNp2L",
  "entity": "payment",
  "amount": 49900,
  "currency": "INR",
  "status": "captured",
  "method": "upi",
  "order_id": "order_Lk8m2qNp9X",
  "email": "customer@example.com",
  "contact": "+919900000000",
  "fee": 748,
  "tax": 134,
  "created_at": 1735900123
}`;

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Developers', to: '/developers' },
  { label: 'Partners', to: '/partners' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Payment Gateway', to: '/products' },
      { label: 'Payment Links', to: '/products' },
      { label: 'Subscriptions', to: '/products' },
      { label: 'Payouts', to: '/products' },
      { label: 'Settlement', to: '/products' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', to: '/developers' },
      { label: 'API Reference', to: '/developers' },
      { label: 'SDKs', to: '/developers' },
      { label: 'Webhooks', to: '/developers' },
      { label: 'Status', to: '/resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Partners', to: '/partners' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', to: '/resources' },
      { label: 'Security', to: '/security' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Merchant Login', to: '/login' },
      { label: 'Sign Up', to: '/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Security', to: '/security' },
    ],
  },
];

export const companies = ['ShopKart', 'GlobeMart', 'SaaSify', 'EduPay', 'QuickShip', 'HealthBridge', 'FinEdge', 'NovaPay'];
