import { useState, useEffect } from 'react';

import {
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Download,
  Calendar,
  Activity,
  CreditCard,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
  XCircle,
} from 'lucide-react';

import { API_BASE_URL } from '../../config';
import api from '../../services/api';


// ==========================================================
// Transaction Interface
// ==========================================================

interface Transaction {
  transactionId: string;
  orderId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: string;
  fee: string;
  currency: string;
  paymentMethod: string;
  transactionStatus: string;
  gatewayResponse: string;
  createdDate: string;
}


// ==========================================================
// Payin Analytics Interface
// ==========================================================

interface PayinAnalytics {
  totalPayinAmount: number;
  totalPayinTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  createdTransactions: number;
  failedTransactions: number;
  authorizedTransactions: number; // ADD
  cancelledTransactions: number;
  refundedTransactions: number;
  partiallyRefundedTransactions: number;
  chargebackTransactions: number;
  successPercentage: number;
  averagePayinAmount: number;
}

// ==========================================================
// API Response Interface
// ==========================================================

interface PayinAnalyticsResponse {
  success?: boolean;

  data?: {
    analytics?: Partial<PayinAnalytics>;

    totalPayinAmount?: number;
    totalPayinTransactions?: number;
    successfulTransactions?: number;
    pendingTransactions?: number;
    createdTransactions?: number;
    failedTransactions?: number;
    authorizedTransactions?: number;
    cancelledTransactions?: number;
    refundedTransactions?: number;
    partiallyRefundedTransactions?: number;
    chargebackTransactions?: number;
    successPercentage?: number;
    averagePayinAmount?: number;
  };

  message?: string;
}


// ==========================================================
// Component
// ==========================================================

