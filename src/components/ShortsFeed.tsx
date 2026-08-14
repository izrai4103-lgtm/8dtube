"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/types";
import { formatCount, thumbnailOf } from "@/lib/format";

function ShortItem({ video, active }: { video: Video; active: boolean }) {
  return (
    <div className="flex h-[calc(100dvh-7.5rem)] snap-start items-center justify-center gap-4 px-4">
      <div
        className={`relative h-full w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/15 bg-black shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 ${
          active ? "max-w-none rounded-none" : ""
        }`}
      >
        {active ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&rel=0&playsinline=1&hl=id&gl=ID`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailOf(video)}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
          <p className="text-sm font-semibold text-white">{video.title}</p>
          <p className="mt-1 text-xs text-white/70">
            {video.channelTitle} · {formatCount(video.viewCount)}x ditonton
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ShortsFeed({ shorts }: { shorts: Video[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setActiveIndex(index);
          }
        }
      },
      { threshold: 0.6 },
    );
    el.querySelectorAll<HTMLElement>("[data-index]").forEach((node) =>
      observer.observe(node),
    );
    return () => observer.disconnect();
  }, [shorts]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh-7.5rem)] snap-y snap-mandatory overflow-y-auto"
    >
      {shorts.map((s, i) => (
        <div key={`${s.id}-${i}`} data-index={i}>
          <ShortItem video={s} active={i === activeIndex} />
        </div>
      ))}
    </div>
  );
}
