"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[--color-border] p-5 shadow-sm print:hidden">
      <div className="flex h-full flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="rounded-2xl bg-[--color-primary]/10 border border-[--color-primary]/20 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[--color-primary-strong]">Today</p>
            <p className="text-lg font-semibold text-[--foreground]">Smart sales</p>
            <p className="text-sm text-[--color-muted]">Faster billing, better receipts.</p>
          </div>

          <nav className="space-y-2 text-sm font-medium text-[--color-muted]">
            <Link href="/pos" className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[--color-primary]/10 hover:text-[--foreground] transition">
              <span>POS Billing</span>
              <span className="text-[10px] font-semibold text-[--color-primary]">Live</span>
            </Link>
            <Link href="/products" className="block rounded-xl px-3 py-2.5 hover:bg-[--color-primary]/10 hover:text-[--foreground] transition">
              Products
            </Link>
            <Link href="/reports" className="block rounded-xl px-3 py-2.5 hover:bg-[--color-primary]/10 hover:text-[--foreground] transition">
              Reports
            </Link>
            <Link href="/expenses" className="block rounded-xl px-3 py-2.5 hover:bg-[--color-primary]/10 hover:text-[--foreground] transition">
              Expenses
            </Link>
          </nav>
        </div>

        {pathname !== "/login" && (
          <button
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[--color-border] bg-white px-4 py-3 text-sm font-semibold text-[--color-muted] transition hover:text-[--foreground] hover:bg-[--color-border]/60"
          >
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
