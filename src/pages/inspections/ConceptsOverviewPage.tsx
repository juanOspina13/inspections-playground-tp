import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

type ViewMode = 'concept' | 'implementation';

interface ConceptItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  concept: React.ReactNode;
  implementation: string;
  route?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const concepts: ConceptItem[] = [
  // ── Hooks ──
  {
    id: 'use-state',
    title: 'useState',
    icon: '🔄',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_STATE,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useState</strong> es el hook más fundamental de React. Agrega{' '}
          <em>estado local</em> a un componente funcional.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>
            <code className="bg-gray-100 px-1 rounded">
              {'const [valor, setValor] = useState(inicial)'}
            </code>
          </li>
          <li>Llamar a <code className="bg-gray-100 px-1 rounded">setValor</code> desencadena un re-render.</li>
          <li>El estado inicial solo se usa en el <strong>primer render</strong>.</li>
          <li>Para actualizar basado en el estado previo usa la forma funcional:
            {' '}<code className="bg-gray-100 px-1 rounded">{'setValor(prev => prev + 1)'}</code>
          </li>
        </ul>
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2 text-blue-800">
          <strong>Regla:</strong> cada cambio de estado en un componente provoca que ese componente (y sus hijos) se re-rendericen.
        </div>
      </div>
    ),
    implementation: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      {/* Actualización directa */}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <span>{count}</span>

      {/* Forma funcional (segura con async/batching) */}
      <button onClick={() => setCount(prev => prev + 1)}>+1 seguro</button>

      {/* Toggle booleano */}
      <button onClick={() => setIsVisible(v => !v)}>Toggle</button>
      {isVisible && <p>Visible</p>}
    </div>
  );
}`,
  },
  {
    id: 'use-effect',
    title: 'useEffect',
    icon: '⚡',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_EFFECT,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useEffect</strong> maneja <em>efectos secundarios</em>: llamadas a APIs, subscripciones, event listeners, timers, etc.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Se ejecuta <strong>después</strong> de que el componente se renderiza en el DOM.</li>
          <li>El array de dependencias controla cuándo se re-ejecuta.</li>
          <li>La función de limpieza (<em>cleanup</em>) cancela el efecto anterior antes de re-ejecutarlo.</li>
        </ul>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-center">
          <div className="bg-green-50 border border-green-200 rounded p-2">
            <p className="font-bold text-green-700">[]</p>
            <p className="text-gray-600">Solo al montar</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
            <p className="font-bold text-yellow-700">[dep]</p>
            <p className="text-gray-600">Cuando dep cambia</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="font-bold text-red-700">sin array</p>
            <p className="text-gray-600">Cada render</p>
          </div>
        </div>
      </div>
    ),
    implementation: `import { useState, useEffect } from 'react';

function InspectionsFetcher({ status }: { status: string }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(\`/api/inspections?status=\${status}\`)
      .then(r => r.json())
      .then(json => {
        if (!cancelled) setData(json);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    // cleanup: cancela si el componente se desmonta o status cambia
    return () => { cancelled = true; };
  }, [status]); // ← re-ejecuta solo cuando status cambia

  return loading ? <p>Cargando...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
  },
  {
    id: 'use-ref',
    title: 'useRef',
    icon: '📌',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_REF,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useRef</strong> devuelve un objeto mutable <code className="bg-gray-100 px-1 rounded">{'{ current: valor }'}</code> que persiste entre renders <em>sin provocar re-renders</em>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Usado para acceder directamente a un elemento del DOM.</li>
          <li>Para guardar valores que necesitan persistir (timers, flags) sin disparar renders.</li>
          <li>A diferencia de <code className="bg-gray-100 px-1 rounded">useState</code>, cambiar <code className="bg-gray-100 px-1 rounded">.current</code> NO re-renderiza.</li>
        </ul>
        <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2 text-amber-800 text-xs">
          <strong>Tip:</strong> Para acceder al DOM usa <code className="bg-amber-100 px-1 rounded">{'ref={miRef}'}</code> en el elemento JSX.
        </div>
      </div>
    ),
    implementation: `import { useRef, useEffect } from 'react';

function SearchInput() {
  // ref al nodo DOM → no causa re-renders al cambiar
  const inputRef = useRef<HTMLInputElement>(null);

  // ref para un valor mutable (timer id)
  const timerRef = useRef<number | null>(null);

  // Auto-focus al montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // debounce manual
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      console.log('Buscar:', e.target.value);
    }, 300);
  };

  return <input ref={inputRef} onChange={handleChange} placeholder="Buscar..." />;
}`,
  },
  {
    id: 'use-memo-callback',
    title: 'useMemo / useCallback / memo',
    icon: '🧠',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_MEMO_CALLBACK,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>Tres herramientas de <strong>memoización</strong> para optimizar renders:</p>
        <div className="space-y-2">
          <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
            <p className="font-bold text-cyan-700">useMemo(fn, deps)</p>
            <p className="text-gray-600 text-xs">Memoriza el <em>valor retornado</em> por una función costosa.</p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
            <p className="font-bold text-cyan-700">useCallback(fn, deps)</p>
            <p className="text-gray-600 text-xs">Memoriza la <em>referencia de una función</em>. Útil para pasar callbacks a componentes memoizados.</p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
            <p className="font-bold text-cyan-700">memo(Component)</p>
            <p className="text-gray-600 text-xs">Evita re-renderizar un componente si sus props no cambiaron (comparación superficial).</p>
          </div>
        </div>
        <div className="mt-1 bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-800 text-xs">
          <strong>Regla de oro:</strong> optimiza solo cuando tengas un problema de rendimiento medible; la memoización tiene su propio costo.
        </div>
      </div>
    ),
    implementation: `import { useMemo, useCallback, memo } from 'react';

