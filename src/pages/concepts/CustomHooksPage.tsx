import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import type { Inspection, InspectionStatus, VehicleType, DashboardStats } from '@/types/inspection';
import { mockInspections } from '@/data/mockData';

// ─── Custom Hook 1: useInspectionStats ────────────────────────────────────────
function useInspectionStats(inspections: Inspection[]) {
  return useMemo<DashboardStats>(() => {
    const total = inspections.length;
    const aprobadas = inspections.filter((i) => i.estado === 'aprobada').length;
    const rechazadas = inspections.filter((i) => i.estado === 'rechazada').length;
    const pendientes = inspections.filter((i) => i.estado === 'pendiente').length;
    const enProgreso = inspections.filter((i) => i.estado === 'en_progreso').length;
    const finalizadas = aprobadas + rechazadas;
    const tasaAprobacion = finalizadas > 0 ? Math.round((aprobadas / finalizadas) * 100) : 0;
    return { total, aprobadas, rechazadas, pendientes, enProgreso, tasaAprobacion };
  }, [inspections]);
}

// ─── Custom Hook 2: useFilter ─────────────────────────────────────────────────
function useFilter(inspections: Inspection[]) {
  const [status, setStatus] = useState<InspectionStatus | 'todas'>('todas');
  const [vehicle, setVehicle] = useState<VehicleType | 'todos'>('todos');

  const filtered = useMemo(() => {
    return inspections.filter((insp) => {
      if (status !== 'todas' && insp.estado !== status) return false;
      if (vehicle !== 'todos' && insp.tipoVehiculo !== vehicle) return false;
      return true;
    });
  }, [inspections, status, vehicle]);

  return { status, setStatus, vehicle, setVehicle, filtered };
}

// ─── Custom Hook 3: useKeyboardShortcut ───────────────────────────────────────
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
}

export function CustomHooksPage() {
  const stats = useInspectionStats(mockInspections);
  const { status, setStatus, vehicle, setVehicle, filtered } = useFilter(mockInspections);
  const [shortcutTriggered, setShortcutTriggered] = useState(0);

  useKeyboardShortcut('r', () => {
    setShortcutTriggered((prev) => prev + 1);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_CONTEXT_API} className="text-blue-600 hover:underline">← Context API</Link>
            <Link to={appRoutes.CONCEPTS_REDUX} className="text-blue-600 hover:underline">Redux Toolkit →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Custom Hooks</h1>
          <p className="text-gray-500 text-sm mt-1">
            Los custom hooks permiten extraer y reutilizar lógica de estado en funciones que comienzan con <code className="bg-gray-100 px-1 rounded">use</code>.
            Combinan hooks nativos para crear abstracciones específicas del dominio.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6 text-sm text-pink-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Un custom hook es una <strong>función normal</strong> cuyo nombre comienza con <code className="bg-pink-100 px-1 rounded">use</code>.</li>
            <li>Puede usar <code className="bg-pink-100 px-1 rounded">useState</code>, <code className="bg-pink-100 px-1 rounded">useEffect</code>, <code className="bg-pink-100 px-1 rounded">useMemo</code> y otros hooks internamente.</li>
            <li>Retorna los valores y funciones que el componente necesita.</li>
            <li>Cada componente que llama al hook obtiene su <strong>propia instancia</strong> de estado (no comparten estado).</li>
            <li>Ideal para: lógica de filtrado, llamadas a APIs, event listeners, validaciones.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-pink-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código de los custom hooks ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// Hook 1: Estadísticas memoizadas
function useInspectionStats(inspections: Inspection[]) {
  return useMemo(() => {
    const total = inspections.length;
    const aprobadas = inspections.filter(i => i.estado === 'aprobada').length;
    // ...
    return { total, aprobadas, ... };
  }, [inspections]);
}

// Hook 2: Filtro con estado
function useFilter(inspections: Inspection[]) {
  const [status, setStatus] = useState('todas');
  const [vehicle, setVehicle] = useState('todos');
  const filtered = useMemo(() => 
    inspections.filter(...), [inspections, status, vehicle]
  );
  return { status, setStatus, vehicle, setVehicle, filtered };
}

// Hook 3: Atajo de teclado
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}

// Uso en componente:
const stats = useInspectionStats(mockInspections);
const { filtered, setStatus } = useFilter(mockInspections);
useKeyboardShortcut('r', handleRefresh);`}</pre>
        </details>

        {/* Hook 1: useInspectionStats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Hook 1: <code className="bg-pink-100 px-1 rounded text-pink-700">useInspectionStats</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Encapsula el cálculo de estadísticas con <code className="bg-gray-100 px-1 rounded">useMemo</code>.
            El componente solo recibe los datos ya procesados.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <span className="text-xl font-bold text-green-700">{stats.aprobadas}</span>
              <p className="text-xs text-green-600">Aprobadas</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <span className="text-xl font-bold text-red-700">{stats.rechazadas}</span>
              <p className="text-xs text-red-600">Rechazadas</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <span className="text-xl font-bold text-yellow-700">{stats.pendientes}</span>
              <p className="text-xs text-yellow-600">Pendientes</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Tasa de aprobación: <strong>{stats.tasaAprobacion}%</strong> | Total: {stats.total}
          </p>
        </div>

        {/* Hook 2: useFilter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Hook 2: <code className="bg-pink-100 px-1 rounded text-pink-700">useFilter</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Combina <code className="bg-gray-100 px-1 rounded">useState</code> + <code className="bg-gray-100 px-1 rounded">useMemo</code>
            para manejar filtros y exponer la lista filtrada.
          </p>

          <div className="flex gap-3 flex-wrap mb-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InspectionStatus | 'todas')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todas">Todos los estados</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
            </select>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value as VehicleType | 'todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todos">Todos los vehículos</option>
              <option value="sedan">Sedán</option>
              <option value="suv">SUV</option>
              <option value="camioneta">Camioneta</option>
              <option value="camion">Camión</option>
              <option value="motocicleta">Motocicleta</option>
              <option value="bus">Bus</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Resultado: <strong>{filtered.length}</strong> inspecciones
          </p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filtered.map((insp) => (
              <div key={insp.id} className="flex justify-between text-sm border-b border-gray-100 py-1.5">
                <span className="font-medium text-gray-700">{insp.id}</span>
                <span className="text-gray-500">{insp.marca} {insp.modelo}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  insp.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                  insp.estado === 'rechazada' ? 'bg-red-100 text-red-700' :
                  insp.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {insp.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hook 3: useKeyboardShortcut */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Hook 3: <code className="bg-pink-100 px-1 rounded text-pink-700">useKeyboardShortcut</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Encapsula un <code className="bg-gray-100 px-1 rounded">useEffect</code> con event listener + cleanup
            en un hook reutilizable.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Presiona la tecla <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono font-bold">R</kbd> en cualquier momento
            </p>
            <p className="text-3xl font-bold text-pink-600">{shortcutTriggered}</p>
            <p className="text-xs text-gray-400 mt-1">veces activado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
