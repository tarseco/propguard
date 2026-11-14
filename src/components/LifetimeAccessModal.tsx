"use client";

import { useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";

export default function LifetimeAccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout is unavailable right now");
      }

      window.location.href = data.url;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function handleClose() {
    setStatus("idle");
    setError("");
    setEmail("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0b0f14] p-6 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-100">
              Get Lifetime Access — $29
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-400">
          One-time payment. Unlocks every blackout timer, the consistency
          checker, and the drawdown calculator for all supported prop firms —
          no subscription.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@tradingdesk.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to checkout…
              </>
            ) : (
              "Continue to Secure Checkout"
            )}
          </button>
          {status === "error" && (
            <p className="text-center text-xs text-red-400">{error}</p>
          )}
          <p className="text-center text-xs text-slate-500">
            Payment is processed securely by Stripe.
          </p>
        </form>
      </div>
    </div>
  );
}
