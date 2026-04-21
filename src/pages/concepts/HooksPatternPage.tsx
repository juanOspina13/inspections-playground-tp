import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { mockInspections } from '@/data/mockData';
import type { Inspection, InspectionStatus } from '@/types/inspection';

// ─── Custom Hook: useInspectionFilter ──────────────────────────────────────────
function useInspectionFilter(inspections: Inspection[]) {
  const [status, setStatus] = useState<InspectionStatus | 'todas'>('todas');
  const [search, setSearch] = useState('');

  const filtered = inspections.filter((insp) => {
    const matchesStatus = status === 'todas' || insp.estado === status;
    const matchesSearch =
      search === '' ||
      insp.placa.toLowerCase().includes(search.toLowerCase()) ||
      insp.marca.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const reset = useCallback(() => {
    setStatus('todas');
    setSearch('');
  }, []);

  return { status, setStatus, search, setSearch, filtered, reset };
}

// ─── Custom Hook: useWindowSize ────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ─── Custom Hook: useKeyPress ──────────────────────────────────────────────────
function useKeyPress(targetKey: string) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [targetKey]);

  return pressed;
}

export function HooksPatternPage() {
  const filter = useInspectionFilter(mockInspections);
  const { width } = useWindowSize();
  const escPressed = useKeyPress('Escape');

  // Escape resets filters
  useEffect(() => {
    if (escPressed) filter.reset();
  }, [escPressed, filter.reset]);

  const statuses: InspectionStatus[] = ['aprobada', 'rechazada', 'pendiente', 'en_progreso'];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-teal-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_COMPOUND} className="text-teal-600 hover:underline">Compound Pattern →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Hooks Pattern</h1>
          <p className="text-gray-500 text-sm mt-1">
            El <strong>Hooks Pattern</strong> permite extraer lógica de estado y efectos secundarios en funciones reutilizables
            (<em>custom hooks</em>). Esto reemplaza la necesidad de class components, HOCs y render props para compartir lógica entre componentes.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fuente: <a href="https://www.patterns.dev/react/hooks-pattern" target="_blank" rel="noreferrer" className="underline">patterns.dev/react/hooks-pattern</a>
          </p>
        </div>

        {/* Callout */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 text-sm text-teal-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Un <strong>custom hook</strong> es una función que empieza con <code className="bg-teal-100 px-1 rounded">use</code> y puede usar otros hooks.</li>
            <li>Permite <strong>extraer lógica reutilizable</strong> (estado, efectos, listeners) fuera del componente.</li>
            <li>Los componentes que usan el hook obtienen su <strong>propia copia del estado</strong> — no comparten instancia.</li>
            <li>Reemplaza patrones más complejos como <strong>HOC</strong> y <strong>Render Props</strong> en la mayoría de casos.</li>
            <li>Evita el <em>"wrapper hell"</em> de componentes anidados: la lógica vive en funciones planas.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-teal-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código de los custom hooks ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// Hook reutilizable: filtro de inspecciones
function useInspectionFilter(inspections: Inspection[]) {
  const [status, setStatus] = useState<InspectionStatus | 'todas'>('todas');
  const [search, setSearch] = useState('');

  const filtered = inspections.filter((insp) => {
    const matchesStatus = status === 'todas' || insp.estado === status;
    const matchesSearch = search === '' ||
      insp.placa.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const reset = useCallback(() => {
    setStatus('todas');
    setSearch('');
  }, []);

  return { status, setStatus, search, setSearch, filtered, reset };
}

// Hook reutilizable: tamaño de ventana
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Hook reutilizable: detección de tecla
function useKeyPress(targetKey: string) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [targetKey]);

  return pressed;
}

// ─── Uso en componente ──────────────────
function HooksPatternPage() {
  const filter = useInspectionFilter(mockInspections);
  const { width } = useWindowSize();
  const escPressed = useKeyPress('Escape');

  useEffect(() => {
    if (escPressed) filter.reset();
  }, [escPressed]);
}`}</pre>
        </details>

        {/* ─── Demo 1: useInspectionFilter ──────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 1 — <code className="bg-teal-100 px-1 rounded text-teal-700">useInspectionFilter</code>
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Hook que encapsula filtrado por estado y búsqueda por texto. Toda la lógica vive en el hook, el componente solo consume datos.
          </p>

          <div className="flex gap-2 flex-wrap mb-3">
            <input
              type="text"
              placeholder="Buscar placa o marca..."
              value={filter.search}
              onChange={(e) => filter.setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm flex-1 min-w-[150px]"
            />
            <select
              value={filter.status}
              onChange={(e) => filter.setStatus(e.target.value as InspectionStatus | 'todas')}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="todas">Todas</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={filter.reset}
              className="bg-teal-600 text-white text-sm px-3 py-1 rounded hover:bg-teal-700"
            >
              Reset
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-1">ID</th>
                <th className="py-1">Placa</th>
                <th className="py-1">Marca</th>
                <th className="py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filter.filtered.map((insp) => (
                <tr key={insp.id} className="border-b last:border-0">
                  <td className="py-1 font-mono text-xs">{insp.id}</td>
                  <td className="py-1">{insp.placa}</td>
                  <td className="py-1">{insp.marca} {insp.modelo}</td>
                  <td className="py-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      insp.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                      insp.estado === 'rechazada' ? 'bg-red-100 text-red-700' :
                      insp.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {insp.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {filter.filtered.length === 0 && (
                <tr><td colSpan={4} className="py-2 text-center text-gray-400">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">
            Presiona <kbd className="bg-gray-100 border px-1 rounded">Escape</kbd> para resetear los filtros (usa <code>useKeyPress</code>).
          </p>
        </div>

        {/* ─── Demo 2: useWindowSize ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 2 — <code className="bg-teal-100 px-1 rounded text-teal-700">useWindowSize</code>
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Hook que escucha el evento <code>resize</code> y devuelve el tamaño actual de la ventana. Incluye cleanup automático.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-teal-700">{width}px</span>
              <p className="text-xs text-teal-600 mt-1">Ancho de ventana</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-teal-700">
                {width < 640 ? '📱 Móvil' : width < 1024 ? '💻 Tablet' : '🖥️ Desktop'}
              </span>
              <p className="text-xs text-teal-600 mt-1">Breakpoint detectado</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Redimensiona la ventana para ver cómo se actualiza automáticamente.
          </p>
        </div>

        {/* ─── Demo 3: useKeyPress ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 3 — <code className="bg-teal-100 px-1 rounded text-teal-700">useKeyPress</code>
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Hook que detecta cuándo una tecla específica está siendo presionada. Usa <code>keydown</code>/<code>keyup</code> con cleanup.
          </p>
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <span className={`text-xl font-bold transition-colors ${escPressed ? 'text-teal-700' : 'text-gray-400'}`}>
              {escPressed ? '✅ Escape presionado' : '⌨️ Presiona Escape'}
            </span>
          </div>
        </div>

        {/* Ventajas vs Class Components */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800">
          <strong>¿Por qué Hooks Pattern?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><strong>Menos código:</strong> No necesitas clases, constructors ni <code>this.bind()</code>.</li>
            <li><strong>Reutilización:</strong> Un custom hook se puede usar en cualquier componente.</li>
            <li><strong>Composición:</strong> Combina múltiples hooks en un componente sin wrapper hell.</li>
            <li><strong>Testing:</strong> Los hooks son funciones puras, fáciles de testear aisladamente.</li>
            <li><strong>React 19+:</strong> El React Compiler puede optimizar automáticamente <code>useMemo</code>/<code>useCallback</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
