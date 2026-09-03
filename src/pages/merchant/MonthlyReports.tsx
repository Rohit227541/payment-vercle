import { useEffect, useState } from "react";
import {
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  Receipt,
} from "lucide-react";

import { API_BASE_URL } from "../../config";


// ==========================================================
// Types
// ==========================================================

interface ReportSummary {
  totalTransactions: number;
  totalAmount: number;

  successfulTransactions: number;
  successfulAmount: number;

  failedTransactions: number;
  failedAmount: number;

  pendingTransactions: number;
  pendingAmount: number;

  authorizedTransactions: number;
  authorizedAmount: number;

  cancelledTransactions: number;
  cancelledAmount: number;

  refundedTransactions: number;
  refundedAmount: number;

  partiallyRefundedTransactions: number;
  partiallyRefundedAmount: number;

  chargebackTransactions: number;
  chargebackAmount: number;

  createdTransactions: number;
  createdAmount: number;
}

interface Transaction {
  transaction_id?: number | string;
  transaction_reference?: string;
  order_id?: number | string;

  customer_name?: string;
  customer_email?: string;

  amount?: number | string;
  currency?: string;

  payment_method?: string;
  payment_provider?: string;

  status?: string;

  created_at?: string;

  [key: string]: any;
}

interface MonthlyReport {
  reportType?: string;
  month?: number;
  year?: number;

  summary: ReportSummary;

  dailyBreakdown?: any[];

  transactions: Transaction[];
}


// ==========================================================
// Default Summary
// ==========================================================

const defaultSummary: ReportSummary = {
  totalTransactions: 0,
  totalAmount: 0,

  successfulTransactions: 0,
  successfulAmount: 0,

  failedTransactions: 0,
  failedAmount: 0,

  pendingTransactions: 0,
  pendingAmount: 0,

  authorizedTransactions: 0,
  authorizedAmount: 0,

  cancelledTransactions: 0,
  cancelledAmount: 0,

  refundedTransactions: 0,
  refundedAmount: 0,

  partiallyRefundedTransactions: 0,
  partiallyRefundedAmount: 0,

  chargebackTransactions: 0,
  chargebackAmount: 0,

  createdTransactions: 0,
  createdAmount: 0,
};


// ==========================================================
// Helpers
// ==========================================================

const formatCurrency = (
  value: number | string | undefined,
  currency = "INR"
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};


const formatDate = (
  value?: string
) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


const getStatusClass = (
  status?: string
) => {
  switch (
    String(status || "").toUpperCase()
  ) {
    case "SUCCESS":
    case "COMPLETED":
    case "PROCESSED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "PENDING":
    case "PROCESSING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "AUTHORIZED":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

    case "CREATED":
      return "bg-violet-500/10 text-violet-600 dark:text-violet-400";

    case "FAILED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";

    case "CANCELLED":
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400";

    case "REFUNDED":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

    case "PARTIALLY_REFUNDED":
      return "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400";

    case "CHARGEBACK":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

    default:
      return "bg-ink-500/10 text-ink-600 dark:text-ink-400";
  }
};


const getStatusLabel = (
  status?: string
) => {
  if (!status) return "UNKNOWN";

  return status
    .replaceAll("_", " ")
    .toUpperCase();
};


// ==========================================================
// Summary Card
// ==========================================================

interface SummaryCardProps {
  title: string;
  value: number;
  amount?: number;
  icon: React.ReactNode;
  iconClass: string;
}

