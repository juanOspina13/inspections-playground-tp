import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { mockInspections } from '@/data/mockData';
import type { Inspection, InspectionStatus } from '@/types/inspection';

// ═══════════════════════════════════════════════════════════════════════════════
// Render Prop: InspectionFilter
// El componente maneja el estado y expone datos a través de render/children
// ═══════════════════════════════════════════════════════════════════════════════

interface InspectionFilterRenderProps {
  filtered: Inspection[];
  status: InspectionStatus | 'todas';
  setStatus: (s: InspectionStatus | 'todas') => void;
  count: number;
}

function InspectionFilter({
  inspections,
  render,
}: {
  inspections: Inspection[];
  render: (props: InspectionFilterRenderProps) => ReactNode;
}) {
  const [status, setStatus] = useState<InspectionStatus | 'todas'>('todas');
  const filtered = inspections.filter((i) => status === 'todas' || i.estado === status);
  return <>{render({ filtered, status, setStatus, count: filtered.length })}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Children as a function: InspectionStats
// ═══════════════════════════════════════════════════════════════════════════════

interface StatsRenderProps {
  total: number;
  aprobadas: number;
  rechazadas: number;
  pendientes: number;
  tasaAprobacion: number;
}

function InspectionStats({
  inspections,
  children,
}: {
  inspections: Inspection[];
  children: (stats: StatsRenderProps) => ReactNode;
}) {
  const total = inspections.length;
  const aprobadas = inspections.filter((i) => i.estado === 'aprobada').length;
  const rechazadas = inspections.filter((i) => i.estado === 'rechazada').length;
  const pendientes = inspections.filter((i) => i.estado === 'pendiente' || i.estado === 'en_progreso').length;
  const tasaAprobacion = total ? Math.round((aprobadas / total) * 100) : 0;
  return <>{children({ total, aprobadas, rechazadas, pendientes, tasaAprobacion })}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Render Prop: Hoverable (ejemplo genérico)
// ═══════════════════════════════════════════════════════════════════════════════

function Hoverable({ render }: { render: (hovered: boolean) => ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {render(hovered)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════════

export function RenderPropsPage() {
  const statuses: InspectionStatus[] = ['aprobada', 'rechazada', 'pendiente', 'en_progreso'];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-sky-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_CONTAINER_PRESENTATIONAL} className="text-sky-600 hover:underline">← Container/Presentational</Link>
            <Link to={appRoutes.PATTERNS_AI_UI} className="text-sky-600 hover:underline">AI UI Patterns →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Render Props Pattern</h1>
          <p className="text-gray-500 text-sm mt-1">
            Un <strong>render prop</strong> es una prop cuyo valor es una función que retorna JSX.
            El componente delega su rendering al consumidor, pasándole datos a través de los argumentos de la función.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fuente: <a href="https://www.patterns.dev/react/render-props-pattern" target="_blank" rel="noreferrer" className="underline">patterns.dev/react/render-props-pattern</a>
          </p>
        </div>

        {/* Callout */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 text-sm text-sky-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Un componente recibe una prop <code className="bg-sky-100 px-1 rounded">render</code> (o usa <code className="bg-sky-100 px-1 rounded">children</code> como función).</li>
            <li>El componente <strong>maneja el estado y lógica</strong>, luego invoca <code className="bg-sky-100 px-1 rounded">render(data)</code>.</li>
            <li>El consumidor decide <strong>cómo renderizar</strong> los datos recibidos como argumento.</li>
            <li>Resuelve naming collisions de HOCs: los props se pasan explícitamente.</li>
            <li><strong>Nota:</strong> En React moderno, los <em>custom hooks</em> reemplazan este patrón en la mayoría de casos.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-sky-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del patrón ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// ──── Render Prop Component ────────────────────
function InspectionFilter({ inspections, render }) {
  const [status, setStatus] = useState('todas');
  const filtered = inspections.filter(
    i => status === 'todas' || i.estado === status
  );
  // Invoca render con los datos como argumento
  return render({ filtered, status, setStatus, count: filtered.length });
}

// ──── Uso con render prop ─────────────────────
<InspectionFilter
  inspections={mockInspections}
  render={({ filtered, status, setStatus }) => (
    <div>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="todas">Todas</option>
        ...
      </select>
      {filtered.map(insp => <div key={insp.id}>...</div>)}
    </div>
  )}
/>

// ──── Children as a function ──────────────────
function InspectionStats({ inspections, children }) {
  const total = inspections.length;
  const aprobadas = inspections.filter(i => i.estado === 'aprobada').length;
  // children es una función que recibe stats
  return children({ total, aprobadas, ... });
}

<InspectionStats inspections={mockInspections}>
  {({ total, aprobadas, tasaAprobacion }) => (
    <div>Total: {total} | Aprobadas: {aprobadas} ({tasaAprobacion}%)</div>
  )}
</InspectionStats>`}</pre>
        </details>

        {/* ─── Demo 1: render prop ─────────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 1 — <code className="bg-sky-100 px-1 rounded text-sky-700">render</code> prop
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            <code>InspectionFilter</code> maneja el estado del filtro. El componente consumidor recibe <code>filtered</code>, <code>status</code> y <code>setStatus</code> vía la prop <code>render</code>.
          </p>

          <InspectionFilter
            inspections={mockInspections}
            render={({ filtered, status, setStatus, count }) => (
              <div>
                <div className="flex gap-2 items-center mb-3 flex-wrap">
                  <span className="text-xs text-gray-500">Filtrar:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InspectionStatus | 'todas')}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="todas">Todas</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-400">{count} resultado(s)</span>
                </div>
                <div className="space-y-1">
                  {filtered.map((insp) => (
                    <div key={insp.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                      <span className="font-mono text-xs text-gray-500">{insp.id}</span>
                      <span>{insp.marca} {insp.modelo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        insp.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                        insp.estado === 'rechazada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {insp.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        {/* ─── Demo 2: children as a function ──────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 2 — <code className="bg-sky-100 px-1 rounded text-sky-700">children</code> as a function
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            <code>InspectionStats</code> calcula estadísticas y las pasa como argumento a <code>children()</code>. El consumidor decide la presentación.
          </p>

          <InspectionStats inspections={mockInspections}>
            {({ total, aprobadas, rechazadas, pendientes, tasaAprobacion }) => (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-sky-700">{total}</span>
                  <p className="text-xs text-sky-600">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-green-700">{aprobadas}</span>
                  <p className="text-xs text-green-600">Aprobadas</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-red-700">{rechazadas}</span>
                  <p className="text-xs text-red-600">Rechazadas</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-yellow-700">{pendientes}</span>
                  <p className="text-xs text-yellow-600">Pendientes</p>
                </div>
                <div className="col-span-2 bg-emerald-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-emerald-700">{tasaAprobacion}%</span>
                  <p className="text-xs text-emerald-600">Tasa de aprobación</p>
                </div>
              </div>
            )}
          </InspectionStats>
        </div>

        {/* ─── Demo 3: Hoverable render prop ───────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 3 — <code className="bg-sky-100 px-1 rounded text-sky-700">Hoverable</code> render prop genérico
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Componente genérico que detecta hover y pasa el estado al render prop. Mismo componente, diferente presentación.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {mockInspections.slice(0, 4).map((insp) => (
              <Hoverable
                key={insp.id}
                render={(hovered) => (
                  <div className={`rounded-lg p-3 border transition-all cursor-pointer ${
                    hovered ? 'bg-sky-50 border-sky-300 shadow-md scale-[1.02]' : 'bg-white border-gray-200'
                  }`}>
                    <p className="font-semibold text-sm">{insp.id}</p>
                    <p className="text-xs text-gray-500">{insp.marca} {insp.modelo}</p>
                    {hovered && (
                      <p className="text-xs text-sky-600 mt-1">
                        🔍 {insp.inspector} — {insp.fecha}
                      </p>
                    )}
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        {/* Nota moderna */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-sm text-sky-800">
          <strong>Nota (React 18+):</strong> Los <strong>custom hooks</strong> han reemplazado a los render props en la mayoría de escenarios.
          Si tu componente solo llama <code className="bg-sky-100 px-1 rounded">props.render()</code>, probablemente un hook logre lo mismo de forma más directa.
          Sin embargo, render props siguen siendo útiles en bibliotecas donde necesitas <strong>inversión de control</strong> sobre el rendering.
        </div>
      </div>
    </div>
  );
}
