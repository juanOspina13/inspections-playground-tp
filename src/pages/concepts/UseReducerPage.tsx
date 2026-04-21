import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

// ─── Tipos del reducer ────────────────────────────────────────────────────────
interface InspectionScheduleState {
  proximaInspeccion: string | null;
  historial: string[];
}

type ScheduleAction =
  | { type: 'programar'; payload: string }
  | { type: 'posponer'; payload: number }
  | { type: 'limpiar' }
  | { type: 'resetear' };

// ─── Funciones auxiliares ─────────────────────────────────────────────────────
function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
const initialState: InspectionScheduleState = {
  proximaInspeccion: null,
  historial: [],
};

function scheduleReducer(
  state: InspectionScheduleState,
  action: ScheduleAction,
): InspectionScheduleState {
  switch (action.type) {
    case 'programar':
      return {
        ...state,
        proximaInspeccion: action.payload,
        historial: [...state.historial, `Programada: ${action.payload}`],
      };
    case 'posponer': {
      const base = state.proximaInspeccion ?? today();
      const newDate = addDays(base, action.payload);
      return {
        ...state,
        proximaInspeccion: newDate,
        historial: [...state.historial, `Pospuesta ${action.payload} días → ${newDate}`],
      };
    }
    case 'limpiar':
      return {
        ...state,
        proximaInspeccion: null,
        historial: [...state.historial, 'Fecha limpiada'],
      };
    case 'resetear':
      return initialState;
    default:
      return state;
  }
}

function newReducer(state: InspectionScheduleState, action: ScheduleAction): InspectionScheduleState {
  switch (action.type) {
    case 'programar':
      return { ...state, proximaInspeccion: action.payload };
    default:
      return state;
  }
}
export function UseReducerPage() {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_MEMO_CALLBACK} className="text-blue-600 hover:underline">← useMemo / useCallback</Link>
            <Link to={appRoutes.CONCEPTS_CONTEXT_API} className="text-blue-600 hover:underline">Context API →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useReducer</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useReducer</code> es una alternativa a <code className="bg-gray-100 px-1 rounded">useState</code>
            {' '}para manejar estado complejo con múltiples acciones. Funciona como un mini Redux local.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 text-sm text-indigo-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-indigo-100 px-1 rounded">const [state, dispatch] = useReducer(reducer, initialState)</code></li>
            <li>El <strong>reducer</strong> es una función pura: <code className="bg-indigo-100 px-1 rounded">(state, action) =&gt; newState</code>.</li>
            <li><code className="bg-indigo-100 px-1 rounded">dispatch(action)</code> envía una acción al reducer para transformar el estado.</li>
            <li>Ideal cuando el estado tiene <strong>múltiples sub-valores</strong> o transiciones complejas.</li>
            <li>El patrón <code className="bg-indigo-100 px-1 rounded">switch (action.type)</code> mantiene la lógica organizada y predecible.</li>
            <li>A diferencia de <code className="bg-indigo-100 px-1 rounded">useState</code>, toda la lógica de actualización está centralizada en el reducer.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-indigo-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del reducer ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`type ScheduleAction =
  | { type: 'programar'; payload: string }
  | { type: 'posponer'; payload: number }
  | { type: 'limpiar' }
  | { type: 'resetear' };

function scheduleReducer(
  state: InspectionScheduleState,
  action: ScheduleAction
): InspectionScheduleState {
  switch (action.type) {
    case 'programar':
      return { ...state, proximaInspeccion: action.payload };
    case 'posponer': {
      const base = state.proximaInspeccion ?? today();
      const newDate = addDays(base, action.payload);
      return { ...state, proximaInspeccion: newDate };
    }
    case 'limpiar':
      return { ...state, proximaInspeccion: null };
    case 'resetear':
      return initialState;
  }
}

// Uso:
const [state, dispatch] = useReducer(scheduleReducer, initialState);
dispatch({ type: 'programar', payload: '2026-06-15' });
dispatch({ type: 'posponer', payload: 30 });`}</pre>
        </details>

        {/* Estado actual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Estado actual</h2>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <pre className="text-gray-700 overflow-x-auto">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Acciones disponibles</h2>
          <p className="text-sm text-gray-500 mb-4">
            Cada botón hace <code className="bg-gray-100 px-1 rounded">dispatch(action)</code> con un tipo diferente.
          </p>
          <div className="space-y-3">
            {/* Programar */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 min-w-[100px] py-2">Programar:</span>
              <button
                onClick={() => dispatch({ type: 'programar', payload: '2026-06-15' })}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                15 Jun 2026
              </button>
              <button
                onClick={() => dispatch({ type: 'programar', payload: '2026-09-01' })}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                01 Sep 2026
              </button>
              <button
                onClick={() => dispatch({ type: 'programar', payload: today() })}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Hoy
              </button>
            </div>

            {/* Posponer */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 min-w-[100px] py-2">Posponer:</span>
              <button
                onClick={() => dispatch({ type: 'posponer', payload: 7 })}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
              >
                +7 días
              </button>
              <button
                onClick={() => dispatch({ type: 'posponer', payload: 30 })}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
              >
                +30 días
              </button>
              <button
                onClick={() => dispatch({ type: 'posponer', payload: 90 })}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
              >
                +90 días
              </button>
            </div>

            {/* Otras */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 min-w-[100px] py-2">Otros:</span>
              <button
                onClick={() => dispatch({ type: 'limpiar' })}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                Limpiar fecha
              </button>
              <button
                onClick={() => dispatch({ type: 'resetear' })}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Resetear todo
              </button>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Historial de acciones</h2>
          <p className="text-sm text-gray-500 mb-4">
            El reducer agrega cada acción al historial, demostrando cómo se pueden acumular transiciones de estado.
          </p>
          {state.historial.length === 0 ? (
            <p className="text-sm text-gray-400">Ninguna acción ejecutada aún.</p>
          ) : (
            <ol className="space-y-1 text-sm">
              {state.historial.map((entry, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                  {entry}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
