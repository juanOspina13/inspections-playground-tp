import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

interface Filters {
  status: 'aprobado' | 'pendiente';
  zone: 'norte' | 'sur';
}

const PrimitiveBadge = memo(function PrimitiveBadge({ value }: { value: number }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-sm text-emerald-800 mb-1">
        Prop primitiva (number): <strong>{value}</strong>
      </p>
      <p className="text-xs text-gray-500">Render del hijo: <strong>{renderCount.current}</strong></p>
    </div>
  );
});

const ObjectBadge = memo(function ObjectBadge({
  value,
}: {
  value: { score: number };
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
      <p className="text-sm text-orange-800 mb-1">
        Prop objeto (inline): <strong>{value.score}</strong>
      </p>
      <p className="text-xs text-gray-500">Render del hijo: <strong>{renderCount.current}</strong></p>
    </div>
  );
});

const FilterPanel = memo(function FilterPanel({
  filters,
  mode,
}: {
  filters: Filters;
  mode: 'estable' | 'inestable';
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className={`rounded-lg border p-4 ${mode === 'estable' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
      <p className={`text-sm mb-2 ${mode === 'estable' ? 'text-green-800' : 'text-amber-800'}`}>
        Panel memoizado con <code className={mode === 'estable' ? 'bg-green-100 px-1 rounded' : 'bg-amber-100 px-1 rounded'}>memo()</code>
      </p>
      <p className="text-sm text-gray-700">
        <strong>status:</strong> {filters.status} · <strong>zone:</strong> {filters.zone}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Render del hijo: <strong>{renderCount.current}</strong>
      </p>
    </div>
  );
});

const ActionButton = memo(function ActionButton({
  onAction,
  label,
  mode,
}: {
  onAction: () => void;
  label: string;
  mode: 'estable' | 'inestable';
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className={`rounded-lg border p-4 ${mode === 'estable' ? 'bg-sky-50 border-sky-200' : 'bg-rose-50 border-rose-200'}`}>
      <p className={`text-sm mb-2 ${mode === 'estable' ? 'text-sky-800' : 'text-rose-800'}`}>
        Botón hijo memoizado: <strong>{label}</strong>
      </p>
      <button
        onClick={onAction}
        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${mode === 'estable' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-rose-600 hover:bg-rose-700'}`}
      >
        Ejecutar acción
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Render del hijo: <strong>{renderCount.current}</strong>
      </p>
    </div>
  );
});

export function StableReferencesPage() {
  const [unrelated, setUnrelated] = useState(0);
  const [executions, setExecutions] = useState(0);

  // Inestable: se crea un nuevo objeto en cada render.
  const unstableFilters: Filters = {
    status: 'aprobado',
    zone: 'norte',
  };

  // Estable: mantiene la referencia entre renders.
  const stableFilters = useMemo<Filters>(() => ({
    status: 'aprobado',
    zone: 'norte',
  }), []);

  // Inestable: nueva función en cada render.
  const unstableAction = () => {
    setExecutions((prev) => prev + 1);
  };

  // Estable: misma referencia de función entre renders.
  const stableAction = useCallback(() => {
    setExecutions((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_MEMO_CALLBACK} className="text-blue-600 hover:underline">← useMemo / useCallback</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">useReducer →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Stable vs Unstable References</h1>
          <p className="text-gray-500 text-sm mt-1">
            En React, comparar props por referencia es clave para evitar re-renders innecesarios.
            Si recreas objetos o funciones en cada render, sus referencias cambian aunque el contenido sea igual.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 text-sm text-indigo-800">
          <strong>Regla práctica</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><strong>Primitive values (string, number, boolean, null, undefined):</strong> son estables por comparación de valor.</li>
            <li><strong>Unstable reference:</strong> <code className="bg-indigo-100 px-1 rounded">{`{}`}</code>, <code className="bg-indigo-100 px-1 rounded">[]</code> o <code className="bg-indigo-100 px-1 rounded">() =&gt; {'{...}'}</code> creados dentro del render.</li>
            <li><strong>Stable reference:</strong> usa <code className="bg-indigo-100 px-1 rounded">useMemo</code>, <code className="bg-indigo-100 px-1 rounded">useCallback</code> o <code className="bg-indigo-100 px-1 rounded">useRef</code>.</li>
            <li>Esto importa especialmente cuando pasas props a hijos con <code className="bg-indigo-100 px-1 rounded">memo()</code> o como dependencias de <code className="bg-indigo-100 px-1 rounded">useEffect</code>.</li>
          </ul>
        </div>

        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-indigo-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver patrón recomendado ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// ❌ Inestable: nueva referencia en cada render
const config = { pageSize: 20 };
const onRefresh = () => fetchData();

// ✅ Estable
const config = useMemo(() => ({ pageSize: 20 }), []);
const onRefresh = useCallback(() => fetchData(), [fetchData]);`}</pre>
        </details>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Controles del demo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Haz click en <code className="bg-gray-100 px-1 rounded">Re-render padre</code> para cambiar estado no relacionado.
            Observa qué hijos memoizados vuelven a renderizar.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setUnrelated((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
            >
              Re-render padre
            </button>
            <span className="text-sm text-gray-600">Estado no relacionado: <strong>{unrelated}</strong></span>
            <span className="text-sm text-gray-600">Acciones ejecutadas: <strong>{executions}</strong></span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Primitives (stable) vs Objects (unstable por default)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ambos hijos están memoizados. Al forzar <code className="bg-gray-100 px-1 rounded">Re-render padre</code>,
            el hijo con primitive mantiene la misma prop por valor, mientras el hijo con objeto inline recibe una nueva referencia.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PrimitiveBadge value={7} />
            <ObjectBadge value={{ score: 7 }} />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Resultado esperado: el contador de render del primitive casi no cambia, el del objeto aumenta en cada render del padre.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-amber-700 mb-2">Referencia inestable (objeto inline)</h3>
            <p className="text-sm text-gray-500 mb-3">
              El hijo memoizado se vuelve a renderizar porque el objeto es nuevo en cada render del padre.
            </p>
            <FilterPanel filters={unstableFilters} mode="inestable" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-green-700 mb-2">Referencia estable (useMemo)</h3>
            <p className="text-sm text-gray-500 mb-3">
              El hijo memoizado evita re-render si solo cambia estado no relacionado en el padre.
            </p>
            <FilterPanel filters={stableFilters} mode="estable" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-rose-700 mb-2">Función inestable (inline)</h3>
            <p className="text-sm text-gray-500 mb-3">
              Cada render crea una nueva función y el hijo memoizado detecta cambio de prop.
            </p>
            <ActionButton onAction={unstableAction} label="Inestable" mode="inestable" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-sky-700 mb-2">Función estable (useCallback)</h3>
            <p className="text-sm text-gray-500 mb-3">
              La referencia de función se mantiene estable entre renders.
            </p>
            <ActionButton onAction={stableAction} label="Estable" mode="estable" />
          </div>
        </div>
      </div>
    </div>
  );
}
