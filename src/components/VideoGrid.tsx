"use client";

import { useCallback, useState } from "react";
import type { Category, Video } from "@/lib/types";
import VideoCard from "./VideoCard";

const ID_CHIPS: { id: string; title: string }[] = [
  { id: "q:musik indonesia", title: "🎵 Musik" },
  { id: "q:vlog indonesia", title: "📹 Vlog" },
  { id: "q:kuliner indonesia", title: "🍜 Kuliner" },
  { id: "q:game mobile", title: "🎮 Gaming" },
  { id: "q:komedi indonesia", title: "😂 Komedi" },
  { id: "q:berita hari ini", title: "📰 Berita" },
  { id: "q:dangdut", title: "💃 Dangdut" },
  { id: "q:lofi indonesia", title: "🌙 Lofi" },
];

const ID_CATEGORY_TITLES: Record<string, string> = {
  "1": "Film & Animasi",
  "2": "Otomotif",
  "10": "Musik",
  "15": "Hewan Peliharaan",
  "17": "Olahraga",
  "19": "Travel & Acara",
  "20": "Gaming",
  "22": "Orang & Blog",
  "23": "Komedi",
  "24": "Hiburan",
  "25": "Berita & Politik",
  "26": "Tutorial & Gaya",
  "27": "Pendidikan",
  "28": "Sains & Teknologi",
};

export default function VideoGrid({
  initialVideos,
  categories,
  defaultQuery = "musik indonesia",
}: {
  initialVideos: Video[];
  categories: Category[];
  defaultQuery?: string;
}) {
  const [active, setActive] = useState<string>("id");
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = useCallback(
    async (chipId: string) => {
      setActive(chipId);
      setLoading(true);
      setError("");
      try {
        let body: { fn: string; data: Record<string, unknown> };
        if (chipId === "id") {
          body = { fn: "search", data: { q: defaultQuery } };
        } else if (chipId.startsWith("q:")) {
          body = { fn: "search", data: { q: chipId.slice(2) } };
        } else {
          body = {
            fn: "home",
            data: chipId ? { categoryId: chipId } : {},
          };
        }
        const res = await fetch("/api/tube", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
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
    },
    [defaultQuery],
  );

  const chips = [
    { id: "id", title: "🇮🇩 Indonesia" },
    ...ID_CHIPS,
    ...categories.map((c) => ({
      id: c.id,
      title: ID_CATEGORY_TITLES[c.id] ?? c.title,
    })),
  ];

  return (
    <div>
      <div className="sticky top-16 z-30 flex gap-2.5 overflow-x-auto bg-transparent py-3 [scrollbar-width:none]">
        {chips.map((c) => (
          <button
            key={c.id}
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
