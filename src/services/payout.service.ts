import api from "./api";

// ==========================================================
// Payout Analytics
// ==========================================================

export interface PayoutAnalyticsData {
  totalPayoutTransactions: number;
  totalPayoutAmount: number;

  successfulTransactions: number;
  successfulPayoutAmount: number;

  failedTransactions: number;
  createdTransactions: number;
  processingTransactions: number;
  processedTransactions: number;

  successPercentage: number;
  averagePayoutAmount: number;

  totalPayoutFee: number;
  totalDebitAmount: number;
}


// ==========================================================
// Refund Analytics
// ==========================================================

export interface RefundAnalyticsData {
  totalRefunds: number;
  totalRefundAmount: number;

  completedRefunds: number;
  processingRefunds: number;
  failedRefunds: number;

  fullRefunds: number;
  partialRefunds: number;

  monthlyTrend: {
    month: string;
    refunds: number;
    amount: number;
  }[];
}


// ==========================================================
// Payout / Refund History
// ==========================================================

export interface PayoutHistoryItem {
  refundId: number | string;

  refundReference: string;
  transactionReference?: string;
  orderId?: string;

  amount: number;
  currency: string;

  refundType: string;

  status: string;
  refundStatus?: string;

  gatewayRefundId?: string | null;
  gatewayPaymentId?: string | null;

  paymentMethod?: string;

  transactionAmount?: number;

  reason?: string | null;

  createdAt: string;
  refundCreatedAt?: string | null;
}


// ==========================================================
// Complete Payout Response
// ==========================================================

export interface PayoutAnalyticsResponse {
  payoutAnalytics: PayoutAnalyticsData;

  refundAnalytics: RefundAnalyticsData;

  history: PayoutHistoryItem[];
}


// ==========================================================
// Defaults
// ==========================================================

const defaultPayoutAnalytics: PayoutAnalyticsData = {

  totalPayoutTransactions: 0,
  totalPayoutAmount: 0,

  successfulTransactions: 0,
  successfulPayoutAmount: 0,

  failedTransactions: 0,
  createdTransactions: 0,
  processingTransactions: 0,
  processedTransactions: 0,

  successPercentage: 0,
  averagePayoutAmount: 0,

  totalPayoutFee: 0,
  totalDebitAmount: 0,
};


const defaultRefundAnalytics: RefundAnalyticsData = {

  totalRefunds: 0,
  totalRefundAmount: 0,

  completedRefunds: 0,
  processingRefunds: 0,
  failedRefunds: 0,

  fullRefunds: 0,
  partialRefunds: 0,

  monthlyTrend: [],
};


// ==========================================================
// Service
// ==========================================================

export const payoutService = {

  getAnalytics: async (): Promise<PayoutAnalyticsResponse> => {

    const response = await api.get(
      "/merchant/payout/analytics"
    );


    console.log(
      "PAYOUT API RESPONSE:",
      response.data
    );


    const data = response.data?.data;


    return {

      // ------------------------------------------
      // Payout Analytics
      // ------------------------------------------

      payoutAnalytics:
        data?.payoutAnalytics ||
        defaultPayoutAnalytics,


      // ------------------------------------------
      // Refund Analytics
      // ------------------------------------------

      refundAnalytics:
        data?.refundAnalytics ||
        defaultRefundAnalytics,


      // ------------------------------------------
      // History
      // ------------------------------------------

      history:
        data?.history ||
        [],

    };

  },

};


export default payoutService;