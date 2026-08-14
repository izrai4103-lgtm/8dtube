"use client";

import { useEffect, useState } from "react";
import type { CinemaProfile, WatchData } from "@/lib/types";
import { formatCount, timeAgo } from "@/lib/format";
import VideoCard from "./VideoCard";

export default function WatchView({ data }: { data: WatchData }) {
  const { video, channel, related, comments } = data;
  const [profile, setProfile] = useState<CinemaProfile | null>(null);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/tube", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fn: "cinema",
            data: { title: video.title, description: video.description },
          }),
        });
        const json = (await res.json()) as {
          ok: boolean;
          result?: { profile?: CinemaProfile };
        };
        if (!cancelled && json.ok && json.result?.profile) {
          setProfile(json.result.profile);
        }
      } catch {
        /* efek 3D tidak aktif jika gagal */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [video]);

  if (!video) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-white/60">
        Video tidak ditemukan.{" "}
        <a className="text-cyan-300 underline" href="/">
          Kembali ke beranda
        </a>
      </div>
    );
  }

  const playerStyle = profile
    ? {
        filter: `saturate(${profile.saturate}) contrast(${profile.contrast}) brightness(${profile.brightness}) hue-rotate(${profile.hueRotate}deg)`,
        transform: `perspective(1400px) rotateX(${profile.depth / 8}deg)`,
        boxShadow: `0 0 ${profile.depth * 4}px ${profile.glow}`,
      }
    : undefined;

  return (
    <div className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-4 xl:flex-row">
      <div className="min-w-0 flex-1">
        <div
          className="relative aspect-video overflow-hidden rounded-xl bg-black transition-all duration-1000"
          style={playerStyle}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&hl=id&gl=ID`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>

        <h1 className="mt-4 text-lg leading-6 font-semibold text-white">
          {video.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {channel?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={channel.avatar}
                alt={channel.title}
                className="h-10 w-10 rounded-full border border-white/20"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-bold text-white">
                {(channel?.title ?? video.channelTitle ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                {channel?.title ?? video.channelTitle}
              </p>
              <p className="text-xs text-white/60">
                {channel ? `${formatCount(channel.subscriberCount)} pelanggan` : ""}
              </p>
            </div>
            <button className="ml-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
              BERLANGGANAN
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-white">
              👍 {formatCount(video.likeCount)}
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white">
              👎
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              Bagikan
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Simpan
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowDesc((s) => !s)}
          className="mt-3 w-full rounded-xl bg-white/5 p-3 text-left text-sm text-white/85 transition hover:bg-white/10"
        >
          <p className={showDesc ? "" : "line-clamp-2"}>
            {video.description || video.title}
          </p>
          {video.description && video.description.length > 180 && (
            <span className="mt-1 inline-block font-semibold text-white">
              {showDesc ? "…lebih sedikit" : "…selengkapnya"}
            </span>
          )}
        </button>

        <section className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-white">
            {comments.length} Komentar
          </h2>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatar}
                  alt={c.author}
                  className="h-9 w-9 shrink-0 rounded-full border border-white/15"
                />
                <div className="min-w-0">
                  <p className="text-xs text-white/50">
                    {c.author} · {timeAgo(c.publishedAt)}
                  </p>
                  <p className="mt-0.5 text-sm text-white/85">{c.text}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    👍 {formatCount(c.likeCount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full shrink-0 xl:w-[380px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {related.map((v) => (
            <VideoCard key={v.id} video={v} row />
          ))}
        </div>
      </aside>
    </div>
  );
}
