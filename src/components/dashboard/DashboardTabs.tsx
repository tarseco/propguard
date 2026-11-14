"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Newspaper, Scale, Calculator } from "lucide-react";
import ConsistencyChecker from "./ConsistencyChecker";
import DrawdownCalculator from "./DrawdownCalculator";

// Live countdown depends on client clock — rendering it on the server would
// always mismatch the client's actual time at hydration.
const NewsBlackoutGuard = dynamic(() => import("./NewsBlackoutGuard"), {
  ssr: false,
});

const TABS = [
  { id: "news", label: "News Blackout Guard", icon: Newspaper },
  { id: "consistency", label: "Consistency & Payout Checker", icon: Scale },
  { id: "drawdown", label: "Trailing Drawdown & Lot Calculator", icon: Calculator },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DashboardTabs() {
  const [active, setActive] = useState<TabId>("news");

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-6">
        {active === "news" && <NewsBlackoutGuard />}
        {active === "consistency" && <ConsistencyChecker />}
        {active === "drawdown" && <DrawdownCalculator />}
      </div>
    </div>
  );
}
