import { useState, useEffect } from "react";

import {
  RefreshCw,
  AlertCircle,
  Inbox,
  Calendar,
  Download,
  FileText,
  PieChart,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  FileSpreadsheet,
} from "lucide-react";

import api from "../../services/api";


// ==========================================================
// Types
// ==========================================================

interface ReportSummary {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  cancelledTransactions: number;
  refundedTransactions: number;
  partiallyRefundedTransactions: number;
  chargebackTransactions: number;

  totalAmount: number;
  successfulAmount: number;
  pendingAmount: number;
}


interface Transaction {
  transaction_id: string | number;

  transaction_ref?: string;

  order_id?: string | number;

  gateway_order_id?: string;

  gateway_payment_id?: string;

  gateway_reference?: string;

  customer_name?: string;

  customer_email?: string;

  customer_phone?: string;

  amount: string | number;

  currency?: string;

  payment_method?: string;

  gateway_name?: string;

  payment_type?: string;

  status: string;

  completion_source?: string;

  settlement_status?: string;

  settled_at?: string;

  failure_code?: string;

  failure_message?: string;

  attempt_count?: number;

  created_at: string;

  completed_at?: string;

  updated_at?: string;

  [key: string]: any;
}


interface ReportData {
  reportType: "DAILY";

  date?: string;

  summary: ReportSummary;

  transactions: Transaction[];
}


// ==========================================================
// Export Format
// ==========================================================

type ExportFormat =
  | "CSV"
  | "EXCEL"
  | "PDF";


// ==========================================================
// Component
// ==========================================================

