import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowDown, ArrowUp, ClipboardList, LayoutDashboard, Minus, Package, Plus, RotateCcw, Store, TriangleAlert,
} from 'lucide-react'
import { ars, categories, compact, tones, type Order, type OrderStatus, type Product } from './data'
import { ProductArt, iconOptions } from './ProductArt'
import { useDemo } from './store'

type Tab = 'resumen' | 'pedidos' | 'productos'

const statusLabel: Record<OrderStatus, string> = { nuevo: 'Nuevo', preparando: 'Preparando', entregado: 'Entregado' }
const statusStyle: Record<OrderStatus, string> = {
  nuevo: 'bg-orange-100 text-orange-800',
  preparando: 'bg-sky-100 text-sky-800',
  entregado: 'bg-emerald-100 text-emerald-800',
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10)
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-neutral-200 bg-white ${className}`}>{children}</div>
}

function StatusPill({ s }: { s: OrderStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[s]}`}>{statusLabel[s]}</span>
}

function Resumen({ go }: { go: (t: Tab) => void }) {
  const { state, dispatch } = useDemo()
  const [days, setDays] = useState<7 | 30>(30)

  const data = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - (days - 1))
    const prevStart = new Date(start)
    prevStart.setDate(prevStart.getDate() - days)
    const inRange = (o: Order, a: Date, b: Date) => {
      const d = new Date(o.date)
      return d >= a && d < b
    }
    const cur = state.orders.filter((o) => inRange(o, start, new Date(now.getTime() + 1)))
    const prev = state.orders.filter((o) => inRange(o, prevStart, start))
    const sum = (a: Order[]) => a.reduce((t, o) => t + o.total, 0)
    const revenue = sum(cur)
    const prevRevenue = sum(prev)

    const byDay = new Map<string, number>()
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      byDay.set(dayKey(d), 0)
    }
    cur.forEach((o) => {
      const k = dayKey(new Date(o.date))
      if (byDay.has(k)) byDay.set(k, (byDay.get(k) ?? 0) + o.total)
    })
    const chart = [...byDay.entries()].map(([k, v]) => ({ label: fmtDate(k + 'T12:00:00'), total: v }))

    const units = new Map<string, number>()
    cur.forEach((o) => o.items.forEach((i) => units.set(i.name, (units.get(i.name) ?? 0) + i.qty)))
    const top = [...units.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

    return {
      revenue,
      revDelta: prevRevenue ? revenue / prevRevenue - 1 : 0,
      orders: cur.length,
      ordDelta: prev.length ? cur.length / prev.length - 1 : 0,
      ticket: cur.length ? Math.round(revenue / cur.length) : 0,
      chart,
      top,
    }
  }, [state.orders, days])

  const pending = state.orders.filter((o) => o.status === 'nuevo').length
  const low = state.products.filter((p) => p.stock <= p.min)
  const latest = [...state.orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const maxTop = data.top[0]?.[1] ?? 1

  const kpis: { label: string; value: string; delta?: number; onClick?: () => void }[] = [
    { label: 'Ventas', value: ars(data.revenue), delta: data.revDelta },
    { label: 'Pedidos', value: String(data.orders), delta: data.ordDelta },
    { label: 'Ticket promedio', value: ars(data.ticket) },
    { label: 'Pedidos por preparar', value: String(pending), onClick: () => go('pedidos') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Resumen</h1>
        <div role="group" aria-label="Período" className="inline-flex rounded-full border border-neutral-200 bg-white p-1">
          {([7, 30] as const).map((d) => (
            <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${days === d ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}>
              Últimos {d} días
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => {
          const body = (
            <>
              <div className="text-sm text-neutral-500">{k.label}</div>
              <div className="mt-1 font-display text-xl font-bold tabular-nums sm:text-2xl">{k.value}</div>
              {k.delta !== undefined && (
                <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${k.delta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {k.delta >= 0 ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                  {Math.abs(k.delta * 100).toFixed(0)}% vs. período anterior
                </div>
              )}
              {k.onClick && <div className="mt-1 text-xs font-semibold text-orange-700">Ver pedidos</div>}
            </>
          )
          return k.onClick ? (
            <button key={k.label} type="button" onClick={k.onClick} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-left hover:border-orange-400">
              {body}
            </button>
          ) : (
            <Card key={k.label} className="p-4">{body}</Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Card className="p-5">
          <h2 className="font-semibold">Ventas por día</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chart} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#737373' }} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tickFormatter={compact} tick={{ fontSize: 11, fill: '#737373' }} tickLine={false} axisLine={false} width={84} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} formatter={(v) => [ars(Number(v)), 'Ventas']} contentStyle={{ borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 13 }} />
                <Bar dataKey="total" fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Más vendidos</h2>
          <ul className="mt-4 space-y-3.5">
            {data.top.map(([name, u]) => (
              <li key={name}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{name}</span>
                  <span className="shrink-0 text-neutral-500 tabular-nums">{u} u.</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: `${(u / maxTop) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr] [&>*]:min-w-0">
        <Card className="p-5">
          <h2 className="font-semibold">Stock bajo</h2>
          {low.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Todo el stock está en orden.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {low.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2.5 text-sm">
                  <TriangleAlert size={17} className="shrink-0 text-amber-700" />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{p.name}</span>: {p.stock === 0 ? 'sin stock' : `quedan ${p.stock}`}
                  </span>
                  <button type="button" onClick={() => dispatch({ type: 'stock', id: p.id, stock: p.stock + 10 })} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-amber-300 hover:ring-amber-600">
                    Reponer 10
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Últimos pedidos</h2>
            <button type="button" onClick={() => go('pedidos')} className="text-sm font-semibold text-orange-700 hover:underline">Ver todos</button>
          </div>
          <ul className="mt-3 divide-y divide-neutral-100">
            {latest.map((o) => (
              <li key={o.id} className={`flex items-center gap-3 py-3 text-sm ${o.live ? '-mx-2 rounded-xl bg-orange-50 px-2' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">
                    #{o.id} {o.customer} {o.live && <span className="ml-1 text-xs font-semibold text-orange-700">Recién llegado</span>}
                  </div>
                  <div className="truncate text-neutral-500">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</div>
                </div>
                <StatusPill s={o.status} />
                <span className="w-24 text-right font-semibold tabular-nums">{ars(o.total)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function Pedidos() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos')
  const list = [...state.orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((o) => filter === 'todos' || o.status === filter)
    .slice(0, 40)
  const counts = (s: OrderStatus) => state.orders.filter((o) => o.status === s).length

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold">Pedidos</h1>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {(['todos', 'nuevo', 'preparando', 'entregado'] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-sm font-medium ${filter === f ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white hover:border-neutral-900'}`}>
            {f === 'todos' ? 'Todos' : `${statusLabel[f]} (${counts(f)})`}
          </button>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className={`border-b border-neutral-100 last:border-0 ${o.live ? 'bg-orange-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="font-semibold">#{o.id}</div>
                  <div className="text-xs text-neutral-500">{fmtDate(o.date)}, {fmtTime(o.date)}</div>
                </td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="max-w-[260px] px-4 py-3 text-neutral-600">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{ars(o.total)}</td>
                <td className="px-4 py-3">
                  <label className="sr-only" htmlFor={`st-${o.id}`}>Estado del pedido {o.id}</label>
                  <select
                    id={`st-${o.id}`}
                    value={o.status}
                    onChange={(e) => dispatch({ type: 'status', id: o.id, status: e.target.value as OrderStatus })}
                    className={`cursor-pointer rounded-full border-0 py-1.5 pr-8 pl-3 text-xs font-semibold ${statusStyle[o.status]}`}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="preparando">Preparando</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {list.length === 0 && <p className="text-sm text-neutral-500">No hay pedidos con ese estado.</p>}
    </div>
  )
}

function Productos() {
  const { state, dispatch } = useDemo()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category: categories[0] as string, price: '', stock: '', icon: iconOptions[0] })
  const [error, setError] = useState('')

  function save(e: FormEvent) {
    e.preventDefault()
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name.trim() || !price || price < 0 || Number.isNaN(stock) || stock < 0 || form.stock === '') {
      setError('Completá nombre, precio y stock con números válidos.')
      return
    }
    const p: Product = {
      id: `n${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price,
      stock,
      min: 3,
      icon: form.icon,
      tone: tones[state.products.length % tones.length],
      active: true,
      desc: 'Producto cargado desde el panel.',
      isNew: true,
    }
    dispatch({ type: 'newProduct', product: p })
    setForm({ name: '', category: categories[0], price: '', stock: '', icon: iconOptions[0] })
    setError('')
    setOpen(false)
  }

  const input = 'mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-neutral-900'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Productos</h1>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {open && (
        <Card className="p-5">
          <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <label className="block text-sm font-medium lg:col-span-2">
              Nombre
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Gorra de gabardina" />
            </label>
            <label className="block text-sm font-medium">
              Categoría
              <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Precio
              <input className={input} inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })} placeholder="15000" />
            </label>
            <label className="block text-sm font-medium">
              Stock
              <input className={input} inputMode="numeric" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, '') })} placeholder="10" />
            </label>
            <fieldset className="sm:col-span-2 lg:col-span-4">
              <legend className="text-sm font-medium">Imagen</legend>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {iconOptions.map((ic) => (
                  <button key={ic} type="button" aria-pressed={form.icon === ic} aria-label={`Imagen ${ic}`} onClick={() => setForm({ ...form, icon: ic })} className={`rounded-xl p-0.5 ${form.icon === ic ? 'ring-2 ring-neutral-900' : 'ring-1 ring-neutral-200'}`}>
                    <ProductArt icon={ic} tone="#f5f5f5" size={20} className="h-11 w-11 rounded-[10px]" />
                  </button>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
              Guardar y publicar
            </button>
            {error && <p className="text-sm text-red-700 sm:col-span-2 lg:col-span-5">{error}</p>}
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">En la tienda</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((p) => (
              <tr key={p.id} className={`border-b border-neutral-100 last:border-0 ${p.active ? '' : 'opacity-55'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductArt icon={p.icon} tone={p.tone} size={20} className="h-11 w-11 shrink-0 rounded-lg" />
                    <div>
                      <div className="font-medium">{p.name} {p.isNew && <span className="ml-1 text-xs font-semibold text-emerald-700">Nuevo</span>}</div>
                      <div className="text-xs text-neutral-500">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{ars(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label={`Restar stock de ${p.name}`} onClick={() => dispatch({ type: 'stock', id: p.id, stock: p.stock - 1 })} className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100">
                      <Minus size={14} />
                    </button>
                    <span className={`w-8 text-center font-semibold tabular-nums ${p.stock <= p.min ? 'text-amber-700' : ''}`}>{p.stock}</span>
                    <button type="button" aria-label={`Sumar stock de ${p.name}`} onClick={() => dispatch({ type: 'stock', id: p.id, stock: p.stock + 1 })} className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100">
                      <Plus size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button type="button" role="switch" aria-checked={p.active} aria-label={`Mostrar ${p.name} en la tienda`} onClick={() => dispatch({ type: 'toggle', id: p.id })} className={`relative h-6 w-11 rounded-full transition-colors ${p.active ? 'bg-emerald-600' : 'bg-neutral-300'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${p.active ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export function Admin({ onShop }: { onShop: () => void }) {
  const { state, dispatch } = useDemo()
  const [tab, setTab] = useState<Tab>('resumen')
  const pending = state.orders.filter((o) => o.status === 'nuevo').length
  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: ClipboardList, badge: pending },
    { id: 'productos', label: 'Productos', icon: Package },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[1400px] flex-col lg:flex-row">
        <aside className="border-b border-neutral-200 bg-white lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="lg:sticky lg:top-[52px]">
          <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
            <div>
              <div className="font-display text-lg font-extrabold tracking-tight">nova<span className="text-orange-600">.</span>store</div>
              <div className="text-xs text-neutral-500">Panel del dueño</div>
            </div>
            <button type="button" onClick={onShop} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-900 lg:hidden">
              <Store size={16} /> Ver tienda
            </button>
          </div>
          <nav aria-label="Secciones del panel" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
            {nav.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                aria-current={tab === id ? 'page' : undefined}
                onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium ${tab === id ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
                <Icon size={18} /> {label}
                {!!badge && <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${tab === id ? 'bg-white text-neutral-900' : 'bg-orange-600 text-white'}`}>{badge}</span>}
              </button>
            ))}
          </nav>
          <div className="hidden space-y-2 px-3 pt-6 lg:block">
            <button type="button" onClick={onShop} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
              <Store size={18} /> Ver tienda
            </button>
            <button type="button" onClick={() => dispatch({ type: 'reset' })} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
              <RotateCcw size={18} /> Reiniciar demo
            </button>
          </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          {tab === 'resumen' && <Resumen go={setTab} />}
          {tab === 'pedidos' && <Pedidos />}
          {tab === 'productos' && <Productos />}
          <button type="button" onClick={() => dispatch({ type: 'reset' })} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 lg:hidden">
            <RotateCcw size={16} /> Reiniciar demo
          </button>
        </main>
      </div>
    </div>
  )
}
