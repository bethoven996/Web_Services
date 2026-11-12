import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import { ars, buildDays, compact, customers, products } from '../data/demo'

const periods = [
  { days: 7, label: '7 días' },
  { days: 30, label: '30 días' },
  { days: 90, label: '90 días' },
] as const

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0)
}

export function DashboardDemo() {
  const all = useMemo(() => buildDays(180), [])
  const [period, setPeriod] = useState<7 | 30 | 90>(30)

  const data = useMemo(() => {
    const cur = all.slice(-period)
    const prev = all.slice(-period * 2, -period)
    const revenue = sum(cur.map((d) => d.revenue))
    const prevRevenue = sum(prev.map((d) => d.revenue))
    const orders = sum(cur.map((d) => d.orders))
    const prevOrders = sum(prev.map((d) => d.orders))
    const units = products.map((_, i) => sum(cur.map((d) => d.units[i])))
    const ranking = products
      .map((p, i) => ({ name: p.name, units: units[i], revenue: units[i] * p.price }))
      .sort((a, b) => b.units - a.units)

    // Para 90 días agrupamos por semana así el gráfico se lee mejor
    let chart: { label: string; revenue: number }[]
    if (period === 90) {
      chart = []
      for (let i = 0; i < cur.length; i += 7) {
        const chunk = cur.slice(i, i + 7)
        chart.push({ label: chunk[0].label, revenue: sum(chunk.map((d) => d.revenue)) })
      }
    } else chart = cur.map((d) => ({ label: d.label, revenue: d.revenue }))

    return {
      revenue,
      orders,
      ticket: Math.round(revenue / orders),
      units: sum(units),
      revDelta: (revenue - prevRevenue) / prevRevenue,
      ordDelta: (orders - prevOrders) / prevOrders,
      ranking,
      chart,
    }
  }, [all, period])

  const maxUnits = data.ranking[0].units
  const lowStock = products.filter((p) => p.stock <= p.min)
  const recent = all
    .slice(-3)
    .reverse()
    .flatMap((d, di) =>
      [0, 1].map((k) => {
        const p = products[(di * 2 + k + 1) % products.length]
        return { when: di === 0 ? 'Hoy' : di === 1 ? 'Ayer' : d.label, who: customers[(di * 3 + k) % customers.length], what: p.name, amount: p.price * (k === 0 ? 1 : 2) }
      }),
    )
    .slice(0, 5)

  const kpis = [
    { label: 'Ingresos', value: ars(data.revenue), delta: data.revDelta },
    { label: 'Pedidos', value: data.orders.toLocaleString('es-AR'), delta: data.ordDelta },
    { label: 'Ticket promedio', value: ars(data.ticket) },
    { label: 'Unidades vendidas', value: data.units.toLocaleString('es-AR') },
  ]

  return (
    <section id="panel" className="py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="section-title">Probá el panel</h2>
            <p className="lead mt-4 text-lg">
              Esto es lo que vas a ver cuando entres a tu web como dueño. Los datos son de una tienda de ejemplo: cambiá el período y mirá cómo se actualiza.
            </p>
          </div>
          <div role="tablist" aria-label="Período" className="inline-flex rounded-full border border-mist bg-white p-1 dark:border-night-line dark:bg-night-2">
            {periods.map((p) => (
              <button
                key={p.days}
                role="tab"
                aria-selected={period === p.days}
                onClick={() => setPeriod(p.days)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  period === p.days ? 'bg-ink text-white dark:bg-moon dark:text-ink' : 'text-muted hover:text-ink dark:text-moon-muted dark:hover:text-moon'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel mt-10 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl bg-paper p-4 dark:bg-night">
                <div className="text-sm text-muted dark:text-moon-muted">{k.label}</div>
                <div className="mt-1 font-display text-xl font-semibold tabular-nums sm:text-[1.7rem]">{k.value}</div>
                {k.delta !== undefined && (
                  <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${k.delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {k.delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {(k.delta * 100).toFixed(0)}% contra el período anterior
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
            <div>
              <h3 className="px-1 text-base font-semibold">{period === 90 ? 'Ingresos por semana' : 'Ingresos por día'}</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chart} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#8a90ad" strokeOpacity={0.18} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8a90ad' }} tickLine={false} axisLine={false} minTickGap={18} />
                    <YAxis tickFormatter={compact} tick={{ fontSize: 11, fill: '#8a90ad' }} tickLine={false} axisLine={false} width={74} />
                    <Tooltip
                      cursor={{ fill: '#4F46E5', fillOpacity: 0.08 }}
                      formatter={(v) => [ars(Number(v)), 'Ingresos']}
                      contentStyle={{ borderRadius: 10, border: '1px solid #E3E6F0', fontSize: 13 }}
                    />
                    <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="px-1 text-base font-semibold">Productos más vendidos</h3>
              <ul className="mt-4 space-y-3.5">
                {data.ranking.map((r) => (
                  <li key={r.name}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium">{r.name}</span>
                      <span className="tabular-nums text-muted dark:text-moon-muted">{r.units} u.</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-mist dark:bg-night-line">
                      <div className="h-2 rounded-full bg-cyan transition-[width] duration-500" style={{ width: `${(r.units / maxUnits) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-6 [&>*]:min-w-0 border-t border-mist pt-6 lg:grid-cols-[1fr_1.6fr] dark:border-night-line">
            <div>
              <h3 className="px-1 text-base font-semibold">Para reponer</h3>
              <ul className="mt-3 space-y-2">
                {lowStock.map((p) => (
                  <li key={p.name} className="flex items-center gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm dark:border-amber-400/30 dark:bg-amber-400/10">
                    <AlertTriangle size={17} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="flex-1">
                      <span className="font-medium">{p.name}</span>: quedan {p.stock}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="px-1 text-base font-semibold">Últimos pedidos</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-muted dark:text-moon-muted">
                    <tr>
                      <th className="px-1 pb-2 font-medium">Cuándo</th>
                      <th className="px-1 pb-2 font-medium">Cliente</th>
                      <th className="px-1 pb-2 font-medium">Producto</th>
                      <th className="px-1 pb-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o, i) => (
                      <tr key={i} className="border-t border-mist dark:border-night-line">
                        <td className="px-1 py-2.5 text-muted dark:text-moon-muted">{o.when}</td>
                        <td className="px-1 py-2.5">{o.who}</td>
                        <td className="px-1 py-2.5">{o.what}</td>
                        <td className="px-1 py-2.5 text-right tabular-nums">{ars(o.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