// ── memo: evita re-render si props no cambian ────────────────
const InspectionRow = memo(({ id, status, onSelect }: Props) => {
  console.log('render row', id);
  return <tr onClick={() => onSelect(id)}><td>{status}</td></tr>;
});

function InspectionTable({ inspections, filter }) {
  // ── useMemo: calcula la lista filtrada solo cuando cambian ──
  const filtered = useMemo(
    () => inspections.filter(i => i.status === filter),
    [inspections, filter],
  );

  // ── useCallback: referencia estable para el callback ────────
  const handleSelect = useCallback((id: string) => {
    console.log('Seleccionada:', id);
  }, []); // sin deps → misma referencia siempre

  return (
    <table>
      {filtered.map(i => (
        <InspectionRow key={i.id} {...i} onSelect={handleSelect} />
      ))}
    </table>
  );
}`,
  },
  {
    id: 'stable-references',
    title: 'Stable vs Unstable References',
    icon: '🧷',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_STABLE_REFERENCES,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          En JavaScript, objetos y funciones son comparados <strong>por referencia</strong>. Cada render crea nuevas instancias, lo que puede anular optimizaciones.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="font-bold text-red-700">❌ Inestable</p>
            <pre className="text-gray-600 mt-1 text-[11px] whitespace-pre-wrap">{'const fn = () => {};\n// nueva fn cada render'}</pre>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-2">
            <p className="font-bold text-green-700">✅ Estable</p>
            <pre className="text-gray-600 mt-1 text-[11px] whitespace-pre-wrap">{'const fn = useCallback(\n  () => {}, []);\n// misma referencia'}</pre>
          </div>
        </div>
        <p className="text-xs text-gray-500">Una referencia inestable rompe <code className="bg-gray-100 px-1 rounded">memo</code>, provoca re-runs de <code className="bg-gray-100 px-1 rounded">useEffect</code> e invalida <code className="bg-gray-100 px-1 rounded">useCallback</code>.</p>
      </div>
    ),
    implementation: `// ─── Referencia INESTABLE ────────────────────────────────────
function ParentBad() {
  const [count, setCount] = useState(0);

  // ❌ Nueva función en cada render → memo(Child) siempre re-renderiza
  const handleClick = () => console.log('click');

  // ❌ Nuevo objeto en cada render → useEffect de Child se re-ejecuta
  const config = { theme: 'dark' };

  return <Child onAction={handleClick} config={config} />;
}

