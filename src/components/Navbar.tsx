"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl">
      <div className="flex h-12 items-center gap-2 px-3">
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <span className="grid h-6 w-9 place-items-center rounded-md bg-red-600">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            8DTUBE
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="flex h-9 flex-1 items-center gap-1 rounded-full border border-white/15 bg-[#121212] px-3 focus-within:border-blue-500/70"
        >
          <svg
            className="h-4 w-4 shrink-0 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
            />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </form>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:scale-90 active:bg-white/10"
          aria-label="Notifikasi"
        >
          <svg
            className="h-5 w-5 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </button>

        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 text-[11px] font-bold text-white">
          8
        </span>
      </div>
    </header>
  );
}
