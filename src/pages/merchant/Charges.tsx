import { useState, useEffect, useMemo } from "react";

import {
  RefreshCw,
  AlertCircle,
  Search,
  Inbox,
} from "lucide-react";

import api from "../../services/api";


// ==========================================================
// Types
// ==========================================================

interface ChargeRule {

  feeId: number;

  merchantId?: number;

  paymentMethod: string;

  feeType: string;

  fixedFee: number | null;

  percentageFee: number | null;

  feeValue: number | null;

  minAmount: number | null;

  maxAmount: number | null;

  minimumFee: number | null;

  maximumFee: number | null;

  gstPercentage: number | null;

  effectiveFrom?: string;

  effectiveTo?: string | null;

  status: string;

  remarks: string | null;

  createdAt: string;

  updatedAt: string;

  slabs?: FeeSlab[];

}


interface FeeSlab {

  slabId: number;

  feeId: number;

  minAmount: number;

  maxAmount: number | null;

  feeType: string;

  fixedFee: number;

  percentageFee: number;

  minFee: number | null;

  maxFee: number | null;

}


// ==========================================================
// Component
// ==========================================================

export default function MerchantCharges() {

  const [data, setData] =
    useState<ChargeRule[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] =
    useState<string>("");


  // ========================================================
  // GET MERCHANT FEES
  // ========================================================

  const loadCharges = async () => {

    setLoading(true);

    setError(false);

    try {

      const response = await api.get(
        "/merchant/fees"
      );

      console.log(
        "MERCHANT FEES API RESPONSE:",
        response.data
      );


      const result =
        response.data;


      // ====================================================
      // Handle different backend response shapes
      // ====================================================

      const fees =
        result?.data?.fees ??
        result?.data ??
        result?.fees ??
        [];


      if (Array.isArray(fees)) {

        setData(
          fees.map((fee: any) => ({

            feeId:
              Number(
                fee.feeId ??
                fee.fee_id ??
                0
              ),

            merchantId:
              fee.merchantId ??
              fee.merchant_id,

            paymentMethod:
              fee.paymentMethod ??
              fee.payment_method ??
              "N/A",

            feeType:
              fee.feeType ??
              fee.fee_type ??
              "N/A",

            fixedFee:
              fee.fixedFee !== undefined
                ? Number(fee.fixedFee)
                : fee.fixed_fee !== undefined
                ? Number(fee.fixed_fee)
                : null,

            percentageFee:
              fee.percentageFee !== undefined
                ? Number(fee.percentageFee)
                : fee.percentage_fee !== undefined
                ? Number(fee.percentage_fee)
                : null,

            /*
             * Some APIs return one generic feeValue.
             * Keep it as fallback.
             */

            feeValue:
              fee.feeValue !== undefined
                ? Number(fee.feeValue)
                : fee.fee_value !== undefined
                ? Number(fee.fee_value)
                : null,

            minAmount:
              fee.minAmount !== undefined
                ? Number(fee.minAmount)
                : fee.min_amount !== undefined
                ? Number(fee.min_amount)
                : null,

            maxAmount:
              fee.maxAmount !== undefined
                ? Number(fee.maxAmount)
                : fee.max_amount !== undefined
                ? Number(fee.max_amount)
                : null,

            minimumFee:
              fee.minimumFee !== undefined
                ? Number(fee.minimumFee)
                : fee.min_fee !== undefined
                ? Number(fee.min_fee)
                : null,

            maximumFee:
              fee.maximumFee !== undefined
                ? Number(fee.maximumFee)
                : fee.max_fee !== undefined
                ? Number(fee.max_fee)
                : null,

            gstPercentage:
              fee.gstPercentage !== undefined
                ? Number(fee.gstPercentage)
                : fee.gst_percentage !== undefined
                ? Number(fee.gst_percentage)
                : null,

            effectiveFrom:
              fee.effectiveFrom ??
              fee.effective_from,

            effectiveTo:
              fee.effectiveTo ??
              fee.effective_to ??
              null,

            status:
              fee.status ??
              "INACTIVE",

            remarks:
              fee.remarks ??
              null,

            createdAt:
              fee.createdAt ??
              fee.created_at ??
              "",

            updatedAt:
              fee.updatedAt ??
              fee.updated_at ??
              "",

            slabs:
              Array.isArray(
                fee.slabs
              )
                ? fee.slabs.map(
                    (slab: any) => ({

                      slabId:
                        Number(
                          slab.slabId ??
                          slab.slab_id ??
                          0
                        ),

                      feeId:
                        Number(
                          slab.feeId ??
                          slab.fee_id ??
                          fee.feeId ??
                          fee.fee_id ??
                          0
                        ),

                      minAmount:
                        Number(
                          slab.minAmount ??
                          slab.min_amount ??
                          0
                        ),

                      maxAmount:
                        slab.maxAmount !== null &&
                        slab.maxAmount !== undefined
                          ? Number(
                              slab.maxAmount ??
                              slab.max_amount
                            )
                          : null,

                      feeType:
                        slab.feeType ??
                        slab.fee_type ??
                        "N/A",

                      fixedFee:
                        Number(
                          slab.fixedFee ??
                          slab.fixed_fee ??
                          0
                        ),

                      percentageFee:
                        Number(
                          slab.percentageFee ??
                          slab.percentage_fee ??
                          0
                        ),

                      minFee:
                        slab.minFee !== null &&
                        slab.minFee !== undefined
                          ? Number(
                              slab.minFee ??
                              slab.min_fee
                            )
                          : null,

                      maxFee:
                        slab.maxFee !== null &&
                        slab.maxFee !== undefined
                          ? Number(
                              slab.maxFee ??
                              slab.max_fee
                            )
                          : null,

                    })
                  )
                : [],

          }))
        );

      } else {

        setData([]);

      }

    } catch (err) {

      console.error(
        "Merchant Fees API Error:",
        err
      );

      setError(true);

      setData([]);

    } finally {

      setLoading(false);

    }

  };


  // ========================================================
  // Initial API Call
  // ========================================================

  useEffect(() => {

    loadCharges();

  }, []);


  // ========================================================
  // Search
  // ========================================================

  const filteredData =
    useMemo(() => {

      const query =
        searchQuery
          .trim()
          .toLowerCase();


      if (!query) {

        return data;

      }


      return data.filter(
        (fee) => {

          return [

            fee.feeId,

            fee.paymentMethod,

            fee.feeType,

            fee.status,

            fee.remarks,

            fee.fixedFee,

            fee.percentageFee,

            fee.minAmount,

            fee.maxAmount,

            fee.minimumFee,

            fee.maximumFee,

            fee.gstPercentage,

          ]
            .filter(
              (value) =>
                value !== null &&
                value !== undefined
            )
            .join(" ")
            .toLowerCase()
            .includes(query);

        }
      );

    }, [
      data,
      searchQuery,
    ]);


  // ========================================================
  // Currency Formatter
  // ========================================================

  const money = (
    value: number | null
  ) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "N/A";

    }


    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value);

  };


  // ========================================================
  // Percentage Formatter
  // ========================================================

  const percentage = (
    value: number | null
  ) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "N/A";

    }

    return `${value}%`;

  };


  // ========================================================
  // Date Formatter
  // ========================================================

  const formatDate = (
    value?: string
  ) => {

    if (!value) {

      return "N/A";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "N/A";

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ========================================================
  // Render
  // ========================================================

  return (

    <div className="space-y-6">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
            Transaction Charges
          </h1>

          <p className="text-sm text-ink-500 dark:text-ink-400">
            View pricing schedules, platform fees, slabs and tax configurations
          </p>

        </div>


        <button

          onClick={loadCharges}

          className="btn-secondary flex items-center gap-2 py-2 px-3 text-xs self-start sm:self-center"

        >

          <RefreshCw
            className={`h-3.5 w-3.5 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh Charges

        </button>

      </div>


      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (

        <div className="flex flex-col items-center justify-center py-20 space-y-4">

          <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />

          <p className="text-sm text-ink-500 dark:text-ink-400">
            Loading fee schedule...
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
            Connection Error
          </h3>

          <p className="text-xs text-ink-500 dark:text-ink-400">
            Failed to fetch merchant fee configuration.
            Check the API and try again.
          </p>

          <button

            onClick={loadCharges}

            className="btn-primary py-2 px-4 text-xs font-semibold mx-auto"

          >

            Retry Connection

          </button>

        </div>

      )}


      {/* ==================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        data.length === 0 && (

          <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400">

              <Inbox className="h-8 w-8" />

            </div>

            <h3 className="font-semibold text-ink-900 dark:text-white">
              No Charge Setup
            </h3>

            <p className="text-xs text-ink-500 dark:text-ink-400">
              No fee rules have been configured for this merchant account.
            </p>

          </div>

        )}


      {/* ==================================================
          DATA
      ================================================== */}

      {!loading &&
        !error &&
        data.length > 0 && (

          <>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200/60 dark:border-ink-800/60">

              <div className="relative w-full sm:w-96">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />

                <input

                  type="text"

                  placeholder="Search payment method, fee type, status..."

                  value={searchQuery}

                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }

                  className="input pl-10 py-2 text-sm w-full focus:ring-brand-500/20"

                />

              </div>


              <div className="text-xs text-ink-400">

                Showing{" "}

                <span className="font-semibold text-ink-700 dark:text-white">
                  {filteredData.length}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-ink-700 dark:text-white">
                  {data.length}
                </span>

                {" "}fee rules

              </div>

            </div>


            {/* ==================================================
                CHARGES TABLE
            ================================================== */}

            <div className="glass-card overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1500px] text-left text-sm">

                  <thead className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/40 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">

                    <tr>

                      <th className="px-5 py-4 font-medium">
                        Fee ID
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Payment Method
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Fee Type
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Fixed Fee
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Percentage
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Min Amount
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Max Amount
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Min Fee
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Max Fee
                      </th>

                      <th className="px-5 py-4 font-medium">
                        GST
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Effective From
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Last Updated
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">

                    {filteredData.map(
                      (fee) => (

                        <tr

                          key={fee.feeId}

                          className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40"

                        >

                          {/* Fee ID */}

                          <td className="px-5 py-4 font-mono text-xs text-ink-600 dark:text-ink-300">

                            #{fee.feeId}

                          </td>


                          {/* Payment Method */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3 py-1.5 text-xs font-bold">

                              {fee.paymentMethod}

                            </span>

                          </td>


                          {/* Fee Type */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-ink-900 dark:text-white">

                              {fee.feeType}

                            </span>

                          </td>


                          {/* Fixed Fee */}

                          <td className="px-5 py-4 font-mono text-xs">

                            {money(
                              fee.fixedFee
                            )}

                          </td>


                          {/* Percentage */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-blue-500">

                              {percentage(
                                fee.percentageFee ??
                                fee.feeValue
                              )}

                            </span>

                          </td>


                          {/* Min Amount */}

                          <td className="px-5 py-4 font-mono text-xs">

                            {money(
                              fee.minAmount
                            )}

                          </td>


                          {/* Max Amount */}

                          <td className="px-5 py-4 font-mono text-xs">

                            {money(
                              fee.maxAmount
                            )}

                          </td>


                          {/* Minimum Fee */}

                          <td className="px-5 py-4 font-mono text-xs text-amber-500">

                            {money(
                              fee.minimumFee
                            )}

                          </td>


                          {/* Maximum Fee */}

                          <td className="px-5 py-4 font-mono text-xs text-orange-500">

                            {money(
                              fee.maximumFee
                            )}

                          </td>


                          {/* GST */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-purple-500">

                              {percentage(
                                fee.gstPercentage
                              )}

                            </span>

                          </td>


                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold

                                ${
                                  fee.status ===
                                  "ACTIVE"

                                    ? "bg-emerald-500/10 text-emerald-600"

                                    : "bg-ink-100 dark:bg-ink-800 text-ink-500"
                                }
                              `}
                            >

                              {fee.status}

                            </span>

                          </td>


                          {/* Effective From */}

                          <td className="px-5 py-4 text-xs text-ink-500">

                            {formatDate(
                              fee.effectiveFrom
                            )}

                          </td>


                          {/* Updated */}

                          <td className="px-5 py-4 text-xs text-ink-500">

                            {formatDate(
                              fee.updatedAt
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* ==================================================
                  SLABS
              ================================================== */}

              {filteredData.some(
                (fee) =>
                  fee.slabs &&
                  fee.slabs.length > 0
              ) && (

                <div className="border-t border-ink-200/60 dark:border-ink-800/60 p-5">

                  <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-4">

                    Fee Slabs

                  </h3>


                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px] text-left text-sm">

                      <thead className="bg-ink-50/50 dark:bg-ink-900/40">

                        <tr>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Fee ID
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Min Amount
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Max Amount
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Fee Type
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Fixed Fee
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Percentage
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Min Fee
                          </th>

                          <th className="px-4 py-3 text-xs uppercase text-ink-500">
                            Max Fee
                          </th>

                        </tr>

                      </thead>


                      <tbody className="divide-y divide-ink-200/40 dark:divide-ink-800/40">

                        {filteredData.flatMap(
                          (fee) =>
                            (fee.slabs || []).map(
                              (slab) => (

                                <tr
                                  key={slab.slabId}
                                  className="hover:bg-ink-50/50 dark:hover:bg-ink-900/40"
                                >

                                  <td className="px-4 py-3 font-mono text-xs">
                                    #{fee.feeId}
                                  </td>

                                  <td className="px-4 py-3 font-mono text-xs">
                                    {money(
                                      slab.minAmount
                                    )}
                                  </td>

                                  <td className="px-4 py-3 font-mono text-xs">
                                    {slab.maxAmount === null
                                      ? "No Limit"
                                      : money(
                                          slab.maxAmount
                                        )}
                                  </td>

                                  <td className="px-4 py-3 font-semibold">
                                    {slab.feeType}
                                  </td>

                                  <td className="px-4 py-3">
                                    {money(
                                      slab.fixedFee
                                    )}
                                  </td>

                                  <td className="px-4 py-3 text-blue-500 font-semibold">
                                    {percentage(
                                      slab.percentageFee
                                    )}
                                  </td>

                                  <td className="px-4 py-3 text-amber-500">
                                    {money(
                                      slab.minFee
                                    )}
                                  </td>

                                  <td className="px-4 py-3 text-orange-500">
                                    {money(
                                      slab.maxFee
                                    )}
                                  </td>

                                </tr>

                              )
                            )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}


              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/10">

                <span className="text-xs text-ink-500">

                  {filteredData.length} fee configuration
                  {filteredData.length !== 1
                    ? "s"
                    : ""}

                </span>

                <span className="text-xs text-ink-400">

                  Merchant fee configuration

                </span>

              </div>

            </div>

          </>

        )}

    </div>

  );

}