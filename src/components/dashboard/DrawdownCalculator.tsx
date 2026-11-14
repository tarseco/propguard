"use client";

import { useMemo, useState } from "react";
import { AlertOctagon, ShieldCheck } from "lucide-react";
import { calculateDrawdown } from "@/lib/calculations";

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DrawdownCalculator() {
  const [accountSize, setAccountSize] = useState("50000");
  const [currentBalance, setCurrentBalance] = useState("51800");
  const [peakBalance, setPeakBalance] = useState("52400");
  const [drawdownLimit, setDrawdownLimit] = useState("2000");
  const [stopLossUnits, setStopLossUnits] = useState("25");
  const [valuePerUnit, setValuePerUnit] = useState("10");

  const result = useMemo(() => {
    const current = parseFloat(currentBalance);
    const peak = parseFloat(peakBalance);
    const limit = parseFloat(drawdownLimit);
    const sl = parseFloat(stopLossUnits);
    const value = parseFloat(valuePerUnit);
    if ([current, peak, limit, sl, value].some((n) => Number.isNaN(n))) return null;
    return calculateDrawdown(current, peak, limit, sl, value);
  }, [currentBalance, peakBalance, drawdownLimit, stopLossUnits, valuePerUnit]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-xl border border-slate-800 bg-[#0b0f14] p-5">
        <NumberField
          label="Starting Account Size ($)"
          value={accountSize}
          onChange={setAccountSize}
          placeholder="50,000"
        />
        <NumberField
          label="Current Balance / Equity ($)"
          value={currentBalance}
          onChange={setCurrentBalance}
          placeholder="51,800"
        />
        <NumberField
          label="Peak Balance / High Water Mark ($)"
          value={peakBalance}
          onChange={setPeakBalance}
          placeholder="52,400"
        />
        <NumberField
          label="Trailing Drawdown Limit ($)"
          value={drawdownLimit}
          onChange={setDrawdownLimit}
          placeholder="2,000"
        />
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Stop Loss"
            value={stopLossUnits}
            onChange={setStopLossUnits}
            placeholder="25"
            suffix="pips/ticks"
          />
          <NumberField
            label="Value / Unit / Lot"
            value={valuePerUnit}
            onChange={setValuePerUnit}
            placeholder="10"
            suffix="$"
          />
        </div>
        <p className="text-xs text-slate-500">
          For forex, 1 pip on a standard lot is usually $10. For futures, use
          the contract&apos;s tick value.
        </p>
      </div>

      <div>
        {!result ? (
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
            Fill in every field to see your drawdown floor and max safe lot
            size.
          </div>
        ) : (
          <div
            className={`space-y-6 rounded-xl border p-6 ${
              result.alreadyBreached
                ? "border-red-500 bg-red-950/30"
                : "border-emerald-700/50 bg-emerald-950/10"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.alreadyBreached ? (
                <AlertOctagon className="h-6 w-6 text-red-400" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              )}
              <span
                className={`text-lg font-extrabold tracking-wide ${
                  result.alreadyBreached ? "text-red-400" : "text-slate-100"
                }`}
              >
                {result.alreadyBreached
                  ? "DRAWDOWN FLOOR BREACHED"
                  : "ACCOUNT INSIDE SAFE ZONE"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Stat
                label="Trailing drawdown floor"
                value={`$${result.floor.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
              />
              <Stat
                label="Dollars until you blow the account"
                value={`$${Math.max(0, result.dollarsToBreach).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
                danger={result.dollarsToBreach < 500}
              />
            </div>

            <div className="rounded-lg bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Max safe position size
              </p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-emerald-400">
                {result.alreadyBreached ? "0.00" : result.maxSafeLots.toFixed(2)}{" "}
                <span className="text-base text-slate-400">lots / contracts</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Based on your stop loss hitting without moving the floor.
                Leave a buffer — don&apos;t size to the exact limit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={`mt-1 font-mono text-xl font-bold ${
          danger ? "text-red-400" : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
