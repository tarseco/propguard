import Link from "next/link";
import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { sendLifetimeAccessEmail } from "@/lib/email";

// This page verifies a real Stripe session and sends an email on every
// load — it must run per-request, never be prerendered or cached.
export const instant = false;

async function verifyAndNotify(sessionId: string | undefined) {
  if (!sessionId) return { ok: false, email: null as string | null };

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { ok: false, email: null };
    }

    const email = session.customer_details?.email ?? session.customer_email ?? null;
    if (email) {
      await sendLifetimeAccessEmail(email);
    }

    return { ok: true, email };
  } catch {
    return { ok: false, email: null };
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const { ok, email } = await verifyAndNotify(session_id);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <ShieldAlert className="h-6 w-6 text-emerald-400" />
        <span className="text-lg font-bold tracking-tight text-slate-50">PropGuard</span>
      </Link>

      {ok ? (
        <>
          <CheckCircle2 className="h-14 w-14 text-emerald-400" />
          <h1 className="mt-4 text-2xl font-bold text-slate-100">You&apos;re all set</h1>
          <p className="mt-2 max-w-md text-slate-400">
            Payment received — Lifetime Access is active
            {email ? ` for ${email}` : ""}. A confirmation email is on its way.
          </p>
        </>
      ) : (
        <>
          <XCircle className="h-14 w-14 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-slate-100">
            We couldn&apos;t confirm that payment
          </h1>
          <p className="mt-2 max-w-md text-slate-400">
            If you were charged, contact support and we&apos;ll sort it out.
          </p>
        </>
      )}

      <Link
        href="/dashboard"
        className="mt-8 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        Open Dashboard
      </Link>
    </div>
  );
}
