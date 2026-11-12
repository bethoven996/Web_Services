import { useEffect, useState } from 'react'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Logo } from './Logo'
import { waLink } from '../config'

const links = [
  { href: '#panel', label: 'El panel' },
  { href: '#planes', label: 'Planes' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#preguntas', label: 'Preguntas' },
]

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('ws-theme', dark ? 'dark' : 'light')
    } catch {
      /* sin storage disponible */
    }
  }, [dark])
  return [dark, setDark] as const
}

export function Nav() {
  const [dark, setDark] = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled ? 'border-b border-mist bg-paper/80 backdrop-blur dark:border-night-line dark:bg-night/85' : 'border-b border-transparent'
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Principal">
        <Logo />
        <ul className="hidden items-center gap-7 text-[0.95rem] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-medium text-ink/80 hover:text-indigo dark:text-moon/80 dark:hover:text-moon">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            className="grid h-10 w-10 place-items-center rounded-full text-muted hover:text-ink dark:text-moon-muted dark:hover:text-moon"
            aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn hidden bg-gradient-to-r from-[#3A1FD0] to-[#1F6BF0] !py-2.5 text-white shadow-md shadow-indigo/25 hover:brightness-110 sm:inline-flex">
            Pedí tu presupuesto <ArrowRight size={17} />
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Abrir menú"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-mist bg-paper md:hidden dark:border-night-line dark:bg-night">
          <ul className="wrap flex flex-col py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn-primary w-full">
                Pedí tu presupuesto
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
