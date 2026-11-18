import {
  Backpack, Coffee, Footprints, Gem, Glasses, Headphones, Lamp, Laptop, Shirt, Smartphone, Sofa, Speaker, Umbrella, Watch,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from './data'

const icons: Record<IconKey, LucideIcon> = {
  shirt: Shirt, footprints: Footprints, watch: Watch, backpack: Backpack, glasses: Glasses, lamp: Lamp,
  coffee: Coffee, headphones: Headphones, smartphone: Smartphone, gem: Gem, umbrella: Umbrella, speaker: Speaker, sofa: Sofa, laptop: Laptop,
}

export const iconOptions = Object.keys(icons) as IconKey[]

// Imagen ilustrada del producto. En una tienda real se reemplaza por la foto.
export function ProductArt({ icon, tone, className = '', size = 64 }: { icon: IconKey; tone: string; className?: string; size?: number }) {
  const Icon = icons[icon]
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`} style={{ backgroundColor: tone }} aria-hidden="true">
      <div className="absolute -right-6 -bottom-6 h-2/3 w-2/3 rounded-full bg-white/40" />
      <div className="absolute -top-8 -left-8 h-1/2 w-1/2 rounded-full bg-white/30" />
      <Icon size={size} strokeWidth={1.25} className="relative text-neutral-800/75" />
    </div>
  )
}
