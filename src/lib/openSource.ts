export interface OpenSourceRepo {
  slug: string;
  name: string;
  owner: string;
  category: "template" | "tool";
  badge: string;
  fallbackStars: number;
  description: string;
  license: string;
  language: string;
  stars?: number;
}

export const OPEN_SOURCE_REPOS: OpenSourceRepo[] = [
  // ---- 5 TEMPLATE (200K+ stars, open source) ----
  {
    slug: "freeCodeCamp/freeCodeCamp",
    name: "freeCodeCamp",
    owner: "freeCodeCamp",
    category: "template",
    badge: "Template",
    fallbackStars: 454017,
    description:
      "Kode sumber open-source freeCodeCamp.org: kurikulum belajar coding gratis dan platform sertifikasi.",
    license: "BSD-3-Clause",
    language: "TypeScript",
  },
  {
    slug: "kamranahmedse/developer-roadmap",
    name: "Developer Roadmap",
    owner: "kamranahmedse",
    category: "template",
    badge: "Template",
    fallbackStars: 364420,
    description:
      "Roadmap interaktif, panduan, dan materi edukasi untuk membantu developer memilih jalur karir.",
    license: "NOASSERTION",
    language: "TypeScript",
  },
  {
    slug: "EbookFoundation/free-programming-books",
    name: "Free Programming Books",
    owner: "EbookFoundation",
    category: "template",
    badge: "Template",
    fallbackStars: 394394,
    description:
      "Kumpulan buku pemrograman gratis, kursus, dan sumber belajar — tersedia dalam banyak bahasa.",
    license: "CC-BY-4.0",
    language: "Python",
  },
  {
    slug: "sindresorhus/awesome",
    name: "Awesome Lists",
    owner: "sindresorhus",
    category: "template",
    badge: "Template",
    fallbackStars: 495609,
    description:
      "Daftar curated hal-hal menarik di dunia programming, tools, dan teknologi — template knowledge base.",
    license: "CC0-1.0",
    language: "—",
  },
  {
    slug: "public-apis/public-apis",
    name: "Public APIs",
    owner: "public-apis",
    category: "template",
    badge: "Template",
    fallbackStars: 457215,
    description:
      "Koleksi API publik gratis untuk dipakai di proyek — template sumber data aplikasi.",
    license: "MIT",
    language: "Python",
  },
  // ---- 4 TOOLS (rating ~200K stars, open source) ----
  {
    slug: "facebook/react",
    name: "React",
    owner: "facebook",
    category: "tool",
    badge: "Tool",
    fallbackStars: 247257,
    description:
      "Library JavaScript untuk membangun antarmuka pengguna web & native. Dipakai 8DTUBE ini.",
    license: "MIT",
    language: "JavaScript",
  },
  {
    slug: "vuejs/vue",
    name: "Vue.js",
    owner: "vuejs",
    category: "tool",
    badge: "Tool",
    fallbackStars: 210239,
    description:
      "Framework progresif untuk membangun UI. Sederhana, fleksibel, dan mudah dipelajari.",
    license: "MIT",
    language: "TypeScript",
  },
  {
    slug: "tensorflow/tensorflow",
    name: "TensorFlow",
    owner: "tensorflow",
    category: "tool",
    badge: "Tool",
    fallbackStars: 197021,
    description:
      "Framework machine learning open-source dari Google untuk AI, deep learning, dan riset.",
    license: "Apache-2.0",
    language: "C++",
  },
  {
    slug: "microsoft/vscode",
    name: "Visual Studio Code",
    owner: "microsoft",
    category: "tool",
    badge: "Tool",
    fallbackStars: 188697,
    description:
      "Editor kode open-source paling populer dengan ekosistem ekstensi yang sangat besar.",
    license: "MIT",
    language: "TypeScript",
  },
];

const cache = new Map<string, { exp: number; stars: number }>();

export async function getRepoStars(repo: OpenSourceRepo): Promise<number> {
  const hit = cache.get(repo.slug);
  if (hit && hit.exp > Date.now()) return hit.stars;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo.slug}`, {
      headers: { accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 21600 },
    });
    if (res.ok) {
      const data = (await res.json()) as { stargazers_count?: number };
      if (typeof data.stargazers_count === "number") {
        const stars = data.stargazers_count;
        cache.set(repo.slug, { exp: Date.now() + 6 * 60 * 60 * 1000, stars });
        return stars;
      }
    }
  } catch {
    /* gunakan fallback */
  }
  return repo.fallbackStars;
}

export async function getOpenSourceData(): Promise<{
  templates: OpenSourceRepo[];
  tools: OpenSourceRepo[];
}> {
  const enriched = await Promise.all(
    OPEN_SOURCE_REPOS.map(async (r) => ({
      ...r,
      stars: await getRepoStars(r),
    })),
  );
  return {
    templates: enriched.filter((r) => r.category === "template"),
    tools: enriched.filter((r) => r.category === "tool"),
  };
}

export function formatStars(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
