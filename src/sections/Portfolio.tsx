import { ExternalLink } from 'lucide-react'
import { projects, type Project } from '../config'

// Mini maqueta de la web hecha con CSS: catálogo a la izquierda, panel a la derecha.
// Cuando tengas capturas reales, reemplazala por <img src="/la-ribera.png" />.
function Mock({ p }: { p: Project }) {
  const [main, accent, bg] = p.palette
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-xl border border-mist dark:border-night-line" style={{ background: bg }} aria-hidden="true">
      <div className="flex h-[12%] items-center gap-1.5 px-[4%]" style={{ background: main }}>
        <span className="h-[30%] w-[18%] rounded-sm bg-white/80" />
        <span className="ml-auto h-[24%] w-[8%] rounded-sm bg-white/40" />
        <span className="h-[24%] w-[8%] rounded-sm bg-white/40" />
      </div>
      <div className="grid h-[88%] grid-cols-[1.4fr_1fr] gap-[4%] p-[4%]">
        <div className="grid grid-cols-3 grid-rows-2 gap-[6%]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-md bg-white p-[8%] shadow-sm">
              <div className="flex-1 rounded-sm" style={{ background: i % 2 ? `${main}26` : `${accent}40` }} />
              <div className="mt-[10%] h-[8%] w-3/4 rounded-sm bg-slate-200" />
              <div className="mt-[6%] h-[8%] w-1/3 rounded-sm" style={{ background: main }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[6%] rounded-md bg-white p-[7%] shadow-sm">
          <div className="grid grid-cols-2 gap-[8%]">
            <div className="h-6 rounded-sm" style={{ background: `${main}22` }} />
            <div className="h-6 rounded-sm" style={{ background: `${accent}33` }} />
          </div>
          <div className="flex flex-1 items-end gap-[6%]">
            {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? accent : main }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Portfolio() {
  const [featured, ...rest] = projects
  return (
    <section id="trabajos" className="py-24 lg:py-32">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="section-title">Trabajos</h2>
          <p className="lead mt-4 text-lg">Un proyecto real en funcionamiento y algunos ejemplos de lo que puedo armar para tu rubro.</p>
        </div>

        <article className="mt-14 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Mock p={featured} />
          <div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Cliente real</span>
            <h3 className="mt-2 text-3xl font-semibold">{featured.name}</h3>
            <p className="mt-1 font-medium text-muted dark:text-moon-muted">{featured.kind}</p>
            <p className="mt-4">{featured.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {featured.tags.map((t) => (
                <li key={t} className="rounded-full border border-mist px-3 py-1 text-sm dark:border-night-line">
                  {t}
                </li>
              ))}
            </ul>
            {featured.url && (
              <a href={featured.url} target="_blank" rel="noreferrer" className="btn-ghost mt-7">
                Visitar la web <ExternalLink size={16} />
              </a>
            )}
          </div>
        </article>

        <div className="mt-20 grid gap-10 md:grid-cols-2">
          {rest.map((p) => (
            <article key={p.name}>
              <Mock p={p} />
              <div className="mt-5 flex items-center gap-3">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-muted dark:bg-night-line dark:text-moon-muted">Proyecto de ejemplo</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted dark:text-moon-muted">{p.kind}</p>
              <p className="lead mt-2">{p.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
