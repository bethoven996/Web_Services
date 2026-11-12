import { Check } from 'lucide-react'

const client = [
  'Ve tus productos ordenados por categoría, con fotos y precios',
  'Busca lo que quiere y arma su pedido en segundos',
  'Te escribe por WhatsApp con el pedido listo',
  'Entra desde el celular y todo se ve bien',
]

const owner = [
  'Ves cuánto vendiste hoy, en la semana y en el mes',
  'Sabés qué productos salen más y cuáles no se mueven',
  'Te avisa cuando un producto se está por quedar sin stock',
  'Cargás y editás productos vos, sin depender de nadie',
]

const services = [
  { name: 'Landing page', text: 'Una página clara para presentar tu negocio y que te contacten.' },
  { name: 'Web institucional', text: 'Varias secciones: quiénes son, servicios, equipo, ubicación.' },
  { name: 'Tienda online', text: 'Catálogo con carrito y pedidos por WhatsApp o pago online.' },
  { name: 'Panel con dashboards', text: 'Tus ventas, productos y stock en gráficos fáciles de leer.' },
  { name: 'Dominio y publicación', text: 'Te registramos el dominio y dejamos la web online, rápida y segura.' },
  { name: 'Mantenimiento', text: 'Cambios, actualizaciones y soporte mes a mes, si lo querés.' },
]

export function TwoSides() {
  return (
    <section className="border-y border-mist bg-white py-24 dark:border-night-line dark:bg-night-2/40">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="section-title">Una web para tus clientes y un panel para vos</h2>
          <p className="lead mt-4 text-lg">
            La mayoría de las páginas terminan en el catálogo. Las nuestras tienen además una parte que solo ves vos, con los números de tu negocio.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-mist bg-mist md:grid-cols-2 dark:border-night-line dark:bg-night-line">
          <div className="bg-paper p-8 sm:p-10 dark:bg-night">
            <h3 className="text-xl font-semibold">Lo que ve tu cliente</h3>
            <ul className="mt-6 space-y-4">
              {client.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={19} className="mt-1 shrink-0 text-muted dark:text-moon-muted" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink p-8 text-moon sm:p-10 dark:bg-indigo/25">
            <h3 className="text-xl font-semibold text-white">Lo que ves vos</h3>
            <ul className="mt-6 space-y-4">
              {owner.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={19} className="mt-1 shrink-0 text-cyan" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="section-title">Qué hacemos</h2>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.name} className="border-t border-mist pt-4 dark:border-night-line">
                <dt className="font-display text-lg font-semibold">{s.name}</dt>
                <dd className="lead mt-1">{s.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
