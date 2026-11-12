import {
  BrainCircuit,
  ChartColumn,
  Code2,
  ExternalLink,
  MonitorSmartphone,
} from "lucide-react";
import { projects, site } from "../config";

const values = [
  {
    k: "Te hablamos claro",
    v: "Sin palabras técnicas ni letra chica. Sabés qué vas a recibir, cuánto sale y cuándo está listo.",
  },
  {
    k: "Cumplimos los tiempos",
    v: "Una semana es una semana. Te vamos mostrando avances para que veas cómo crece tu web.",
  },
  {
    k: "Trabajamos con datos",
    v: "No hacemos solo páginas lindas: te damos un panel para que decidas con los números de tu negocio.",
  },
];

const skills = [
  {
    icon: MonitorSmartphone,
    k: "Frontend",
    v: "Interfaces en React rápidas, modernas y pensadas primero para el celular.",
  },
  {
    icon: Code2,
    k: "Backend y datos",
    v: "Python para procesar ventas, pedidos y stock, y convertirlos en información útil.",
  },
  {
    icon: ChartColumn,
    k: "Dashboards",
    v: "Paneles con gráficos claros para que el dueño entienda su negocio de un vistazo.",
  },
  {
    icon: BrainCircuit,
    k: "Inteligencia artificial",
    v: "Estudiante avanzado de la Tecnicatura Universitaria en IA (FCEIA, UNR).",
  },
];

const stack = [
  "React",
  "JavaScript",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "SQL",
  "Análisis de datos",
  "Machine Learning",
];

export function QuienesSomos() {
  const { owner } = site;
  const client = projects.find((p) => p.real);
  const links = [
    { label: "LinkedIn", href: site.linkedin },
    { label: "GitHub", href: site.github },
  ].filter((l) => l.href);

  return (
    <section id="quienes-somos" className="py-24 lg:py-32">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="section-title">Quiénes somos</h2>
          <div className="max-w-[62ch] space-y-4 text-lg">
            <p>
              {site.brand} es un estudio de desarrollo web de {site.city}.
              Hacemos páginas y tiendas online para emprendimientos y comercios,
              con un panel donde el dueño ve sus ventas, sus productos y su
              stock.
            </p>
            <p className="lead">
              Trabajamos directo con vos, sin intermediarios. Nos importa que tu
              web no solo se vea bien, sino que te ayude a vender y a tomar
              mejores decisiones.
            </p>
          </div>
        </div>

        <dl className="mt-16 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.k}
              className="border-t-2 border-ink pt-5 dark:border-moon"
            >
              <dt className="font-display text-xl font-semibold">{v.k}</dt>
              <dd className="lead mt-2">{v.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid overflow-hidden rounded-3xl border border-mist bg-white lg:grid-cols-[0.75fr_1.25fr] dark:border-night-line dark:bg-night-2">
          <div className="relative min-h-[360px] lg:min-h-full">
            {owner.photo ? (
              <img
                src={owner.photo}
                alt={owner.fullName}
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
              />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center bg-gradient-to-br from-indigo to-cyan font-display text-7xl font-bold text-white"
                aria-hidden="true"
              >
                BN
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-6 pt-20 text-white">
              <div className="font-display text-2xl font-bold">
                {owner.fullName}
              </div>
              <div className="text-white/80">Fundador y desarrollador web</div>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-lg">
              Desarrollador web especializado en{" "}
              <strong className="font-semibold">React y Python</strong>, y
              estudiante avanzado de la{" "}
              <strong className="font-semibold">
                Tecnicatura Universitaria en Inteligencia Artificial
              </strong>{" "}
              de la UNR.
            </p>
            <p className="lead mt-4">
              Une dos mundos que casi nunca van juntos en una página de
              comercio: el diseño de una web que vende y el análisis de los
              datos que esa web genera. Por eso cada proyecto de {site.brand}{" "}
              incluye un panel pensado para tomar decisiones, no solo para
              mirar.
            </p>

            <dl className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {skills.map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo/10 text-indigo dark:bg-indigo/20 dark:text-indigo-soft">
                    <Icon size={21} />
                  </span>
                  <div>
                    <dt className="font-display text-lg font-semibold">{k}</dt>
                    <dd className="lead mt-0.5 text-[0.97rem]">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-9 border-t border-mist pt-6 dark:border-night-line">
              <div className="text-sm font-medium text-muted dark:text-moon-muted">
                Tecnologías con las que trabajamos
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-mist bg-paper px-3 py-1 text-sm font-medium dark:border-night-line dark:bg-night"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {links.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost !py-2.5 text-sm"
                  >
                    {l.label} <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {client && (
          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg">
            <span className="lead">Ya confían en nosotros:</span>
            {client.url ? (
              <a
                href={client.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold underline decoration-cyan decoration-2 underline-offset-4"
              >
                {client.name} <ExternalLink size={16} />
              </a>
            ) : (
              <span className="font-semibold">{client.name}</span>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
