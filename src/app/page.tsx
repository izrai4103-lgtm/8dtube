import type { Category, Video } from "@/lib/types";
import VideoGrid from "@/components/VideoGrid";
import { getCategories, getHomeVideos } from "@/lib/lovable";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: Category[] = [];
  let videos: Video[] = [];

  try {
    [categories, videos] = await Promise.all([
      getCategories(),
      getHomeVideos().then((r) => r.items),
    ]);
  } catch {
    /* fallback kosong */
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <section className="py-10 text-center">
        <h1 className="mx-auto max-w-3xl bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black tracking-tight text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.35)] sm:text-5xl">
          Video Populer dalam Dimensi ke-8
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/55 sm:text-base">
          Video & fitur dimuat langsung dari{" "}
            <a
              href="https://eight-dee-tube-clone.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline decoration-dotted underline-offset-4"
            >
              eight-dee-tube-clone.lovable.app
            </a>
          , dibungkus pengalaman 3D.
        </p>
      </section>

      <VideoGrid initialVideos={videos} categories={categories} />
    </div>
  );
}
