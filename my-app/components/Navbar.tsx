"use client";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-[--color-border] bg-white/80 backdrop-blur shadow-sm flex items-center justify-between px-6 print:hidden">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[--color-muted]">Ali Optical</p>
        <h1 className="text-xl font-semibold text-[--foreground]">POS & Inventory</h1>
      </div>
      <div className="flex items-center gap-3 text-sm text-[--color-muted]">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[--color-border] bg-[--surface] px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[--color-primary]"></span>
          <span className="font-medium text-[--foreground]">Retail floor live</span>
        </div>
        <Link
          href="/pos"
          className="rounded-full bg-[--color-primary] px-4 py-2 text-black font-semibold shadow-sm transition hover:bg-[--color-primary-strong]"
        >
          New Sale
        </Link>
      </div>
    </header>
  );
}
import Link from "next/link";
