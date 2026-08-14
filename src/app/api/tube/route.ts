import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  getCinemaProfile,
  getFeed,
  getHomeVideos,
  getLocalShorts,
  getWatch,
  searchVideos,
} from "@/lib/lovable";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      fn?: string;
      data?: Record<string, unknown>;
    };
    const fn = body.fn;
    const data = body.data ?? {};

    let result: unknown;
    switch (fn) {
      case "home":
        result = await getHomeVideos(
          typeof data.categoryId === "string" ? data.categoryId : undefined,
        );
        break;
      case "categories":
        result = await getCategories();
        break;
      case "search":
        result = await searchVideos(String(data.q ?? ""));
        break;
      case "details":
        result = await getWatch(String(data.id ?? ""));
        break;
      case "shorts":
        result = {
          local: await getLocalShorts(),
          feed: await getFeed(),
        };
        break;
      case "cinema":
        result = await getCinemaProfile(
          String(data.title ?? ""),
          String(data.description ?? ""),
        );
        break;
      default:
        return NextResponse.json({ ok: false, error: "fn tidak dikenal" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan" },
      { status: 502 },
    );
  }
}
