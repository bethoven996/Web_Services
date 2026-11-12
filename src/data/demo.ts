// Datos ficticios para el demo del panel. Generados de forma determinística
// para que el demo se vea igual en cada visita.

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export type Product = { name: string; category: string; price: number; stock: number; min: number }

export const products: Product[] = [
  { name: 'Remera oversize', category: 'Indumentaria', price: 18500, stock: 42, min: 10 },
  { name: 'Buzo canguro', category: 'Indumentaria', price: 36900, stock: 7, min: 8 },
  { name: 'Gorra bordada', category: 'Accesorios', price: 12900, stock: 25, min: 6 },
  { name: 'Jean recto', category: 'Indumentaria', price: 42500, stock: 15, min: 6 },
  { name: 'Tote bag', category: 'Accesorios', price: 9800, stock: 3, min: 5 },
  { name: 'Medias pack x3', category: 'Accesorios', price: 7500, stock: 60, min: 15 },
]

const weights = [0.28, 0.14, 0.16, 0.12, 0.1, 0.2]

export type Day = { date: Date; label: string; revenue: number; orders: number; units: number[] }

export function buildDays(n = 90): Day[] {
  const r = rng(42)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const out: Day[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    const weekend = dow === 5 || dow === 6 ? 1.45 : dow === 0 ? 0.7 : 1
    const trend = 1 + ((n - i) / n) * 1.1
    const orders = Math.max(1, Math.round((3 + r() * 5) * weekend * trend))
    const units = products.map(() => 0)
    let revenue = 0
    for (let o = 0; o < orders; o++) {
      const items = 1 + Math.floor(r() * 2.4)
      for (let k = 0; k < items; k++) {
        let x = r()
        let idx = 0
        while (x > weights[idx] && idx < weights.length - 1) {
          x -= weights[idx]
          idx++
        }
        units[idx]++
        revenue += products[idx].price
      }
    }
    out.push({
      date: d,
      label: d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
      revenue,
      orders,
      units,
    })
  }
  return out
}

export const customers = ['Lucía M.', 'Martín G.', 'Sofía R.', 'Joaquín P.', 'Valentina C.', 'Tomás B.', 'Camila F.', 'Nicolás A.']

export const ars = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export const compact = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1).replace('.', ',')} M` : n >= 1000 ? `$${Math.round(n / 1000)} mil` : `$${n}`
