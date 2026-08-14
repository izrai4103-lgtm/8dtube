import type { Category, Video } from "@/lib/types";
import VideoGrid from "@/components/VideoGrid";
import { getCategories, searchVideos } from "@/lib/lovable";

export const dynamic = "force-dynamic";

const DEFAULT_QUERY = "musik indonesia";

export default async function Home() {
  let categories: Category[] = [];
  let videos: Video[] = [];

  try {
    [categories, videos] = await Promise.all([
      getCategories(),
      searchVideos(DEFAULT_QUERY).then((r) => r.items),
    ]);
  } catch {
    /* fallback kosong */
  }

  return (
    <div className="mx-auto max-w-[1700px] px-4 pt-4 pb-16">
      <VideoGrid
        initialVideos={videos}
        categories={categories}
        defaultQuery={DEFAULT_QUERY}
      />
    </div>
  );
}
