import { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

/* ─── Datos pesados para simular un render costoso ────────────────────────── */
const ALL_ITEMS = Array.from({ length: 20_000 }, (_, i) => `Elemento #${i + 1}`);

/** Componente hijo que renderiza una lista grande (simulando trabajo pesado) */
function HeavyList({ filter }: { filter: string }) {
  const filtered = ALL_ITEMS.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <ul className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
      {filtered.slice(0, 500).map((item) => (
        <li key={item} className="px-3 py-1.5 text-gray-700">
          {item}
        </li>
      ))}
      {filtered.length > 500 && (
        <li className="px-3 py-2 text-gray-400 italic">
          … y {filtered.length - 500} más
        </li>
      )}
    </ul>
  );
}

export function UseTransitionPage() {
  // ─── Ejemplo 1: Filtro con useTransition ──────────────────────────────────
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Actualización urgente: el input responde inmediatamente
    setInputValue(value);
    // Actualización no urgente: filtrar la lista pesada se difiere
    startTransition(() => {
      setFilter(value);
    });
  };

  // ─── Ejemplo 2: Tabs con useTransition ────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'resumen' | 'detalle' | 'historial'>('resumen');
  const [isPendingTab, startTabTransition] = useTransition();

  const handleTabChange = (tab: typeof activeTab) => {
    startTabTransition(() => {
      setActiveTab(tab);
    });
  };

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'detalle', label: 'Detalle (pesado)' },
    { key: 'historial', label: 'Historial (pesado)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">useReducer →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useTransition</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useTransition</code> permite marcar actualizaciones de estado
            como <strong>no urgentes</strong>, evitando que bloqueen la UI mientras React las procesa en segundo plano.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-blue-100 px-1 rounded">const [isPending, startTransition] = useTransition()</code> retorna un flag y una función.</li>
            <li>Envuelve la actualización costosa dentro de <code className="bg-blue-100 px-1 rounded">startTransition(() =&gt; setState(...))</code>.</li>
            <li>React prioriza las actualizaciones urgentes (input) y difiere las no urgentes (lista).</li>
            <li><code className="bg-blue-100 px-1 rounded">isPending</code> es <code className="bg-blue-100 px-1 rounded">true</code> mientras la transición se procesa → úsalo para mostrar indicadores de carga.</li>
            <li>A diferencia de <code className="bg-blue-100 px-1 rounded">useDeferredValue</code>, te da control explícito sobre <strong>qué</strong> actualización diferir.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-blue-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`const [inputValue, setInputValue] = useState('');
const [filter, setFilter] = useState('');
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  // Urgente: el input responde de inmediato
  setInputValue(e.target.value);

  // No urgente: filtrar la lista pesada se difiere
  startTransition(() => {
    setFilter(e.target.value);
  });
};

// isPending → true mientras la transición se procesa
{isPending && <Spinner />}`}</pre>
        </details>

        {/* ───────── Ejemplo 1: Filtro con transición ───────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 1: Filtro con transición</h2>
          <p className="text-sm text-gray-500 mb-4">
            Escribe en el input — la respuesta es inmediata gracias a <code className="bg-gray-100 px-1 rounded">useTransition</code>.
            La lista pesada (20 000 elementos) se actualiza en segundo plano.
          </p>

          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Buscar elemento…"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 text-sm"
          />

          {isPending && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Actualizando lista…
            </div>
          )}

          <HeavyList filter={filter} />
        </div>

        {/* ───────── Ejemplo 2: Tabs con transición ───────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 2: Tabs con transición</h2>
          <p className="text-sm text-gray-500 mb-4">
            Cambiar de tab dispara un render pesado. Sin <code className="bg-gray-100 px-1 rounded">useTransition</code>,
            los clicks se sentirían lentos. Con él, el tab activo cambia de forma fluida.
          </p>

          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={`transition-opacity ${isPendingTab ? 'opacity-50' : 'opacity-100'}`}>
            {activeTab === 'resumen' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                <strong>Resumen:</strong> Este tab es liviano y se renderiza rápido.
              </div>
            )}
            {activeTab === 'detalle' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Detalle:</strong> Simulando contenido pesado…
                <ul className="mt-2 space-y-0.5 max-h-48 overflow-y-auto">
                  {Array.from({ length: 2000 }, (_, i) => (
                    <li key={i}>Registro de detalle #{i + 1}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'historial' && (
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg text-sm text-violet-800">
                <strong>Historial:</strong> Simulando contenido pesado…
                <ul className="mt-2 space-y-0.5 max-h-48 overflow-y-auto">
                  {Array.from({ length: 3000 }, (_, i) => (
                    <li key={i}>Evento #{i + 1} — {new Date(Date.now() - i * 60_000).toLocaleTimeString()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Comparación sin/con useTransition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Sin vs Con useTransition</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-2">❌ Sin useTransition</h3>
              <ul className="space-y-1 text-red-800">
                <li>• El input se congela mientras la lista filtra</li>
                <li>• Todas las actualizaciones tienen la misma prioridad</li>
                <li>• Mala experiencia de usuario en renders costosos</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">✅ Con useTransition</h3>
              <ul className="space-y-1 text-green-800">
                <li>• El input responde de inmediato</li>
                <li>• La lista se actualiza en segundo plano</li>
                <li>• <code className="bg-green-100 px-1 rounded">isPending</code> permite mostrar un spinner</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
