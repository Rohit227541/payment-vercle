import api from "./api";

export interface WalletSummaryBackend {
  walletId?: string | number;
  merchantId?: string | number;
  balance?: {
    available: number;
    pending: number;
    blocked: number;
  };
  totals?: {
    received: number;
    refunded: number;
    settled: number;
  };
  currency?: string;
  status?: string;
  lastTransactionAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletOverviewData {
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
  lastTransactionAt?: string;
}

export interface WalletLedgerItem {
  transactionId: string | number;
  type: 'CREDIT' | 'DEBIT' | string;
  source?: string;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  referenceType?: string;
  referenceId?: string;
  status: string;
  description?: string;
  createdAt: string;
}

export interface WalletAnalyticsData {
  summary?: any;
  sourceAnalytics?: any[];
  trend?: any[];
}


export const walletService = {
  getOverview: async (): Promise<WalletOverviewData> => {
    try {
      // Primary: GET /merchant/wallet-analytics/balance
      const res = await api.get("/merchant/wallet-analytics/balance");
      const summary = res.data?.data || res.data || {};
      if (summary) {
        return {
          walletId: summary.walletId,
          merchantId: summary.merchantId,
          availableBalance: summary.balance.available || 0,
          pendingBalance: summary.balance.pending || 0,
          blockedBalance: summary.balance.blocked || 0,
          totalReceived: summary.totals?.received || 0,
          totalRefunded: summary.totals?.refunded || 0,
          totalSettled: summary.totals?.settled || 0,
          currency: summary.currency || 'INR',
          status: summary.status || 'ACTIVE',
          lastTransactionAt: summary.lastTransactionAt || summary.updatedAt,
        };
      }
    } catch {
      // Fallback: GET /merchant/wallet
    }

    try {
      const res = await api.get("/merchant/wallet");
      const data = res.data?.data || res.data || {};
      return {
        walletId: data.walletId,
        merchantId: data.merchantId,
        availableBalance: Number(data.availableBalance || data.available_balance || 0),
        pendingBalance: Number(data.pendingBalance || data.pending_balance || 0),
        blockedBalance: Number(data.blockedBalance || data.blocked_balance || 0),
        totalReceived: Number(data.totalReceived || data.total_received || 0),
        totalRefunded: Number(data.totalRefunded || data.total_refunded || 0),
        totalSettled: Number(data.totalSettled || data.total_settled || 0),
        currency: data.currency || 'INR',
        status: data.status || 'ACTIVE',
        totalWalletTransactions: Number(data.totalWalletTransactions || 0)
      };
    } catch {
      return {
        availableBalance: 0,
        pendingBalance: 0,
        blockedBalance: 0,
        totalReceived: 0,
        totalRefunded: 0,
        totalSettled: 0,
      };
    }
  },

  getLedger: async (page: number = 1, limit: number = 20): Promise<WalletLedgerItem[]> => {
    try {
      // Primary: GET /merchant/wallet-analytics/history
      const res = await api.get(`/merchant/wallet-analytics/history?page=${page}&limit=${limit}`);
      const txs = res.data?.data?.transactions || res.data?.transactions;
      if (Array.isArray(txs)) {
        return txs;
      }
    } catch {
      // Fallback
    }

    try {
      // Fallback: GET /merchant/wallet-analytics/history
      const res = await api.get(`/merchant/wallet-analytics/history?page=${page}&limit=${limit}`);
      const history = res.data?.data?.history || res.data?.data || res.data || [];
      if (Array.isArray(history)) {
        return history.map((item: any) => ({
          transactionId: item.wallet_transaction_id || item.transactionId || item.id,
          type: item.transaction_type || item.type || 'CREDIT',
          source: item.source || 'SYSTEM',
          amount: Number(item.amount || 0),
          balanceBefore: Number(item.balance_before || item.balanceBefore || 0),
          balanceAfter: Number(item.balance_after || item.balanceAfter || 0),
          referenceType: item.reference_type || item.referenceType,
          referenceId: item.reference_id || item.referenceId,
          status: item.status || 'COMPLETED',
          description: item.description || 'Wallet transaction',
          createdAt: item.created_at || item.createdAt || new Date().toISOString()
        }));
      }
    } catch {
      // Empty
    }

    return [];
  },

  getAnalytics: async (): Promise<WalletAnalyticsData | null> => {
    try {
      const res = await api.get("/merchant/wallet-analytics/analytics");
      return res.data?.data || null;
    } catch {
      return null;
    }
  }
};

export default walletService;
