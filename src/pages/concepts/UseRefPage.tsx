import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

export function UseRefPage() {
  // ─── Ejemplo 1: Focus en input ──────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusCount, setFocusCount] = useState(0);

  const handleFocus = () => {
    inputRef.current?.focus();
    setFocusCount((prev) => prev + 1);
  };

  // ─── Ejemplo 2: Scroll a un elemento ───────────────────────────────────────
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ─── Ejemplo 3: Valor persistente sin re-render ─────────────────────────────
  const renderCount = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const [timerValue, setTimerValue] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  renderCount.current += 1;

  const startTimer = () => {
    if (intervalRef.current) return;
    setTimerRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTimerValue((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerValue(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_EFFECT} className="text-blue-600 hover:underline">← useEffect</Link>
            <Link to={appRoutes.CONCEPTS_USE_MEMO_CALLBACK} className="text-blue-600 hover:underline">useMemo / useCallback →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">useRef</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">useRef</code> crea una referencia mutable que persiste
            entre renders. Se usa para acceder al DOM directamente y para almacenar valores que no deben causar re-renders.
          </p>
        </div>

        {/* Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-amber-100 px-1 rounded">const ref = useRef(initialValue)</code> retorna un objeto <code className="bg-amber-100 px-1 rounded">{`{ current: initialValue }`}</code>.</li>
            <li>Cambiar <code className="bg-amber-100 px-1 rounded">ref.current</code> <strong>no dispara re-render</strong>.</li>
            <li>Para referencias al DOM: <code className="bg-amber-100 px-1 rounded">&lt;input ref={'{inputRef}'} /&gt;</code>.</li>
            <li>Es ideal para guardar IDs de timers, valores previos, o contadores internos.</li>
            <li>A diferencia de <code className="bg-amber-100 px-1 rounded">useState</code>, mutar <code className="bg-amber-100 px-1 rounded">.current</code> es sincrónico.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-amber-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del ejemplo ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// Referencia al DOM
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus(); // Accede al elemento directamente

// Valor persistente (no causa re-render)
const renderCount = useRef(0);
renderCount.current += 1; // Se incrementa sin re-render

// Guardar ID de intervalo
const intervalRef = useRef<number | null>(null);
intervalRef.current = window.setInterval(...);
clearInterval(intervalRef.current);`}</pre>
        </details>

        <div ref={topRef} />

        {/* Ejemplo 1: Focus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 1: Focus programático</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">inputRef.current?.focus()</code> enfoca el input sin necesidad de manipular el DOM manualmente.
          </p>
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Haz click en el botón →"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleFocus}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              Focus input
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Focus ejecutado: {focusCount} veces</p>
        </div>

        {/* Ejemplo 2: Scroll */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 2: Scroll a elementos</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">ref.current?.scrollIntoView()</code> desplaza la vista hasta el elemento referenciado.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              ↑ Scroll arriba
            </button>
            <button
              onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
            >
              ↓ Scroll abajo
            </button>
          </div>
        </div>

        {/* Ejemplo 3: Valor persistente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ejemplo 3: Valor persistente sin re-render</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="bg-gray-100 px-1 rounded">renderCount.current</code> se incrementa cada render, pero cambiarlo <strong>no causa</strong> re-render.
            El ID del intervalo se guarda en un ref para poder limpiarlo después.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
            <p>Este componente se ha renderizado <strong>{renderCount.current}</strong> veces.</p>
            <p className="text-gray-400 text-xs">
              (El ref guarda este valor sin causar renders adicionales)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={timerRunning ? stopTimer : startTimer}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timerRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {timerRunning ? '⏸ Pausar' : '▶ Iniciar'} Timer
            </button>
            <button
              onClick={resetTimer}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Reset
            </button>
            <span className="text-2xl font-bold font-mono text-gray-800">{timerValue}s</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            El ID del intervalo se guarda en <code className="bg-gray-100 px-1 rounded">intervalRef.current</code> para poder hacer <code className="bg-gray-100 px-1 rounded">clearInterval</code>.
          </p>
        </div>

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
