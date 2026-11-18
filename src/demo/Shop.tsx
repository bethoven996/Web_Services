import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleCheck, Minus, Plus, Search, ShoppingBag, Truck, X } from 'lucide-react'
import { ars, categories, type Order, type Product } from './data'
import { ProductArt } from './ProductArt'
import { useDemo } from './store'

function StockBadge({ p }: { p: Product }) {
  if (p.stock === 0) return <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white">Sin stock</span>
  if (p.stock <= p.min) return <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">Últimas {p.stock}</span>
  if (p.isNew) return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Nuevo</span>
  return null
}

function ProductModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const { dispatch } = useDemo()
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-0 sm:place-items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white sm:grid-cols-2 sm:rounded-3xl"
      >
        <ProductArt icon={p.icon} tone={p.tone} size={120} className="aspect-square sm:aspect-auto sm:h-full" />
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-neutral-500">{p.category}</span>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="-mt-1 -mr-2 grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100">
              <X size={20} />
            </button>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">{p.name}</h2>
          <div className="mt-3 font-display text-3xl font-bold">{ars(p.price)}</div>
          <div className="mt-1 text-sm text-neutral-500">o 3 cuotas sin interés de {ars(Math.round(p.price / 3))}</div>
          <p className="mt-5 text-neutral-700">{p.desc}</p>
          <div className="mt-4"><StockBadge p={p} /></div>
          <div className="mt-auto pt-8">
            <button
              type="button"
              disabled={p.stock === 0}
              onClick={() => {
                dispatch({ type: 'add', productId: p.id })
                onClose()
              }}
              className="w-full rounded-full bg-neutral-900 py-3.5 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-neutral-500">
              <Truck size={16} /> Envío gratis en compras desde $60.000
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Cart({ open, onClose, onOrdered }: { open: boolean; onClose: () => void; onOrdered: (o: Order) => void }) {
  const { state, dispatch, nextOrderId } = useDemo()
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const lines = state.cart.flatMap((l) => {
    const p = state.products.find((x) => x.id === l.productId)
    return p ? [{ ...l, p }] : []
  })
  const total = lines.reduce((t, l) => t + l.p.price * l.qty, 0)

  function confirm(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Escribí tu nombre para que la tienda sepa de quién es el pedido.')
      return
    }
    const id = nextOrderId()
    const order: Order = {
      id,
      date: new Date().toISOString(),
      customer: name.trim(),
      items: lines.map((l) => ({ productId: l.p.id, name: l.p.name, price: l.p.price, qty: l.qty })),
      total,
      status: 'nuevo',
      live: true,
    }
    dispatch({ type: 'order', customer: name.trim(), orderId: id })
    setStep('cart')
    setName('')
    setError('')
    onOrdered(order)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <h2 className="font-display text-xl font-bold">{step === 'cart' ? 'Tu carrito' : 'Finalizar compra'}</h2>
              <button type="button" onClick={onClose} aria-label="Cerrar carrito" className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <ShoppingBag size={40} strokeWidth={1.4} className="text-neutral-400" />
                <p className="font-medium">Tu carrito está vacío</p>
                <p className="text-sm text-neutral-500">Agregá productos desde el catálogo.</p>
                <button type="button" onClick={onClose} className="mt-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold hover:border-neutral-900">
                  Ver productos
                </button>
              </div>
            ) : step === 'cart' ? (
              <>
                <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex gap-4 py-4">
                      <ProductArt icon={l.p.icon} tone={l.p.tone} size={30} className="h-20 w-20 shrink-0 rounded-xl" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="font-medium">{l.p.name}</span>
                        <span className="text-sm text-neutral-500">{ars(l.p.price)}</span>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-neutral-200">
                            <button type="button" aria-label="Restar uno" onClick={() => dispatch({ type: 'qty', productId: l.productId, qty: l.qty - 1 })} className="grid h-9 w-9 place-items-center">
                              <Minus size={15} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                            <button type="button" aria-label="Sumar uno" disabled={l.qty >= l.p.stock} onClick={() => dispatch({ type: 'qty', productId: l.productId, qty: l.qty + 1 })} className="grid h-9 w-9 place-items-center disabled:opacity-30">
                              <Plus size={15} />
                            </button>
                          </div>
                          <span className="font-semibold tabular-nums">{ars(l.p.price * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-neutral-200 p-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{ars(total)}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{total >= 60000 ? 'Tenés envío gratis.' : `Te faltan ${ars(60000 - total)} para el envío gratis.`}</p>
                  <button type="button" onClick={() => setStep('checkout')} className="mt-5 w-full rounded-full bg-neutral-900 py-3.5 font-semibold text-white hover:bg-orange-600">
                    Finalizar compra
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={confirm} noValidate className="flex flex-1 flex-col p-6">
                <label className="block text-sm font-medium">
                  Tu nombre
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Laura Gómez"
                    autoFocus
                    aria-invalid={!!error}
                    aria-describedby="checkout-error"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900"
                  />
                </label>
                {error && <p id="checkout-error" className="mt-2 text-sm text-red-700">{error}</p>}
                <div className="mt-6 rounded-2xl bg-neutral-50 p-4 text-sm">
                  {lines.map((l) => (
                    <div key={l.productId} className="flex justify-between py-1">
                      <span>{l.qty} × {l.p.name}</span>
                      <span className="tabular-nums">{ars(l.p.price * l.qty)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{ars(total)}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-neutral-500">En una tienda real, acá elegís cómo pagar (Mercado Pago, transferencia) y cómo recibir el pedido.</p>
                <div className="mt-auto flex gap-3 pt-6">
                  <button type="button" onClick={() => setStep('cart')} className="rounded-full border border-neutral-300 px-5 py-3.5 font-semibold hover:border-neutral-900">
                    Volver
                  </button>
                  <button type="submit" className="flex-1 rounded-full bg-orange-600 py-3.5 font-semibold text-white hover:bg-orange-700">
                    Confirmar pedido
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function OrderDone({ order, onClose, onPanel }: { order: Order; onClose: () => void; onPanel: () => void }) {
  const msg = `Hola! Soy ${order.customer}. Quiero hacer este pedido (#${order.id}):\n${order.items.map((i) => `• ${i.qty} × ${i.name}`).join('\n')}\nTotal: ${ars(order.total)}`
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div role="dialog" aria-modal="true" aria-label="Pedido confirmado" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl bg-white p-7 text-center">
        <CircleCheck size={52} strokeWidth={1.6} className="mx-auto text-emerald-600" />
        <h2 className="mt-3 font-display text-2xl font-bold">¡Pedido #{order.id} confirmado!</h2>
        <p className="mt-2 text-neutral-600">Así le llega el pedido a la tienda por WhatsApp:</p>
        <div className="mt-4 rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-4 text-left text-sm whitespace-pre-line text-neutral-900">{msg}</div>
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-left text-sm text-orange-900">
          <strong className="font-semibold">Ahora mirá el otro lado:</strong> el pedido ya aparece en el panel del dueño, con el stock descontado y las ventas actualizadas.
        </div>
        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" onClick={onPanel} className="rounded-full bg-neutral-900 py-3.5 font-semibold text-white hover:bg-orange-600">
            Ver el pedido en el panel
          </button>
          <button type="button" onClick={onClose} className="rounded-full py-3 font-semibold text-neutral-700 hover:bg-neutral-100">
            Seguir comprando
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Shop({ onPanel }: { onPanel: () => void }) {
  const { state, dispatch } = useDemo()
  const [cat, setCat] = useState<string>('Todo')
  const [q, setQ] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [detail, setDetail] = useState<Product | null>(null)
  const [done, setDone] = useState<Order | null>(null)
  const [added, setAdded] = useState<string | null>(null)
  const count = state.cart.reduce((t, l) => t + l.qty, 0)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return state.products.filter((p) => p.active && (cat === 'Todo' || p.category === cat) && (!term || p.name.toLowerCase().includes(term)))
  }, [state.products, cat, q])

  function add(p: Product) {
    dispatch({ type: 'add', productId: p.id })
    setAdded(p.id)
    window.setTimeout(() => setAdded((x) => (x === p.id ? null : x)), 1200)
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
          <a href="#tienda" className="font-display text-xl font-extrabold tracking-tight">
            nova<span className="text-orange-600">.</span>store
          </a>
          <label className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <span className="sr-only">Buscar productos</span>
            <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos" className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-neutral-900 focus:bg-white" />
          </label>
          <button type="button" onClick={() => setCartOpen(true)} className="relative ml-auto grid h-11 w-11 place-items-center rounded-full hover:bg-neutral-100 md:ml-0" aria-label={`Abrir carrito, ${count} productos`}>
            <ShoppingBag size={22} />
            {count > 0 && <span className="absolute top-1 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">{count}</span>}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <section className="mt-6 grid overflow-hidden rounded-3xl bg-neutral-900 text-white md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-12">
            <span className="text-sm font-semibold text-orange-400">Nueva temporada</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Lo nuevo ya llegó.</h1>
            <p className="mt-4 max-w-md text-neutral-300">Hasta 3 cuotas sin interés y envío gratis en compras desde $60.000.</p>
            <button type="button" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="mt-7 rounded-full bg-white px-6 py-3 font-semibold text-neutral-900 hover:bg-orange-500 hover:text-white">
              Ver productos
            </button>
          </div>
          <div className="hidden grid-cols-2 gap-3 p-6 md:grid">
            {['p1', 'p3', 'p5', 'p10'].flatMap((id) => state.products.filter((x) => x.id === id)).map((p) => (
              <ProductArt key={p.id} icon={p.icon} tone={p.tone} size={44} className="rounded-2xl" />
            ))}
          </div>
        </section>

        <section id="catalogo" className="scroll-mt-20 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight">Productos</h2>
            <label className="relative w-full md:hidden">
              <span className="sr-only">Buscar productos</span>
              <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos" className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-neutral-900" />
            </label>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Categorías">
            {['Todo', ...categories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? 'bg-neutral-900 text-white' : 'border border-neutral-200 hover:border-neutral-900'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-neutral-300 p-12 text-center">
              <p className="font-medium">No encontramos productos con esa búsqueda.</p>
              <button type="button" onClick={() => { setQ(''); setCat('Todo') }} className="mt-3 text-sm font-semibold text-orange-700 underline underline-offset-4">
                Ver todos los productos
              </button>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {list.map((p) => (
                <li key={p.id} className="group flex flex-col">
                  <button type="button" onClick={() => setDetail(p)} className="relative block overflow-hidden rounded-2xl text-left" aria-label={`Ver ${p.name}`}>
                    <ProductArt icon={p.icon} tone={p.tone} size={56} className="aspect-square transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute top-3 left-3"><StockBadge p={p} /></span>
                  </button>
                  <div className="mt-3 flex flex-1 flex-col">
                    <span className="text-xs text-neutral-500">{p.category}</span>
                    <button type="button" onClick={() => setDetail(p)} className="mt-0.5 text-left font-medium hover:underline">
                      {p.name}
                    </button>
                    <span className="mt-1 mb-3 font-display text-lg font-bold">{ars(p.price)}</span>
                    <button
                      type="button"
                      disabled={p.stock === 0}
                      onClick={() => add(p)}
                      className={`mt-auto rounded-full py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400 ${
                        added === p.id ? 'bg-emerald-600 text-white' : 'border border-neutral-900 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      {p.stock === 0 ? 'Sin stock' : added === p.id ? 'Agregado' : 'Agregar al carrito'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
        nova.store es una tienda de demostración. No se realizan ventas reales.
      </footer>

      <AnimatePresence>{detail && <ProductModal p={detail} onClose={() => setDetail(null)} />}</AnimatePresence>
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onOrdered={(o) => {
          setCartOpen(false)
          setDone(o)
        }}
      />
      <AnimatePresence>
        {done && (
          <OrderDone
            order={done}
            onClose={() => setDone(null)}
            onPanel={() => {
              setDone(null)
              onPanel()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