function SummaryCard({
  title,
  value,
  amount,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-ink-200/60
        bg-white
        px-5
        py-4
        dark:border-ink-800/60
        dark:bg-ink-900
      "
    >
      <div className="flex items-start justify-between">

        <div>
          <p
            className="
              text-xs
              font-medium
              text-ink-500
              dark:text-ink-400
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-ink-900
              dark:text-white
            "
          >
            {value.toLocaleString("en-IN")}
          </p>

          {amount !== undefined && (
            <p
              className="
                mt-1
                text-xs
                text-ink-500
                dark:text-ink-400
              "
            >
              {formatCurrency(amount)}
            </p>
          )}
        </div>

        <div
          className={`
            grid
            h-9
            w-9
            place-items-center
            rounded-lg
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}


// ==========================================================
// Main Component
// ==========================================================

export default function MonthlyReports() {

  const now = new Date();

  const [month, setMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  );

  const [year, setYear] = useState(
    String(now.getFullYear())
  );

  const [report, setReport] =
    useState<MonthlyReport | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [exporting, setExporting] =
    useState<string | null>(null);


  // ========================================================
  // Token
  // ========================================================

  const getToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };


  // ========================================================
  // Fetch Report
  // ========================================================

  const fetchReport = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/reports/monthly?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          "Unable to fetch monthly report."
        );
      }

      const data =
        result.data || {};

      setReport({
        reportType:
          data.reportType || "MONTHLY",

        month:
          data.month || Number(month),

        year:
          data.year || Number(year),

        summary: {
          ...defaultSummary,
          ...(data.summary || {}),
        },

        dailyBreakdown:
          data.dailyBreakdown || [],

        transactions:
          Array.isArray(data.transactions)
            ? data.transactions
            : [],
      });

    } catch (err) {

      console.log(
        "Monthly Report Error:",
        err
      );

      setReport(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch monthly report."
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================================
  // Export
  // ========================================================

  const handleExport = async (
    format: "CSV" | "EXCEL" | "PDF"
  ) => {

    setExporting(format);

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/reports/monthly/export?month=${month}&year=${year}&format=${format}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${getToken()}`,
            },
          }
        );

      if (!response.ok) {

        let message =
          "Export failed.";

        try {
          const errorData =
            await response.json();

          message =
            errorData?.message ||
            message;

        } catch {
          // Ignore
        }

        throw new Error(message);
      }


      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const extension =
        format === "EXCEL"
          ? "xlsx"
          : format.toLowerCase();

      link.download =
        `monthly-report-${year}-${month}.${extension}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.log(
        "Export Error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Unable to export report."
      );

    } finally {

      setExporting(null);

    }
  };


  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {
    fetchReport();
  }, [month, year]);


  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          Header
      ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-ink-900
              dark:text-white
            "
          >
            Monthly Reports
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-ink-500
              dark:text-ink-400
            "
          >
            View monthly transaction performance
            and export reports.
          </p>

        </div>


        {/* Export */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <button
            onClick={() =>
              handleExport("CSV")
            }
            disabled={
              exporting !== null
            }
            className="
              btn-secondary
              flex
              items-center
              gap-2
              px-3
              py-2
              text-xs
            "
          >
            <Download
              className="h-4 w-4"
            />

            {exporting === "CSV"
              ? "Exporting..."
              : "CSV"}
          </button>


          <button
            onClick={() =>
              handleExport("EXCEL")
            }
            disabled={
              exporting !== null
            }
            className="
              btn-secondary
              flex
              items-center
              gap-2
              px-3
              py-2
              text-xs
            "
          >
            <FileSpreadsheet
              className="h-4 w-4"
            />

            {exporting === "EXCEL"
              ? "Exporting..."
              : "Excel"}
          </button>


          <button
            onClick={() =>
              handleExport("PDF")
            }
            disabled={
              exporting !== null
            }
            className="
              btn-secondary
              flex
              items-center
              gap-2
              px-3
              py-2
              text-xs
            "
          >
            <FileText
              className="h-4 w-4"
            />

            {exporting === "PDF"
              ? "Generating..."
              : "PDF"}
          </button>


          <button
            onClick={fetchReport}
            disabled={loading}
            className="
              btn-secondary
              flex
              items-center
              gap-2
              px-3
              py-2
              text-xs
            "
          >
            <RefreshCw
              className={`
                h-4
                w-4
                ${loading ? "animate-spin" : ""}
              `}
            />

            Refresh
          </button>

        </div>

      </div>


      {/* ====================================================
          Filter
      ==================================================== */}

      <div
        className="
          glass-card
          flex
          flex-col
          gap-4
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              bg-brand-500/10
              text-brand-500
            "
          >
            <CalendarDays
              className="h-4 w-4"
            />
          </div>

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-ink-900
                dark:text-white
              "
            >
              Report Period
            </p>

            <p
              className="
                text-xs
                text-ink-500
                dark:text-ink-400
              "
            >
              Select month and year
            </p>

          </div>

        </div>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
            className="
              input
              min-w-[130px]
              py-2
              text-sm
            "
          >

            {[
              ["01", "January"],
              ["02", "February"],
              ["03", "March"],
              ["04", "April"],
              ["05", "May"],
              ["06", "June"],
              ["07", "July"],
              ["08", "August"],
              ["09", "September"],
              ["10", "October"],
              ["11", "November"],
              ["12", "December"],
            ].map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}

          </select>


          <select
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
            className="
              input
              min-w-[100px]
              py-2
              text-sm
            "
          >

            {Array.from(
              { length: 6 },
              (_, index) => {
                const y =
                  now.getFullYear() -
                  index;

                return (
                  <option
                    key={y}
                    value={y}
                  >
                    {y}
                  </option>
                );
              }
            )}

          </select>

        </div>

      </div>


      {/* ====================================================
          Loading
      ==================================================== */}

      {loading && !report && (

        <div
          className="
            glass-card
            flex
            flex-col
            items-center
            justify-center
            gap-3
            py-16
          "
        >

          <RefreshCw
            className="
              h-7
              w-7
              animate-spin
              text-brand-500
            "
          />

          <p
            className="
              text-sm
              text-ink-500
            "
          >
            Loading monthly report...
          </p>

        </div>

      )}


      {/* ====================================================
          Error
      ==================================================== */}

      {!loading &&
        error && (

          <div
            className="
              glass-card
              mx-auto
              max-w-lg
              p-8
              text-center
            "
          >

            <div
              className="
                mx-auto
                grid
                h-11
                w-11
                place-items-center
                rounded-full
                bg-rose-500/10
                text-rose-500
              "
            >
              <XCircle
                className="h-5 w-5"
              />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-ink-900
                dark:text-white
              "
            >
              Unable to load report
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-ink-500
              "
            >
              {error}
            </p>

            <button
              onClick={fetchReport}
              className="
                btn-primary
                mt-4
                px-4
                py-2
                text-xs
              "
            >
              Try Again
            </button>

          </div>

        )}


      {/* ====================================================
          Report
      ==================================================== */}

      {!error &&
        report && (

          <>

            {/* ==================================================
                Summary Cards
            ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              <SummaryCard
                title="Total Transactions"
                value={
                  report.summary
                    .totalTransactions
                }
                amount={
                  report.summary
                    .totalAmount
                }
                icon={
                  <Receipt
                    className="h-4 w-4"
                  />
                }
                iconClass="
                  bg-brand-500/10
                  text-brand-500
                "
              />


              <SummaryCard
                title="Successful"
                value={
                  report.summary
                    .successfulTransactions
                }
                amount={
                  report.summary
                    .successfulAmount
                }
                icon={
                  <CheckCircle2
                    className="h-4 w-4"
                  />
                }
                iconClass="
                  bg-emerald-500/10
                  text-emerald-500
                "
              />


              <SummaryCard
                title="Pending"
                value={
                  report.summary
                    .pendingTransactions
                }
                amount={
                  report.summary
                    .pendingAmount
                }
                icon={
                  <Clock3
                    className="h-4 w-4"
                  />
                }
                iconClass="
                  bg-amber-500/10
                  text-amber-500
                "
              />


              <SummaryCard
                title="Failed"
                value={
                  report.summary
                    .failedTransactions
                }
                amount={
                  report.summary
                    .failedAmount
                }
                icon={
                  <XCircle
                    className="h-4 w-4"
                  />
                }
                iconClass="
                  bg-rose-500/10
                  text-rose-500
                "
              />

            </div>


            {/* ==================================================
                Secondary Status Summary
            ================================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >

              <div
                className="
                  rounded-xl
                  border
                  border-ink-200/60
                  bg-white
                  px-4
                  py-3
                  dark:border-ink-800/60
                  dark:bg-ink-900
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <ShieldCheck
                    className="
                      h-4
                      w-4
                      text-blue-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-ink-500
                    "
                  >
                    Authorized
                  </span>

                </div>

                <p
                  className="
                    mt-2
                    text-lg
                    font-bold
                    text-ink-900
                    dark:text-white
                  "
                >
                  {
                    report.summary
                      .authorizedTransactions
                  }
                </p>

              </div>


              <div
                className="
                  rounded-xl
                  border
                  border-ink-200/60
                  bg-white
                  px-4
                  py-3
                  dark:border-ink-800/60
                  dark:bg-ink-900
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <XCircle
                    className="
                      h-4
                      w-4
                      text-slate-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-ink-500
                    "
                  >
                    Cancelled
                  </span>

                </div>

                <p
                  className="
                    mt-2
                    text-lg
                    font-bold
                    text-ink-900
                    dark:text-white
                  "
                >
                  {
                    report.summary
                      .cancelledTransactions
                  }
                </p>

              </div>


              <div
                className="
                  rounded-xl
                  border
                  border-ink-200/60
                  bg-white
                  px-4
                  py-3
                  dark:border-ink-800/60
                  dark:bg-ink-900
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <RefreshCw
                    className="
                      h-4
                      w-4
                      text-purple-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-ink-500
                    "
                  >
                    Refunded
                  </span>

                </div>

                <p
                  className="
                    mt-2
                    text-lg
                    font-bold
                    text-ink-900
                    dark:text-white
                  "
                >
                  {
                    report.summary
                      .refundedTransactions
                  }
                </p>

              </div>


              <div
                className="
                  rounded-xl
                  border
                  border-ink-200/60
                  bg-white
                  px-4
                  py-3
                  dark:border-ink-800/60
                  dark:bg-ink-900
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <RefreshCw
                    className="
                      h-4
                      w-4
                      text-fuchsia-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-ink-500
                    "
                  >
                    Partial Refund
                  </span>

                </div>

                <p
                  className="
                    mt-2
                    text-lg
                    font-bold
                    text-ink-900
                    dark:text-white
                  "
                >
                  {
                    report.summary
                      .partiallyRefundedTransactions
                  }
                </p>

              </div>

            </div>


            {/* ==================================================
                Transaction Table
            ================================================== */}

            <div
              className="
                glass-card
                overflow-hidden
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  border-b
                  border-ink-200/60
                  px-5
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  dark:border-ink-800/60
                "
              >

                <div>

                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-ink-900
                      dark:text-white
                    "
                  >
                    Transaction Breakdown
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-ink-500
                    "
                  >
                    All transactions for the
                    selected month
                  </p>

                </div>


                <span
                  className="
                    text-xs
                    text-ink-500
                  "
                >
                  {report.transactions.length}
                  {" "}
                  records
                </span>

              </div>


              {report.transactions.length === 0 ? (

                <div
                  className="
                    py-16
                    text-center
                  "
                >

                  <Receipt
                    className="
                      mx-auto
                      h-8
                      w-8
                      text-ink-400
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-ink-600
                      dark:text-ink-300
                    "
                  >
                    No transactions found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-ink-500
                    "
                  >
                    No transactions exist for
                    the selected month.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table
                    className="
                      w-full
                      min-w-[1000px]
                      text-left
                    "
                  >

                    <thead
                      className="
                        border-b
                        border-ink-200/60
                        bg-ink-50/50
                        dark:border-ink-800/60
                        dark:bg-ink-900/40
                      "
                    >

                      <tr>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Transaction
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Order ID
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Customer
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Amount
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Method
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Status
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-ink-500
                          "
                        >
                          Date
                        </th>

                      </tr>

                    </thead>


                    <tbody
                      className="
                        divide-y
                        divide-ink-200/40
                        dark:divide-ink-800/40
                      "
                    >

                      {report.transactions.map(
                        (
                          transaction,
                          index
                        ) => (

                          <tr
                            key={
                              transaction.transaction_id ||
                              transaction.transaction_reference ||
                              index
                            }
                            className="
                              transition-colors
                              hover:bg-ink-50/50
                              dark:hover:bg-ink-900/30
                            "
                          >

                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <div>

                                <p
                                  className="
                                    font-mono
                                    text-xs
                                    font-medium
                                    text-ink-800
                                    dark:text-ink-200
                                  "
                                >
                                  {
                                    transaction.transaction_reference ||
                                    transaction.transaction_id ||
                                    "—"
                                  }
                                </p>

                                {transaction.transaction_id && (
                                  <p
                                    className="
                                      mt-1
                                      text-[10px]
                                      text-ink-500
                                    "
                                  >
                                    ID #{transaction.transaction_id}
                                  </p>
                                )}

                              </div>

                            </td>


                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <span
                                className="
                                  font-mono
                                  text-xs
                                  text-ink-600
                                  dark:text-ink-300
                                "
                              >
                                {
                                  transaction.order_id ||
                                  "—"
                                }
                              </span>

                            </td>


                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-sm
                                    font-medium
                                    text-ink-800
                                    dark:text-ink-200
                                  "
                                >
                                  {
                                    transaction.customer_name ||
                                    "—"
                                  }
                                </p>

                                {transaction.customer_email && (
                                  <p
                                    className="
                                      mt-1
                                      text-[11px]
                                      text-ink-500
                                    "
                                  >
                                    {
                                      transaction.customer_email
                                    }
                                  </p>
                                )}

                              </div>

                            </td>


                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-ink-900
                                  dark:text-white
                                "
                              >
                                {formatCurrency(
                                  transaction.amount,
                                  transaction.currency ||
                                    "INR"
                                )}
                              </p>

                            </td>


                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <span
                                className="
                                  text-xs
                                  text-ink-600
                                  dark:text-ink-300
                                "
                              >
                                {
                                  transaction.payment_method ||
                                  "—"
                                }
                              </span>

                            </td>


                            <td
                              className="
                                px-5
                                py-4
                              "
                            >

                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-semibold
                                  ${getStatusClass(
                                    transaction.status
                                  )}
                                `}
                              >
                                {
                                  getStatusLabel(
                                    transaction.status
                                  )
                                }
                              </span>

                            </td>


                            <td
                              className="
                                whitespace-nowrap
                                px-5
                                py-4
                                text-xs
                                text-ink-500
                                dark:text-ink-400
                              "
                            >
                              {
                                formatDate(
                                  transaction.created_at
                                )
                              }
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>

        )}

    </div>
  );
}