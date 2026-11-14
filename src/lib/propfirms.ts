export interface PropFirm {
  id: string;
  name: string;
  /** Minutes before AND after a red-folder news event that trading is banned */
  newsBlackoutMinutes: number;
  /** Max % of total profit that can come from a single best day. null = no hard rule */
  consistencyMaxPercent: number | null;
  weekendHoldingAllowed: boolean;
  newsTradingAllowed: boolean;
  maxLotNote: string;
  payoutNote: string;
}

export const PROP_FIRMS: PropFirm[] = [
  {
    id: "ftmo",
    name: "FTMO",
    newsBlackoutMinutes: 2,
    consistencyMaxPercent: 50,
    weekendHoldingAllowed: true,
    newsTradingAllowed: false,
    maxLotNote: "No hard lot cap, but risking more than ~2% of account balance per trade flags manual review.",
    payoutNote: "Payouts can be denied if trades are opened/closed inside the 2-minute news window on a Normal or Aggressive account.",
  },
  {
    id: "apex",
    name: "Apex Trader Funding",
    newsBlackoutMinutes: 0,
    consistencyMaxPercent: 30,
    weekendHoldingAllowed: false,
    newsTradingAllowed: true,
    maxLotNote: "Contract scaling is capped by account size tier — exceeding it during the evaluation resets progress.",
    payoutNote: "The single-day profit cap (30% of total) is the #1 reason funded accounts get their first payout rejected.",
  },
  {
    id: "topstep",
    name: "Topstep",
    newsBlackoutMinutes: 0,
    consistencyMaxPercent: 50,
    weekendHoldingAllowed: false,
    newsTradingAllowed: true,
    maxLotNote: "Positions must be flat before the weekend close on the Trading Combine — flatten by Friday's session end.",
    payoutNote: "No single trading day should represent more than ~50% of total gains when requesting a payout.",
  },
  {
    id: "fundednext",
    name: "FundedNext",
    newsBlackoutMinutes: 5,
    consistencyMaxPercent: 40,
    weekendHoldingAllowed: true,
    newsTradingAllowed: false,
    maxLotNote: "Stellar accounts restrict news trading entirely inside the 5-minute window; Evaluation accounts allow it with wider stops.",
    payoutNote: "Profit share requests are held for manual review if one day exceeds 40% of total account profit.",
  },
  {
    id: "the5ers",
    name: "The5ers",
    newsBlackoutMinutes: 0,
    consistencyMaxPercent: null,
    weekendHoldingAllowed: true,
    newsTradingAllowed: true,
    maxLotNote: "No fixed lot cap — risk limits scale with the account's daily and total loss limits instead.",
    payoutNote: "No hard consistency rule, but highly irregular profit distribution can still trigger a manual risk review.",
  },
];

export function getFirm(id: string): PropFirm {
  return PROP_FIRMS.find((f) => f.id === id) ?? PROP_FIRMS[0];
}

export interface NewsEvent {
  id: string;
  label: string;
  timestamp: number;
  custom?: boolean;
}

export function demoNewsEvents(now: number): NewsEvent[] {
  return [
    { id: "cpi", label: "CPI (US Inflation)", timestamp: now + 1000 * 60 * 42 },
    { id: "nfp", label: "NFP (Non-Farm Payrolls)", timestamp: now + 1000 * 60 * 60 * 26 },
    { id: "fomc", label: "FOMC Rate Decision", timestamp: now + 1000 * 60 * 60 * 24 * 6 },
  ];
}
