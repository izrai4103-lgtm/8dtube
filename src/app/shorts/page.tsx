import type { Video } from "@/lib/types";
import ShortsFeed from "@/components/ShortsFeed";
import { getFeed, getLocalShorts } from "@/lib/lovable";

export const dynamic = "force-dynamic";

export default async function Shorts() {
  let shorts: Video[] = [];

  const [feed, local] = await Promise.all([
    getFeed().catch(() => null),
    getLocalShorts().catch(() => null),
  ]);

  if (local?.items) shorts.push(...local.items);
  if (feed?.items) shorts.push(...feed.items);

  return <ShortsFeed initialShorts={shorts} />;
}
