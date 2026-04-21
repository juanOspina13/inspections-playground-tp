import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { mockInspections } from '@/data/mockData';
import type { Inspection, InspectionStatus, DashboardStats } from '@/types/inspection';

// ═══════════════════════════════════════════════════════════════════════════════
// Custom Hook (reemplaza al "Container" tradicional)
// ═══════════════════════════════════════════════════════════════════════════════
function useInspectionDashboardData() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula fetch de API
    const timer = setTimeout(() => {
      setInspections(mockInspections);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const stats: DashboardStats = {
    total: inspections.length,
    aprobadas: inspections.filter((i) => i.estado === 'aprobada').length,
    rechazadas: inspections.filter((i) => i.estado === 'rechazada').length,
    pendientes: inspections.filter((i) => i.estado === 'pendiente').length,
    enProgreso: inspections.filter((i) => i.estado === 'en_progreso').length,
    tasaAprobacion: inspections.length
      ? Math.round((inspections.filter((i) => i.estado === 'aprobada').length / inspections.length) * 100)
      : 0,
  };

  const reload = useCallback(() => {
    setLoading(true);
    setInspections([]);
    setTimeout(() => {
      setInspections(mockInspections);
      setLoading(false);
    }, 800);
  }, []);

  return { inspections, stats, loading, reload };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Presentational Components (solo reciben props, no tienen lógica de datos)
// ═══════════════════════════════════════════════════════════════════════════════

function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Aprobadas', value: stats.aprobadas, color: 'bg-green-100 text-green-700' },
    { label: 'Rechazadas', value: stats.rechazadas, color: 'bg-red-100 text-red-700' },
    { label: 'Pendientes', value: stats.pendientes, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'En progreso', value: stats.enProgreso, color: 'bg-blue-100 text-blue-700' },
    { label: 'Tasa aprobación', value: `${stats.tasaAprobacion}%`, color: 'bg-emerald-100 text-emerald-700' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg p-3 text-center ${c.color}`}>
          <span className="text-xl font-bold block">{c.value}</span>
          <span className="text-xs">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function InspectionList({ inspections }: { inspections: Inspection[] }) {
  if (inspections.length === 0) return <p className="text-sm text-gray-400 text-center py-4">Sin inspecciones.</p>;
  const statusColors: Record<InspectionStatus, string> = {
    aprobada: 'bg-green-100 text-green-700',
    rechazada: 'bg-red-100 text-red-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    en_progreso: 'bg-blue-100 text-blue-700',
  };
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-gray-500">
          <th className="py-1">ID</th>
          <th className="py-1">Vehículo</th>
          <th className="py-1">Inspector</th>
          <th className="py-1">Estado</th>
        </tr>
      </thead>
      <tbody>
        {inspections.map((insp) => (
          <tr key={insp.id} className="border-b last:border-0">
            <td className="py-1 font-mono text-xs">{insp.id}</td>
            <td className="py-1">{insp.marca} {insp.modelo}</td>
            <td className="py-1">{insp.inspector}</td>
            <td className="py-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[insp.estado]}`}>
                {insp.estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LoadingSpinner() {
  return (
    <div className="text-center py-8">
      <div className="inline-block w-8 h-8 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 mt-2">Cargando inspecciones...</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════════

export function ContainerPresentationalPage() {
  const { inspections, stats, loading, reload } = useInspectionDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-lime-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_COMPOUND} className="text-lime-600 hover:underline">← Compound Pattern</Link>
            <Link to={appRoutes.PATTERNS_RENDER_PROPS} className="text-lime-600 hover:underline">Render Props →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Container / Presentational Pattern</h1>
          <p className="text-gray-500 text-sm mt-1">
            Separar la <strong>lógica de datos</strong> (container) de la <strong>presentación visual</strong> (presentational).
            En React moderno, los <em>custom hooks</em> reemplazan a los class-based containers.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fuente: <a href="https://www.patterns.dev/react/presentational-container-pattern" target="_blank" rel="noreferrer" className="underline">patterns.dev</a>
          </p>
        </div>

        {/* Callout */}
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6 text-sm text-lime-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><strong>Presentational:</strong> Recibe datos por props, solo se encarga de <strong>mostrar UI</strong>. No tiene side effects.</li>
            <li><strong>Container:</strong> Se encarga de <strong>obtener y transformar datos</strong> (API, estado, lógica). Antes era una clase, ahora es un <em>custom hook</em>.</li>
            <li>El componente <strong>presentational</strong> es fácil de reutilizar y testear (es puro).</li>
            <li>Con Hooks, ya no necesitas un componente wrapper — el hook <code className="bg-lime-100 px-1 rounded">useData()</code> reemplaza al container.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-lime-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del patrón ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// ──── "Container" como Custom Hook ────────────────
function useInspectionDashboardData() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInspections(mockInspections);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const stats: DashboardStats = {
    total: inspections.length,
    aprobadas: inspections.filter(i => i.estado === 'aprobada').length,
    // ...
  };

  return { inspections, stats, loading, reload };
}

// ──── Presentational: Solo recibe props ──────────
function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map(c => (
        <div key={c.label} className={c.color}>
          <span>{c.value}</span>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function InspectionList({ inspections }: { inspections: Inspection[] }) {
  return (
    <table>
      {inspections.map(insp => (
        <tr key={insp.id}>...</tr>
      ))}
    </table>
  );
}

// ──── Composición ────────────────────────────────
function Page() {
  // Hook reemplaza al container class component
  const { inspections, stats, loading, reload } = useInspectionDashboardData();

  if (loading) return <LoadingSpinner />;
  return (
    <>
      <StatsGrid stats={stats} />
      <InspectionList inspections={inspections} />
    </>
  );
}`}</pre>
        </details>

        {/* ─── Demo interactiva ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-700">
              Demo — Presentational components + Hook container
            </h2>
            <button
              onClick={reload}
              className="bg-lime-600 text-white text-sm px-3 py-1 rounded hover:bg-lime-700"
            >
              🔄 Re-fetch
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            El hook <code className="bg-lime-100 px-1 rounded">useInspectionDashboardData()</code> simula un fetch con 800ms de delay.
            Los componentes <code>StatsGrid</code> y <code>InspectionList</code> son <strong>puramente presentacionales</strong>.
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  <code className="bg-lime-100 px-1 rounded text-lime-700">&lt;StatsGrid stats={'{stats}'} /&gt;</code>
                </h3>
                <StatsGrid stats={stats} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  <code className="bg-lime-100 px-1 rounded text-lime-700">&lt;InspectionList inspections={'{inspections}'} /&gt;</code>
                </h3>
                <InspectionList inspections={inspections} />
              </div>
            </>
          )}
        </div>

        {/* Nota moderna */}
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-sm text-lime-800">
          <strong>Nota (React 18+):</strong> Los custom hooks reemplazan completamente a los class-based containers.
          Un hook como <code className="bg-lime-100 px-1 rounded">useDogImages()</code> o <code className="bg-lime-100 px-1 rounded">useInspectionDashboardData()</code> logra
          la misma separación de responsabilidades sin componente wrapper. El React Compiler optimiza mejor las funciones y hooks que los lifecycles de clases.
        </div>
      </div>
    </div>
  );
}
