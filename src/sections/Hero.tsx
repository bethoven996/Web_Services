import { useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChartColumn,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  Headphones,
  House,
  Package,
  Play,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { waLink } from "../config";
import { ars, buildDays, customers, products } from "../data/demo";
import { Isotipo } from "../components/Logo";

type Sale = { id: number; product: string; amount: number; customer: string };

const pct = (n: number) =>
  `${n >= 0 ? "+" : ""}${(n * 100).toFixed(1).replace(".", ",")}%`;

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`mt-1 inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
    >
      {up ? (
        <ArrowUp size={13} strokeWidth={2.5} />
      ) : (
        <ArrowDown size={13} strokeWidth={2.5} />
      )}
      {pct(value)}
    </span>
  );
}

function Kpi({
  icon,
  label,
  short,
  value,
  delta,
  pulse,
}: {
  icon: ReactNode;
  label: string;
  short: string;
  value: string;
  delta: number;
  pulse: number;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-mist bg-white p-2.5 shadow-[0_6px_20px_-12px_rgba(18,23,53,0.25)] sm:p-3 dark:border-night-line dark:bg-night">
      <span className="text-indigo dark:text-indigo-soft">{icon}</span>
      <div className="mt-1.5 truncate text-xs text-muted dark:text-moon-muted">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{label}</span>
      </div>
      <motion.div
        key={pulse}
        initial={pulse ? { color: "#06B6D4" } : false}
        animate={{ color: "currentColor" }}
        transition={{ duration: 1.2 }}
        className="truncate font-display text-[0.9rem] font-bold tracking-tight tabular-nums sm:text-lg"
      >
        {value}
      </motion.div>
      <Delta value={delta} />
    </div>
  );
}

function LivePanel() {
  const base = useMemo(() => buildDays(35), []);
  const [days, setDays] = useState(base);
  const [toast, setToast] = useState<Sale | null>(null);
  const [pulse, setPulse] = useState(0);
  const counter = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  const today = days[days.length - 1];
  const yesterday = days[days.length - 2];
  const last7 = days.slice(-8, -1);
  const avg = (k: "revenue" | "orders") =>
    last7.reduce((a, d) => a + d[k], 0) / last7.length;
  const ticket = Math.round(today.revenue / today.orders);
  const yTicket = yesterday.revenue / yesterday.orders;
  const chart = days.slice(-28).map((d, i, arr) => {
    // promedio móvil de 4 días para que la curva se lea como tendencia
    const all = days.length - arr.length + i;
    const win = days.slice(Math.max(0, all - 3), all + 1);
    return {
      label: d.label,
      revenue: d.revenue,
      trend: Math.round(win.reduce((a, x) => a + x.revenue, 0) / win.length),
    };
  });
  const half = (a: typeof chart) => a.reduce((s, d) => s + d.revenue, 0);
  const growth = half(chart.slice(14)) / half(chart.slice(0, 14)) - 1;

  function simulate() {
    const idx = Math.floor(Math.random() * products.length);
    const p = products[idx];
    const qty = Math.random() > 0.7 ? 2 : 1;
    const sale: Sale = {
      id: ++counter.current,
      product: qty > 1 ? `${p.name} x${qty}` : p.name,
      amount: p.price * qty,
      customer: customers[Math.floor(Math.random() * customers.length)],
    };
    setDays((prev) => {
      const next = [...prev];
      const t = {
        ...next[next.length - 1],
        units: [...next[next.length - 1].units],
      };
      t.revenue += sale.amount;
      t.orders += 1;
      t.units[idx] += qty;
      next[next.length - 1] = t;
      return next;
    });
    setToast(sale);
    setPulse((n) => n + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }

  const nav = [House, ChartColumn, ShoppingBag, Users, Settings];

  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:mr-0 lg:[transform:perspective(1600px)_rotateY(-9deg)_rotateX(3deg)]">
      <div className="flex overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_40px_80px_-30px_rgba(40,40,140,0.45)] backdrop-blur dark:border-night-line dark:bg-night-2/90">
        <aside
          className="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-mist bg-paper/70 py-5 sm:flex dark:border-night-line dark:bg-night/60"
          aria-hidden="true"
        >
          <Isotipo className="h-4 w-auto" />
          <div className="mt-3 flex flex-col items-center gap-4">
            {nav.map((Icon, i) => (
              <span
                key={i}
                className={`grid h-8 w-8 place-items-center rounded-lg ${i === 0 ? "bg-indigo text-white shadow-md shadow-indigo/30" : "text-muted dark:text-moon-muted"}`}
              >
                <Icon size={16} />
              </span>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-center justify-between">
            <span className="border-l-[3px] border-indigo pl-2.5 font-display text-[1.05rem] font-bold">
              Panel de Tu Tienda
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted dark:text-moon-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En
              vivo
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <Kpi
              icon={<ShoppingBag size={18} />}
              label="Vendiste hoy"
              short="Hoy"
              value={ars(today.revenue)}
              delta={today.revenue / avg("revenue") - 1}
              pulse={pulse}
            />
            <Kpi
              icon={<Package size={18} />}
              label="Pedidos"
              short="Pedidos"
              value={String(today.orders)}
              delta={today.orders / avg("orders") - 1}
              pulse={pulse}
            />
            <Kpi
              icon={<Ticket size={18} />}
              label="Ticket promedio"
              short="Ticket"
              value={ars(ticket)}
              delta={ticket / yTicket - 1}
              pulse={pulse}
            />
          </div>

          <div className="relative mt-3 rounded-xl border border-mist bg-white p-3 pt-4 dark:border-night-line dark:bg-night">
            <div className="flex items-center gap-2 px-1 text-sm font-medium">
              <TrendingUp
                size={16}
                className="text-indigo dark:text-indigo-soft"
              />{" "}
              Ventas de las últimas 4 semanas
            </div>
            <div className="mt-1 h-28 sm:h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chart}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#4F46E5"
                        stopOpacity={0.28}
                      />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="#8a90ad"
                    strokeOpacity={0.15}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#8a90ad" }}
                    tickLine={false}
                    axisLine={false}
                    interval={6}
                    padding={{ left: 10, right: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [ars(Number(v)), "Promedio diario"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E3E6F0",
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="trend"
                    stroke="#4F46E5"
                    strokeWidth={2.4}
                    fill="url(#heroFill)"
                    isAnimationActive={false}
                    dot={(props: {
                      cx?: number;
                      cy?: number;
                      index?: number;
                    }) =>
                      props.index !== undefined && props.index % 4 === 3 ? (
                        <circle
                          key={props.index}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill="#4F46E5"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ) : (
                        <g key={props.index} />
                      )
                    }
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted dark:text-moon-muted">
              Probalo: cargá una venta y mirá cómo cambian los números.
            </p>
            <button
              type="button"
              onClick={simulate}
              className="btn bg-ink !px-4 !py-2 text-sm text-white hover:bg-indigo dark:bg-moon dark:text-ink dark:hover:bg-cyan"
            >
              Simular una venta
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-[44%] -right-3 hidden items-center gap-2.5 rounded-xl border border-mist bg-white px-3.5 py-2.5 shadow-xl sm:flex lg:-right-8 dark:border-night-line dark:bg-night-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo to-cyan text-white">
          <ChartNoAxesColumnIncreasing size={20} />
        </span>
        <div>
          <div className="flex items-center gap-1 font-display text-lg font-bold tabular-nums">
            {pct(growth)}{" "}
            {growth >= 0 && (
              <ArrowUp
                size={16}
                className="text-emerald-500"
                strokeWidth={2.5}
              />
            )}
          </div>
          <div className="text-xs text-muted dark:text-moon-muted">
            vs. período anterior
          </div>
        </div>
      </div>

      <div
        aria-live="polite"
        className="pointer-events-none absolute -top-8 left-4 right-4 z-10 sm:left-auto sm:right-6 sm:w-72"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="rounded-xl border border-mist bg-white p-3.5 shadow-xl dark:border-night-line dark:bg-night-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Nueva venta
                  </div>
                  <div className="mt-0.5 text-sm font-medium">
                    {toast.product}
                  </div>
                  <div className="text-xs text-muted dark:text-moon-muted">
                    {toast.customer}
                  </div>
                </div>
                <div className="font-display text-base font-semibold tabular-nums">
                  {ars(toast.amount)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const trust = [
  { icon: CircleCheck, text: "Diseño profesional y adaptable" },
  {
    icon: ChartNoAxesColumnIncreasing,
    text: "Paneles y reportes en tiempo real",
  },
  { icon: Headphones, text: "Soporte dedicado" },
  { icon: ShieldCheck, text: "Seguridad y confiabilidad" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.6,
            delay,
            ease: [0.2, 0.7, 0.2, 1] as const,
          },
        };

  return (
    <section id="inicio" className="wrap pt-10 pb-20 lg:pt-16 lg:pb-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-full bg-cyan/12 py-1.5 pr-4 pl-1.5 text-sm font-semibold dark:bg-cyan/15"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-cyan dark:bg-night">
              <ChartNoAxesColumnIncreasing size={16} />
            </span>
            Tu negocio, en crecimiento
          </motion.span>
          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[3rem] font-extrabold tracking-[-0.035em] sm:text-[4.2rem] lg:text-[4.1rem] xl:text-[4.6rem]"
          >
            Webs que{" "}
            <span className="bg-gradient-to-r from-[#3A1FD0] via-indigo to-[#1F6BF0] bg-clip-text text-transparent dark:from-indigo-soft dark:via-[#6aa0ff] dark:to-cyan">
              venden.
            </span>{" "}
            Datos que deciden.
          </motion.h1>
          <motion.p
            {...rise(0.14)}
            className="lead mt-6 max-w-[36rem] text-lg sm:text-xl"
          >
            Creamos páginas web, tiendas online y paneles con dashboards para
            que tu emprendimiento o comercio crezca con decisiones basadas en
            datos.
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="btn bg-gradient-to-r from-[#3A1FD0] to-[#1F6BF0] !px-7 !py-3.5 text-white shadow-lg shadow-indigo/30 transition-[filter] hover:brightness-110"
            >
              <ArrowRight size={18} /> Pedí tu presupuesto
            </a>
            <a
              href="#panel"
              className="btn-ghost !px-7 !py-3.5 !border-indigo/40 dark:!border-moon/30"
            >
              <Play size={16} /> Ver el panel completo
            </a>
          </motion.div>
        </div>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  duration: 0.8,
                  delay: 0.25,
                  ease: [0.2, 0.7, 0.2, 1] as const,
                },
              })}
        >
          <LivePanel />
        </motion.div>
      </div>

      <ul className="mt-20 grid grid-cols-2 gap-y-6 lg:mt-24 lg:grid-cols-4 lg:divide-x lg:divide-mist dark:lg:divide-night-line">
        {trust.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 px-2 lg:justify-center lg:px-6"
          >
            <Icon size={30} strokeWidth={1.7} className="shrink-0" />
            <span className="max-w-[11rem] text-[0.95rem] leading-snug font-medium">
              {text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
