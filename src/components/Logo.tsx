import { useId } from 'react'
import { site } from '../config'

// Isotipo WS vectorizado del logo original. Los archivos sueltos están en /public/brand.
const paths = [
  'M0,37 L29.6,37 L50,73.5 L50,61.3 L74.3,45.7 L74.3,81.7 L59.5,99 L33.9,99 Z',
  'M80.4,40 L106.5,23.9 L106.5,99 L80.4,99 Z',
  'M114.3,19.6 L143,0.4 L143,63.9 L114.3,94.3 Z',
  'M237,6.5 L219.6,29.6 L174,29.6 A6.3,6.3 0 0 0 174,42.2 L206.5,42.2 A28.4,28.4 0 0 1 206.5,99 L126,99 L147.8,75 L205.6,75 A5.55,5.55 0 0 0 205.6,63.9 L177,63.9 C160,63.9 149,50 149,35 C149,19 162,6.5 178,6.5 Z',
]

export function Isotipo({ className = '', white = false }: { className?: string; white?: boolean }) {
  const id = useId()
  return (
    <svg viewBox="0 0 240 100" className={className} aria-hidden="true">
      {!white && (
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="95" y1="104" x2="150" y2="0">
            <stop offset="0" stopColor="#2A17B5" />
            <stop offset="0.55" stopColor="#1F55E8" />
            <stop offset="0.85" stopColor="#0AA6F2" />
            <stop offset="1" stopColor="#03D2E6" />
          </linearGradient>
        </defs>
      )}
      <g fill={white ? '#fff' : `url(#${id})`}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#inicio" className={`flex items-center gap-3 ${className}`} aria-label={`${site.brand}, ir al inicio`}>
      <Isotipo className="h-7 w-auto shrink-0" />
      <span className="h-8 w-px bg-ink/30 dark:bg-moon/40" aria-hidden="true" />
      <span className="flex flex-col font-sans leading-[0.95]">
        <span className="text-[0.95rem] font-medium">Web</span>
        <span className="text-[1.15rem] font-extrabold tracking-tight">Service</span>
      </span>
    </a>
  )
}
