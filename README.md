# Web Service: sitio web

Landing de Web Service hecha con React, Vite, TypeScript, Tailwind CSS v4, Framer Motion y Recharts.

## Correrlo en tu compu

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

## Qué cambiar primero

Todo el contenido editable está en **`src/config.ts`**:

- `whatsapp`, `email`, `instagram`, `linkedin`, `github`
- `owner.photo`: poné tu foto en `public/beto.jpg` y escribí `'/beto.jpg'`
- `projects[0].url`: el link real de La Ribera
- planes, textos de mantenimiento y preguntas frecuentes

Logo: está vectorizado en `src/components/Logo.tsx` (isotipo + texto) y los archivos sueltos están en `public/brand/` (horizontal claro y oscuro, isotipo, ícono de app y el PNG original).

Capturas reales del portfolio: en `src/sections/Portfolio.tsx` cambiá `<Mock p={...} />` por `<img src="/la-ribera.png" alt="La Ribera" className="rounded-xl" />`.

## Subir a Vercel

1. Subí la carpeta a un repo de GitHub.
2. En vercel.com elegí **Add New → Project**, importá el repo y dejá todo por defecto (Vercel detecta Vite solo).
3. Para tu dominio, andá a **Settings → Domains** y agregalo.

## Estructura

```
src/
  config.ts           ← datos editables
  data/demo.ts        ← datos ficticios del panel de demo
  components/         ← Nav, Logo
  sections/           ← cada sección de la página
```