// ─── Referencia ESTABLE ──────────────────────────────────────
function ParentGood() {
  const [count, setCount] = useState(0);

  // ✅ Misma referencia → memo(Child) no re-renderiza
  const handleClick = useCallback(() => console.log('click'), []);

  // ✅ Mismo objeto mientras theme no cambia
  const config = useMemo(() => ({ theme: 'dark' }), []);

  return <Child onAction={handleClick} config={config} />;
}`,
  },
  {
    id: 'use-reducer',
    title: 'useReducer',
    icon: '⚙️',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_REDUCER,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useReducer</strong> maneja estado complejo mediante un patrón de <em>acción → reducer → nuevo estado</em>, similar a Redux pero local al componente.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Ideal cuando el siguiente estado depende del anterior de forma compleja.</li>
          <li>Centraliza la lógica de transiciones en una función pura (<em>reducer</em>).</li>
          <li>Facilita el testing ya que el reducer es puro (sin efectos secundarios).</li>
        </ul>
        <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded p-2 text-indigo-800 text-xs">
          <strong>Cuándo elegir useReducer sobre useState:</strong> cuando tienes 3+ campos de estado relacionados o transiciones complejas entre estados.
        </div>
      </div>
    ),
    implementation: `type Action =
  | { type: 'APPROVE'; id: string }
  | { type: 'REJECT'; id: string; reason: string }
  | { type: 'RESET' };

interface State {
  status: 'idle' | 'approved' | 'rejected';
  selectedId: string | null;
  reason: string;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'APPROVE':
      return { status: 'approved', selectedId: action.id, reason: '' };
    case 'REJECT':
      return { status: 'rejected', selectedId: action.id, reason: action.reason };
    case 'RESET':
      return { status: 'idle', selectedId: null, reason: '' };
    default:
      return state;
  }
}

function InspectionReview() {
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle', selectedId: null, reason: '',
  });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'APPROVE', id: '1' })}>Aprobar</button>
      <button onClick={() => dispatch({ type: 'REJECT', id: '1', reason: 'Falla de frenos' })}>
        Rechazar
      </button>
      <p>Estado: {state.status}</p>
    </div>
  );
}`,
  },
  {
    id: 'use-transition',
    title: 'useTransition',
    icon: '⏳',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_TRANSITION,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useTransition</strong> marca actualizaciones de estado como <em>no urgentes</em>, permitiendo que React las interrumpa para mantener la UI responsiva.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="font-bold text-red-700">Urgente</p>
            <p className="text-gray-600">Input del usuario, clicks — responden inmediatamente.</p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded p-2">
            <p className="font-bold text-teal-700">Transición</p>
            <p className="text-gray-600">Re-filtrar 10.000 items — puede esperar.</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Devuelve <code className="bg-gray-100 px-1 rounded">[isPending, startTransition]</code>. Usa <code className="bg-gray-100 px-1 rounded">isPending</code> para mostrar un spinner.
        </p>
      </div>
    ),
    implementation: `import { useState, useTransition } from 'react';

