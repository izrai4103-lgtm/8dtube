"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const SOURCE = "https://eight-dee-tube-clone.lovable.app";

export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070d]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center">
            <span className="absolute inset-0 rounded-full border-2 border-cyan-400/80 transition-transform group-hover:rotate-45" />
            <span className="absolute inset-2 rounded-full border-2 border-fuchsia-400/80" />
            <span className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 bg-clip-text text-sm font-black text-transparent">
              8D
            </span>
          </span>
          <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-xl font-black tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]">
            8DTUBE
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur focus-within:border-cyan-400/60 focus-within:shadow-[0_0_24px_rgba(34,211,238,0.25)]"
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
            placeholder="Cari video di 8DTube…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </form>

        <nav className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href="/shorts"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 transition hover:border-fuchsia-400/60 hover:text-white"
          >
            Shorts
          </Link>
          <a
            href={SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 transition hover:border-cyan-400/60 hover:text-white"
          >
            Situs Asli ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
