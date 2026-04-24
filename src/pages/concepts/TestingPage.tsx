import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

// ─── Snippets de código para mostrar en la página ─────────────────────────────

const snippetTestSuites = `// Anatomía de un test suite en Vitest
import { describe, it, expect } from 'vitest';

describe('Nombre del módulo o feature', () => {
  // "it" o "test" son equivalentes
  it('describe el comportamiento esperado', () => {
    const result = 2 + 2;

    // expect(valor).matcher()
    expect(result).toBe(4);
    expect(result).toBeGreaterThan(3);
    expect(result).not.toBe(5);
  });

  describe('sub-suite anidada', () => {
    it('permite organizar tests relacionados', () => {
      expect('hola').toContain('ola');
      expect([1, 2, 3]).toHaveLength(3);
      expect({ nombre: 'Juan' }).toHaveProperty('nombre', 'Juan');
    });
  });
});`;

const snippetMatchers = `// Matchers más comunes de Vitest + @testing-library/jest-dom

// Valores
expect(value).toBe(exact)           // ===  (primitivos)
expect(value).toEqual(obj)          // comparación profunda (objetos/arrays)
expect(value).toBeTruthy()          // cualquier valor truthy
expect(value).toBeFalsy()           // cualquier valor falsy
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeGreaterThan(n)

// Strings / Arrays
expect(str).toContain('texto')
expect(arr).toHaveLength(3)
expect(arr).toContain(item)

// DOM (jest-dom)
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('texto')
expect(element).toHaveAttribute('href', '/ruta')
expect(element).toBeDisabled()
expect(element).toBeVisible()
expect(element).toHaveClass('mi-clase')

// Funciones mock
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledTimes(2)
expect(fn).toHaveBeenCalledWith(arg1, arg2)`;

const snippetUserInteraction = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p data-testid="count">Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Incrementar</button>
      <button onClick={() => setCount(0)}>Resetear</button>
    </div>
  );
}

describe('Counter — estado local', () => {
  it('inicia en 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
  });

  it('incrementa al hacer click', async () => {
    // userEvent.setup() simula eventos reales del navegador
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: 'Incrementar' }));

    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });

  it('resetea a 0', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: 'Incrementar' }));
    await user.click(screen.getByRole('button', { name: 'Incrementar' }));
    await user.click(screen.getByRole('button', { name: 'Resetear' }));
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
  });
});`;

const snippetConnected = `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { logOut } from '@/redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';

// Helper: crea un store con estado precargado
function makeStore(preloadedState) {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState,
  });
}

// Helper: render + Provider
function renderWithStore(ui, preloadedState) {
  const store = makeStore(preloadedState);
  return render(<Provider store={store}>{ui}</Provider>);
}

