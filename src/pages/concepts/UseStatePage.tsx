import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import type { InspectionStatus } from '@/types/inspection';
import { mockInspections } from '@/data/mockData';

export function UseStatePage() {
  // ─── Ejemplo 1: Contador simple ─────────────────────────────────────────────
  const [count, setCount] = useState(0);

  // ─── Ejemplo 2: Toggle booleano ─────────────────────────────────────────────
  const [isVisible, setIsVisible] = useState(false);

  // ─── Ejemplo 3: Estado con objeto (filtro práctico) ─────────────────────────
  const [filter, setFilter] = useState<InspectionStatus | 'todas'>('todas');

  const filteredInspections = mockInspections.filter(
    (insp) => filter === 'todas' || insp.estado === filter,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_EFFECT} className="text-blue-600 hover:underline">useEffect →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useState</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useState</code> es el hook más fundamental de React.
            Permite agregar estado local a componentes funcionales. Cada vez que el estado cambia, el componente se re-renderiza.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-blue-100 px-1 rounded">const [valor, setValor] = useState(inicial)</code> declara una variable de estado.</li>
            <li>Llamar a <code className="bg-blue-100 px-1 rounded">setValor(nuevoValor)</code> re-renderiza el componente con el nuevo estado.</li>
            <li>El valor inicial solo se usa en el <strong>primer render</strong>.</li>
            <li>Se puede usar con cualquier tipo: <code className="bg-blue-100 px-1 rounded">number</code>, <code className="bg-blue-100 px-1 rounded">string</code>, <code className="bg-blue-100 px-1 rounded">boolean</code>, objetos, arrays.</li>
            <li>Para actualizar basado en el estado previo, usa la forma funcional: <code className="bg-blue-100 px-1 rounded">setValor(prev =&gt; prev + 1)</code>.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-blue-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`const [count, setCount] = useState(0);
const [isVisible, setIsVisible] = useState(false);
const [filter, setFilter] = useState<InspectionStatus | 'todas'>('todas');

// Actualización directa
setCount(5);

// Actualización funcional (basada en estado previo)
setCount(prev => prev + 1);

// Toggle booleano
setIsVisible(prev => !prev);`}</pre>
        </details>

        {/* Ejemplo 1: Contador */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 1: Contador</h2>
          <p className="text-sm text-gray-500 mb-4">
            Cada click llama a <code className="bg-gray-100 px-1 rounded">setCount</code>, lo que dispara un re-render.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount((prev) => prev - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
            >
              − 1
            </button>
            <span className="text-3xl font-bold text-gray-800 min-w-[3ch] text-center">{count}</span>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              + 1
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Ejemplo 2: Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 2: Toggle booleano</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">setIsVisible(prev =&gt; !prev)</code> alterna entre <code className="bg-gray-100 px-1 rounded">true</code> y <code className="bg-gray-100 px-1 rounded">false</code>.
          </p>
          <button
            onClick={() => setIsVisible((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium mb-3"
          >
            {isVisible ? 'Ocultar' : 'Mostrar'} mensaje
          </button>
          {isVisible && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
              ¡Hola! Este mensaje se muestra condicionalmente con <code className="bg-indigo-100 px-1 rounded">isVisible && (...)</code>
            </div>
          )}
        </div>

        {/* Ejemplo 3: Filtro práctico */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 3: Filtro de inspecciones</h2>
          <p className="text-sm text-gray-500 mb-4">
            Un uso práctico: <code className="bg-gray-100 px-1 rounded">useState</code> para manejar el filtro de estado y renderizar la lista filtrada.
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {(['todas', 'aprobada', 'rechazada', 'pendiente', 'en_progreso'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status === 'todas' ? 'Todas' : status === 'en_progreso' ? 'En progreso' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Estado actual: <code className="bg-gray-100 px-1 rounded">filter = "{filter}"</code> — Mostrando <strong>{filteredInspections.length}</strong> inspecciones
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredInspections.map((insp) => (
              <div key={insp.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-2 text-sm">
                <span className="font-medium text-gray-700">{insp.id}</span>
                <span className="text-gray-500">{insp.marca} {insp.modelo}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
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
      </div>
    </div>
  );
}