function FilterableList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val); // ← urgente: actualiza el input inmediatamente

    startTransition(() => {
      // ← no urgente: puede interrumpirse si el usuario sigue escribiendo
      setFiltered(items.filter(i => i.toLowerCase().includes(val.toLowerCase())));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Filtrar..." />
      {isPending && <span>Actualizando...</span>}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
  },
  {
    id: 'use-deferred-value',
    title: 'useDeferredValue',
    icon: '🔮',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_DEFERRED_VALUE,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useDeferredValue</strong> acepta un valor y devuelve una versión <em>diferida</em> del mismo. React priorizará el valor urgente y aplazará el costoso.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Similar a <code className="bg-gray-100 px-1 rounded">useTransition</code> pero aplicado al valor en lugar del setter.</li>
          <li>Útil cuando no controlas el setState directamente (props externas).</li>
          <li>La UI muestra el valor "viejo" (stale) mientras recalcula.</li>
        </ul>
        <div className="mt-1 bg-violet-50 border border-violet-200 rounded p-2 text-violet-800 text-xs">
          <strong>Patrón:</strong> combina con <code className="bg-violet-100 px-1 rounded">memo</code> en el componente costoso para que solo re-renderice cuando el valor diferido cambia.
        </div>
      </div>
    ),
    implementation: `import { useState, useDeferredValue, memo } from 'react';

// Componente costoso — envuelto en memo
const HeavyList = memo(({ query }: { query: string }) => {
  const items = Array.from({ length: 5000 }, (_, i) => \`Inspección \${i}\`).filter(
    i => i.includes(query)
  );
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // ← versión "retrasada"

  return (
    <div>
      {/* El input responde inmediatamente */}
      <input value={query} onChange={e => setQuery(e.target.value)} />

      {/* HeavyList solo re-renderiza con deferredQuery, no con query */}
      <HeavyList query={deferredQuery} />
    </div>
  );
}`,
  },
  {
    id: 'use-action-state',
    title: 'useActionState',
    icon: '🚀',
    category: 'Hooks',
    route: appRoutes.CONCEPTS_USE_ACTION_STATE,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>useActionState</strong> (React 19) gestiona el ciclo completo de una <em>form action</em>: estado resultado, indicador de carga y errores — en un solo hook.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Reemplaza el patrón <code className="bg-gray-100 px-1 rounded">isLoading + error + result</code> manual.</li>
          <li>Integrado con el nuevo modelo de acciones de formularios de React 19.</li>
          <li>Devuelve <code className="bg-gray-100 px-1 rounded">[state, action, isPending]</code>.</li>
        </ul>
        <div className="mt-1 bg-orange-50 border border-orange-200 rounded p-2 text-orange-800 text-xs">
          <strong>Requiere React 19+.</strong> En versiones anteriores usa <code className="bg-orange-100 px-1 rounded">useState + useTransition</code>.
        </div>
      </div>
    ),
    implementation: `import { useActionState } from 'react';

type FormState = { ok: boolean; message: string } | null;

async function submitInspection(_prev: FormState, data: FormData): Promise<FormState> {
  const plate = data.get('plate') as string;
  if (!plate) return { ok: false, message: 'La placa es requerida' };

  await fetch('/api/inspections', { method: 'POST', body: data });
  return { ok: true, message: 'Inspección creada exitosamente' };
}

function NewInspectionForm() {
  const [state, action, isPending] = useActionState(submitInspection, null);

  return (
    <form action={action}>
      <input name="plate" placeholder="ABC-123" />
      {state && (
        <p className={state.ok ? 'text-green-600' : 'text-red-600'}>{state.message}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Crear inspección'}
      </button>
    </form>
  );
}`,
  },
  // ── Patrones ──
  {
    id: 'context-api',
    title: 'Context API',
    icon: '🌐',
    category: 'Patrones',
    route: appRoutes.CONCEPTS_CONTEXT_API,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          La <strong>Context API</strong> permite compartir datos entre componentes sin pasar props manualmente en cada nivel (<em>prop drilling</em>).
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li><code className="bg-gray-100 px-1 rounded">createContext</code> crea el contexto.</li>
          <li><code className="bg-gray-100 px-1 rounded">{'<Context.Provider value={...}>'}</code> provee el valor.</li>
          <li><code className="bg-gray-100 px-1 rounded">useContext(Context)</code> consume el valor desde cualquier hijo.</li>
        </ul>
        <div className="mt-1 bg-purple-50 border border-purple-200 rounded p-2 text-purple-800 text-xs">
          <strong>Cuidado:</strong> cualquier cambio en el valor del Provider re-renderiza <em>todos</em> los consumidores. Divide contextos por dominio o usa memoización.
        </div>
      </div>
    ),
    implementation: `import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Crear el contexto
interface InspectionCtx {
  selectedId: string | null;
  select: (id: string) => void;
}
const InspectionContext = createContext<InspectionCtx | null>(null);

// 2. Provider (envuelve el subárbol que necesita el dato)
function InspectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <InspectionContext.Provider value={{ selectedId, select: setSelectedId }}>
      {children}
    </InspectionContext.Provider>
  );
}

// 3. Custom hook de acceso (con error-boundary incorporado)
function useInspectionCtx() {
  const ctx = useContext(InspectionContext);
  if (!ctx) throw new Error('useInspectionCtx debe usarse dentro de InspectionProvider');
  return ctx;
}

// 4. Consumidor en cualquier nivel
function InspectionBadge() {
  const { selectedId } = useInspectionCtx();
  return <span>Seleccionada: {selectedId ?? 'ninguna'}</span>;
}`,
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    icon: '🪝',
    category: 'Patrones',
    route: appRoutes.CONCEPTS_CUSTOM_HOOKS,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          Los <strong>Custom Hooks</strong> son funciones que empiezan con <code className="bg-gray-100 px-1 rounded">use</code> y encapsulan lógica de estado reutilizable.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Permiten compartir lógica <em>sin</em> compartir UI (a diferencia de HOCs o render props).</li>
          <li>Pueden usar cualquier hook interno: useState, useEffect, useCallback, etc.</li>
          <li>Son la forma idiomática de extraer y testear lógica en React moderno.</li>
        </ul>
        <div className="mt-1 bg-pink-50 border border-pink-200 rounded p-2 text-pink-800 text-xs">
          <strong>Regla:</strong> si el nombre no empieza con <code className="bg-pink-100 px-1 rounded">use</code>, React no puede verificar que sigue las reglas de hooks.
        </div>
      </div>
    ),
    implementation: `// hooks/useInspectionFilters.ts
import { useState, useMemo } from 'react';
import type { Inspection } from '@/types/inspection';

export function useInspectionFilters(inspections: Inspection[]) {
  const [status, setStatus] = useState<string>('todas');
  const [query, setQuery]   = useState('');

  const filtered = useMemo(() => {
    return inspections
      .filter(i => status === 'todas' || i.estado === status)
      .filter(i => i.placa.toLowerCase().includes(query.toLowerCase()));
  }, [inspections, status, query]);

  return { filtered, status, setStatus, query, setQuery };
}

// Uso en cualquier componente:
function InspectionPage() {
  const { filtered, status, setStatus, query, setQuery } =
    useInspectionFilters(allInspections);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="todas">Todas</option>
        <option value="aprobada">Aprobadas</option>
      </select>
      <InspectionTable data={filtered} />
    </div>
  );
}`,
  },
  // ── Estado global ──
  {
    id: 'redux',
    title: 'Redux Toolkit',
    icon: '🗃️',
    category: 'Estado Global',
    route: appRoutes.CONCEPTS_REDUX,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Redux Toolkit (RTK)</strong> es la forma oficial y moderna de usar Redux. Elimina el boilerplate con <em>slices</em>, <em>immer</em> integrado y <em>RTK Query</em>.
        </p>
        <div className="space-y-1 text-xs">
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">createSlice</span>
            <span className="text-gray-600"> — define reducer + actions en un solo lugar.</span>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">configureStore</span>
            <span className="text-gray-600"> — combina slices y agrega devtools automáticamente.</span>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">useSelector / useDispatch</span>
            <span className="text-gray-600"> — consumen el store desde cualquier componente.</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">Ideal para estado global complejo compartido entre muchas partes de la app.</p>
      </div>
    ),
    implementation: `// store/inspectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const inspectionSlice = createSlice({
  name: 'inspection',
  initialState: { selected: null as string | null, filter: 'todas' },
  reducers: {
    selectInspection(state, action: PayloadAction<string>) {
      state.selected = action.payload; // immer → mutación directa OK
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const { selectInspection, setFilter } = inspectionSlice.actions;
export default inspectionSlice.reducer;

// ─── Uso en componente ──────────────────────────────────────
import { useSelector, useDispatch } from 'react-redux';
import { selectInspection, setFilter } from '@/redux/reducers/inspectionReducer';

function InspectionToolbar() {
  const filter   = useSelector((s: RootState) => s.inspection.filter);
  const dispatch = useDispatch();

  return (
    <select value={filter} onChange={e => dispatch(setFilter(e.target.value))}>
      <option value="todas">Todas</option>
      <option value="aprobada">Aprobadas</option>
    </select>
  );
}`,
  },
  // ── Estilos ──
  {
    id: 'styled-components',
    title: 'Styled Components',
    icon: '🎨',
    category: 'Estilos',
    route: appRoutes.CONCEPTS_STYLED_COMPONENTS,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Styled Components</strong> es una librería de <em>CSS-in-JS</em> que permite escribir CSS real dentro de JavaScript, asociado directamente al componente.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Los estilos están <em>encapsulados</em> al componente — no hay colisiones de clases CSS.</li>
          <li>Soporta <em>props dinámicos</em> para estilos condicionales.</li>
          <li>Genera nombres de clase automáticos y únicos.</li>
          <li>Soporta <em>theming</em> global mediante <code className="bg-gray-100 px-1 rounded">ThemeProvider</code>.</li>
        </ul>
      </div>
    ),
    implementation: `import styled, { css, ThemeProvider } from 'styled-components';

// Componente estilizado básico
const Button = styled.button<{ $variant?: 'primary' | 'danger' }>\`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;

  // Estilos condicionales basados en props
  \${({ $variant }) =>
    $variant === 'danger'
      ? css\`background: #ef4444; color: white;\`
      : css\`background: #3b82f6; color: white;\`}

  &:hover { opacity: 0.9; }
\`;

// Extender estilos de otro componente
const IconButton = styled(Button)\`
  display: flex;
  align-items: center;
  gap: 0.5rem;
\`;

function InspectionActions() {
  return (
    <div>
      <Button>Aprobar</Button>
      <Button $variant="danger">Rechazar</Button>
      <IconButton>🔍 Ver detalles</IconButton>
    </div>
  );
}`,
  },
  // ── Formularios ──
  {
    id: 'form-controlled',
    title: 'Formulario Controlado',
    icon: '📋',
    category: 'Formularios',
    route: appRoutes.FORMS_CONTROLLED,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          En un formulario <strong>controlado</strong>, React es la <em>única fuente de verdad</em> del valor de cada input: el estado de React controla el DOM.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Cada input tiene <code className="bg-gray-100 px-1 rounded">{'value={state}'}</code> y <code className="bg-gray-100 px-1 rounded">onChange</code> que actualiza el estado.</li>
          <li>Permite validación en tiempo real, transformaciones y lógica dependiente.</li>
          <li>Mayor verbosidad pero máximo control.</li>
        </ul>
        <div className="mt-1 bg-blue-50 border border-blue-200 rounded p-2 text-blue-800 text-xs">
          <strong>Flujo:</strong> usuario escribe → onChange → setState → React re-renderiza con nuevo value.
        </div>
      </div>
    ),
    implementation: `import { useState, FormEvent } from 'react';

interface FormValues {
  placa: string;
  tipo: string;
  fecha: string;
}

function ControlledInspectionForm() {
  const [values, setValues] = useState<FormValues>({
    placa: '', tipo: '', fecha: '',
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Validación en tiempo real
    if (name === 'placa' && value.length < 6)
      setErrors(prev => ({ ...prev, placa: 'Mínimo 6 caracteres' }));
    else
      setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Enviando:', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="placa" value={values.placa} onChange={handleChange} />
      {errors.placa && <p className="text-red-500">{errors.placa}</p>}
      <button type="submit" disabled={!!Object.values(errors).filter(Boolean).length}>
        Crear
      </button>
    </form>
  );
}`,
  },
  {
    id: 'form-uncontrolled',
    title: 'Formulario No Controlado',
    icon: '📄',
    category: 'Formularios',
    route: appRoutes.FORMS_UNCONTROLLED,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          En un formulario <strong>no controlado</strong>, el DOM mantiene el estado de los inputs. React solo lee los valores al momento de submit usando <code className="bg-gray-100 px-1 rounded">refs</code> o <code className="bg-gray-100 px-1 rounded">FormData</code>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Menos re-renders: React no se involucra en cada tecla.</li>
          <li>Útil para integraciones con librerías no-React o formularios con muchos campos.</li>
          <li>Validación típicamente al submit, no en tiempo real.</li>
        </ul>
        <div className="mt-1 bg-amber-50 border border-amber-200 rounded p-2 text-amber-800 text-xs">
          <strong>Flujo:</strong> usuario escribe → DOM guarda valor → submit → leer con ref o FormData.
        </div>
      </div>
    ),
    implementation: `import { useRef, FormEvent } from 'react';

function UncontrolledInspectionForm() {
  // Los refs apuntan a los nodos DOM — sin estado de React
  const placaRef = useRef<HTMLInputElement>(null);
  const tipoRef  = useRef<HTMLSelectElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Opción 1: leer directamente via refs
    const placa = placaRef.current?.value ?? '';
    const tipo  = tipoRef.current?.value ?? '';

    // Opción 2: usar la API estándar FormData
    const form = e.currentTarget;
    const data = new FormData(form);
    const plate = data.get('placa') as string;

    console.log({ placa, tipo, plate });
    form.reset(); // limpiar el formulario
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* defaultValue en lugar de value → no controlado */}
      <input ref={placaRef} name="placa" defaultValue="" placeholder="Placa" />
      <select ref={tipoRef} name="tipo" defaultValue="automovil">
        <option value="automovil">Automóvil</option>
        <option value="moto">Moto</option>
      </select>
      <button type="submit">Crear</button>
    </form>
  );
}`,
  },
  {
    id: 'react-hook-form',
    title: 'React Hook Form + Zod',
    icon: '✅',
    category: 'Formularios',
    route: appRoutes.FORMS_HOOK_FORM,
    concept: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>React Hook Form</strong> gestiona formularios con mínimos re-renders. <strong>Zod</strong> define un esquema de validación con tipos TypeScript automáticos.
        </p>
        <div className="space-y-1 text-xs">
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">RHF</span>
            <span className="text-gray-600"> — register, handleSubmit, formState, watch, setValue.</span>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">Zod</span>
            <span className="text-gray-600"> — z.object(), z.string().min(), z.enum(), parse/safeParse.</span>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <span className="font-bold text-violet-700">zodResolver</span>
            <span className="text-gray-600"> — puente entre RHF y Zod vía @hookform/resolvers.</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">Los errores se infieren del esquema y el tipo <code className="bg-gray-100 px-1 rounded">FormValues</code> se deriva automáticamente con <code className="bg-gray-100 px-1 rounded">z.infer</code>.</p>
      </div>
    ),
    implementation: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Esquema de validación
