import { toJSON, fromJSON } from "seroval";
import type { Category, CinemaProfile, Video, WatchData } from "./types";

type SerovalJSON = Parameters<typeof fromJSON>[0];

const SOURCE =
  process.env.LOVABLE_SOURCE ?? "https://eight-dee-tube-clone.lovable.app";

const FUNCTIONS = {
  home: "cc4bebd9d6f937a96a6b2beab26307091521f32cf6e5f9caa75c4becba0bcfec",
  categories:
    "01726dc3b223b5bcd9b0c2c37bf4df7ee93ec10456bdcf60377fde195dd863ca",
  search:
    "36614dcd90485083cc31903f928ecf4789f136d842742385d01e5ba5415e5bd6",
  details:
    "00abdfa7d2574b4fce7b876b4a91dbde50300942bd06edd9d7d9d590409d32e1",
  feed: "ce18b8e54a1485d34443c5376ed8b1daeceab3f0abc515eea1808119fbc60610",
  shorts:
    "4707f51a4df8e7730593519d3db6d28067fd15db342072ee8485d204bb9f5ae2",
  cinema:
    "81d24ead793cbe511e63227bcd749f6d40713bfdb67563df5005a14d7844a9da",
} as const;

export type LovableFn = keyof typeof FUNCTIONS;

const cache = new Map<string, { exp: number; data: unknown }>();

interface LovableEnvelope<T> {
  result?: T;
  error?: unknown;
}

export async function callLovable<T = unknown>(
  fn: LovableFn,
  data: Record<string, unknown> = {},
  opts: { ttl?: number } = {},
): Promise<T> {
  const key = `${fn}:${JSON.stringify(data)}`;
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return hit.data as T;

  const payload = JSON.stringify(toJSON({ data, context: undefined }));
  const url = `${SOURCE}/_serverFn/${FUNCTIONS[fn]}?payload=${encodeURIComponent(payload)}`;

  const res = await fetch(url, {
    headers: {
      "x-tsr-serverFn": "true",
      accept: "application/x-tss-framed, application/x-ndjson, application/json",
      "user-agent": "Mozilla/5.0 (8DTUBE proxy)",
      referer: `${SOURCE}/`,
      origin: SOURCE,
    },
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Lovable "${fn}" gagal: HTTP ${res.status}`);

  const raw = (await res.json()) as unknown;
  const out = fromJSON({ t: raw, f: 127, m: [] } as SerovalJSON) as LovableEnvelope<T>;
  if (out.error) {
    throw new Error(
      `Lovable "${fn}" error: ${JSON.stringify(out.error).slice(0, 200)}`,
    );
  }

  const result = out.result as T;
  const ttl = opts.ttl ?? (fn === "home" || fn === "categories" || fn === "feed" ? 60_000 : 0);
  if (ttl) cache.set(key, { exp: Date.now() + ttl, data: result });
  return result;
}

export const getHomeVideos = (categoryId?: string) =>
  callLovable<{ items: Video[]; nextPageToken?: string }>(
    "home",
    categoryId ? { categoryId } : {},
    { ttl: 60_000 },
  );

export const getCategories = () =>
  callLovable<Category[]>("categories", {}, { ttl: 300_000 });

export const searchVideos = (q: string) =>
  callLovable<{ items: Video[] }>("search", { q });

export const getWatch = (id: string) =>
  callLovable<WatchData>("details", { id });

export const getFeed = () =>
  callLovable<{ items: Video[] }>("feed", {}, { ttl: 60_000 });

export const getLocalShorts = () =>
  callLovable<{ items: Video[] }>("shorts", { onlyShorts: true }, { ttl: 60_000 });

export const getCinemaProfile = (title: string, description: string) =>
  callLovable<{ profile: CinemaProfile; ai: boolean }>("cinema", {
    title,
    description,
  });
