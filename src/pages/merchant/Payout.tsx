import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Percent,
  TrendingUp,
  BarChart3,
  Receipt,
  IndianRupee,
  RotateCcw,
  Search,
  CalendarDays,
  X,
} from "lucide-react";

import api from "../../services/api";

// ==========================================================
// Types
// ==========================================================

interface PayoutAnalyticsData {
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

interface RefundAnalyticsData {
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

interface PayoutHistoryItem {
  refundId: number | string;

  refundReference: string;
  transactionReference?: string;
  orderId?: string;

  amount: number;
  feeAmount?: number;
  totalDebitAmount?: number;
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
// Complete API Response
// ==========================================================

interface PayoutApiResponse {
  payoutAnalytics: PayoutAnalyticsData;
  refundAnalytics: RefundAnalyticsData;
  history: PayoutHistoryItem[];
}

// ==========================================================
// Defaults
// ==========================================================

const defaultAnalytics: PayoutAnalyticsData = {
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
// API Service
// ==========================================================

const payoutService = {
  getAnalytics: async (): Promise<PayoutApiResponse> => {
    const response = await api.get(
      "/merchant/payout/analytics"
    );

    console.log(
      "PAYOUT ANALYTICS FULL RESPONSE:",
      response.data
    );

    const data = response.data?.data;

    return {
      payoutAnalytics:
        data?.payoutAnalytics ||
        defaultAnalytics,

      refundAnalytics:
        data?.refundAnalytics ||
        defaultRefundAnalytics,

      history:
        data?.history ||
        [],
    };
  },
};

// ==========================================================
// Helpers
// ==========================================================

const money = (value: number) => {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

const number = (value: number) => {
  return Number(value || 0).toLocaleString(
    "en-IN"
  );
};

// ==========================================================
// Component
// ==========================================================

export default function Payout() {

  const [analytics, setAnalytics] =
    useState<PayoutAnalyticsData>(
      defaultAnalytics
    );

  const [refundAnalytics, setRefundAnalytics] =
    useState<RefundAnalyticsData>(
      defaultRefundAnalytics
    );

  const [history, setHistory] =
    useState<PayoutHistoryItem[]>([]);

  // ========================================================
  // HISTORY FILTERS
  // ========================================================

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ========================================================
  // Fetch Payout Data
  // ========================================================

  const fetchAnalytics = async () => {

    setLoading(true);
    setError(null);

    try {

      const response =
        await payoutService.getAnalytics();

      console.log(
        "PAYOUT DATA FOR UI:",
        response
      );

      setAnalytics(
        response.payoutAnalytics
      );

      setRefundAnalytics(
        response.refundAnalytics
      );

      // History is loaded from the dedicated refund history API.
      // Payout history is backed by transaction_refunds/refund_requests.
      const historyResponse = await api.get(
        "/merchant/refund/history",
        {
          params: {
            page: 1,
            limit: 100,
          },
        }
      );

      const records =
        historyResponse.data?.data?.refunds ??
        historyResponse.data?.refunds ??
        [];

      setHistory(
        Array.isArray(records)
          ? records.map((item: any) => ({
              refundId:
                item.refundId ??
                item.refund_id,

              refundReference:
                item.refundReference ??
                item.requestReference ??
                item.refund_reference ??
                "-",

              transactionReference:
                item.transactionReference ??
                item.transaction_reference,

              orderId:
                item.orderId ??
                item.order_id,

              amount: Number(
                item.amount ??
                item.approvedAmount ??
                item.approved_amount ??
                0
              ),

              currency:
                item.currency ??
                "INR",

              refundType:
                item.refundType ??
                item.refund_type ??
                "-",

              status:
                item.status ??
                "-",

              refundStatus:
                item.refundStatus ??
                item.refund_status,

              gatewayRefundId:
                item.gatewayRefundId ??
                item.gateway_refund_id,

              gatewayPaymentId:
                item.gatewayPaymentId ??
                item.gateway_payment_id,

              paymentMethod:
                item.paymentMethod ??
                item.payment_method,

              transactionAmount:
                Number(
                  item.transactionAmount ??
                  item.transaction_amount ??
                  0
                ),

              reason:
                item.reason ??
                null,

              createdAt:
                item.createdAt ??
                item.created_at ??
                "",

              refundCreatedAt:
                item.refundCreatedAt ??
                item.refund_created_at ??
                null,
            }))
          : []
      );

    } catch (err: any) {

      console.log(
        "Payout Analytics Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load payout analytics."
      );

      setAnalytics(
        defaultAnalytics
      );

      setRefundAnalytics(
        defaultRefundAnalytics
      );

      setHistory([]);

    } finally {

      setLoading(false);

    }
  };

  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {

    fetchAnalytics();

  }, []);

  // ========================================================
  // Derived Values
  // ========================================================

  const totalPayouts =
    analytics.totalPayoutTransactions;

  const successful =
    analytics.successfulTransactions;

  const failed =
    analytics.failedTransactions;

  const processing =
    analytics.processingTransactions;

  const created =
    analytics.createdTransactions;

  const totalAmount =
    analytics.totalPayoutAmount;

  const successfulAmount =
    analytics.successfulPayoutAmount;

  const averageAmount =
    analytics.averagePayoutAmount;

  const successRate =
    analytics.successPercentage;

  const payoutFee =
    analytics.totalPayoutFee;

  const totalDebit =
    analytics.totalDebitAmount;

  // ========================================================
  // Status Percentages
  // ========================================================

  const completedPercentage = useMemo(() => {

    if (!totalPayouts) return 0;

    return Math.min(
      100,
      (successful / totalPayouts) * 100
    );

  }, [
    successful,
    totalPayouts,
  ]);

  const processingPercentage = useMemo(() => {

    if (!totalPayouts) return 0;

    return Math.min(
      100,
      (processing / totalPayouts) * 100
    );

  }, [
    processing,
    totalPayouts,
  ]);

  const failedPercentage = useMemo(() => {

    if (!totalPayouts) return 0;

    return Math.min(
      100,
      (failed / totalPayouts) * 100
    );

  }, [
    failed,
    totalPayouts,
  ]);

  const createdPercentage = useMemo(() => {

    if (!totalPayouts) return 0;

    return Math.min(
      100,
      (created / totalPayouts) * 100
    );

  }, [
    created,
    totalPayouts,
  ]);

  // ========================================================
  // FILTERED HISTORY
  // ========================================================

  const filteredHistory = useMemo(() => {

    const query = search.trim().toLowerCase();

    return history.filter((item) => {

      const searchableText = [
        item.refundId,
        item.refundReference,
        item.transactionReference,
        item.orderId,
        item.gatewayRefundId,
        item.gatewayPaymentId,
        item.paymentMethod,
        item.refundType,
        item.status,
        item.refundStatus,
        item.reason,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      if (!item.createdAt) {
        return matchesSearch;
      }

      const itemDate =
        new Date(item.createdAt);

      if (
        Number.isNaN(
          itemDate.getTime()
        )
      ) {
        return matchesSearch;
      }

      const dateOnly =
        itemDate
          .toISOString()
          .slice(0, 10);

      const matchesStart =
        !startDate ||
        dateOnly >= startDate;

      const matchesEnd =
        !endDate ||
        dateOnly <= endDate;

      return (
        matchesSearch &&
        matchesStart &&
        matchesEnd
      );
    });

  }, [
    history,
    search,
    startDate,
    endDate,
  ]);

  const clearHistoryFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  // ========================================================
  // Render
  // ========================================================

  return (

    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-500">

              <Wallet className="h-5 w-5" />

            </span>

            <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white">
              Payout Analytics
            </h1>

          </div>

          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            Monitor payout performance, amounts, fees, refunds and processing status.
          </p>

        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-xs font-semibold text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-50"
        >

          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh

        </button>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">

          <AlertCircle className="h-5 w-5 shrink-0" />

          <div>

            <p className="text-sm font-semibold">
              Failed to load payout analytics
            </p>

            <p className="text-xs mt-1">
              {error}
            </p>

          </div>

        </div>

      )}

      {/* ==================================================
          MAIN METRICS
      ================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total Payouts */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-ink-200/60 dark:border-ink-800/60 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Total Payouts
            </span>

            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">

              <Receipt className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-ink-900 dark:text-white mt-2">

            {loading
              ? "..."
              : number(totalPayouts)}

          </p>

          <p className="text-[10px] text-ink-400 mt-1">
            Total payout transactions
          </p>

        </div>

        {/* Total Payout Amount */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-blue-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Payout Amount
            </span>

            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">

              <IndianRupee className="h-4 w-4" />

            </span>

          </div>

          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">

            {loading
              ? "..."
              : money(totalAmount)}

          </p>

          <p className="text-[10px] text-blue-500/70 mt-1">
            Total payout amount
          </p>

        </div>

        {/* Successful */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-emerald-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Successful
            </span>

            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">

              <CheckCircle2 className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">

            {loading
              ? "..."
              : number(successful)}

          </p>

          <p className="text-[10px] text-emerald-600/70 mt-1">
            Processed successfully
          </p>

        </div>

        {/* Successful Amount */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-emerald-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Successful Amount
            </span>

            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">

              <Wallet className="h-4 w-4" />

            </span>

          </div>

          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">

            {loading
              ? "..."
              : money(successfulAmount)}

          </p>

          <p className="text-[10px] text-emerald-600/70 mt-1">
            Amount successfully processed
          </p>

        </div>

      </div>

      {/* ==================================================
          SECONDARY METRICS
      ================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Processing */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-amber-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Processing
            </span>

            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">

              <Clock className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">

            {loading
              ? "..."
              : number(processing)}

          </p>

          <p className="text-[10px] text-amber-600/70 mt-1">
            Currently processing
          </p>

        </div>

        {/* Created */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-indigo-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Created
            </span>

            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">

              <BarChart3 className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">

            {loading
              ? "..."
              : number(created)}

          </p>

          <p className="text-[10px] text-indigo-500/70 mt-1">
            Newly created payouts
          </p>

        </div>

        {/* Failed */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-rose-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              Failed
            </span>

            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">

              <XCircle className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">

            {loading
              ? "..."
              : number(failed)}

          </p>

          <p className="text-[10px] text-rose-500/70 mt-1">
            Failed payouts
          </p>

        </div>

        {/* Success Rate */}

        <div className="p-4 rounded-2xl bg-white dark:bg-ink-900/70 border border-cyan-500/20 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
              Success Rate
            </span>

            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">

              <Percent className="h-4 w-4" />

            </span>

          </div>

          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">

            {loading
              ? "..."
              : `${successRate.toFixed(2)}%`}

          </p>

          <p className="text-[10px] text-cyan-500/70 mt-1">
            Processed / total payouts
          </p>

        </div>

      </div>

      {/* ==================================================
          FINANCIAL SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Average */}

        <div className="p-5 rounded-2xl bg-white dark:bg-ink-900/70 border border-ink-200/60 dark:border-ink-800/60 shadow-sm">

          <div className="flex items-center gap-3">

            <span className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">

              <TrendingUp className="h-5 w-5" />

            </span>

            <div>

              <p className="text-xs text-ink-500">
                Average Payout
              </p>

              <p className="text-xl font-bold text-ink-900 dark:text-white mt-1">

                {loading
                  ? "..."
                  : money(averageAmount)}

              </p>

            </div>

          </div>

        </div>

        {/* Fee */}

        <div className="p-5 rounded-2xl bg-white dark:bg-ink-900/70 border border-orange-500/20 shadow-sm">

          <div className="flex items-center gap-3">

            <span className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">

              <Percent className="h-5 w-5" />

            </span>

            <div>

              <p className="text-xs text-ink-500">
                Payout Fee
              </p>

              <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">

                {loading
                  ? "..."
                  : money(payoutFee)}

              </p>

            </div>

          </div>

        </div>

        {/* Debit */}

        <div className="p-5 rounded-2xl bg-white dark:bg-ink-900/70 border border-red-500/20 shadow-sm">

          <div className="flex items-center gap-3">

            <span className="p-2.5 rounded-xl bg-red-500/10 text-red-500">

              <Wallet className="h-5 w-5" />

            </span>

            <div>

              <p className="text-xs text-ink-500">
                Total Debit
              </p>

              <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">

                {loading
                  ? "..."
                  : money(totalDebit)}

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          REFUND ANALYTICS
      ================================================== */}

      <div className="rounded-2xl bg-white dark:bg-ink-900/70 border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-ink-200/60 dark:border-ink-800/60">

          <div className="flex items-center gap-2">

            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">

              <RotateCcw className="h-4 w-4" />

            </span>

            <div>

              <h2 className="text-sm font-bold text-ink-900 dark:text-white">
                Refund Summary
              </h2>

              <p className="text-[11px] text-ink-400 mt-0.5">
                Refund activity related to payouts
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">

          <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/50">

            <p className="text-xs text-ink-500">
              Total Refunds
            </p>

            <p className="text-xl font-bold text-ink-900 dark:text-white mt-1">

              {number(
                refundAnalytics.totalRefunds
              )}

            </p>

          </div>

          <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/50">

            <p className="text-xs text-ink-500">
              Refund Amount
            </p>

            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">

              {money(
                refundAnalytics.totalRefundAmount
              )}

            </p>

          </div>

          <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/50">

            <p className="text-xs text-ink-500">
              Completed
            </p>

            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">

              {number(
                refundAnalytics.completedRefunds
              )}

            </p>

          </div>

          <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800/50">

            <p className="text-xs text-ink-500">
              Partial Refunds
            </p>

            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">

              {number(
                refundAnalytics.partialRefunds
              )}

            </p>

          </div>

        </div>

      </div>

      {/* ==================================================
          PAYOUT STATUS DISTRIBUTION
      ================================================== */}

      <div className="rounded-2xl bg-white dark:bg-ink-900/70 border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-ink-200/60 dark:border-ink-800/60">

          <div className="flex items-center gap-2">

            <span className="p-2 rounded-lg bg-brand-500/10 text-brand-500">

              <BarChart3 className="h-4 w-4" />

            </span>

            <div>

              <h2 className="text-sm font-bold text-ink-900 dark:text-white">
                Payout Status Distribution
              </h2>

              <p className="text-[11px] text-ink-400 mt-0.5">
                Current payout transaction status
              </p>

            </div>

          </div>

        </div>

        <div className="p-5 space-y-5">

          {/* Successful */}

          <div>

            <div className="flex justify-between text-[11px] mb-1">

              <span className="text-ink-500">
                Successful
              </span>

              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {number(successful)}
              </span>

            </div>

            <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">

              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${completedPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Processing */}

          <div>

            <div className="flex justify-between text-[11px] mb-1">

              <span className="text-ink-500">
                Processing
              </span>

              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {number(processing)}
              </span>

            </div>

            <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">

              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{
                  width: `${processingPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Created */}

          <div>

            <div className="flex justify-between text-[11px] mb-1">

              <span className="text-ink-500">
                Created
              </span>

              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {number(created)}
              </span>

            </div>

            <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">

              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{
                  width: `${createdPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Failed */}

          <div>

            <div className="flex justify-between text-[11px] mb-1">

              <span className="text-ink-500">
                Failed
              </span>

              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {number(failed)}
              </span>

            </div>

            <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">

              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500"
                style={{
                  width: `${failedPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          PAYOUT HISTORY
      ================================================== */}

      <div className="rounded-2xl bg-white dark:bg-ink-900/70 border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden">

        {/* HISTORY HEADER */}

        <div className="px-6 py-5 border-b border-ink-200/60 dark:border-ink-800/60">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">

                <Receipt className="h-5 w-5" />

              </span>

              <div>

                <h2 className="text-base font-bold text-ink-900 dark:text-white">
                  Payout History
                </h2>

                <p className="text-xs text-ink-400 mt-1">
                  Refund transactions related to your payout activity
                </p>

              </div>

            </div>

            <div className="text-xs text-ink-500 dark:text-ink-400">

              Showing{" "}

              <span className="font-bold text-ink-900 dark:text-white">
                {filteredHistory.length}
              </span>

              {" "}of{" "}

              <span className="font-bold text-ink-900 dark:text-white">
                {history.length}
              </span>

              {" "}records

            </div>

          </div>

        </div>

        {/* FILTERS */}

        <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/40 dark:bg-ink-950/30">

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,1fr)_200px_200px_auto] gap-3 items-end">

            {/* SEARCH */}

            <div>

              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">
                Search
              </label>

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Refund ID, reference, order ID, payment ID..."
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                />

                {search && (

                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-white"
                  >

                    <X className="h-4 w-4" />

                  </button>

                )}

              </div>

            </div>

            {/* START DATE */}

            <div>

              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">
                Start Date
              </label>

              <div className="relative">

                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                />

              </div>

            </div>

            {/* END DATE */}

            <div>

              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">
                End Date
              </label>

              <div className="relative">

                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                />

              </div>

            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={clearHistoryFilters}
              disabled={
                !search &&
                !startDate &&
                !endDate
              }
              className="h-11 px-5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>

          </div>

        </div>

        {/* TABLE */}

        {loading ? (

          <div className="py-20 text-center">

            <RefreshCw className="h-7 w-7 mx-auto text-brand-500 animate-spin" />

            <p className="text-sm text-ink-500 mt-3">
              Loading payout history...
            </p>

          </div>

        ) : filteredHistory.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1500px]">

              <thead>

                <tr className="bg-ink-50/70 dark:bg-ink-950/40 border-b border-ink-200/60 dark:border-ink-800/60">

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Refund ID
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Reference
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Order ID
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Payment ID
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Fee
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Total Debit
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredHistory.map((item) => {

                  const status = String(
                    item.refundStatus ||
                    item.status ||
                    "UNKNOWN"
                  ).toUpperCase();

                  const statusClass =
                    status === "PROCESSED" ||
                    status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : status === "PROCESSING"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : status === "FAILED"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20";

                  return (

                    <tr
                      key={item.refundId}
                      className="border-b border-ink-200/50 dark:border-ink-800/60 hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors"
                    >

                      <td className="px-6 py-5">

                        <span className="font-semibold text-sm text-ink-900 dark:text-white">
                          #{item.refundId}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <div>

                          <p className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
                            {item.refundReference || "-"}
                          </p>

                          {item.transactionReference && (

                            <p className="text-[10px] text-ink-400 mt-1">
                              {item.transactionReference}
                            </p>

                          )}

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-medium text-sm text-ink-700 dark:text-ink-200">
                          {item.orderId || "-"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-mono text-xs text-ink-600 dark:text-ink-300">
                          {item.gatewayPaymentId || "-"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <p className="font-bold text-sm text-ink-900 dark:text-white whitespace-nowrap">
                          {money(item.amount)}
                        </p>

                        <p className="text-[10px] text-ink-400 mt-1">
                          {item.currency || "INR"}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-semibold text-sm text-rose-500 whitespace-nowrap">
                          {money((item as any).feeAmount || 0)}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-bold text-sm text-ink-900 dark:text-white whitespace-nowrap">
                          {money((item as any).totalDebitAmount || item.amount)}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-ink-100 dark:bg-ink-800 text-xs font-semibold text-ink-700 dark:text-ink-300">
                          {item.paymentMethod || "-"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-xs font-semibold">
                          {item.refundType || "-"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full border text-[11px] font-bold ${statusClass}`}
                        >
                          {status}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <div className="whitespace-nowrap">

                          <p className="text-xs font-semibold text-ink-700 dark:text-ink-200">
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"
                            }
                          </p>

                          <p className="text-[10px] text-ink-400 mt-1">
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : ""
                            }
                          </p>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="py-20 text-center">

            <Receipt className="h-10 w-10 mx-auto text-ink-300" />

            <p className="text-sm font-semibold text-ink-500 mt-3">
              No payout history found
            </p>

            <p className="text-xs text-ink-400 mt-1">
              {search || startDate || endDate
                ? "No records match your selected filters."
                : "No payout or refund transactions are available."
              }
            </p>

            {(search || startDate || endDate) && (

              <button
                type="button"
                onClick={clearHistoryFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600"
              >
                Clear Filters
              </button>

            )}

          </div>

        )}

      </div>

    </div>

  );
}