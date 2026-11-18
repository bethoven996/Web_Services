import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { seedOrders, seedProducts, type Order, type OrderStatus, type Product } from './data'

export type CartLine = { productId: string; qty: number }
type State = { products: Product[]; orders: Order[]; cart: CartLine[] }

type Action =
  | { type: 'add'; productId: string }
  | { type: 'qty'; productId: string; qty: number }
  | { type: 'order'; customer: string; orderId: number }
  | { type: 'status'; id: number; status: OrderStatus }
  | { type: 'newProduct'; product: Product }
  | { type: 'toggle'; id: string }
  | { type: 'stock'; id: string; stock: number }
  | { type: 'reset' }

const KEY = 'nova-demo-v1'

function fresh(): State {
  const products = seedProducts.map((p) => ({ ...p }))
  return { products, orders: seedOrders(products), cart: [] }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {
    /* sin storage: arrancamos de cero */
  }
  return fresh()
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const p = s.products.find((x) => x.id === a.productId)
      const line = s.cart.find((l) => l.productId === a.productId)
      if (!p || (line?.qty ?? 0) >= p.stock) return s
      return {
        ...s,
        cart: line ? s.cart.map((l) => (l === line ? { ...l, qty: l.qty + 1 } : l)) : [...s.cart, { productId: a.productId, qty: 1 }],
      }
    }
    case 'qty': {
      const p = s.products.find((x) => x.id === a.productId)
      const qty = Math.min(a.qty, p?.stock ?? 0)
      return { ...s, cart: qty <= 0 ? s.cart.filter((l) => l.productId !== a.productId) : s.cart.map((l) => (l.productId === a.productId ? { ...l, qty } : l)) }
    }
    case 'order': {
      const items = s.cart.flatMap((l) => {
        const p = s.products.find((x) => x.id === l.productId)
        return p ? [{ productId: p.id, name: p.name, price: p.price, qty: l.qty }] : []
      })
      if (!items.length) return s
      const order: Order = {
        id: a.orderId,
        date: new Date().toISOString(),
        customer: a.customer,
        items,
        total: items.reduce((t, i) => t + i.price * i.qty, 0),
        status: 'nuevo',
        live: true,
      }
      return {
        products: s.products.map((p) => {
          const it = items.find((i) => i.productId === p.id)
          return it ? { ...p, stock: p.stock - it.qty } : p
        }),
        orders: [...s.orders, order],
        cart: [],
      }
    }
    case 'status':
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, status: a.status } : o)) }
    case 'newProduct':
      return { ...s, products: [a.product, ...s.products] }
    case 'toggle':
      return { ...s, products: s.products.map((p) => (p.id === a.id ? { ...p, active: !p.active } : p)) }
    case 'stock':
      return { ...s, products: s.products.map((p) => (p.id === a.id ? { ...p, stock: Math.max(0, a.stock) } : p)) }
    case 'reset':
      return fresh()
  }
}

type Ctx = { state: State; dispatch: (a: Action) => void; nextOrderId: () => number }
const DemoCtx = createContext<Ctx | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* sin storage */
    }
  }, [state])
  const nextOrderId = () => Math.max(...state.orders.map((o) => o.id)) + 1
  return <DemoCtx.Provider value={{ state, dispatch, nextOrderId }}>{children}</DemoCtx.Provider>
}

export function useDemo() {
  const c = useContext(DemoCtx)
  if (!c) throw new Error('useDemo fuera de DemoProvider')
  return c
}
