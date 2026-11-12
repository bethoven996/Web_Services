import { site } from '../config'

const facts = [
  { k: 'Desarrollo', v: 'React para lo que ve tu cliente, Python para los datos y el panel.' },
  { k: 'Inteligencia artificial', v: 'Último año de la Tecnicatura Universitaria en IA (FCEIA, UNR).' },
  { k: '6 años', v: 'como profesor de educación física.' },
  { k: '8 años', v: 'como técnico de básquet.' },
]

export function About() {
  const { owner } = site
  return (
    <section id="sobre-mi" className="py-24 lg:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          {owner.photo ? (
            <img src={owner.photo} alt={owner.fullName} className="aspect-[4/5] w-full max-w-sm rounded-2xl object-cover" />
          ) : (
            <div className="grid aspect-[4/5] w-full max-w-sm place-items-center rounded-2xl bg-gradient-to-br from-indigo to-cyan font-display text-7xl font-bold text-white" aria-hidden="true">
              BN
            </div>
          )}
        </div>
        <div>
          <h2 className="section-title">Hola, soy Beto</h2>
          <div className="mt-6 max-w-[62ch] space-y-4 text-lg">
            <p>
              Soy {owner.fullName}, desarrollador web en {site.city}. Antes de programar pasé muchos años enseñando y dirigiendo equipos, y de ahí me traje dos cosas que hoy aplico en cada proyecto: explicar todo simple y cumplir con los tiempos.
            </p>
            <p className="lead">
              Trabajo directo con vos, sin intermediarios. Me interesa que tu web no solo se vea bien, sino que te ayude a vender y a tomar mejores decisiones con los números de tu negocio.
            </p>
          </div>
          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.k} className="border-t border-mist pt-4 dark:border-night-line">
                <dt className="font-display text-xl font-semibold">{f.k}</dt>
                <dd className="lead mt-1">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
