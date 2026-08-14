import Link from "next/link";
import type { Video } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import { searchVideos } from "@/lib/lovable";

export const dynamic = "force-dynamic";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  let items: Video[] = [];
  let error = "";

  if (q) {
    try {
      items = (await searchVideos(q)).items;
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal mencari";
    }
  }

  return (
    <div className="px-3 py-3">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {q && items.length === 0 && !error && (
        <p className="mt-6 text-sm text-white/50">
          Tidak ada hasil ditemukan.{" "}
          <Link href="/" className="text-cyan-300 underline">
            Kembali ke beranda
          </Link>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
