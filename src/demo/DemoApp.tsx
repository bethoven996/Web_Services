import { useEffect, useState } from 'react'
import { LayoutDashboard, MessageCircle, Store } from 'lucide-react'
import { waLink } from '../config'
import { Admin } from './Admin'
import { Shop } from './Shop'
import { DemoProvider } from './store'

type View = 'tienda' | 'panel'
const fromHash = (): View => (location.hash === '#panel' ? 'panel' : 'tienda')

function DemoBar({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <div className="sticky top-0 z-40 bg-[#121735] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5 sm:px-8">
        <a href="../" className="flex items-center gap-2 text-sm">
          <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#4F46E5" />
            <rect x="7" y="17" width="4" height="8" rx="1.5" fill="#fff" fillOpacity=".7" />
            <rect x="14" y="12" width="4" height="13" rx="1.5" fill="#fff" fillOpacity=".85" />
            <rect x="21" y="7" width="4" height="18" rx="1.5" fill="#fff" />
          </svg>
          <span>
            <span className="font-semibold">Demo de Web Service.</span>
            <span className="hidden text-white/70 md:inline"> Comprá algo en la tienda y después miralo en el panel.</span>
          </span>
        </a>
        <div role="tablist" aria-label="Cambiar de vista" className="ml-auto inline-flex rounded-full bg-white/10 p-1">
          {([
            { id: 'tienda', label: 'Vista del cliente', icon: Store },
            { id: 'panel', label: 'Panel del dueño', icon: LayoutDashboard },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${view === id ? 'bg-white text-[#121735]' : 'text-white/80 hover:text-white'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        <a href={waLink('Hola! Vi la demo de la tienda y quiero una para mi negocio.')} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#0b2e17] sm:inline-flex">
          <MessageCircle size={16} /> Quiero mi tienda
        </a>
      </div>
    </div>
  )
}

export default function DemoApp() {
  const [view, setViewState] = useState<View>(fromHash)

  useEffect(() => {
    const onHash = () => setViewState(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const setView = (v: View) => {
    setViewState(v)
    try {
      history.replaceState(null, '', v === 'panel' ? '#panel' : '#tienda')
    } catch {
      /* sin history */
    }
    window.scrollTo({ top: 0 })
  }

  return (
    <DemoProvider>
      <DemoBar view={view} setView={setView} />
      {view === 'tienda' ? <Shop onPanel={() => setView('panel')} /> : <Admin onShop={() => setView('tienda')} />}
    </DemoProvider>
  )
}
