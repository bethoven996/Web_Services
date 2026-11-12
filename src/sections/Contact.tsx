import { useState, type FormEvent } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { site, waLink } from '../config'

const needs = ['Landing page', 'Web institucional', 'Tienda online', 'Tienda + panel con dashboards', 'Todavía no sé']

// El formulario arma el mensaje y abre WhatsApp: no necesita servidor.
// Si más adelante querés recibirlo por mail, se puede conectar a Formspree o a un backend en FastAPI.
export function Contact() {
  const [form, setForm] = useState({ name: '', business: '', need: needs[3], message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Escribí tu nombre para saber cómo llamarte.'
    if (!form.business.trim()) errs.business = 'Contanos cómo se llama o de qué es tu emprendimiento.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const text = `Hola! Soy ${form.name}, de ${form.business}.\nMe interesa: ${form.need}.${form.message.trim() ? `\n\n${form.message.trim()}` : ''}`
    window.open(waLink(text), '_blank', 'noopener')
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-mist bg-white px-4 py-3 text-base outline-none transition-colors focus:border-indigo dark:border-night-line dark:bg-night dark:focus:border-indigo-soft'

  return (
    <section id="contacto" className="pb-24 lg:pb-32">
      <div className="wrap">
        <div className="grid gap-12 overflow-hidden rounded-3xl bg-ink p-8 text-moon sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-16 dark:bg-night-2">
          <div>
            <h2 className="section-title text-white">Contanos tu proyecto</h2>
            <p className="mt-4 max-w-[44ch] text-lg text-moon-muted">
              Completá el formulario y se abre WhatsApp con tu mensaje listo para mandar. Te respondemos con un presupuesto cerrado.
            </p>
            <div className="mt-10 space-y-3">
              <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white hover:text-cyan">
                <MessageCircle size={20} /> Escribinos por WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white hover:text-cyan">
                <Mail size={20} /> {site.email}
              </a>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="rounded-2xl bg-paper p-6 text-ink sm:p-8 dark:bg-night dark:text-moon">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Tu nombre
                <input className={field} value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-name" />
                {errors.name && <span id="err-name" className="mt-1.5 block text-sm font-normal text-rose-600 dark:text-rose-400">{errors.name}</span>}
              </label>
              <label className="block text-sm font-medium">
                Tu emprendimiento
                <input className={field} value={form.business} onChange={set('business')} placeholder="Ej: tienda de ropa" aria-invalid={!!errors.business} aria-describedby="err-business" />
                {errors.business && <span id="err-business" className="mt-1.5 block text-sm font-normal text-rose-600 dark:text-rose-400">{errors.business}</span>}
              </label>
            </div>
            <label className="mt-5 block text-sm font-medium">
              ¿Qué necesitás?
              <select className={field} value={form.need} onChange={set('need')}>
                {needs.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="mt-5 block text-sm font-medium">
              Algo más que quieras contarnos <span className="font-normal text-muted dark:text-moon-muted">(opcional)</span>
              <textarea className={`${field} min-h-28 resize-y`} value={form.message} onChange={set('message')} />
            </label>
            <button type="submit" className="btn-primary mt-6 w-full">
              <MessageCircle size={18} /> Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
