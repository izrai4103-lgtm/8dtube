"use client";

import Link from "next/link";
import { MouseEvent, useRef } from "react";
import type { Video } from "@/lib/types";
import { formatCount, formatDuration, thumbnailOf, timeAgo } from "@/lib/format";

export default function VideoCard({
  video,
  row = false,
}: {
  video: Video;
  row?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${
      -py * 10
    }deg) translateZ(8px)`;
    el.style.boxShadow = `0 24px 50px -20px rgba(0,0,0,0.75), 0 0 40px -12px ${
      px > 0 ? "rgba(34,211,238,0.35)" : "rgba(232,121,249,0.35)"
    }`;
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group transition-transform duration-200 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link href={`/watch?v=${video.id}`} className="block">
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${
            row ? "aspect-video" : "aspect-video"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailOf(video)}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {video.duration ? (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {formatDuration(video.duration)}
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition group-hover:opacity-100" />
        </div>

        <div className="mt-2.5 flex gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 text-xs font-bold text-white/80">
            {(video.channelTitle || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3
              className={`line-clamp-2 text-sm font-semibold leading-snug text-white ${
                row ? "" : ""
              }`}
            >
              {video.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {video.channelTitle}
            </p>
            <p className="text-xs text-white/50">
              {formatCount(video.viewCount)}x ditonton · {timeAgo(video.publishedAt)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
