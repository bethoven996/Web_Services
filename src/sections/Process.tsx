const steps = [
  { when: 'Día 1', title: 'Charlamos', text: 'Nos contás qué vendés, a quién y qué querés lograr. Te pasamos el presupuesto cerrado y la lista de lo que necesitamos.' },
  { when: 'Días 2 y 3', title: 'Diseño', text: 'Te mostramos cómo va a quedar la web en celular y computadora. Ajustamos colores, textos y fotos hasta que te guste.' },
  { when: 'Días 4 a 6', title: 'Desarrollo', text: 'Programamos la web y el panel, cargamos tus productos y probamos que todo funcione bien en cualquier dispositivo.' },
  { when: 'Día 7', title: 'Entrega', text: 'Publicamos en tu dominio y te enseñamos a usar el panel. Desde ese día ya podés compartir el link.' },
]

export function Process() {
  return (
    <section className="bg-ink py-24 text-moon lg:py-32 dark:bg-night-2">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="section-title text-white">De la primera charla a tu web online, en una semana</h2>
        </div>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-white/15 pt-6">
              <span className="absolute -top-px left-0 h-px bg-cyan" style={{ width: `${((i + 1) / steps.length) * 100}%` }} aria-hidden="true" />
              <div className="text-sm font-medium text-cyan">{s.when}</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-moon-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
