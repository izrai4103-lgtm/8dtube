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
    el.style.transform = `perspective(900px) rotateY(${px * 4}deg) rotateX(${
      -py * 4
    }deg)`;
    el.style.boxShadow = "0 12px 32px -16px rgba(0,0,0,0.8)";
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
      className="transition-transform duration-200 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link href={`/watch?v=${video.id}`} className="block">
        {row ? (
          <div className="flex gap-3">
            <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-lg bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailOf(video)}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {video.duration ? (
                <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                  {formatDuration(video.duration)}
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
                {video.title}
              </h3>
              <p className="mt-1 truncate text-xs text-white/60">
                {video.channelTitle}
              </p>
              <p className="text-xs text-white/60">
                {formatCount(video.viewCount)}x ditonton · {timeAgo(video.publishedAt)}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailOf(video)}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {video.duration ? (
                <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
                  {formatDuration(video.duration)}
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white">
                {(video.channelTitle || "?").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">
                  {video.title}
                </h3>
                <p className="mt-1 truncate text-xs text-white/60">
                  {video.channelTitle}
                </p>
                <p className="text-xs text-white/60">
                  {formatCount(video.viewCount)}x ditonton · {timeAgo(video.publishedAt)}
                </p>
              </div>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
