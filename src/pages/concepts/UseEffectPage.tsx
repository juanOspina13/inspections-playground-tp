import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

export function UseEffectPage() {
  // ─── Ejemplo 0: Ciclo de vida (mount, update, unmount) ────────────────────
  const [showLifecycleDemo, setShowLifecycleDemo] = useState(true);
  const [lifecycleCount, setLifecycleCount] = useState(0);
  const [lifecycleLogs, setLifecycleLogs] = useState<string[]>([]);

  const addLifecycleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLifecycleLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 8));
  };

  // ─── Ejemplo 1: Efecto con cleanup (event listener) ─────────────────────────
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [keyCount, setKeyCount] = useState(0);
  const [listenKeys, setListenKeys] = useState(true);

  useEffect(() => {
    if (!listenKeys) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setLastKey(event.key);
      setKeyCount((prev) => prev + 1);
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup: se ejecuta al desmontar o cuando cambian las dependencias
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [listenKeys]);

  // ─── Ejemplo 2: Efecto con dependencia (timer) ──────────────────────────────
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [running]);

  // ─── Ejemplo 3: Efecto de "fetch" simulado ──────────────────────────────────
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fakeUsers: Record<number, { name: string; role: string }> = {
      1: { name: 'Carlos Méndez', role: 'Inspector Senior' },
      2: { name: 'Ana García', role: 'Inspectora' },
      3: { name: 'Roberto Silva', role: 'Inspector Junior' },
    };

    // Simulamos un fetch con setTimeout
    const timeoutId = setTimeout(() => {
      setUserData(fakeUsers[userId] ?? null);
      setLoading(false);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId]);

  function LifecycleChild({
    count,
    onLog,
  }: {
    count: number;
    onLog: (message: string) => void;
  }) {
    useEffect(() => {
      onLog('Mounting: componente montado');

      return () => {
        onLog('Unmount: cleanup al desmontar el componente');
      };
    }, [onLog]);

    useEffect(() => {
      onLog(`Update: count cambió a ${count}`);
    }, [count, onLog]);

    return (
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-sm text-sky-800">
        Componente hijo activo. Valor actual: <strong>{count}</strong>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_STATE} className="text-blue-600 hover:underline">← useState</Link>
            <Link to={appRoutes.CONCEPTS_USE_REF} className="text-blue-600 hover:underline">useRef →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useEffect</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useEffect</code> permite ejecutar efectos secundarios
            después del render: suscripciones, timers, event listeners, llamadas a APIs, y manipulación del DOM.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-green-100 px-1 rounded">useEffect(callback, [deps])</code> ejecuta el callback después de cada render donde cambien las dependencias.</li>
            <li>Sin array de dependencias → se ejecuta en <strong>cada render</strong>.</li>
            <li>Array vacío <code className="bg-green-100 px-1 rounded">[]</code> → solo en el <strong>primer render</strong> (mount).</li>
            <li>El <strong>return</strong> del callback es la función de <strong>cleanup</strong> (limpieza).</li>
            <li>El cleanup se ejecuta <strong>antes</strong> de la siguiente ejecución del efecto y al <strong>desmontar</strong>.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-green-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`useEffect(() => {
  // Efecto: se ejecuta después del render
  const handleKeyDown = (e: KeyboardEvent) => {
    setLastKey(e.key);
  };
  window.addEventListener('keydown', handleKeyDown);

  // Cleanup: se ejecuta al desmontar o
  // antes de re-ejecutar el efecto
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [listenKeys]); // Dependencias: re-ejecuta si cambian`}</pre>
        </details>

        {/* Ejemplo 0: Ciclo de vida */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 0: Ciclo de vida (mounting, update, unmount)</h2>
          <p className="text-sm text-gray-500 mb-4">
            En componentes funcionales, el ciclo de vida se modela con <code className="bg-gray-100 px-1 rounded">useEffect</code>.
            Aquí puedes montar/desmontar un hijo y cambiar props para ver cada fase en tiempo real.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 mb-4">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Mounting:</strong> <code className="bg-green-100 px-1 rounded">useEffect(() =&gt; {'{...}'}, [])</code></li>
              <li><strong>Update:</strong> <code className="bg-green-100 px-1 rounded">useEffect(() =&gt; {'{...}'}, [deps])</code> cuando cambian dependencias</li>
              <li><strong>Unmount:</strong> función de cleanup del efecto al desmontar</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowLifecycleDemo((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                showLifecycleDemo
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {showLifecycleDemo ? 'Unmount hijo' : 'Mount hijo'}
            </button>
            <button
              onClick={() => setLifecycleCount((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Update count (+1)
            </button>
            <button
              onClick={() => {
                setLifecycleCount(0);
                setLifecycleLogs([]);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Limpiar demo
            </button>
          </div>

          <div className="space-y-3">
            {showLifecycleDemo ? (
              <LifecycleChild count={lifecycleCount} onLog={addLifecycleLog} />
            ) : (
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-500">
                Componente hijo desmontado.
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Log del ciclo de vida:</p>
              {lifecycleLogs.length === 0 ? (
                <p className="text-sm text-gray-400">Sin eventos aún.</p>
              ) : (
                <ul className="text-sm text-gray-600 space-y-1 font-mono">
                  {lifecycleLogs.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Ejemplo 1: Event Listener */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 1: Event Listener + Cleanup</h2>
          <p className="text-sm text-gray-500 mb-4">
            Se suscribe a <code className="bg-gray-100 px-1 rounded">keydown</code> del window.
            La función de cleanup remueve el listener para evitar memory leaks.
          </p>
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setListenKeys((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                listenKeys ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Listener: {listenKeys ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => { setLastKey(null); setKeyCount(0); }}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Reset
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p>Última tecla: <strong>{lastKey ?? '(ninguna)'}</strong></p>
            <p>Teclas presionadas: <strong>{keyCount}</strong></p>
            <p className="text-gray-400 text-xs mt-1">
              {listenKeys ? 'Presiona cualquier tecla...' : 'Listener desactivado (cleanup ejecutado)'}
            </p>
          </div>
        </div>

        {/* Ejemplo 2: Timer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 2: Timer con setInterval</h2>
          <p className="text-sm text-gray-500 mb-4">
            El <code className="bg-gray-100 px-1 rounded">setInterval</code> se limpia en el cleanup para evitar múltiples intervalos activos.
          </p>
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setRunning((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                running ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {running ? '⏸ Pausar' : '▶ Iniciar'}
            </button>
            <button
              onClick={() => { setRunning(false); setSeconds(0); }}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Reset
            </button>
          </div>
          <div className="text-4xl font-bold text-gray-800 font-mono text-center py-4">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Ejemplo 3: Fetch simulado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 3: Fetch simulado con dependencia</h2>
          <p className="text-sm text-gray-500 mb-4">
            Cuando cambia <code className="bg-gray-100 px-1 rounded">userId</code>, el efecto se re-ejecuta.
            El cleanup cancela el timeout anterior si el usuario cambia rápido.
          </p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((id) => (
              <button
                key={id}
                onClick={() => setUserId(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userId === id
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Inspector {id}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            {loading ? (
              <p className="text-gray-400 animate-pulse">Cargando datos...</p>
            ) : userData ? (
              <div>
                <p className="font-medium text-gray-700">{userData.name}</p>
                <p className="text-gray-500">{userData.role}</p>
              </div>
            ) : (
              <p className="text-gray-400">No encontrado</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Dependencia: <code className="bg-gray-100 px-1 rounded">[userId]</code> = {userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
