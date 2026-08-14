export function formatCount(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!n && n !== 0) return "0";
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatDuration(iso?: string): string {
  if (!iso) return "";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const sec = Number(m[3] ?? 0);
  const pad = (x: number) => String(x).padStart(2, "0");
  if (h > 0) return `${h}:${pad(min)}:${pad(sec)}`;
  return `${min}:${pad(sec)}`;
}

export function timeAgo(iso: string): string {
  const t = Date.now() - new Date(iso).getTime();
  const s = Math.floor(t / 1000);
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w} minggu lalu`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} bulan lalu`;
  return `${Math.floor(d / 365)} tahun lalu`;
}

export function thumbnailOf(video: { id: string; thumbnail?: string }): string {
  if (video.thumbnail && video.thumbnail.startsWith("http")) return video.thumbnail;
  return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
}
