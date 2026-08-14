"use client";

import { useCallback, useState } from "react";
import type { Category, Video } from "@/lib/types";
import VideoCard from "./VideoCard";

export default function VideoGrid({
  initialVideos,
  categories,
}: {
  initialVideos: Video[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = useCallback(async (categoryId: string) => {
    setActive(categoryId);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tube", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fn: "home",
          data: categoryId ? { categoryId } : {},
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        result?: { items?: Video[] };
        error?: string;
      };
      if (!json.ok || !json.result?.items) throw new Error(json.error ?? "Gagal");
      setVideos(json.result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat video");
    } finally {
      setLoading(false);
    }
  }, []);

  const chips = [{ id: "", title: "Semua" }, ...categories];

  return (
    <div>
      <div className="sticky top-16 z-30 flex gap-2.5 overflow-x-auto bg-transparent py-3 [scrollbar-width:none]">
        {chips.map((c) => (
          <button
            key={c.id || "all"}
            onClick={() => pick(c.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition ${
              active === c.id
                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                : "border border-white/15 bg-white/5 text-white/70 hover:border-cyan-400/50 hover:text-white"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

      {loading && (
        <div className="py-10 text-center text-sm text-white/50">
          Memuat dalam 3D…
        </div>
      )}
    </div>
  );
}
