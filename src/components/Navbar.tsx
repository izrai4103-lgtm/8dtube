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
      <div className="mx-auto flex h-14 max-w-[1700px] items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-7 w-10 place-items-center rounded-lg bg-red-600">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            8DTUBE
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="mx-auto flex h-10 w-full max-w-xl items-stretch overflow-hidden rounded-full border border-white/15 bg-[#121212] focus-within:border-blue-500/70"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari"
            className="w-full bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="grid w-16 shrink-0 place-items-center border-l border-white/15 bg-white/5 transition hover:bg-white/10"
          >
            <svg
              className="h-5 w-5 text-white/70"
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
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/shorts"
            title="Shorts"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
          >
            <svg className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.77 10.32 4.23 3.55c-.66-.36-1.23.33-1.23 1.02v13.94c0 .69.57 1.38 1.23 1.02l13.54-6.77c.96-.48.96-2.9 0-3.38z" />
            </svg>
          </Link>
          <span
            title="Notifikasi"
            className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 sm:grid"
          >
            <svg
              className="h-6 w-6 text-white/80"
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
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 text-xs font-bold text-white">
            8
          </span>
        </div>
      </div>
    </header>
  );
}
