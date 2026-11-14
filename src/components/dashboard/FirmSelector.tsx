"use client";

import { PROP_FIRMS } from "@/lib/propfirms";

export default function FirmSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
        Prop Firm
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-100 outline-none focus:border-emerald-500"
      >
        {PROP_FIRMS.map((firm) => (
          <option key={firm.id} value={firm.id}>
            {firm.name}
          </option>
        ))}
      </select>
    </div>
  );
}
