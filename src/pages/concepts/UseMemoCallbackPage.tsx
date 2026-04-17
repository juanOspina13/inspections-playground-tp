import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import type { Inspection, VehicleType } from '@/types/inspection';
import { mockInspections } from '@/data/mockData';

// ─── Componente memoizado ─────────────────────────────────────────────────────
interface ActionsPanelProps {
  refreshCount: number;
  onRefresh: () => void;
}

const ActionsPanel = memo(function ActionsPanel({ refreshCount, onRefresh }: ActionsPanelProps) {
  console.log('ActionsPanel renderizado');
  return (
    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
      <p className="text-sm text-cyan-700 mb-2">
        Este componente está envuelto en <code className="bg-cyan-100 px-1 rounded">memo()</code>.
        Solo se re-renderiza si cambian sus props.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium"
        >
          Incrementar contador
        </button>
        <span className="text-sm font-medium text-cyan-800">Clicks: {refreshCount}</span>
      </div>
      <p className="text-xs text-cyan-600 mt-2">
        Abre la consola del navegador para ver cuándo se re-renderiza este componente.
      </p>
    </div>
  );
});

// ─── Helper para formatear ────────────────────────────────────────────────────
const mileageFormatter = new Intl.NumberFormat('es-CO');

const vehicleOptions: Array<{ value: VehicleType | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'camion', label: 'Camión' },
  { value: 'motocicleta', label: 'Motocicleta' },
  { value: 'bus', label: 'Bus' },
];

// ─── Función costosa simulada ─────────────────────────────────────────────────
function computeSummary(inspections: Inspection[], vehicleType: VehicleType | 'todos') {
  console.log('computeSummary ejecutado (cálculo costoso)');
  const filtered = inspections.filter(
    (insp) => vehicleType === 'todos' || insp.tipoVehiculo === vehicleType,
  );

  return {
    total: filtered.length,
    totalKm: filtered.reduce((sum, insp) => sum + insp.kilometraje, 0),
    inspectors: new Set(filtered.map((insp) => insp.inspector)).size,
    nextInspection:
      filtered
        .map((insp) => insp.proximaInspeccion)
        .filter((d): d is string => Boolean(d))
        .sort()[0] ?? 'Sin fecha',
  };
}

export function UseMemoCallbackPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | 'todos'>('todos');
  const [refreshCount, setRefreshCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);

  // ─── useMemo: solo recalcula cuando cambian las dependencias ────────────────
  const summary = useMemo(
    () => computeSummary(mockInspections, selectedVehicle),
    [selectedVehicle],
  );

  // ─── useCallback: referencia estable para pasar a hijos memoizados ──────────
  const handleRefresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  const handleVehicleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(e.target.value as VehicleType | 'todos');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_REF} className="text-blue-600 hover:underline">← useRef</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">useReducer →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useMemo / useCallback / memo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Herramientas de optimización que evitan cálculos innecesarios y re-renders de componentes hijos.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6 text-sm text-cyan-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-cyan-100 px-1 rounded">useMemo(fn, [deps])</code> memoriza el <strong>resultado</strong> de una función. Solo recalcula si cambian las dependencias.</li>
            <li><code className="bg-cyan-100 px-1 rounded">useCallback(fn, [deps])</code> memoriza la <strong>referencia</strong> de una función. Útil para props de componentes memoizados.</li>
            <li><code className="bg-cyan-100 px-1 rounded">memo(Component)</code> envuelve un componente para que solo se re-renderice si sus <strong>props cambian</strong>.</li>
            <li>Sin <code className="bg-cyan-100 px-1 rounded">useCallback</code>, una función se recrea en cada render → la prop cambia → el hijo memoizado se re-renderiza.</li>
            <li>Úsalos solo cuando hay un <strong>beneficio real</strong> (cálculos costosos, listas grandes, componentes pesados).</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-cyan-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// useMemo: memoriza el resultado del cálculo
const summary = useMemo(
  () => computeSummary(inspections, vehicleType),
  [vehicleType]  // Solo recalcula si vehicleType cambia
);

// useCallback: referencia estable para la función
const handleRefresh = useCallback(() => {
  setRefreshCount(prev => prev + 1);
}, []);  // [] = nunca se recrea

// memo: componente que solo re-renderiza si props cambian
const ActionsPanel = memo(function ActionsPanel({ 
  refreshCount, onRefresh 
}) {
  return <button onClick={onRefresh}>Click: {refreshCount}</button>;
});`}</pre>
        </details>

        {/* Demo: useMemo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">useMemo: Resumen memoizado</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">computeSummary()</code> solo se ejecuta cuando cambia el tipo de vehículo.
            Abre la consola para verificarlo.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-600">Tipo de vehículo:</label>
            <select
              value={selectedVehicle}
              onChange={handleVehicleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {vehicleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-gray-800">{summary.total}</span>
              <p className="text-xs text-gray-500">Inspecciones</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-gray-800">{mileageFormatter.format(summary.totalKm)}</span>
              <p className="text-xs text-gray-500">Km acumulados</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-gray-800">{summary.inspectors}</span>
              <p className="text-xs text-gray-500">Inspectores</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-gray-800 text-sm">{summary.nextInspection}</span>
              <p className="text-xs text-gray-500">Próxima inspección</p>
            </div>
          </div>
        </div>

        {/* Demo: memo + useCallback */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">memo + useCallback: Componente estable</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">ActionsPanel</code> está envuelto en <code className="bg-gray-100 px-1 rounded">memo()</code>.
            Gracias a <code className="bg-gray-100 px-1 rounded">useCallback</code>, <code className="bg-gray-100 px-1 rounded">onRefresh</code> mantiene
            la misma referencia, así que el componente solo se re-renderiza cuando cambia <code className="bg-gray-100 px-1 rounded">refreshCount</code>.
          </p>
          <ActionsPanel refreshCount={refreshCount} onRefresh={handleRefresh} />
        </div>

        {/* Demo: Prueba de re-render innecesario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Prueba: estado no relacionado</h2>
          <p className="text-sm text-gray-500 mb-4">
            Al cambiar este estado, el componente padre se re-renderiza. Pero <code className="bg-gray-100 px-1 rounded">ActionsPanel</code> (memo)
            y <code className="bg-gray-100 px-1 rounded">summary</code> (useMemo) <strong>no se recalculan</strong>.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setUnrelatedState((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
            >
              Cambiar estado no relacionado
            </button>
            <span className="text-sm text-gray-500">Valor: {unrelatedState}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Abre la consola: verás que <code className="bg-gray-100 px-1 rounded">computeSummary</code> y <code className="bg-gray-100 px-1 rounded">ActionsPanel</code> NO se ejecutan.
          </p>
        </div>
      </div>
    </div>
  );
}
