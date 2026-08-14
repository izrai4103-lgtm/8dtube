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
      <div className="px-4 py-20 text-center text-white/60">
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

  const actions = [
    {
      label: `Suka · ${formatCount(video.likeCount)}`,
      svg: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
      ),
    },
    {
      label: "Bagikan",
      svg: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
      ),
    },
    {
      label: "Simpan",
      svg: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      label: "Unduh",
      svg: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4 px-3 pt-3">
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

      <h1 className="text-[15px] leading-6 font-semibold text-white">
        {video.title}
      </h1>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {channel?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={channel.avatar}
              alt={channel.title}
              className="h-9 w-9 rounded-full border border-white/20"
            />
          ) : (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold text-white">
              {(channel?.title ?? video.channelTitle ?? "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {channel?.title ?? video.channelTitle}
            </p>
            <p className="text-xs text-white/60">
              {channel ? `${formatCount(channel.subscriberCount)} pelanggan` : ""}
            </p>
          </div>
        </div>
        <button className="h-9 shrink-0 rounded-full bg-white px-4 text-sm font-semibold text-black transition active:scale-95">
          BERLANGGANAN
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg bg-white/[0.07] text-white transition active:scale-95 active:bg-white/15"
          >
            {a.svg}
            <span className="px-1 text-[10px] leading-none font-medium">
              {a.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowDesc((s) => !s)}
        className="w-full rounded-lg bg-white/5 p-3 text-left text-[13px] leading-relaxed text-white/85 transition active:bg-white/10"
      >
        <p className={showDesc ? "" : "line-clamp-2"}>
          {video.description || video.title}
        </p>
        {video.description && video.description.length > 180 && (
          <span className="mt-1 inline-block text-xs font-semibold text-white">
            {showDesc ? "…lebih sedikit" : "…selengkapnya"}
          </span>
        )}
      </button>

      <section>
        <h2 className="text-base font-semibold text-white">
          {comments.length} Komentar
        </h2>
        <div className="mt-3 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.avatar}
                alt={c.author}
                className="h-8 w-8 shrink-0 rounded-full border border-white/15"
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

      <div className="grid grid-cols-1 gap-4 pt-1">
        {related.map((v) => (
          <VideoCard key={v.id} video={v} row />
        ))}
      </div>
    </div>
  );
}
