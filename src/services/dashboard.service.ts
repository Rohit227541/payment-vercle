import api from "./api";

export interface DashboardSummaryData {
  totalPayIn: number;
  totalPayOut: number;

  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;

  // NEW
  authorizedTransactions: number;
  cancelledTransactions: number;

  refundCount: number;
  chargebacks: number;

  successRate: number;
  avgTransaction: number;

  availableBalance: number;
  settledAmount: number;
  refundedAmount: number;
  pendingBalance: number;

  createdTransactions?: number;
}

export interface RevenueTrendItem {
  date?: string;
  period?: string;
  total_revenue?: number;
  successful_count?: number;
  [key: string]: any;
}

export interface PaymentMethodItem {
  payment_method: string;
  count: number;
  total_amount: number;
  [key: string]: any;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
  total_amount: number;
  [key: string]: any;
}

export interface DashboardAnalyticsData {
  revenueTrend: RevenueTrendItem[];
  paymentMethodDistribution: PaymentMethodItem[];
  transactionStatusDistribution: StatusDistributionItem[];
  successRate: string;
  averageTransactionAmount: number;
}

export interface MerchantRecentTransaction {
  transactionId: string | number;
  transactionReference?: string;
  orderId?: string | number;
  customerName?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  paymentType?: string;
  status: string;
  completionSource?: string;
  createdAt: string;
}

export interface WalletDashboardData {
  walletId?: string | number;
  merchantId?: string | number;
  availableBalance: number;
  pendingBalance: number;
  blockedBalance: number;
  totalReceived: number;
  totalRefunded: number;
  totalSettled: number;
  currency?: string;
  status?: string;
  totalWalletTransactions?: number;
}

export interface RefundDashboardData {
  summary: {
    totalRefunds: number;
    totalRefundAmount: number;
    completedRefunds: number;
    processingRefunds: number;
    failedRefunds: number;
  };
  trend: any[];
  statusDistribution: any[];
}

export const merchantDashboardService = {

  // ==========================================
  // Dashboard Summary
  // ==========================================

  getSummary: async (): Promise<DashboardSummaryData> => {

    const response = await api.get(
      "/merchant/summary"
    );

    return response.data?.data || {
      totalPayIn: 0,
      totalPayOut: 0,

      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      pendingTransactions: 0,
      authorizedTransactions: 0,
      cancelledTransactions: 0,

      refundCount: 0,
      chargebacks: 0,

      successRate: 0,
      avgTransaction: 0,

      availableBalance: 0,
      settledAmount: 0,
      refundedAmount: 0,
      pendingBalance: 0,
    };
  },

  // ==========================================
  // Analytics
  // ==========================================

  getAnalytics: async (): Promise<DashboardAnalyticsData> => {

    const response = await api.get(
      "/merchant/analytics"
    );

    return response.data?.data || {
      revenueTrend: [],
      paymentMethodDistribution: [],
      transactionStatusDistribution: [],
      successRate: "0.00",
      averageTransactionAmount: 0,
    };
  },

  // ==========================================
  // Recent Transactions
  // ==========================================

  getRecentTransactions: async (
    limit: number = 10
  ): Promise<MerchantRecentTransaction[]> => {

    const response = await api.get(
      `/merchant/recent-transactions?limit=${limit}`
    );

    return response.data?.data?.transactions || [];
  },

  // ==========================================
  // Wallet
  // ==========================================

  getWalletOverview: async (): Promise<WalletDashboardData> => {

    const response = await api.get(
      "/merchant/wallet"
    );

    return response.data?.data || {
      availableBalance: 0,
      pendingBalance: 0,
      blockedBalance: 0,
      totalReceived: 0,
      totalRefunded: 0,
      totalSettled: 0,
    };
  },

  // ==========================================
  // Refunds
  // ==========================================

  getRefundOverview: async (): Promise<RefundDashboardData> => {

    const response = await api.get(
      "/merchant/refunds"
    );

    return response.data?.data || {
      summary: {
        totalRefunds: 0,
        totalRefundAmount: 0,
        completedRefunds: 0,
        processingRefunds: 0,
        failedRefunds: 0,
      },

      trend: [],

      statusDistribution: [],
    };
  },
};

export default merchantDashboardService;