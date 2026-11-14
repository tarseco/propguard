import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, LIFETIME_PRICE_USD_CENTS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "PropGuard — Lifetime Access" },
            unit_amount: LIFETIME_PRICE_USD_CENTS,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
      // Managed Payments (Stripe as merchant of record) requires a tax_code
      // on every line item. We're not using Stripe Tax yet, so opt this
      // session out rather than guessing at tax codes.
      managed_payments: { enabled: false },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
