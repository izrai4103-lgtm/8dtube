"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN = { href: "/shorts", label: "Buat" };

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl">
      <div className="flex items-end justify-around px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link
          href="/"
          className={`flex w-14 flex-col items-center gap-0.5 rounded-lg py-1 transition active:scale-90 ${
            isActive("/") ? "text-white" : "text-white/60"
          }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
            />
          </svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>

        <Link
          href="/shorts"
          className={`flex w-14 flex-col items-center gap-0.5 rounded-lg py-1 transition active:scale-90 ${
            isActive("/shorts") ? "text-white" : "text-white/60"
          }`}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.77 10.32 4.23 3.55c-.66-.36-1.23.33-1.23 1.02v13.94c0 .69.57 1.38 1.23 1.02l13.54-6.77c.96-.48.96-2.9 0-3.38z" />
          </svg>
          <span className="text-[10px] font-medium">Shorts</span>
        </Link>

        <button
          type="button"
          aria-label={MAIN.label}
          className="-mt-5 grid h-12 w-12 place-items-center rounded-2xl bg-red-600 text-white shadow-[0_8px_24px_rgba(220,38,38,0.45)] transition active:scale-90"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        <button
          type="button"
          className="flex w-14 flex-col items-center gap-0.5 rounded-lg py-1 text-white/60 transition active:scale-90"
          aria-label="Notifikasi"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          <span className="text-[10px] font-medium">Notifikasi</span>
        </button>

        <span
          className="flex w-14 flex-col items-center gap-0.5 rounded-lg py-1 text-white/60"
          aria-label="Profil"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan-500/50 to-fuchsia-500/50 text-[10px] font-bold text-white">
            8
          </span>
          <span className="text-[10px] font-medium">Anda</span>
        </span>
      </div>
    </nav>
  );
}
