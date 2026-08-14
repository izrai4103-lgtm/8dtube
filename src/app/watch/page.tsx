import WatchView from "@/components/WatchView";
import { getWatch } from "@/lib/lovable";

export const dynamic = "force-dynamic";

export default async function Watch({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v = "" } = await searchParams;
  let data = null;
  let error = "";

  if (v) {
    try {
      data = await getWatch(v);
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal memuat video";
    }
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-white/60">
        {error}
      </div>
    );
  }

  return (
    <WatchView
      data={
        data ?? {
          video: null,
          channel: null,
          related: [],
          comments: [],
        }
      }
    />
  );
}
