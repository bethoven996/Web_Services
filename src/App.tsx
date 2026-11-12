import { MessageCircle } from 'lucide-react'
import { Nav } from './components/Nav'
import { Logo } from './components/Logo'
import { Hero } from './sections/Hero'
import { TwoSides } from './sections/TwoSides'
import { DashboardDemo } from './sections/DashboardDemo'
import { Plans } from './sections/Plans'
import { Process } from './sections/Process'
import { QuienesSomos } from './sections/QuienesSomos'
import { Faq } from './sections/Faq'
import { Contact } from './sections/Contact'
import { site, waLink } from './config'

function Footer() {
  const socials = [
    { label: 'Instagram', href: site.instagram },
    { label: 'LinkedIn', href: site.linkedin },
    { label: 'GitHub', href: site.github },
  ].filter((s) => s.href)
  return (
    <footer className="border-t border-mist py-10 dark:border-night-line">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted dark:text-moon-muted">
            {site.tagline} {site.city}.
          </p>
        </div>
        <ul className="flex gap-6 text-sm">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ink dark:text-moon-muted dark:hover:text-moon">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="wrap mt-8 text-xs text-muted dark:text-moon-muted">© {new Date().getFullYear()} {site.brand}</p>
    </footer>
  )
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px] overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 right-[-10%] h-[700px] w-[700px] rounded-full bg-indigo/15 lg:bg-indigo/25 blur-[120px] dark:bg-indigo/30" />
      <div className="absolute top-40 right-[-18%] h-[520px] w-[520px] rounded-full bg-cyan/25 blur-[110px] dark:bg-cyan/15" />
      <div className="absolute top-[30%] left-[-15%] h-[460px] w-[460px] rounded-full bg-indigo-soft/15 blur-[120px]" />
      <div className="absolute top-[-12%] right-[-6%] hidden h-[900px] w-[340px] rotate-[32deg] lg:block rounded-[80px] bg-gradient-to-b from-indigo/70 via-[#2f5bf0]/60 to-cyan/60 opacity-60 blur-[2px] dark:opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper dark:to-night" />
    </div>
  )
}

export default function App() {
  return (
    <div className="relative isolate">
      <HeroBackground />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <Hero />
        <TwoSides />
        <DashboardDemo />
        <Plans />
        <Process />
        <QuienesSomos />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  )
}
