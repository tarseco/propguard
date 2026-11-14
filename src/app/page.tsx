"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  TimerReset,
  Scale,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import LifetimeAccessModal from "@/components/LifetimeAccessModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#05070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
            <span className="text-base font-bold tracking-tight text-slate-50 sm:text-lg">
              PropGuard
            </span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="whitespace-nowrap rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300 sm:px-4 sm:py-2 sm:text-sm"
            >
              Launch App
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="whitespace-nowrap rounded-md bg-emerald-500 px-2.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 sm:px-4 sm:py-2 sm:text-sm"
            >
              Get Lifetime Access
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-grid relative overflow-hidden border-b border-slate-800/80">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-4 py-1.5 text-xs font-medium text-red-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              92% of blown payouts come from a rule violation, not a bad trade
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-5xl">
              Don&apos;t Let a Stupid Rule Violation Cost You a{" "}
              <span className="text-emerald-400">$5,000 Payout</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
              Instant news blackout timers, a trailing drawdown calculator,
              and a consistency rule checker — tailored for FTMO, Apex,
              Topstep, and FundedNext.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Launch App / Try Free <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
              >
                Get Lifetime Access — $29
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              No card required to try the dashboard. Works on mobile.
            </p>
          </div>
        </section>

        {/* Pain points */}
        <section className="border-b border-slate-800/80 bg-[#070a0d] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold text-slate-100 sm:text-3xl">
              Three ways prop firms deny your payout
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400">
              None of them are about your strategy.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <PainCard
                icon={<TimerReset className="h-6 w-6 text-red-400" />}
                title="News Trading Bans"
                body="A 2–5 minute window around CPI, NFP, or FOMC bans trading entirely. One open trade inside it and your evaluation resets or your payout gets flagged."
                solution="PropGuard runs a live countdown calibrated to your exact firm's window and flashes a hard red alert before it's too late."
              />
              <PainCard
                icon={<Scale className="h-6 w-6 text-red-400" />}
                title="Consistency Rule Traps"
                body="Most firms cap how much of your total profit can come from a single day — 30% to 50%. One great day can silently disqualify your whole payout."
                solution="Enter two numbers and PropGuard tells you instantly if you're safe to request a payout, and exactly how much more you need if not."
              />
              <PainCard
                icon={<TrendingDown className="h-6 w-6 text-red-400" />}
                title="Trailing Drawdown Math"
                body="Trailing drawdown floors move with your peak balance. Sizing a position wrong by even half a lot can blow a funded account in one trade."
                solution="PropGuard calculates your exact dollar distance to the floor and the maximum lot size that keeps you inside it."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-slate-100 sm:text-3xl">
              Simple pricing
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-7">
                <h3 className="text-lg font-semibold text-slate-100">Free</h3>
                <p className="mt-1 text-3xl font-bold text-slate-50">
                  $0
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-400">
                  <PricingLine text="Basic news blackout timer" />
                  <PricingLine text="1 prop firm profile" />
                  <PricingLine text="Manual consistency check" />
                </ul>
                <Link
                  href="/dashboard"
                  className="mt-6 block rounded-lg border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
                >
                  Start Free
                </Link>
              </div>
              <div className="relative rounded-xl border border-emerald-500/50 bg-[#0b0f14] p-7 shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)]">
                <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">
                  BEST VALUE
                </span>
                <h3 className="text-lg font-semibold text-slate-100">Pro</h3>
                <p className="mt-1 text-3xl font-bold text-slate-50">
                  $12<span className="text-base text-slate-500">/mo</span>
                </p>
                <p className="text-sm text-emerald-400">
                  or $29 one-time lifetime access
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-400">
                  <PricingLine text="All 5 prop firms (FTMO, Apex, Topstep, FundedNext, The5ers)" />
                  <PricingLine text="Live news blackout alerts + sound" />
                  <PricingLine text="Consistency & payout checker" />
                  <PricingLine text="Trailing drawdown & lot calculator" />
                </ul>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-6 block w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Get Lifetime Access — $29
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500">
          PropGuard is an independent risk-management tool and is not
          affiliated with FTMO, Apex Trader Funding, Topstep, FundedNext, or
          The5ers. Rules shown are simplified reference guidelines — always
          confirm exact terms in your firm&apos;s official rulebook before
          trading or requesting a payout.
        </div>
      </footer>

      <LifetimeAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function PainCard({
  icon,
  title,
  body,
  solution,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  solution: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
      <div className="mt-4 flex items-start gap-2 border-t border-slate-800 pt-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
        <p className="text-sm text-emerald-300/90">{solution}</p>
      </div>
    </div>
  );
}

function PricingLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
      <span>{text}</span>
    </li>
  );
}
