import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropGuard — Prop Firm Payout & Rule Protector",
  description:
    "Instant news blackout timers, trailing drawdown calculator, and consistency rule checker for FTMO, Apex, Topstep, and FundedNext traders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#05070a] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