export default function MerchantDailyReports() {

  const [dailyDate, setDailyDate] =
    useState<string>(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  const [data, setData] =
    useState<ReportData | null>(null);


  const [loading, setLoading] =
    useState<boolean>(false);


  const [error, setError] =
    useState<boolean>(false);


  const [exporting, setExporting] =
    useState<ExportFormat | null>(null);


  // ========================================================
  // Load Daily Report
  // ========================================================

  const loadReports = async () => {

    setLoading(true);

    setError(false);

    try {

      const response =
        await api.get(
          "/merchant/reports/daily",
          {
            params: {
              date: dailyDate,
            },
          }
        );


      console.log(
        "DAILY REPORT RESPONSE:",
        response.data
      );


      if (
        response.data?.success
      ) {

        setData(
          response.data.data
        );

      } else {

        throw new Error(
          response.data?.message ||
          "Failed to fetch daily report."
        );

      }

    } catch (err) {

      console.error(
        "Fetch Daily Reports Error:",
        err
      );

      setError(true);

      setData(null);

    } finally {

      setLoading(false);

    }

  };


  // ========================================================
  // Export Report
  // ========================================================

  const handleExport = async (
    format: ExportFormat
  ) => {

    setExporting(format);

    try {

      const response =
        await api.get(
          "/merchant/reports/daily/export",
          {
            params: {
              date: dailyDate,
              format,
            },

            /*
             * Backend generates the file.
             * Frontend only receives the file.
             */
            responseType: "blob",
          }
        );


      console.log(
        "REPORT EXPORT RESPONSE:",
        response
      );


      // ====================================================
      // File Type
      // ====================================================

      let contentType =
        "application/octet-stream";

      let extension =
        "csv";


      if (format === "PDF") {

        contentType =
          "application/pdf";

        extension =
          "pdf";

      }


      if (format === "EXCEL") {

        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        extension =
          "xlsx";

      }


      if (format === "CSV") {

        contentType =
          "text/csv";

        extension =
          "csv";

      }


      // ====================================================
      // Create Blob
      // ====================================================

      const blob =
        new Blob(
          [response.data],
          {
            type: contentType,
          }
        );


      // ====================================================
      // Browser Download
      // ====================================================

      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        downloadUrl;


      link.download =
        `daily-transaction-report-${dailyDate}.${extension}`;


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      window.URL.revokeObjectURL(
        downloadUrl
      );


    } catch (err: any) {

      console.error(
        `${format} export error:`,
        err
      );


      /*
       * Since responseType is blob,
       * backend JSON errors also arrive
       * as Blob.
       */

      try {

        if (
          err?.response?.data instanceof Blob
        ) {

          const text =
            await err.response.data.text();


          const errorData =
            JSON.parse(text);


          alert(
            errorData?.message ||
            `Failed to export ${format} report.`
          );

        } else {

          alert(
            `Failed to export ${format} report.`
          );

        }

      } catch {

        alert(
          `Failed to export ${format} report.`
        );

      }

    } finally {

      setExporting(null);

    }

  };


  // ========================================================
  // Load On Date Change
  // ========================================================

  useEffect(() => {

    loadReports();

  }, [dailyDate]);


  // ========================================================
  // Summary Card
  // ========================================================

  const SummaryCard = ({
    title,
    value,
    icon,
    className = "",
  }: {
    title: string;

    value: string | number;

    icon: React.ReactNode;

    className?: string;
  }) => (

    <div
      className={`
        p-4
        rounded-xl
        border
        border-ink-200/60
        dark:border-ink-800/60
        bg-white
        dark:bg-ink-900
        ${className}
      `}
    >

      <div className="flex items-center gap-3 mb-2">

        <div className="p-2 rounded-lg bg-ink-50 dark:bg-ink-800">

          {icon}

        </div>

        <h4 className="text-sm font-medium text-ink-500 dark:text-ink-400">

          {title}

        </h4>

      </div>


      <div className="text-2xl font-bold text-ink-900 dark:text-white">

        {value}

      </div>

    </div>

  );


  // ========================================================
  // Money Formatter
  // ========================================================

  const formatMoney = (
    value: number | string | null | undefined
  ) => {

    const amount =
      Number(value || 0);


    return `₹${amount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  };


  // ========================================================
  // Status Style
  // ========================================================

  const getStatusClass = (
    status: string
  ) => {

    switch (
      status?.toUpperCase()
    ) {

      case "SUCCESS":

        return "bg-emerald-500/10 text-emerald-600";


      case "PENDING":

        return "bg-amber-500/10 text-amber-600";


      case "CREATED":

        return "bg-blue-500/10 text-blue-600";


      case "AUTHORIZED":

        return "bg-purple-500/10 text-purple-600";


      case "CANCELLED":

        return "bg-orange-500/10 text-orange-600";


      case "REFUNDED":

        return "bg-indigo-500/10 text-indigo-600";


      case "CHARGEBACK":

        return "bg-pink-500/10 text-pink-600";


      case "FAILED":

      default:

        return "bg-rose-500/10 text-rose-600";

    }

  };


  // ========================================================
  // Render
  // ========================================================

  return (

    <div className="space-y-6">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>

          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">

            Daily Report

          </h1>


          <p className="text-sm text-ink-500 dark:text-ink-400">

            View and export your daily transaction report

          </p>

        </div>


        {/* ==================================================
            EXPORT BUTTONS
        ================================================== */}

        <div className="flex flex-wrap gap-2">

          {/* CSV */}

          <button

            onClick={() =>
              handleExport("CSV")
            }

            disabled={
              exporting !== null
            }

            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"

          >

            {exporting === "CSV" ? (

              <RefreshCw
                className="h-3.5 w-3.5 animate-spin"
              />

            ) : (

              <Download
                className="h-3.5 w-3.5"
              />

            )}

            CSV

          </button>


          {/* EXCEL */}

          <button

            onClick={() =>
              handleExport("EXCEL")
            }

            disabled={
              exporting !== null
            }

            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"

          >

            {exporting === "EXCEL" ? (

              <RefreshCw
                className="h-3.5 w-3.5 animate-spin"
              />

            ) : (

              <FileSpreadsheet
                className="h-3.5 w-3.5"
              />

            )}

            Excel

          </button>


          {/* PDF */}

          <button

            onClick={() =>
              handleExport("PDF")
            }

            disabled={
              exporting !== null
            }

            className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs"

          >

            {exporting === "PDF" ? (

              <RefreshCw
                className="h-3.5 w-3.5 animate-spin"
              />

            ) : (

              <FileText
                className="h-3.5 w-3.5"
              />

            )}

            PDF

          </button>


          {/* REFRESH */}

          <button

            onClick={loadReports}

            disabled={loading}

            className="btn-primary flex items-center gap-2 py-2 px-3 text-xs"

          >

            <RefreshCw
              className={`
                h-3.5
                w-3.5
                ${
                  loading
                    ? "animate-spin"
                    : ""
                }
              `}
            />

            Refresh

          </button>

        </div>

      </div>


      {/* ==================================================
          DATE FILTER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">

        <div className="flex items-center gap-3">

          <Calendar
            className="h-4 w-4 text-ink-400"
          />

          <div>

            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">

              Report Date

            </label>


            <input

              type="date"

              value={dailyDate}

              onChange={(e) =>
                setDailyDate(
                  e.target.value
                )
              }

              className="input py-1.5 px-3 text-sm"

            />

          </div>

        </div>


        <div className="text-xs text-ink-400">

          Selected:

          <span className="font-semibold text-ink-700 dark:text-white ml-1">

            {dailyDate}

          </span>

        </div>

      </div>


      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && !data && (

        <div className="flex flex-col items-center justify-center py-20 space-y-4">

          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />

          <p className="text-sm text-ink-500">

            Generating daily report...

          </p>

        </div>

      )}


      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading && error && (

        <div className="glass-card p-6 border border-rose-500/20 bg-rose-500/5 text-center max-w-xl mx-auto space-y-4">

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-500/10 text-rose-500">

            <AlertCircle className="h-6 w-6" />

          </div>


          <h3 className="font-semibold text-ink-900 dark:text-white">

            Failed to Load Report

          </h3>


          <p className="text-xs text-ink-500 dark:text-ink-400">

            Unable to fetch report data.
            Please try again.

          </p>


          <button

            onClick={loadReports}

            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"

          >

            Retry Connection

          </button>

        </div>

      )}


      {/* ==================================================
          REPORT
      ================================================== */}

      {!loading &&
        !error &&
        data && (

          <div className="space-y-6">


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


              <SummaryCard

                title="Total Volume"

                value={formatMoney(
                  data.summary.totalAmount
                )}

                icon={
                  <PieChart className="h-5 w-5 text-brand-500" />
                }

                className="border-brand-500/20"

              />


              <SummaryCard

                title="Total Transactions"

                value={
                  data.summary.totalTransactions ||
                  0
                }

                icon={
                  <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                }

              />


              <SummaryCard

                title="Successful"

                value={
                  data.summary.successfulTransactions ||
                  0
                }

                icon={
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                }

              />


              <SummaryCard

                title="Failed"

                value={
                  data.summary.failedTransactions ||
                  0
                }

                icon={
                  <XCircle className="h-5 w-5 text-rose-500" />
                }

              />

            </div>


            {/* ==================================================
                SECOND SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


              <SummaryCard

                title="Successful Volume"

                value={formatMoney(
                  data.summary.successfulAmount
                )}

                icon={
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                }

              />


              <SummaryCard

                title="Pending Volume"

                value={formatMoney(
                  data.summary.pendingAmount
                )}

                icon={
                  <Clock className="h-4 w-4 text-amber-500" />
                }

              />


              <SummaryCard

                title="Cancelled"

                value={
                  data.summary.cancelledTransactions ||
                  0
                }

                icon={
                  <XCircle className="h-4 w-4 text-orange-500" />
                }

              />


              <SummaryCard

                title="Refunds & Chargebacks"

                value={
                  (data.summary.refundedTransactions || 0) +
                  (data.summary.partiallyRefundedTransactions || 0) +
                  (data.summary.chargebackTransactions || 0)
                }

                icon={
                  <RefreshCw className="h-4 w-4 text-purple-500" />
                }

              />

            </div>


            {/* ==================================================
                TRANSACTION BREAKDOWN
            ================================================== */}

            <div className="glass-card overflow-hidden">


              <div className="p-5 border-b border-ink-200/60 dark:border-ink-800/60">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>

                    <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white flex items-center gap-2">

                      <FileText className="h-4 w-4 text-ink-400" />

                      Transaction Breakdown

                    </h3>


                    <p className="text-xs text-ink-400 mt-1">

                      Transactions for {dailyDate}

                    </p>

                  </div>


                  <div className="text-xs text-ink-400">

                    {data.transactions?.length || 0}
                    {" "}transactions

                  </div>

                </div>

              </div>


              {data.transactions &&
              data.transactions.length > 0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1100px] text-left text-sm">

                    <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">

                      <tr>

                        <th className="px-5 py-3 font-medium">
                          Txn ID
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Reference
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Order ID
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Customer
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Payment Method
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Type
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Status
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Amount
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Date
                        </th>

                      </tr>

                    </thead>


                    <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">

                      {data.transactions.map(
                        (txn, idx) => (

                          <tr

                            key={
                              txn.transaction_id ||
                              idx
                            }

                            className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40"

                          >


                            {/* Txn ID */}

                            <td className="px-5 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">

                              {txn.transaction_id ||
                                "N/A"}

                            </td>


                            {/* Reference */}

                            <td className="px-5 py-3.5 font-mono text-xs">

                              {txn.transaction_ref ||
                                "N/A"}

                            </td>


                            {/* Order */}

                            <td className="px-5 py-3.5 font-mono text-xs">

                              {txn.order_id ||
                                "N/A"}

                            </td>


                            {/* Customer */}

                            <td className="px-5 py-3.5">

                              <div className="max-w-[180px]">

                                <div className="font-medium text-ink-900 dark:text-white truncate">

                                  {txn.customer_name ||
                                    "N/A"}

                                </div>


                                {txn.customer_email && (

                                  <div className="text-[11px] text-ink-400 truncate">

                                    {txn.customer_email}

                                  </div>

                                )}

                              </div>

                            </td>


                            {/* Payment Method */}

                            <td className="px-5 py-3.5">

                              {txn.payment_method ||
                                "N/A"}

                            </td>


                            {/* Payment Type */}

                            <td className="px-5 py-3.5">

                              {txn.payment_type ||
                                "N/A"}

                            </td>


                            {/* Status */}

                            <td className="px-5 py-3.5">

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${getStatusClass(
                                    txn.status
                                  )}
                                `}
                              >

                                {txn.status ||
                                  "UNKNOWN"}

                              </span>

                            </td>


                            {/* Amount */}

                            <td className="px-5 py-3.5 font-semibold whitespace-nowrap">

                              {formatMoney(
                                txn.amount
                              )}

                            </td>


                            {/* Date */}

                            <td className="px-5 py-3.5 text-ink-500 text-xs whitespace-nowrap">

                              {txn.created_at
                                ? new Date(
                                    txn.created_at
                                  ).toLocaleString(
                                    "en-IN"
                                  )
                                : "N/A"}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="p-12 text-center">

                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400 mb-3">

                    <Inbox className="h-6 w-6" />

                  </div>


                  <h4 className="text-sm font-medium text-ink-900 dark:text-white">

                    No Transactions

                  </h4>


                  <p className="text-xs text-ink-500 mt-1">

                    No transactions found for the selected date.

                  </p>

                </div>

              )}

            </div>

          </div>

        )}

    </div>

  );

}