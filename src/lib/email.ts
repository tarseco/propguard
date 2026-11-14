import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? "PropGuard <onboarding@resend.dev>";

export async function sendLifetimeAccessEmail(toEmail: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set — skipping email send");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: "Your PropGuard Lifetime Access is active",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Welcome to PropGuard Pro</h1>
        <p>Your one-time payment went through — Lifetime Access is active on your account.</p>
        <p>Open the dashboard any time:</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://propguard-azure.vercel.app"}/dashboard"
             style="display:inline-block;background:#10b981;color:#05070a;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Open Dashboard
          </a>
        </p>
        <p style="color:#64748b;font-size:12px;">If you didn't make this purchase, reply to this email.</p>
      </div>
    `,
  });
}
