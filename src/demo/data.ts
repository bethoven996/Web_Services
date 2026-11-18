// Datos de la tienda de demostración "Nova Store" (ficticia).

export type IconKey =
  | 'shirt' | 'footprints' | 'watch' | 'backpack' | 'glasses' | 'lamp'
  | 'coffee' | 'headphones' | 'smartphone' | 'gem' | 'umbrella' | 'speaker' | 'sofa' | 'laptop'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  min: number
  icon: IconKey
  tone: string // color de fondo de la imagen del producto
  active: boolean
  desc: string
  isNew?: boolean
}

export type OrderItem = { productId: string; name: string; price: number; qty: number }
export type OrderStatus = 'nuevo' | 'preparando' | 'entregado'
export type Order = {
  id: number
  date: string
  customer: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  live?: boolean // pedido hecho durante la demo
}

export const categories = ['Indumentaria', 'Calzado', 'Accesorios', 'Hogar', 'Tecnología'] as const

export const tones = ['#F3E8DD', '#E4ECF4', '#E7EFE4', '#F4E4E6', '#ECE6F5', '#F5EFD9']

export const seedProducts: Product[] = [
  { id: 'p1', name: 'Remera algodón premium', category: 'Indumentaria', price: 18900, stock: 34, min: 8, icon: 'shirt', tone: '#E4ECF4', active: true, desc: 'Algodón peinado 24/1, calce regular. Talles S a XXL.' },
  { id: 'p2', name: 'Buzo canguro frisa', category: 'Indumentaria', price: 42500, stock: 6, min: 6, icon: 'shirt', tone: '#E7EFE4', active: true, desc: 'Frisa invisible, capucha forrada y bolsillo canguro.' },
  { id: 'p3', name: 'Zapatillas urbanas', category: 'Calzado', price: 74900, stock: 12, min: 4, icon: 'footprints', tone: '#F3E8DD', active: true, desc: 'Capellada de cuero ecológico y suela de goma liviana.' },
  { id: 'p4', name: 'Botas de cuero', category: 'Calzado', price: 118000, stock: 3, min: 3, icon: 'footprints', tone: '#F4E4E6', active: true, desc: 'Cuero vacuno, plantilla acolchada. Hechas en Argentina.' },
  { id: 'p5', name: 'Reloj minimalista', category: 'Accesorios', price: 56000, stock: 9, min: 3, icon: 'watch', tone: '#ECE6F5', active: true, desc: 'Malla de acero, resistente al agua 3 ATM.' },
  { id: 'p6', name: 'Mochila urbana 20 L', category: 'Accesorios', price: 39900, stock: 15, min: 5, icon: 'backpack', tone: '#E4ECF4', active: true, desc: 'Bolsillo acolchado para notebook de hasta 15".' },
  { id: 'p7', name: 'Anteojos de sol', category: 'Accesorios', price: 29500, stock: 2, min: 4, icon: 'glasses', tone: '#F5EFD9', active: true, desc: 'Lentes polarizados con protección UV400.' },
  { id: 'p8', name: 'Lámpara de mesa', category: 'Hogar', price: 34800, stock: 11, min: 3, icon: 'lamp', tone: '#F5EFD9', active: true, desc: 'Base de madera, luz cálida regulable.' },
  { id: 'p9', name: 'Set de tazas x4', category: 'Hogar', price: 21900, stock: 20, min: 5, icon: 'coffee', tone: '#F3E8DD', active: true, desc: 'Cerámica esmaltada, aptas para lavavajillas.' },
  { id: 'p10', name: 'Auriculares inalámbricos', category: 'Tecnología', price: 64900, stock: 8, min: 4, icon: 'headphones', tone: '#ECE6F5', active: true, desc: 'Bluetooth 5.3, 30 horas de batería y cancelación de ruido.' },
  { id: 'p11', name: 'Parlante portátil', category: 'Tecnología', price: 52300, stock: 14, min: 4, icon: 'speaker', tone: '#E7EFE4', active: true, desc: 'Resistente al agua, 12 horas de autonomía.' },
  { id: 'p12', name: 'Funda para celular', category: 'Tecnología', price: 9900, stock: 48, min: 10, icon: 'smartphone', tone: '#F4E4E6', active: true, desc: 'Silicona con interior de microfibra.' },
]

const customers = [
  'Lucía Martínez', 'Martín Gómez', 'Sofía Romero', 'Joaquín Pérez', 'Valentina Castro', 'Tomás Benítez',
  'Camila Fernández', 'Nicolás Álvarez', 'Agustina Ruiz', 'Federico Sosa', 'Micaela Torres', 'Lautaro Díaz',
]

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Genera ~60 días de pedidos históricos para que el panel tenga datos desde el primer momento.
export function seedOrders(products: Product[]): Order[] {
  const r = rng(7)
  const weights = [0.16, 0.08, 0.1, 0.03, 0.06, 0.08, 0.06, 0.07, 0.09, 0.08, 0.07, 0.12]
  const pick = () => {
    let x = r()
    for (let i = 0; i < weights.length; i++) {
      if (x < weights[i]) return products[i]
      x -= weights[i]
    }
    return products[0]
  }
  const orders: Order[] = []
  const now = new Date()
  let id = 1000
  for (let d = 59; d >= 0; d--) {
    const day = new Date(now)
    day.setDate(now.getDate() - d)
    const dow = day.getDay()
    const boost = dow === 5 || dow === 6 ? 1.5 : dow === 0 ? 0.7 : 1
    const trend = 1 + (59 - d) / 90
    const count = Math.max(1, Math.round((2 + r() * 4) * boost * trend))
    for (let o = 0; o < count; o++) {
      const map = new Map<string, OrderItem>()
      const lines = 1 + Math.floor(r() * 2.2)
      for (let k = 0; k < lines; k++) {
        const p = pick()
        const prev = map.get(p.id)
        if (prev) prev.qty += 1
        else map.set(p.id, { productId: p.id, name: p.name, price: p.price, qty: 1 })
      }
      const items = [...map.values()]
      const date = new Date(day)
      date.setHours(9 + Math.floor(r() * 12), Math.floor(r() * 60))
      if (date > now) date.setTime(now.getTime() - (count - o) * 600000)
      orders.push({
        id: ++id,
        date: date.toISOString(),
        customer: customers[Math.floor(r() * customers.length)],
        items,
        total: items.reduce((a, i) => a + i.price * i.qty, 0),
        status: d > 2 ? 'entregado' : d > 0 ? 'preparando' : 'nuevo',
      })
    }
  }
  return orders
}

export const ars = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export const compact = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1).replace('.', ',')} M` : n >= 1000 ? `$${Math.round(n / 1000)} mil` : `$${n}`
