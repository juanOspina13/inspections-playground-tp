import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

/* ─── Lista grande simulada ──────────────────────────────────────────────── */
const ALL_ITEMS = Array.from({ length: 20_000 }, (_, i) => `Elemento #${i + 1}`);

function HeavyList({ filter }: { filter: string }) {
  const filtered = useMemo(
    () => ALL_ITEMS.filter((item) => item.toLowerCase().includes(filter.toLowerCase())),
    [filter],
  );

  return (
    <ul className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
      {filtered.slice(0, 500).map((item) => (
        <li key={item} className="px-3 py-1.5 text-gray-700">
          {item}
        </li>
      ))}
      {filtered.length > 500 && (
        <li className="px-3 py-2 text-gray-400 italic">… y {filtered.length - 500} más</li>
      )}
    </ul>
  );
}

export function UseDeferredValuePage() {
  // ─── Ejemplo 1: useDeferredValue ──────────────────────────────────────────
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // ─── Ejemplo 2: comparación sin defer (misma lista, sin diferir) ──────────
  const [query2, setQuery2] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_TRANSITION} className="text-blue-600 hover:underline">← useTransition</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">useReducer →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useDeferredValue</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useDeferredValue</code> recibe un valor y devuelve
            una versión <strong>diferida</strong> del mismo. React mantiene el valor anterior mientras
            procesa el nuevo, evitando que renders costosos bloqueen la UI.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6 text-sm text-violet-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-violet-100 px-1 rounded">const deferred = useDeferredValue(value)</code> — React prioriza otras actualizaciones urgentes.</li>
            <li>Mientras el nuevo valor se procesa, <code className="bg-violet-100 px-1 rounded">deferred</code> sigue siendo el valor <strong>anterior</strong>.</li>
            <li>Comparar <code className="bg-violet-100 px-1 rounded">value !== deferred</code> indica si la UI está <em>stale</em> (desactualizada).</li>
            <li>A diferencia de <code className="bg-violet-100 px-1 rounded">useTransition</code>, no necesitas controlar qué setState diferir — solo el valor.</li>
          </ul>
        </div>

        {/* useDeferredValue vs useTransition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3">useDeferredValue vs useTransition</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
              <h3 className="font-semibold text-violet-700 mb-1">useDeferredValue</h3>
              <ul className="space-y-1 text-violet-800 text-xs">
                <li>• Difiere un <strong>valor</strong> específico</li>
                <li>• Útil cuando no controlas el setState origen</li>
                <li>• Ideal para librerías de terceros</li>
              </ul>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
              <h3 className="font-semibold text-sky-700 mb-1">useTransition</h3>
              <ul className="space-y-1 text-sky-800 text-xs">
                <li>• Difiere una <strong>actualización</strong> de estado</li>
                <li>• Proporciona <code className="bg-sky-100 px-1 rounded">isPending</code> explícito</li>
                <li>• Control total sobre qué setState es no urgente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-violet-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

// isStale es true mientras deferredQuery != query
const isStale = query !== deferredQuery;

// El input se actualiza de inmediato (query)
// La lista costosa usa deferredQuery → se renderiza en segundo plano
<input value={query} onChange={e => setQuery(e.target.value)} />
<div style={{ opacity: isStale ? 0.5 : 1 }}>
  <HeavyList filter={deferredQuery} />
</div>`}</pre>
        </details>

        {/* Ejemplo 1: Con useDeferredValue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Ejemplo 1: Con <code className="text-violet-600">useDeferredValue</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            El input responde al instante. La lista pesada usa el valor diferido y se atenúa
            mientras se actualiza.
          </p>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar elemento…"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 mb-3 text-sm"
          />

          <div className={`transition-opacity duration-200 ${isStale ? 'opacity-50' : 'opacity-100'}`}>
            <HeavyList filter={deferredQuery} />
          </div>

          {isStale && (
            <p className="text-xs text-violet-500 mt-2 animate-pulse">
              Actualizando lista con valor diferido…
            </p>
          )}
        </div>

        {/* Ejemplo 2: Sin useDeferredValue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Ejemplo 2: Sin <code className="text-rose-600">useDeferredValue</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Aquí el input usa el mismo valor directamente en la lista. Escribe rápido y nota
            que el input puede sentirse menos fluido.
          </p>

          <input
            type="text"
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
            placeholder="Buscar sin diferir…"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 mb-3 text-sm"
          />

          <HeavyList filter={query2} />
        </div>

        {/* Cuándo usar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">¿Cuándo usar useDeferredValue?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">✅ Úsalo cuando…</h3>
              <ul className="space-y-1 text-green-800">
                <li>• La actualización de estado no está bajo tu control</li>
                <li>• Quieres diferir el <em>consume</em> de un valor, no el setState</li>
                <li>• Trabajas con componentes externos o de librería</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-700 mb-2">⚠️ No lo necesitas cuando…</h3>
              <ul className="space-y-1 text-amber-800">
                <li>• Controlas el setState y puedes usar <code className="bg-amber-100 px-1 rounded">useTransition</code></li>
                <li>• El render no es realmente costoso</li>
                <li>• Necesitas mostrar un spinner explícito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