// Componente conectado a Redux
function UserBadge() {
  const dispatch = useDispatch();
  const { isLoggedIn, userProfile } = useSelector(s => s.user);

  if (!isLoggedIn) return <p data-testid="status">Sin sesión</p>;
  return (
    <div>
      <p data-testid="status">
        {userProfile ? \`Hola, \${userProfile.nombre}\` : 'Sesión activa'}
      </p>
      <button onClick={() => dispatch(logOut())}>Cerrar sesión</button>
    </div>
  );
}

describe('UserBadge — connected component', () => {
  it('refleja el estado del store (isLoggedIn: true)', () => {
    renderWithStore(<UserBadge />, {
      user: { isLoggedIn: true, userProfile: null, rolePermissions: null }
    });
    expect(screen.getByTestId('status')).toHaveTextContent('Sesión activa');
  });

  it('muestra el nombre cuando hay perfil', () => {
    renderWithStore(<UserBadge />, {
      user: {
        isLoggedIn: true,
        userProfile: { nombre: 'Juan', apellido: 'Pérez', ... },
        rolePermissions: null,
      }
    });
    expect(screen.getByTestId('status')).toHaveTextContent('Hola, Juan');
  });

  it('despacha logOut y actualiza la UI', async () => {
    const user = userEvent.setup();
    renderWithStore(<UserBadge />, {
      user: { isLoggedIn: true, userProfile: null, rolePermissions: null }
    });
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByTestId('status')).toHaveTextContent('Sin sesión');
  });
});`;

const snippetAsync = `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Componente que carga datos de forma asíncrona
function InspectionList({ fetchFn }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const data = await fetchFn();
      setInspections(data);
    } catch {
      setError('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLoad}>Cargar</button>
      {loading && <p data-testid="loading">Cargando...</p>}
      {error  && <p data-testid="error">{error}</p>}
      <ul>{inspections.map(i => <li key={i.id}>{i.placa}</li>)}</ul>
    </div>
  );
}

describe('Async Code', () => {
  it('muestra loading con promesa pendiente', async () => {
    // Promesa que nunca resuelve → el componente queda en loading
    const neverResolves = vi.fn(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<InspectionList fetchFn={neverResolves} />);
    await user.click(screen.getByRole('button', { name: 'Cargar' }));
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('muestra los items tras fetch exitosa', async () => {
    const mockFetch = vi.fn().mockResolvedValue([{ id: '1', placa: 'ABC-123' }]);
    const user = userEvent.setup();
    render(<InspectionList fetchFn={mockFetch} />);
    await user.click(screen.getByRole('button', { name: 'Cargar' }));

    // waitFor re-intenta la aserción hasta que sea verdadera
    await waitFor(() =>
      expect(screen.getByText('ABC-123')).toBeInTheDocument()
    );
  });

  it('muestra error cuando la promesa rechaza', async () => {
    const failFetch = vi.fn().mockRejectedValue(new Error('fail'));
    const user = userEvent.setup();
    render(<InspectionList fetchFn={failFetch} />);
    await user.click(screen.getByRole('button', { name: 'Cargar' }));

    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('Error al cargar')
    );
  });
});`;

const snippetMocks = `import { vi, describe, it, expect, beforeEach } from 'vitest';

// ── vi.fn() — función mock básica ─────────────────────────────────────────────
describe('vi.fn()', () => {
  it('registra llamadas y argumentos', () => {
    const onClick = vi.fn();
    onClick('a');
    onClick('b', 'c');

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledWith('a');
    expect(onClick).toHaveBeenLastCalledWith('b', 'c');
  });

  it('mockReturnValue — valor de retorno fijo', () => {
    const getStatus = vi.fn().mockReturnValue('aprobada');
    expect(getStatus()).toBe('aprobada');
  });

  it('mockReturnValueOnce — secuencias controladas', () => {
    const fn = vi.fn()
      .mockReturnValueOnce('pendiente')
      .mockReturnValueOnce('en_progreso')
      .mockReturnValue('aprobada'); // fallback

    expect(fn()).toBe('pendiente');
    expect(fn()).toBe('en_progreso');
    expect(fn()).toBe('aprobada');  // fallback
  });
});

// ── vi.fn() async ─────────────────────────────────────────────────────────────
describe('Mocks async', () => {
  it('mockResolvedValue — promesa exitosa', async () => {
    const fetch = vi.fn().mockResolvedValue([{ id: '1', placa: 'ABC' }]);
    const data = await fetch();
    expect(data).toHaveLength(1);
  });

  it('mockRejectedValue — promesa fallida', async () => {
    const fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    await expect(fetch()).rejects.toThrow('Network error');
  });
});

// ── vi.spyOn() — espia un método real ─────────────────────────────────────────
const service = {
  getAll() { return [1, 2, 3]; }
};

describe('vi.spyOn()', () => {
  afterEach(() => vi.restoreAllMocks());

  it('espía sin alterar la implementación', () => {
    const spy = vi.spyOn(service, 'getAll');
    const result = service.getAll();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(3); // original sigue corriendo
  });

  it('puede reemplazar temporalmente', () => {
    vi.spyOn(service, 'getAll').mockReturnValue([42]);
    expect(service.getAll()).toEqual([42]);
  });
});

// ── Ciclo de vida de los mocks ────────────────────────────────────────────────
// clearAllMocks  → limpia llamadas, mantiene implementación
// resetAllMocks  → limpia llamadas + resetea implementación
// restoreAllMocks→ restaura spies a la función original`;

// ─── Sección de código reutilizable ──────────────────────────────────────────
function CodeBlock({ code, color = 'blue' }: { code: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-300',
    green: 'text-green-300',
    purple: 'text-purple-300',
    amber: 'text-amber-300',
    pink: 'text-pink-300',
  };
  return (
    <details className="mb-6 bg-gray-800 rounded-lg text-xs font-mono">
      <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white select-none">
        Ver código ▾
      </summary>
      <pre className={`px-4 pb-4 overflow-x-auto ${colors[color] ?? colors.blue}`}>{code}</pre>
    </details>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function TestingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_AI_UI} className="text-blue-600 hover:underline">← AI UI Patterns</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">🧪 Testing con Vitest</h1>
          <p className="text-gray-500 text-sm mt-1">
            Vitest es el framework de testing nativo para proyectos Vite. Comparte configuración,
            soporte de TypeScript, path aliases y transformaciones sin configuración extra.
            Combinado con <code className="bg-gray-100 px-1 rounded">@testing-library/react</code>{' '}
            permite escribir tests centrados en el comportamiento del usuario.
          </p>
        </div>

        {/* ── Callout principal ───────────────────────────────────────────────── */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-8 text-sm text-violet-800">
          <strong>¿Por qué Testing Library?</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Los queries priorizan lo que el usuario ve: <code className="bg-violet-100 px-1 rounded">getByRole</code>, <code className="bg-violet-100 px-1 rounded">getByText</code>, <code className="bg-violet-100 px-1 rounded">getByLabelText</code>.</li>
            <li><code className="bg-violet-100 px-1 rounded">userEvent</code> simula eventos reales del navegador (focus, blur, typing).</li>
            <li><code className="bg-violet-100 px-1 rounded">waitFor</code> maneja código asíncrono sin <code className="bg-violet-100 px-1 rounded">sleep</code> ni timeouts arbitrarios.</li>
            <li>Evita testear detalles de implementación → tests más robustos ante refactors.</li>
          </ul>
          <div className="mt-3 bg-violet-100 rounded p-2 font-mono text-xs">
            <span className="text-gray-500"># Ejecutar tests</span><br />
            npm run test<br />
            npm run test:watch<span className="text-gray-500 ml-4"># modo watch interactivo</span><br />
            npm run test:ui<span className="text-gray-500 ml-4"># UI visual en el browser</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECCIÓN 1 — TEST SUITES
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            📦 Test Suites: <code className="text-sm font-mono bg-gray-100 px-1 rounded">describe / it / expect</code>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Un <strong>test suite</strong> es un grupo de tests relacionados, definido con{' '}
            <code className="bg-gray-100 px-1 rounded">describe()</code>. Dentro van los casos
            de prueba individuales (<code className="bg-gray-100 px-1 rounded">it()</code> /{' '}
            <code className="bg-gray-100 px-1 rounded">test()</code>). Los suites se pueden
            anidar para crear jerarquías que reflejen la estructura del feature.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { fn: 'describe(name, fn)', desc: 'Agrupa tests relacionados. Se pueden anidar.', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { fn: 'it(name, fn)', desc: 'Un caso de prueba individual. Alias: test().', color: 'bg-green-50 border-green-200 text-green-700' },
              { fn: 'expect(val)', desc: 'Inicia una aserción. Encadena un matcher.', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            ].map(({ fn, desc, color }) => (
              <div key={fn} className={`rounded-lg border p-3 text-xs ${color}`}>
                <code className="font-bold">{fn}</code>
                <p className="mt-1 opacity-80">{desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={snippetTestSuites} color="purple" />

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
            <p className="text-xs font-semibold text-gray-600 mb-2">Matchers más comunes</p>
            <CodeBlock code={snippetMatchers} color="green" />
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { hook: 'beforeAll', desc: 'Una vez antes de todos los tests del suite' },
              { hook: 'afterAll', desc: 'Una vez después de todos los tests' },
              { hook: 'beforeEach', desc: 'Antes de cada test individual' },
              { hook: 'afterEach', desc: 'Después de cada test individual' },
            ].map(({ hook, desc }) => (
              <div key={hook} className="bg-amber-50 border border-amber-200 rounded p-2">
                <code className="text-amber-700 font-bold">{hook}</code>
                <p className="text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECCIÓN 2 — USER INTERACTION & STATE
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            🖱️ User Interaction & State
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Verifica que el estado local (<code className="bg-gray-100 px-1 rounded">useState</code>)
            se actualiza correctamente cuando el usuario interactúa con la UI.
            Se usa <code className="bg-gray-100 px-1 rounded">userEvent.setup()</code> para
            simular eventos reales (click, typing, keyboard) en lugar de{' '}
            <code className="bg-gray-100 px-1 rounded">fireEvent</code> (que es de nivel más bajo).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: 'render()', desc: 'Monta el componente en el DOM virtual' },
              { label: 'screen.getByRole()', desc: 'Query accesible por ARIA role' },
              { label: 'screen.getByTestId()', desc: 'Query por data-testid' },
              { label: 'user.click()', desc: 'Simula un click completo' },
              { label: 'user.type()', desc: 'Simula escritura tecla a tecla' },
              { label: 'user.clear()', desc: 'Limpia el valor de un input' },
            ].map(({ label, desc }) => (
              <span
                key={label}
                title={desc}
                className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded cursor-help"
              >
                <code>{label}</code>
              </span>
            ))}
          </div>

          <CodeBlock code={snippetUserInteraction} color="blue" />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <strong>Archivo:</strong>{' '}
            <code>src/test/user-interaction-state.test.tsx</code>
            <p className="mt-1">
              Contiene 3 componentes de prueba: <code>Counter</code>, <code>FilterList</code> y{' '}
              <code>VisibilityToggle</code>, cubriendo los patrones más comunes de estado local.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECCIÓN 3 — CONNECTED COMPONENTS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            🏪 Connected Components (Redux)
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Los componentes conectados al store de Redux necesitan un{' '}
            <code className="bg-gray-100 px-1 rounded">&lt;Provider&gt;</code> en el árbol durante
            el test. El patrón <strong>renderWithStore</strong> encapsula la creación del store de
            prueba con <code className="bg-gray-100 px-1 rounded">preloadedState</code>, permitiendo
            probar distintos escenarios sin acoplarse al estado inicial por defecto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { title: 'makeStore(preloadedState)', desc: 'Crea un store fresco con estado precargado para cada test.', color: 'bg-green-50 border-green-200 text-green-700' },
              { title: 'renderWithStore(ui, state)', desc: 'Wrapper que combina render() + Provider automáticamente.', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { title: 'preloadedState', desc: 'Configura el estado inicial del store sin ejecutar reducers.', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              { title: 'dispatch en tests', desc: 'El usuario interactúa → dispatch → estado cambia → UI se actualiza.', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
            ].map(({ title, desc, color }) => (
              <div key={title} className={`rounded-lg border p-3 text-xs ${color}`}>
                <code className="font-bold">{title}</code>
                <p className="mt-1 opacity-80">{desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={snippetConnected} color="green" />

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
            <strong>Archivo:</strong>{' '}
            <code>src/test/connected-components.test.tsx</code>
            <p className="mt-1">
              Usa los reducers reales del proyecto (<code>userReducer</code>,{' '}
              <code>inspectionReducer</code>) y el patrón <code>renderWithStore</code>
              para testear <code>UserBadge</code> y <code>UserRoleBadge</code>.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECCIÓN 4 — ASYNC CODE
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            ⏳ Asynchronous Code
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Los tests asíncronos verifican las tres fases de una operación async:{' '}
            <strong>loading</strong>, <strong>success</strong> y <strong>error</strong>.
            El truco está en controlar cuándo y cómo resuelven las promesas usando mocks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { title: 'waitFor(fn)', desc: 'Re-intenta la aserción hasta que sea verdadera o haga timeout. Ideal para esperar re-renders.', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { title: 'findBy*()', desc: 'Variante async de getBy*. Equivale a waitFor + getBy. Retorna una promesa.', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { title: 'Promise que no resuelve', desc: 'new Promise(() => {}) nunca resuelve, lo que fija el componente en estado loading.', color: 'bg-red-50 border-red-200 text-red-700' },
            ].map(({ title, desc, color }) => (
              <div key={title} className={`rounded-lg border p-3 text-xs ${color}`}>
                <code className="font-bold">{title}</code>
                <p className="mt-1 opacity-80">{desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={snippetAsync} color="amber" />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <strong>Archivo:</strong>{' '}
            <code>src/test/async-code.test.tsx</code>
            <p className="mt-1">
              Usa inyección de dependencia (<code>fetchFn</code> prop) para controlar
              las promesas desde los tests, sin necesidad de mockear módulos completos.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECCIÓN 5 — WORKING WITH MOCKS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            🎭 Working with Mocks
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Los mocks reemplazan dependencias externas con versiones controladas, aislando
            la unidad bajo prueba. Vitest proporciona <code className="bg-gray-100 px-1 rounded">vi.fn()</code>,{' '}
            <code className="bg-gray-100 px-1 rounded">vi.spyOn()</code> y{' '}
            <code className="bg-gray-100 px-1 rounded">vi.mock()</code> para diferentes
            escenarios de aislamiento.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { api: 'vi.fn()', desc: 'Función mock vacía. Registra llamadas, argumentos y retornos.', color: 'bg-pink-50 border-pink-200 text-pink-700' },
              { api: 'mockReturnValue(v)', desc: 'Fija el valor retornado en todas las llamadas.', color: 'bg-rose-50 border-rose-200 text-rose-700' },
              { api: 'mockResolvedValue(v)', desc: 'La función retorna Promise.resolve(v). Para async.', color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700' },
              { api: 'mockRejectedValue(e)', desc: 'La función retorna Promise.reject(e). Simula errores.', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { api: 'mockReturnValueOnce(v)', desc: 'Retorna v solo en la próxima llamada. Se puede encadenar.', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
              { api: 'vi.spyOn(obj, method)', desc: 'Espía un método real. Puede reemplazarlo o solo observarlo.', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { api: 'vi.clearAllMocks()', desc: 'Limpia historial de llamadas. Mantiene la implementación.', color: 'bg-sky-50 border-sky-200 text-sky-700' },
              { api: 'vi.restoreAllMocks()', desc: 'Restaura spies a la implementación original del método.', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
            ].map(({ api, desc, color }) => (
              <div key={api} className={`rounded-lg border p-3 text-xs ${color}`}>
                <code className="font-bold">{api}</code>
                <p className="mt-1 opacity-80">{desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={snippetMocks} color="pink" />

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-800">
            <strong>Archivo:</strong>{' '}
            <code>src/test/mocks.test.tsx</code>
            <p className="mt-1">
              Cubre 5 grupos: <code>vi.fn()</code> básico, mocks async, <code>vi.spyOn()</code>,
              mocks en componentes React y ciclo de vida de mocks (clear / reset / restore).
            </p>
          </div>
        </section>

        {/* ── Resumen de archivos ─────────────────────────────────────────────── */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6 text-sm text-gray-100">
          <h2 className="text-base font-semibold mb-3 text-white">📁 Archivos creados</h2>
          <ul className="space-y-2 font-mono text-xs">
            {[
              { file: 'vite.config.ts', note: '→ Configuración de Vitest (globals, jsdom, setupFiles)' },
              { file: 'src/test/setup.ts', note: '→ Importa @testing-library/jest-dom' },
              { file: 'src/test/user-interaction-state.test.tsx', note: '→ Counter, FilterList, VisibilityToggle' },
              { file: 'src/test/connected-components.test.tsx', note: '→ UserBadge con Redux + renderWithStore' },
              { file: 'src/test/async-code.test.tsx', note: '→ Loading / Success / Error + findBy*' },
              { file: 'src/test/mocks.test.tsx', note: '→ vi.fn(), spyOn, mocks async, ciclo de vida' },
            ].map(({ file, note }) => (
              <li key={file} className="flex flex-wrap gap-2">
                <span className="text-green-400">{file}</span>
                <span className="text-gray-400">{note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 bg-gray-700 rounded p-3 text-xs">
            <span className="text-gray-400"># Scripts disponibles en package.json</span><br />
            <span className="text-green-400">npm run test</span>
            <span className="text-gray-400 ml-4">       # ejecuta todos los tests una vez</span><br />
            <span className="text-green-400">npm run test:watch</span>
            <span className="text-gray-400 ml-4">  # modo watch interactivo</span><br />
            <span className="text-green-400">npm run test:ui</span>
            <span className="text-gray-400 ml-4">     # UI visual en http://localhost:51204</span>
          </div>
        </section>

      </div>
    </div>
  );
}