export default function MerchantPayin() {

  // ========================================================
  // Transaction State
  // ========================================================

  const [data, setData] =
    useState<Transaction[] | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<boolean>(false);


  // ========================================================
  // Search / Filter State
  // ========================================================

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [debouncedSearch, setDebouncedSearch] =
    useState<string>('');

  const [statusFilter, setStatusFilter] =
    useState<string>('ALL');

  const [startDate, setStartDate] =
    useState<string>('');

  const [endDate, setEndDate] =
    useState<string>('');

  const [showDatePicker, setShowDatePicker] =
    useState<boolean>(false);


  // ========================================================
  // Pagination State
  // ========================================================

  const [page, setPage] =
    useState<number>(1);

  const [limit, setLimit] =
    useState<number>(10);

  const [totalPages, setTotalPages] =
    useState<number>(1);

  const [totalRecords, setTotalRecords] =
    useState<number>(0);


  // ========================================================
  // Analytics State
  // ========================================================

  const [analytics, setAnalytics] =
    useState<PayinAnalytics | null>(null);

  const [metricsLoading, setMetricsLoading] =
    useState<boolean>(true);


  // ========================================================
  // Fetch Payin Analytics
  // ========================================================

  const fetchMetrics = async () => {

    try {

      setMetricsLoading(true);

      console.log(
        'Fetching Payin Analytics...'
      );

      const response =
        await api.get<PayinAnalyticsResponse>(
          '/merchant/payin/analytics'
        );

      console.log(
        'Payin Analytics Response:',
        response.data
      );


      // ====================================================
      // Support both possible backend structures:
      //
      // data.analytics
      //
      // OR
      //
      // data directly
      // ====================================================

      const rawData =
        response.data?.data?.analytics ||
        response.data?.data ||
        {};


      const normalizedData: PayinAnalytics = {

        totalPayinAmount:
          Number(rawData.totalPayinAmount || 0),

        totalPayinTransactions:
          Number(rawData.totalPayinTransactions || 0),

        successfulTransactions:
          Number(rawData.successfulTransactions || 0),

        pendingTransactions:
          Number(rawData.pendingTransactions || 0),

        createdTransactions:
          Number(rawData.createdTransactions || 0),

        failedTransactions:
          Number(rawData.failedTransactions || 0),

        authorizedTransactions:
          Number(rawData.authorizedTransactions || 0),

        cancelledTransactions:
          Number(rawData.cancelledTransactions || 0),

        refundedTransactions:
          Number(rawData.refundedTransactions || 0),

        partiallyRefundedTransactions:
          Number(rawData.partiallyRefundedTransactions || 0),

        chargebackTransactions:
          Number(rawData.chargebackTransactions || 0),

        successPercentage:
          Number(rawData.successPercentage || 0),

        averagePayinAmount:
          Number(rawData.averagePayinAmount || 0),
      };

      console.log(
        'Normalized Payin Analytics:',
        normalizedData
      );


      setAnalytics(
        normalizedData
      );

    } catch (err: any) {

      console.log(
        'Failed to load payin metrics:',
        err
      );

      setAnalytics({
        totalPayinAmount: 0,
        totalPayinTransactions: 0,
        successfulTransactions: 0,
        pendingTransactions: 0,
        createdTransactions: 0,
        failedTransactions: 0,
        authorizedTransactions: 0,
        cancelledTransactions: 0,
        refundedTransactions: 0,
        partiallyRefundedTransactions: 0,
        chargebackTransactions: 0,
        successPercentage: 0,
        averagePayinAmount: 0,
      });

    } finally {

      setMetricsLoading(false);

    }
  };


  // ========================================================
  // Load Transactions
  // ========================================================

  const loadTransactions = async () => {

    setLoading(true);

    setError(false);


    // ======================================================
    // Mock Data
    // ======================================================

    if (!API_BASE_URL) {

      try {

        const response =
          await fetch(
            '/mock-merchant-transactions.json'
          );

        const result =
          await response.json();

        setData(result);

        setTotalPages(1);

        setTotalRecords(
          result.length
        );

      } catch (err) {

        console.log(
          'Failed to load mock transactions:',
          err
        );

        setError(true);

      } finally {

        setLoading(false);

      }

      return;
    }


    // ======================================================
    // Real API
    // ======================================================

    try {

      const token =
        localStorage.getItem(
          'accessToken'
        ) ||
        localStorage.getItem(
          'token'
        );


      const headers: Record<string, string> = {

        'Content-Type':
          'application/json',
      };


      if (token) {

        headers.Authorization =
          `Bearer ${token}`;

      }


      // ====================================================
      // Base URL
      // ====================================================

      let url =
        `${API_BASE_URL}/payment/history?page=${page}&limit=${limit}`;


      // ====================================================
      // Search
      // ====================================================

      if (
        debouncedSearch.trim()
      ) {

        url +=
          `&search=${encodeURIComponent(
            debouncedSearch.trim()
          )}`;

      }


      // ====================================================
      // Status
      // ====================================================

      if (
        statusFilter &&
        statusFilter !== 'ALL'
      ) {

        url +=
          `&status=${encodeURIComponent(
            statusFilter
          )}`;

      }


      // ====================================================
      // Start Date
      // ====================================================

      if (startDate) {

        url +=
          `&start_date=${encodeURIComponent(
            startDate
          )}`;

      }


      // ====================================================
      // End Date
      // ====================================================

      if (endDate) {

        url +=
          `&end_date=${encodeURIComponent(
            endDate
          )}`;

      }


      console.log(
        'Loading Payin Transactions:',
        url
      );


      const response =
        await fetch(
          url,
          {
            method: 'GET',
            headers,
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          'Failed to load transactions'
        );

      }


      // ====================================================
      // Extract Transactions
      // ====================================================

      const transactions =
        result.data?.transactions ||
        [];


      // ====================================================
      // Format Transactions
      // ====================================================

      const formatted: Transaction[] =
        transactions.map(
          (t: any) => ({

            transactionId:
              String(
                t.transactionId ??
                t.transaction_id ??
                'N/A'
              ),

            orderId:
              String(
                t.orderId ??
                t.order_id ??
                'N/A'
              ),

            paymentId:
              String(
                t.gatewayPaymentId ??
                t.provider_payment_id ??
                t.gateway_payment_id ??
                'N/A'
              ),

            customerName:
              t.customerName ??
              t.customer_name ??
              'N/A',

            customerEmail:
              t.customerEmail ??
              t.customer_email ??
              'N/A',

            customerPhone:
              t.customerPhone ??
              t.customer_phone ??
              'N/A',

            amount:
              Number(
                t.amount || 0
              ).toFixed(2),

            fee:
              Number(
                t.merchantFee ??
                t.merchant_fee ??
                0
              ).toFixed(2),

            currency:
              t.currency === 'INR'
                ? '₹'
                : (
                  t.currency ||
                  '₹'
                ),

            paymentMethod:
              t.paymentMethod ??
              t.payment_method ??
              'N/A',

            transactionStatus:
              t.status ??
              t.transactionStatus ??
              'PENDING',

            gatewayResponse:
              t.gatewayName ??
              t.gateway_name ??
              t.payment_provider ??
              'N/A',

            createdDate:
              t.createdAt ||
                t.created_at
                ? new Date(
                  t.createdAt ||
                  t.created_at
                ).toLocaleString()
                : 'N/A',

          })
        );


      setData(
        formatted
      );


      // ====================================================
      // Pagination
      // ====================================================

      setTotalPages(
        Number(
          result.data?.pagination?.total_pages ||
          1
        )
      );

      setTotalRecords(
        Number(
          result.data?.pagination?.total_records ||
          0
        )
      );

    } catch (err: any) {

      console.log(
        'Failed to load transactions:',
        err
      );

      setError(true);

    } finally {

      setLoading(false);

    }
  };


  // ========================================================
  // CSV Export
  // ========================================================

  const exportToCSV = () => {

    if (
      !data ||
      data.length === 0
    ) {

      return;

    }


    const headers = [

      'Transaction ID',

      'Order ID',

      'Payment ID',

      'Customer Name',

      'Customer Email',

      'Customer Phone',

      'Amount',

      'Currency',

      'Payment Method',

      'Status',

      'Gateway Response',

      'Created Date',

    ];


    const rows =
      data.map(
        (t) => [

          t.transactionId,

          t.orderId,

          t.paymentId,

          t.customerName,

          t.customerEmail,

          t.customerPhone,

          t.amount,

          t.currency,

          t.paymentMethod,

          t.transactionStatus,

          t.gatewayResponse,

          t.createdDate,

        ]
      );


    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),

        ...rows.map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(value)
                    .replace(/"/g, '""')}"`
              )
              .join(',')
        ),
      ].join('\n');


    const encodedUri =
      encodeURI(
        csvContent
      );


    const link =
      document.createElement(
        'a'
      );


    link.setAttribute(
      'href',
      encodedUri
    );


    link.setAttribute(
      'download',
      `payin_transactions_${new Date()
        .toISOString()
        .split('T')[0]}.csv`
    );


    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };


  // ========================================================
  // Debounce Search
  // ========================================================

  useEffect(() => {

    const handler =
      setTimeout(() => {

        setDebouncedSearch(
          searchQuery
        );

      }, 400);


    return () =>
      clearTimeout(
        handler
      );

  }, [
    searchQuery
  ]);


  // ========================================================
  // Reset Page On Filters
  // ========================================================

  useEffect(() => {

    setPage(1);

  }, [
    statusFilter,
    startDate,
    endDate,
    debouncedSearch,
    limit,
  ]);


  // ========================================================
  // Load Analytics On Mount
  // ========================================================

  useEffect(() => {

    fetchMetrics();

  }, []);


  // ========================================================
  // Load Transactions
  // ========================================================

  useEffect(() => {

    loadTransactions();

  }, [
    page,
    statusFilter,
    startDate,
    endDate,
    debouncedSearch,
    limit,
  ]);


  // ========================================================
  // Status Classes
  // ========================================================

  const getStatusClass = (
    status: string
  ) => {

    switch (
    status.toUpperCase()
    ) {

      case 'SUCCESS':

        return `
          bg-emerald-500/10
          text-emerald-600
          dark:text-emerald-400
        `;

      case 'PENDING':

        return `
          bg-amber-500/10
          text-amber-600
          dark:text-amber-400
        `;

      case 'CREATED':

        return `
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        `;

      case 'AUTHORIZED':

        return `
          bg-indigo-500/10
          text-indigo-600
          dark:text-indigo-400
        `;

      case 'CANCELLED':

        return `
          bg-slate-500/10
          text-slate-600
          dark:text-slate-400
        `;

      case 'REFUNDED':

        return `
          bg-violet-500/10
          text-violet-600
          dark:text-violet-400
        `;

      case 'PARTIALLY_REFUNDED':

        return `
          bg-purple-500/10
          text-purple-600
          dark:text-purple-400
        `;

      case 'CHARGEBACK':

        return `
          bg-orange-500/10
          text-orange-600
          dark:text-orange-400
        `;

      case 'FAILED':

        return `
          bg-rose-500/10
          text-rose-600
          dark:text-rose-400
        `;

      default:

        return `
          bg-ink-500/10
          text-ink-600
          dark:text-ink-400
        `;
    }
  };


  // ========================================================
  // Render
  // ========================================================

  return (

    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">

            Payin History

          </h1>

          <p className="text-sm text-ink-500 dark:text-ink-400">

            Track and manage all customer payin transactions

          </p>

        </div>


        <div className="flex gap-2.5">

          <button
            onClick={() => {
              fetchMetrics();
              loadTransactions();
            }}
            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"
          >

            <RefreshCw
              className={`h-3.5 w-3.5 ${loading
                ? 'animate-spin'
                : ''
                }`}
            />

            Refresh

          </button>


          <button
            onClick={exportToCSV}
            className="btn-primary flex items-center gap-2 py-2 px-3 text-xs"
          >

            <Download className="h-3.5 w-3.5" />

            Export CSV

          </button>

        </div>

      </div>


      {/* ==================================================
          Metric Cards
      ================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">

        {[
          {
            label: 'Total Payin',

            value:
              `₹ ${(
                analytics?.totalPayinAmount ??
                0
              ).toLocaleString(
                'en-IN',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`,

            icon:
              <CreditCard className="h-4 w-4 text-brand-500" />,
          },


          {
            label: 'Total Txn Payin',

            value:
              (
                analytics?.totalPayinTransactions ??
                0
              ).toLocaleString(
                'en-IN'
              ),

            icon:
              <Activity className="h-4 w-4 text-brand-500" />,
          },


          {
            label: 'Success Txn',

            value:
              (
                analytics?.successfulTransactions ??
                0
              ).toLocaleString(
                'en-IN'
              ),

            icon:
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
          },


          {
            label: 'Pending Txn',

            value:
              (
                analytics?.pendingTransactions ??
                0
              ).toLocaleString(
                'en-IN'
              ),

            icon:
              <Clock className="h-4 w-4 text-amber-500" />,
          },


          {
            label: 'Failed Txn',

            value:
              (
                analytics?.failedTransactions ??
                0
              ).toLocaleString(
                'en-IN'
              ),

            icon:
              <XCircle className="h-4 w-4 text-rose-500" />,
          },
          {
            label: 'Cancelled Txn',

            value:
              (
                analytics?.cancelledTransactions ??
                0
              ).toLocaleString('en-IN'),

            icon:
              <XCircle className="h-4 w-4 text-slate-500" />,
          },


          {
            label: 'Created Txn',

            value:
              (
                analytics?.createdTransactions ??
                0
              ).toLocaleString(
                'en-IN'
              ),

            icon:
              <RefreshCw className="h-4 w-4 text-brand-500" />,
          },
          {
            label: 'Authorized Txn',

            value:
              (
                analytics?.authorizedTransactions ??
                0
              ).toLocaleString('en-IN'),

            icon:
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />,
          },


          {
            label: 'Success Rate',

            value:
              `${(
                analytics?.successPercentage ??
                0
              ).toFixed(2)}%`,

            icon:
              <Percent className="h-4 w-4 text-brand-500" />,
          },


          {
            label: 'Avg Txn Amount',

            value:
              `₹ ${(
                analytics?.averagePayinAmount ??
                0
              ).toLocaleString(
                'en-IN',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`,

            icon:
              <TrendingUp className="h-4 w-4 text-brand-500" />,
          },

        ].map(
          (item, index) => (

            <div
              key={index}
              className="
                bg-white
                dark:bg-ink-900
                rounded-2xl
                p-4
                border
                border-ink-200/60
                dark:border-ink-800/60
                shadow-sm
                flex
                flex-col
                justify-center
                relative
                overflow-hidden
                group
              "
            >

              <div className="flex justify-between items-start mb-2">

                <p className="text-[11px] font-bold text-ink-500 uppercase tracking-wider">

                  {item.label}

                </p>


                <div className="
                  p-1.5
                  bg-ink-50
                  dark:bg-ink-800/50
                  rounded-lg
                  group-hover:bg-brand-50
                  dark:group-hover:bg-brand-900/20
                  transition-colors
                ">

                  {item.icon}

                </div>

              </div>


              {metricsLoading ? (

                <div className="
                  h-7
                  w-20
                  bg-ink-100
                  dark:bg-ink-800
                  rounded-md
                  animate-pulse
                " />

              ) : (

                <p className="
                  text-xl
                  font-black
                  text-ink-900
                  dark:text-white
                  font-mono
                  tracking-tight
                ">

                  {item.value}

                </p>

              )}

            </div>

          )
        )}

      </div>


      {/* ==================================================
          Filters
      ================================================== */}

      <div className="
        grid
        gap-3
        sm:flex
        items-center
        justify-between
        bg-white
        dark:bg-ink-900
        p-4
        rounded-xl
        border
        border-ink-200/60
        dark:border-ink-800/60
      ">

        <div className="relative w-full sm:w-80">

          <Search className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            h-4
            w-4
            text-ink-400
          " />

          <input
            type="text"
            placeholder="Search by Payment ID, Order ID, or Customer Email..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            className="
              input
              pl-10
              py-1.5
              text-sm
              w-full
              focus:ring-brand-500/20
            "
          />

        </div>


        <div className="
          flex
          flex-wrap
          gap-2
          items-center
          w-full
          sm:w-auto
        ">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              input
              py-1.5
              px-3
              text-xs
              w-full
              sm:w-44
            "
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="CREATED">
              Created
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="AUTHORIZED">
              Authorized
            </option>

            <option value="SUCCESS">
              Success
            </option>

            <option value="FAILED">
              Failed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="REFUNDED">
              Refunded
            </option>

            <option value="PARTIALLY_REFUNDED">
              Partially Refunded
            </option>

            <option value="CHARGEBACK">
              Chargeback
            </option>

          </select>


          {/* Date Range */}

          <div className="relative flex items-center gap-1.5">

            <button
              onClick={() =>
                setShowDatePicker(
                  !showDatePicker
                )
              }
              className={`
                btn-secondary
                py-1.5
                px-3
                text-xs
                flex
                items-center
                gap-1.5

                ${showDatePicker
                  ? `
                      border-brand-500
                      bg-brand-500/5
                      text-brand-600
                      dark:text-brand-400
                    `
                  : ''
                }
              `}
            >

              <Calendar className="h-3.5 w-3.5" />

              Date Range

            </button>


            {showDatePicker && (

              <div className="
                absolute
                right-0
                top-full
                mt-2
                z-50
                flex
                items-center
                gap-1
                bg-white
                dark:bg-ink-900
                p-3
                rounded-xl
                border
                border-ink-200
                dark:border-ink-800
                shadow-xl
              ">

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="
                    input
                    py-1
                    px-2
                    text-xs
                    w-32
                    bg-ink-50
                    dark:bg-ink-950
                    dark:[color-scheme:dark]
                  "
                />

                <span className="text-ink-400 text-xs">
                  to
                </span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                  className="
                    input
                    py-1
                    px-2
                    text-xs
                    w-32
                    bg-ink-50
                    dark:bg-ink-950
                    dark:[color-scheme:dark]
                  "
                />

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          Loading
      ================================================== */}

      {loading && (

        <div className="
          flex
          flex-col
          items-center
          justify-center
          py-20
          space-y-4
        ">

          <div className="
            h-10
            w-10
            border-4
            border-brand-500/20
            border-t-brand-500
            rounded-full
            animate-spin
          " />

          <p className="
            text-sm
            text-ink-500
            dark:text-ink-400
          ">

            Loading payins...

          </p>

        </div>

      )}


      {/* ==================================================
          Error
      ================================================== */}

      {!loading && error && (

        <div className="
          glass-card
          p-6
          border
          border-rose-500/20
          bg-rose-500/5
          text-center
          max-w-xl
          mx-auto
          space-y-4
        ">

          <div className="
            mx-auto
            grid
            h-12
            w-12
            place-items-center
            rounded-full
            bg-rose-500/10
            text-rose-500
          ">

            <AlertCircle className="h-6 w-6" />

          </div>


          <h3 className="
            font-semibold
            text-ink-900
            dark:text-white
          ">

            Failed to Load Payins

          </h3>


          <p className="
            text-xs
            text-ink-500
            dark:text-ink-400
          ">

            Could not fetch transaction database.
            Please check your API URL configuration
            or try again.

          </p>


          <button
            onClick={() => {
              fetchMetrics();
              loadTransactions();
            }}
            className="
              btn-primary
              py-2
              px-4
              text-xs
              font-semibold
              mx-auto
            "
          >

            Retry Connection

          </button>

        </div>

      )}


      {/* ==================================================
          Empty State
      ================================================== */}

      {!loading &&
        !error &&
        (!data ||
          data.length === 0) && (

          <div className="
            glass-card
            p-12
            text-center
            max-w-xl
            mx-auto
            space-y-4
          ">

            <div className="
              mx-auto
              grid
              h-16
              w-16
              place-items-center
              rounded-full
              bg-ink-100
              dark:bg-ink-800
              text-ink-400
            ">

              <Inbox className="h-8 w-8" />

            </div>


            <h3 className="
              font-semibold
              text-ink-900
              dark:text-white
            ">

              No Payins Found

            </h3>


            <p className="
              text-xs
              text-ink-500
              dark:text-ink-400
              font-normal
            ">

              No payin transactions have been
              processed on this merchant account yet.

            </p>

          </div>

        )}


      {/* ==================================================
          Transactions Table
      ================================================== */}

      {!loading &&
        !error &&
        data &&
        data.length > 0 && (

          <div className="
            glass-card
            overflow-hidden
          ">

            <div className="overflow-x-auto">

              <table className="
                w-full
                text-left
                text-sm
              ">

                <thead className="
                  border-b
                  border-ink-200/60
                  dark:border-ink-800/60
                  bg-ink-50/50
                  dark:bg-ink-900/40
                  text-xs
                  uppercase
                  tracking-wider
                  text-ink-500
                  dark:text-ink-400
                ">

                  <tr>

                    <th className="px-5 py-3 font-medium">
                      Transaction ID
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Order ID
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Payment ID
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Customer Name
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Contact Details
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Amount
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Fee
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Method
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Gateway Response
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Created Date
                    </th>

                  </tr>

                </thead>


                <tbody className="
                  divide-y
                  divide-ink-200/40
                  dark:divide-ink-800/40
                ">

                  {data.map(
                    (t, index) => (

                      <tr
                        key={
                          t.transactionId ||
                          index
                        }
                        className="
                          hover:bg-ink-50/50
                          dark:hover:bg-ink-900/40
                        "
                      >

                        <td className="
                          px-5
                          py-3.5
                          font-mono
                          text-xs
                          text-ink-600
                          dark:text-ink-300
                          whitespace-nowrap
                        ">

                          {t.transactionId}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          font-mono
                          text-xs
                          text-ink-600
                          dark:text-ink-300
                          whitespace-nowrap
                        ">

                          {t.orderId}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          font-mono
                          text-xs
                          text-ink-600
                          dark:text-ink-300
                          whitespace-nowrap
                        ">

                          {t.paymentId}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          font-semibold
                          text-ink-900
                          dark:text-white
                          whitespace-nowrap
                        ">

                          {t.customerName}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          whitespace-nowrap
                        ">

                          <p className="
                            text-sm
                            text-ink-900
                            dark:text-white
                            leading-tight
                          ">

                            {t.customerEmail}

                          </p>

                          <p className="
                            text-xs
                            text-ink-400
                            mt-0.5
                          ">

                            {t.customerPhone}

                          </p>

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          font-semibold
                          text-ink-900
                          dark:text-white
                          whitespace-nowrap
                        ">

                          {t.currency}
                          {t.amount}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          font-semibold
                          text-rose-500
                          dark:text-rose-400
                          whitespace-nowrap
                        ">

                          {t.currency}
                          {t.fee}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          text-ink-600
                          dark:text-ink-300
                          whitespace-nowrap
                        ">

                          {t.paymentMethod}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          whitespace-nowrap
                        ">

                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClass(
                              t.transactionStatus
                            )}
                            `}
                          >

                            {t.transactionStatus}

                          </span>

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          text-xs
                          text-ink-500
                          dark:text-ink-400
                          max-w-xs
                          truncate
                        ">

                          {t.gatewayResponse}

                        </td>


                        <td className="
                          px-5
                          py-3.5
                          text-ink-500
                          dark:text-ink-400
                          whitespace-nowrap
                        ">

                          {t.createdDate}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* ==================================================
                Pagination
            ================================================== */}

            <div className="
              flex
              items-center
              justify-between
              px-5
              py-4
              border-t
              border-ink-200/60
              dark:border-ink-800/60
              bg-ink-50/30
              dark:bg-ink-900/10
            ">

              <div className="
                flex
                items-center
                gap-4
              ">

                <span className="
                  text-xs
                  text-ink-500
                ">

                  Page {page} of {totalPages}
                  {' '}
                  (Total: {totalRecords})

                </span>


                <select
                  value={limit}
                  onChange={(e) =>
                    setLimit(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="
                    input
                    py-1
                    px-2
                    text-xs
                    bg-white
                    dark:bg-ink-900
                    w-24
                  "
                >

                  <option value={10}>
                    10 / page
                  </option>

                  <option value={50}>
                    50 / page
                  </option>

                  <option value={100}>
                    100 / page
                  </option>

                  <option value={1000}>
                    Show All
                  </option>

                </select>

              </div>


              <div className="
                flex
                gap-2
              ">

                <button
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (p) =>
                        Math.max(
                          1,
                          p - 1
                        )
                    )
                  }
                  className={`
                    btn-secondary
                    py-1.5
                    px-3
                    text-xs
                    flex
                    items-center
                    gap-1

                    ${page <= 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                >

                  <ChevronLeft className="h-3.5 w-3.5" />

                  Previous

                </button>


                <button
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(
                      (p) =>
                        Math.min(
                          totalPages,
                          p + 1
                        )
                    )
                  }
                  className={`
                    btn-secondary
                    py-1.5
                    px-3
                    text-xs
                    flex
                    items-center
                    gap-1

                    ${page >= totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                >

                  Next

                  <ChevronRight className="h-3.5 w-3.5" />

                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}