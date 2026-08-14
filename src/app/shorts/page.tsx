import type { Video } from "@/lib/types";
import ShortsFeed from "@/components/ShortsFeed";
import { getFeed, getLocalShorts } from "@/lib/lovable";

export const dynamic = "force-dynamic";

export default async function Shorts() {
  let shorts: Video[] = [];

  try {
    const [{ items: feed }, { items: local }] = await Promise.all([
      getFeed(),
      getLocalShorts(),
    ]);
    shorts = [
      ...local.map((v) => ({ ...v, kind: "local" })),
      ...feed.map((v) => ({ ...v, kind: "yt" })),
    ];
  } catch {
    /* fallback kosong */
  }

  if (shorts.length === 0) {
    return (
      <div className="grid h-[calc(100dvh-4rem)] place-items-center px-4 text-center">
        <div>
          <p className="text-lg text-white/70">Belum ada Shorts tersedia.</p>
          <a href="/" className="mt-2 inline-block text-sm text-cyan-300 underline">
            Kembali ke beranda
          </a>
        </div>
      </div>
    );
  }

  return <ShortsFeed shorts={shorts} />;
}
