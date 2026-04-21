import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface LoginState {
  success: boolean | null;
  error: string | null;
  username: string;
}

interface ScheduleState {
  submitted: boolean;
  date: string | null;
  inspector: string | null;
  error: string | null;
}

// ─── Acciones (simulan lógica async con delay) ────────────────────────────────
async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  await new Promise((r) => setTimeout(r, 900));
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: 'Usuario y contraseña son requeridos.', username };
  }
  if (username === 'inspector' && password === '1234') {
    return { success: true, error: null, username };
  }
  return { success: false, error: 'Credenciales incorrectas.', username };
}

async function scheduleAction(
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  await new Promise((r) => setTimeout(r, 700));
  const date = formData.get('date') as string;
  const inspector = formData.get('inspector') as string;

  if (!date || !inspector) {
    return { submitted: false, date: null, inspector: null, error: 'Todos los campos son obligatorios.' };
  }
  if (new Date(date) < new Date()) {
    return { submitted: false, date, inspector: null, error: 'La fecha debe ser futura.' };
  }
  return { submitted: true, date, inspector, error: null };
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function UseActionStatePage() {
  // Ejemplo 1: Formulario de login
  const [loginState, loginDispatch, loginPending] = useActionState(loginAction, {
    success: null,
    error: null,
    username: '',
  });

  // Ejemplo 2: Programar inspección
  const [scheduleState, scheduleDispatch, schedulePending] = useActionState(scheduleAction, {
    submitted: false,
    date: null,
    inspector: null,
    error: null,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">← useReducer</Link>
            <Link to={appRoutes.CONCEPTS_CONTEXT_API} className="text-blue-600 hover:underline">Context API →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useActionState</h1>
          <p className="text-gray-500 text-sm mt-1">
            Nuevo hook de React 19 que gestiona el <strong>estado de una action</strong> vinculada a un formulario.
            Simplifica el patrón de manejar pendiente, error y resultado de operaciones async sin boilerplate adicional.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-sm text-orange-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>
              <code className="bg-orange-100 px-1 rounded">
                {'const [state, dispatch, isPending] = useActionState(actionFn, initialState)'}
              </code>
            </li>
            <li><code className="bg-orange-100 px-1 rounded">actionFn</code> recibe el estado previo y un <code className="bg-orange-100 px-1 rounded">FormData</code> (o payload manual). Debe retornar el nuevo estado.</li>
            <li><code className="bg-orange-100 px-1 rounded">isPending</code> es <code className="bg-orange-100 px-1 rounded">true</code> mientras la action async se ejecuta.</li>
            <li>Se usa directamente como <code className="bg-orange-100 px-1 rounded">{'<form action={dispatch}>'}</code> o con <code className="bg-orange-100 px-1 rounded">dispatch(payload)</code>.</li>
            <li>Reemplaza el patrón manual de <code className="bg-orange-100 px-1 rounded">useState</code> + <code className="bg-orange-100 px-1 rounded">useTransition</code> + handler.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-orange-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver patrón de código ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// 1. Define la action (función pura async)
async function myAction(prevState, formData) {
  const value = formData.get('field');
  // ...lógica async
  return { success: true, error: null };
}

// 2. Usa el hook
const [state, dispatch, isPending] = useActionState(myAction, {
  success: null,
  error: null,
});

// 3. Conecta al form
<form action={dispatch}>
  <input name="field" />
  <button disabled={isPending}>
    {isPending ? 'Enviando...' : 'Enviar'}
  </button>
</form>

// El estado previo se pasa automáticamente a myAction
// state refleja el resultado de la última ejecución`}</pre>
        </details>

        {/* Ejemplo 1: Login */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Ejemplo 1: Formulario de login</h2>
          <p className="text-sm text-gray-500 mb-4">
            Usa <code className="bg-gray-100 px-1 rounded">{'<form action={dispatch}>'}</code>.
            La action valida credenciales y retorna el nuevo estado.
            Prueba con <strong>inspector / 1234</strong>.
          </p>

          <form action={loginDispatch} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                name="username"
                defaultValue={loginState.username}
                placeholder="inspector"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                placeholder="1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loginPending}
              className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {loginPending ? 'Verificando…' : 'Iniciar sesión'}
            </button>
          </form>

          {loginState.success === true && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              ✅ Bienvenido, <strong>{loginState.username}</strong>
            </div>
          )}
          {loginState.success === false && loginState.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              ❌ {loginState.error}
            </div>
          )}
        </div>

        {/* Ejemplo 2: Programar inspección */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Ejemplo 2: Programar inspección</h2>
          <p className="text-sm text-gray-500 mb-4">
            La action valida que la fecha sea futura y que haya inspector asignado.
            El estado refleja el resultado sin useState adicional.
          </p>

          {scheduleState.submitted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <p className="font-medium">✅ Inspección programada</p>
              <p className="mt-1">Fecha: <strong>{scheduleState.date}</strong></p>
              <p>Inspector: <strong>{scheduleState.inspector}</strong></p>
              <button
                onClick={() => scheduleDispatch(new FormData())}
                className="mt-3 px-3 py-1.5 text-xs border border-green-400 rounded-lg hover:bg-green-100"
              >
                Programar otra
              </button>
            </div>
          ) : (
            <form action={scheduleDispatch} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inspección</label>
                <input
                  name="date"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspector asignado</label>
                <select
                  name="inspector"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Seleccionar…</option>
                  <option>Carlos Méndez</option>
                  <option>Ana García</option>
                  <option>Roberto Silva</option>
                </select>
              </div>

              {scheduleState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  ❌ {scheduleState.error}
                </div>
              )}

              <button
                type="submit"
                disabled={schedulePending}
                className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              >
                {schedulePending ? 'Guardando…' : 'Programar inspección'}
              </button>
            </form>
          )}
        </div>

        {/* Comparación con patrón anterior */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Antes vs Después de useActionState</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-2">❌ Patrón manual (React 18)</h3>
              <ul className="space-y-1 text-red-800 text-xs">
                <li>• <code className="bg-red-100 px-1 rounded">useState</code> para loading, error y resultado</li>
                <li>• <code className="bg-red-100 px-1 rounded">useTransition</code> para marcar como no urgente</li>
                <li>• Handler <code className="bg-red-100 px-1 rounded">onSubmit</code> con try/catch manual</li>
                <li>• Más código para el mismo resultado</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">✅ useActionState (React 19)</h3>
              <ul className="space-y-1 text-green-800 text-xs">
                <li>• Estado, dispatch e isPending en una sola llamada</li>
                <li>• La action recibe el estado previo automáticamente</li>
                <li>• Integración directa con <code className="bg-green-100 px-1 rounded">{'<form action>'}</code></li>
                <li>• Menos boilerplate, más legible</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
