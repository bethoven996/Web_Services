import { useState } from 'react'
import { Check } from 'lucide-react'
import { maintenance, plans, waLink } from '../config'

export function Plans() {
  const [withMaint, setWithMaint] = useState(true)
  const m = withMaint ? maintenance.with : maintenance.without

  return (
    <section id="planes" className="border-y border-mist bg-white py-24 lg:py-32 dark:border-night-line dark:bg-night-2/40">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="section-title">Planes</h2>
          <p className="lead mt-4 text-lg">
            Elegí el punto de partida. Cada página se hace a medida, así que el precio final depende de tu proyecto: escribinos y te pasamos un presupuesto cerrado.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`flex flex-col rounded-2xl p-7 sm:p-8 ${
                p.featured
                  ? 'bg-ink text-moon ring-1 ring-ink lg:-my-4 lg:py-12 dark:bg-indigo/25 dark:ring-indigo/50'
                  : 'border border-mist bg-paper dark:border-night-line dark:bg-night'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className={`text-2xl font-semibold ${p.featured ? 'text-white' : ''}`}>{p.name}</h3>
                {p.featured && <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs font-semibold text-cyan">El más elegido</span>}
              </div>
              <p className={`mt-2 ${p.featured ? 'text-moon-muted' : 'lead'}`}>{p.forWho}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-3 text-[0.97rem]">
                    <Check size={18} className={`mt-1 shrink-0 ${p.featured ? 'text-cyan' : 'text-indigo dark:text-indigo-soft'}`} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a
                href={waLink(`Hola! Me interesa el plan ${p.name}. ¿Me pasás un presupuesto?`)}
                target="_blank"
                rel="noreferrer"
                className={`mt-9 ${p.featured ? 'btn bg-white text-ink hover:bg-cyan' : 'btn-ghost'}`}
              >
                Consultar precio
              </a>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 rounded-2xl border border-mist p-7 sm:p-9 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14 dark:border-night-line">
          <div>
            <h3 className="text-xl font-semibold">¿Con o sin mantenimiento?</h3>
            <div role="radiogroup" aria-label="Mantenimiento" className="mt-4 inline-flex rounded-full border border-mist bg-paper p-1 dark:border-night-line dark:bg-night">
              {[
                { v: false, label: 'Sin mantenimiento' },
                { v: true, label: 'Con mantenimiento' },
              ].map((o) => (
                <button
                  key={o.label}
                  role="radio"
                  aria-checked={withMaint === o.v}
                  onClick={() => setWithMaint(o.v)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    withMaint === o.v ? 'bg-indigo text-white' : 'text-muted hover:text-ink dark:text-moon-muted dark:hover:text-moon'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div aria-live="polite">
            <div className="font-display text-lg font-semibold">{m.title}</div>
            <p className="lead mt-1.5 max-w-[60ch]">{m.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
