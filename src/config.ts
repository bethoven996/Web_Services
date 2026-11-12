// ─────────────────────────────────────────────────────────────
//  TODOS LOS DATOS EDITABLES DE LA WEB ESTÁN ACÁ.
//  Cambiá lo que diga "CAMBIAR" y listo.
// ─────────────────────────────────────────────────────────────

export const site = {
  brand: "Web Service",
  tagline: "Webs que venden. Datos que deciden.",
  city: "Rosario, Argentina",

  whatsapp: "5493413101996",
  email: "narvaeznorberto29@gmail.com",
  // CAMBIAR (dejá '' para ocultar)
  instagram: "https://instagram.com/webservice",
  linkedin: "https://www.linkedin.com/in/",
  github: "https://github.com/",

  owner: {
    name: "Beto Narvaez",
    fullName: "Norberto Narvaez",
    role: "Desarrollador web · React y Python",
    photo: "foto.jpeg",
  },
};

export const waLink = (
  text = "Hola! Quiero una página para mi emprendimiento.",
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type Plan = {
  id: string;
  name: string;
  forWho: string;
  includes: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "inicial",
    name: "Inicial",
    forWho: "Para arrancar a tener presencia online.",
    includes: [
      "Página de una sola sección (landing)",
      "Diseño a medida, adaptado a celular",
      "Botón de WhatsApp y formulario de contacto",
      "Ubicación en Google Maps",
      "Publicación en tu dominio",
    ],
  },
  {
    id: "negocio",
    name: "Negocio",
    forWho: "Para mostrar y vender tus productos.",
    featured: true,
    includes: [
      "Todo lo del plan Inicial",
      "Catálogo de productos con categorías y buscador",
      "Carrito con pedido directo por WhatsApp",
      "Panel para cargar y editar productos",
      "SEO básico para aparecer en Google",
    ],
  },
  {
    id: "completo",
    name: "Completo",
    forWho: "Para manejar tu negocio con datos.",
    includes: [
      "Todo lo del plan Negocio",
      "Dashboard de ventas: productos vendidos, ingresos y ticket promedio",
      "Control de stock con avisos de faltantes",
      "Registro de pedidos y clientes",
      "Capacitación para usar el panel",
    ],
  },
];

export const maintenance = {
  without: {
    title: "Sin mantenimiento",
    text: "Pagás una sola vez y la web es tuya. Te entregamos todo funcionando y te enseñamos a usarla. Si después necesitás cambios, los cotizamos aparte.",
  },
  with: {
    title: "Con mantenimiento mensual",
    text: "Nos ocupamos de que todo siga andando: cambios de textos, fotos y precios, copias de seguridad, renovación de dominio y soporte por WhatsApp.",
  },
};

export type Project = {
  name: string;
  kind: string;
  summary: string;
  tags: string[];
  url?: string;
  real: boolean;
  palette: [string, string, string];
};

export const projects: Project[] = [
  {
    // CAMBIAR: poné el link real de La Ribera
    name: "La Ribera",
    kind: "Tienda online + panel de ventas",
    summary:
      "Catálogo completo con carrito y un panel donde los dueños ven qué productos se venden más, cuánto facturaron y qué les queda en stock.",
    tags: ["React", "Dashboard", "Catálogo", "Stock"],
    url: "",
    real: true,
    palette: ["#0E7490", "#F59E0B", "#F8FAFC"],
  },
  {
    name: "Pizzería Don Tano",
    kind: "Menú online con pedidos",
    summary:
      "Carta con fotos, armado del pedido y envío directo al WhatsApp del local. El dueño ve los pedidos del día y los gustos más pedidos.",
    tags: ["Menú", "Pedidos", "WhatsApp"],
    real: false,
    palette: ["#B91C1C", "#FBBF24", "#FFF7ED"],
  },
  {
    name: "Estudio Pilates Norte",
    kind: "Web institucional con turnos",
    summary:
      "Presentación del estudio, horarios de clases y reserva de turnos. El panel muestra ocupación por horario y alumnos activos.",
    tags: ["Turnos", "Institucional", "Panel"],
    real: false,
    palette: ["#047857", "#A7F3D0", "#F0FDF4"],
  },
];

export const faqs = [
  {
    q: "¿Cuánto sale una página?",
    a: "Depende de lo que necesites: no es lo mismo una landing que una tienda con panel de ventas. Contame tu proyecto por WhatsApp y en el día te pasamos un presupuesto cerrado, sin sorpresas.",
  },
  {
    q: "¿De verdad está lista en una semana?",
    a: "Sí, para los planes Inicial y Negocio. El plan Completo puede llevar unos días más según la cantidad de productos. Lo que más acelera todo es tener fotos, textos y logo a mano.",
  },
  {
    q: "¿Qué necesito tener para empezar?",
    a: "Solo ganas. Si tenés logo, fotos y lista de productos, mejor. Si no, te ayudamos a ordenarlo y te decimos exactamente qué hace falta.",
  },
  {
    q: "¿Puedo cargar productos y cambiar precios yo?",
    a: "Sí. Desde el plan Negocio tenés un panel simple para agregar, editar o pausar productos sin tocar nada de código.",
  },
  {
    q: "¿Qué pasa con el dominio y el hosting?",
    a: "Te ayudamos a registrar tu dominio (.com o .com.ar) y la web queda publicada en servidores rápidos y seguros. Con mantenimiento, de las renovaciones nos ocupamos nosotros.",
  },
  {
    q: "¿Trabajan solo con negocios de Rosario?",
    a: "No, trabajamos con emprendimientos de todo el país. Nos podemos juntar en persona si estás en Rosario o hacer todo por videollamada y WhatsApp.",
  },
];