const schema = z.object({
  placa:  z.string().min(6, 'Mínimo 6 caracteres').max(8),
  tipo:   z.enum(['automovil', 'moto', 'camion']),
  fecha:  z.string().min(1, 'Requerido'),
  km:     z.number({ invalid_type_error: 'Debe ser un número' }).positive(),
});

// 2. Tipo derivado del esquema ← cero duplicación
type FormValues = z.infer<typeof schema>;

function ZodInspectionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => console.log('Válido:', data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('placa')} placeholder="Placa" />
      {errors.placa && <p className="text-red-500">{errors.placa.message}</p>}

      <input {...register('km', { valueAsNumber: true })} type="number" />
      {errors.km && <p className="text-red-500">{errors.km.message}</p>}

      <button type="submit">Crear inspección</button>
    </form>
  );
}`,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Hooks: 'bg-blue-100 text-blue-700',
  Patrones: 'bg-purple-100 text-purple-700',
  'Estado Global': 'bg-violet-100 text-violet-700',
  Estilos: 'bg-pink-100 text-pink-700',
  Formularios: 'bg-amber-100 text-amber-700',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = ['Todos', 'Hooks', 'Patrones', 'Estado Global', 'Estilos', 'Formularios'];

export function ConceptsOverviewPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [globalMode, setGlobalMode] = useState<ViewMode | null>(null);

  const visible = concepts.filter(
    (c) => activeCategory === 'Todos' || c.category === activeCategory,
  );

  // Apply global mode override when toggling all
  const handleGlobalToggle = (mode: ViewMode) => {
    setGlobalMode((prev) => (prev === mode ? null : mode));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <nav className="flex gap-3 text-sm mb-4 flex-wrap items-center">
            <Link to={appRoutes.DASHBOARD} className="text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">
              🏠 Conceptos
            </Link>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Resumen de Conceptos React</h1>
          <p className="text-gray-500 mt-1">
            Alterna entre la explicación conceptual y el ejemplo de implementación para cada tema.
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Global toggle */}
          <div className="ml-auto flex gap-2 text-xs">
            <button
              onClick={() => handleGlobalToggle('concept')}
              className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
                globalMode === 'concept'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}
            >
              📚 Todos: Concepto
            </button>
            <button
              onClick={() => handleGlobalToggle('implementation')}
              className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
                globalMode === 'implementation'
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-600'
              }`}
            >
              {'</> Todos: Código'}
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-700">{visible.length}</span> conceptos
          {activeCategory !== 'Todos' && (
            <span>· filtrando por <strong>{activeCategory}</strong></span>
          )}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((item) => (
            <ConceptCardControlled key={item.id} item={item} globalMode={globalMode} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ConceptCard with global mode override ────────────────────────────────────

function ConceptCardControlled({
  item,
  globalMode,
}: {
  item: ConceptItem;
  globalMode: ViewMode | null;
}) {
  const [localMode, setLocalMode] = useState<ViewMode>('concept');
  const mode = globalMode ?? localMode;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">{item.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.title}</h3>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {item.category}
            </span>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
          <button
            onClick={() => setLocalMode('concept')}
            className={`px-2.5 py-1 transition-colors ${
              mode === 'concept'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Concepto
          </button>
          <button
            onClick={() => setLocalMode('implementation')}
            className={`px-2.5 py-1 transition-colors ${
              mode === 'implementation'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {'</>'}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 p-4">
        {mode === 'concept' ? (
          <div>{item.concept}</div>
        ) : (
          <pre className="text-[11px] leading-relaxed text-green-300 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre font-mono">
            {item.implementation}
          </pre>
        )}
      </div>

      {/* Footer link */}
      {item.route && (
        <div className="px-4 pb-3 pt-0">
          <Link
            to={item.route}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            Ver ejemplo completo →
          </Link>
        </div>
      )}
    </div>
  );
}
