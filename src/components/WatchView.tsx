"use client";

import { useState } from "react";
import type { CinemaProfile, WatchData } from "@/lib/types";
import { formatCount, formatDuration, thumbnailOf, timeAgo } from "@/lib/format";
import VideoCard from "./VideoCard";

export default function WatchView({ data }: { data: WatchData }) {
  const { video, channel, related, comments } = data;
  const [cinema, setCinema] = useState(false);
  const [profile, setProfile] = useState<CinemaProfile | null>(null);
  const [loadingCinema, setLoadingCinema] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

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

  const toggleCinema = async () => {
    const next = !cinema;
    setCinema(next);
    if (next && !profile) {
      setLoadingCinema(true);
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
        if (json.ok && json.result?.profile) setProfile(json.result.profile);
      } catch {
        /* abaikan */
      } finally {
        setLoadingCinema(false);
      }
    }
  };

  const playerStyle = cinema && profile
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
          className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black transition-all duration-500"
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={toggleCinema}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              cinema
                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(34,211,238,0.5)]"
                : "border border-white/15 bg-white/5 text-white/80 hover:border-cyan-400/50"
            }`}
          >
            🎬 8D Cinema AI {cinema ? "AKTIF" : "MATI"}
          </button>
          {profile && (
            <span className="text-xs text-white/50">
              {profile.mode} — {profile.note}
            </span>
          )}
          {loadingCinema && (
            <span className="text-xs text-white/50">Menyiapkan profil HDR 3D…</span>
          )}
        </div>

        <h1 className="mt-3 text-lg leading-6 font-semibold text-white">
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
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 text-white">
                {(channel?.title ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                {channel?.title ?? video.channelTitle}
              </p>
              <p className="text-xs text-white/50">
                {channel ? `${formatCount(channel.subscriberCount)} subscriber` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
              👍 {formatCount(video.likeCount)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
              👁 {formatCount(video.viewCount)}x
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
              {timeAgo(video.publishedAt)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowDesc((s) => !s)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/70 transition hover:border-cyan-400/40"
        >
          {showDesc ? video.description : video.description?.slice(0, 180)}
          {video.description?.length > 180 && (
            <span className="ml-1 text-cyan-300">
              {showDesc ? " (tutup)" : "… selengkapnya"}
            </span>
          )}
        </button>

        <section className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-white">
            💬 {comments.length} Komentar
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
        <h2 className="mb-3 text-base font-semibold text-white">Terhubung</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {related.map((v) => (
            <VideoCard key={v.id} video={v} row />
          ))}
        </div>
      </aside>
    </div>
  );
}
