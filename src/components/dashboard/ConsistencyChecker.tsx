"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import FirmSelector from "./FirmSelector";
import { getFirm } from "@/lib/propfirms";
import { checkConsistency } from "@/lib/calculations";

export default function ConsistencyChecker() {
  const [firmId, setFirmId] = useState("apex");
  const firm = getFirm(firmId);

  const [totalProfit, setTotalProfit] = useState("");
  const [bestDay, setBestDay] = useState("");

  const result = useMemo(() => {
    const total = parseFloat(totalProfit);
    const best = parseFloat(bestDay);
    if (Number.isNaN(total) || Number.isNaN(best) || total <= 0) return null;
    return checkConsistency(total, best, firm.consistencyMaxPercent);
  }, [totalProfit, bestDay, firm.consistencyMaxPercent]);

  const barPercent = result ? Math.min(100, result.percent) : 0;
  const capPercent = firm.consistencyMaxPercent ?? 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-5">
          <FirmSelector value={firmId} onChange={setFirmId} />
          <p className="mt-3 text-xs text-slate-500">
            {firm.consistencyMaxPercent !== null
              ? `${firm.name} caps any single day at ${firm.consistencyMaxPercent}% of total profit.`
              : `${firm.name} has no hard consistency rule.`}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Current Profit ($)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={totalProfit}
              onChange={(e) => setTotalProfit(e.target.value)}
              placeholder="4,200"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Best Single Day Profit ($)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={bestDay}
              onChange={(e) => setBestDay(e.target.value)}
              placeholder="1,760"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div>
        {!result ? (
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
            Enter your total profit and best single day to check your payout
            eligibility.
          </div>
        ) : (
          <div
            className={`rounded-xl border p-6 ${
              result.pass
                ? "border-emerald-700/50 bg-emerald-950/10"
                : "border-red-500 bg-red-950/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.pass ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
              <span
                className={`text-lg font-extrabold tracking-wide ${
                  result.pass ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {result.pass ? "SAFE TO REQUEST PAYOUT" : "WAIT: PAYOUT WILL BE REJECTED"}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Best day share of total profit</span>
                <span className="font-mono font-semibold text-slate-100">
                  {result.percent.toFixed(1)}%{" "}
                  <span className="text-slate-500">
                    (max {capPercent === 100 && firm.consistencyMaxPercent === null ? "—" : `${capPercent}%`})
                  </span>
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.pass ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, barPercent)}%` }}
                />
              </div>
            </div>

            {!result.pass && firm.consistencyMaxPercent !== null && (
              <p className="mt-5 rounded-lg bg-slate-900/60 p-4 text-sm text-slate-300">
                You need{" "}
                <span className="font-mono font-semibold text-red-300">
                  ${result.amountNeeded.toFixed(2)}
                </span>{" "}
                more in total profit (spread across other days) to bring your
                best day under the {firm.consistencyMaxPercent}% cap for{" "}
                {firm.name}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
