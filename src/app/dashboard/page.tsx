import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#05070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
            <span className="text-base font-bold tracking-tight text-slate-50 sm:text-lg">
              PropGuard
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-emerald-300 sm:text-sm"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Everything runs instantly in your browser — no files to upload.
          </p>
          <div className="mt-6">
            <DashboardTabs />
          </div>
        </div>
      </main>
    </div>
  );
}
