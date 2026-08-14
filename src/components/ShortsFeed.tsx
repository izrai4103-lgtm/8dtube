"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Comment, Video } from "@/lib/types";
import { formatCount, thumbnailOf } from "@/lib/format";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: Record<string, unknown>,
      ) => unknown;
      PlayerState?: { PLAYING: number; ENDED: number };
    };
  }
}

let ytReadyPromise: Promise<void> | null = null;

function ensureYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (ytReadyPromise) return ytReadyPromise;
  ytReadyPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytReadyPromise;
}

type PlayerLike = {
  playVideo?: () => void;
  pauseVideo?: () => void;
  mute?: () => void;
  unMute?: () => void;
  setVolume?: (v: number) => void;
  getDuration?: () => number;
  getCurrentTime?: () => number;
  getPlayerState?: () => number;
  destroy?: () => void;
};

function ShortItem({
  video,
  active,
  onNext,
}: {
  video: Video;
  active: boolean;
  onNext: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerLike | null>(null);
  const lastTap = useRef(0);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [heartBurst, setHeartBurst] = useState(false);
  const [progress, setProgress] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!active) return;
    let disposed = false;
    playerRef.current = null;
    ensureYouTubeAPI().then(() => {
      if (disposed || !window.YT?.Player || !containerRef.current) return;
      const player = new window.YT.Player(containerRef.current, {
        videoId: video.id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 0,
          rel: 0,
          playsinline: 1,
          controls: 0,
          hl: "id",
          gl: "ID",
        },
        events: {
          onReady: (e: { target: PlayerLike }) => {
            e.target.playVideo?.();
          },
          onStateChange: (e: { data: number }) => {
            if (
              window.YT?.PlayerState &&
              e.data === window.YT.PlayerState.ENDED
            ) {
              onNext();
            }
          },
        },
      }) as PlayerLike;
      playerRef.current = player;
    });
    return () => {
      disposed = true;
      const p = playerRef.current;
      playerRef.current = null;
      if (p) {
        try {
          p.destroy?.();
        } catch {
          /* abaikan */
        }
      }
    };
  }, [active, video.id, onNext]);

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    const iv = setInterval(() => {
      const p = playerRef.current;
      if (!p || !p.getDuration || !p.getCurrentTime) return;
      const d = p.getDuration();
      const t = p.getCurrentTime();
      if (d && t >= 0) setProgress(Math.min(1, t / d));
    }, 250);
    return () => clearInterval(iv);
  }, [active]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute?.();
      p.setVolume?.(100);
      setMuted(false);
    }
    const st = p.getPlayerState?.();
    if (st === window.YT?.PlayerState?.PLAYING) p.pauseVideo?.();
    else p.playVideo?.();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute?.();
      p.setVolume?.(100);
      setMuted(false);
    } else {
      p.mute?.();
      setMuted(true);
    }
  };

  const toggleLike = () => {
    setLiked((l) => !l);
    setHeartBurst(true);
    window.setTimeout(() => setHeartBurst(false), 700);
  };

  const onTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      toggleLike();
    } else {
      togglePlay();
    }
    lastTap.current = now;
  };

  const openComments = async () => {
    if (comments) {
      setCommentsOpen(true);
      return;
    }
    setCommentsLoading(true);
    setCommentsOpen(true);
    try {
      const res = await fetch("/api/tube", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fn: "details", data: { id: video.id } }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        result?: { comments?: Comment[] };
      };
      setComments(json.ok ? (json.result?.comments ?? []) : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const share = async () => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* dibatalkan pengguna */
    }
  };

  const likeCount = Number(video.likeCount || 0) + (liked ? 1 : 0);
  const commentCount = comments?.length;

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] snap-start items-center justify-center px-0">
      <div
        className="relative h-full w-full max-w-[420px] overflow-hidden rounded-none bg-black"
        onClick={onTap}
      >
        {active ? (
          <div ref={containerRef} className="h-full w-full [&>div]:h-full [&>div]:w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailOf(video)}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {heartBurst && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <svg
              className="h-28 w-28 animate-ping text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ animationDuration: "700ms" }}
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
        )}

        {active && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white active:scale-90"
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          >
            {muted ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            )}
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
                {(video.channelTitle || "?").slice(0, 1).toUpperCase()}
              </span>
              <p className="truncate text-sm font-semibold text-white">
                {video.channelTitle}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.classList.toggle("bg-white");
                  e.currentTarget.classList.toggle("text-black");
                  e.currentTarget.classList.toggle("bg-white/10");
                  e.currentTarget.classList.toggle("text-white");
                }}
                className="pointer-events-auto shrink-0 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition active:scale-95"
              >
                Berlangganan
              </button>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-white">
              {video.title}
            </p>
            <p className="mt-1 line-clamp-1 text-[11px] text-white/70">
              {formatCount(video.viewCount)}x ditonton
            </p>
          </div>

          <div className="pointer-events-auto flex shrink-0 flex-col items-center gap-3 pb-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
              className="flex flex-col items-center gap-0.5 text-white"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-full bg-black/50 transition active:scale-90 ${
                  liked ? "text-red-500" : "text-white"
                }`}
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </span>
              <span className="text-[11px] font-medium drop-shadow">
                {formatCount(likeCount)}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openComments();
              }}
              className="flex flex-col items-center gap-0.5 text-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black/50 active:scale-90">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              </span>
              <span className="text-[11px] font-medium drop-shadow">
                {commentCount !== undefined ? formatCount(commentCount) : "Komentar"}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                share();
              }}
              className="flex flex-col items-center gap-0.5 text-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black/50 active:scale-90">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </span>
              <span className="text-[11px] font-medium drop-shadow">
                {copied ? "Tersalin" : "Bagikan"}
              </span>
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-0.5 w-full bg-white/20">
            <div
              className="h-full bg-white transition-[width] duration-200 ease-linear"
              style={{ width: `${Math.max(progress * 100, 1.5)}%` }}
            />
          </div>
        </div>
      </div>

      {commentsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCommentsOpen(false)}
          />
          <div className="relative z-10 max-h-[65dvh] w-full max-w-[420px] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#1a1a1a] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {commentsLoading
                  ? "Memuat…"
                  : commentCount !== undefined
                    ? `${commentCount} Komentar`
                    : "Komentar"}
              </h3>
              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white active:scale-90"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {(comments ?? []).map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="h-8 w-8 shrink-0 rounded-full border border-white/15"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">{c.author}</p>
                    <p className="mt-0.5 text-sm text-white/85">{c.text}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      👍 {formatCount(c.likeCount)}
                    </p>
                  </div>
                </div>
              ))}
              {!commentsLoading && (comments ?? []).length === 0 && (
                <p className="py-6 text-center text-sm text-white/50">
                  Belum ada komentar.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShortsFeed({
  initialShorts,
}: {
  initialShorts: Video[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shorts, setShorts] = useState<Video[]>(initialShorts);
  const [loading, setLoading] = useState(initialShorts.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (initialShorts.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/tube", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fn: "shorts" }),
        });
        const json = (await res.json()) as {
          ok: boolean;
          result?: {
            local?: { items?: Video[] };
            feed?: { items?: Video[] };
          };
        };
        if (cancelled) return;
        const local = json.ok ? (json.result?.local?.items ?? []) : [];
        const feed = json.ok ? (json.result?.feed?.items ?? []) : [];
        const list = [...local, ...feed];
        if (list.length) setShorts(list);
      } catch {
        /* biarkan kosong */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialShorts]);

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

  const goToNext = useCallback(
    (current: number) => {
      const el = containerRef.current?.querySelector(
        `[data-index="${current + 1}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  if (loading && shorts.length === 0) {
    return (
      <div className="grid h-[calc(100dvh-7.5rem)] place-items-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh-7.5rem)] snap-y snap-mandatory overflow-y-auto overscroll-y-none"
    >
      {shorts.map((s, i) => (
        <div key={`${s.id}-${i}`} data-index={i}>
          <ShortItem
            video={s}
            active={i === activeIndex}
            onNext={() => goToNext(i)}
          />
        </div>
      ))}
    </div>
  );
}
