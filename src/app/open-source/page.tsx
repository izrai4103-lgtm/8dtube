import type { OpenSourceRepo } from "@/lib/openSource";
import { formatStars, getOpenSourceData } from "@/lib/openSource";

function RepoCard({ repo }: { repo: OpenSourceRepo }) {
  const over = (repo.stars ?? repo.fallbackStars) >= 200000;
  return (
    <a
      href={`https://github.com/${repo.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[0.5deg] group-hover:border-cyan-400/50 group-hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.4)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 text-lg font-black text-white">
              {repo.name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{repo.name}</h3>
              <p className="text-xs text-white/50">
                {repo.owner} · {repo.language}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              over
                ? "bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 text-cyan-200"
                : "bg-white/10 text-white/60"
            }`}
          >
            {over ? "200K+ ⭐" : "≈200K ⭐"}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
          {repo.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 font-semibold text-amber-200">
            ⭐ {formatStars(repo.stars ?? repo.fallbackStars)} bintang
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
            {repo.license}
          </span>
          <span className="ml-auto text-white/40">Open Source ↗</span>
        </div>
      </div>
    </a>
  );
}

export const dynamic = "force-dynamic";

export default async function OpenSource() {
  const { templates, tools } = await getOpenSourceData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
          Open Source 200K+ ⭐
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/55 sm:text-base">
          Template & tools open-source dengan rating terbesar di GitHub — jumlah
          bintang diambil langsung dari GitHub API.
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">📦 5 Template</h2>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-0.5 text-xs font-semibold text-cyan-200">
            Semua 200K+ bintang
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((r) => (
            <RepoCard key={r.slug} repo={r} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">🧰 4 Tools</h2>
          <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-0.5 text-xs font-semibold text-fuchsia-200">
            Rating ~200K bintang
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((r) => (
            <RepoCard key={r.slug} repo={r} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-white/40">
        Jumlah bintang diperbarui otomatis dari GitHub API. 8DTUBE dibangun dengan
        Next.js (141K+ ⭐), Three.js (103K+ ⭐), dan Tailwind CSS (85K+ ⭐).
      </p>
    </div>
  );
}
