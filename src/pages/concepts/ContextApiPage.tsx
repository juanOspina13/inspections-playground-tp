import { createContext, useContext, useReducer, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

// ─── 1. Definir el contexto ──────────────────────────────────────────────────
interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'sm' | 'base' | 'lg';
}

type ThemeAction =
  | { type: 'toggle_mode' }
  | { type: 'set_color'; payload: string }
  | { type: 'set_font_size'; payload: 'sm' | 'base' | 'lg' };

interface ThemeContextValue extends ThemeState {
  toggleMode: () => void;
  setColor: (color: string) => void;
  setFontSize: (size: 'sm' | 'base' | 'lg') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── 2. Reducer ──────────────────────────────────────────────────────────────
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'toggle_mode':
      return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' };
    case 'set_color':
      return { ...state, primaryColor: action.payload };
    case 'set_font_size':
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
}

// ─── 3. Provider ─────────────────────────────────────────────────────────────
function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, {
    mode: 'light',
    primaryColor: '#3b82f6',
    fontSize: 'base',
  });

  const toggleMode = () => dispatch({ type: 'toggle_mode' });
  const setColor = (color: string) => dispatch({ type: 'set_color', payload: color });
  const setFontSize = (size: 'sm' | 'base' | 'lg') => dispatch({ type: 'set_font_size', payload: size });

  return (
    <ThemeContext.Provider value={{ ...state, toggleMode, setColor, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── 4. Custom hook para consumir ────────────────────────────────────────────
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}

// ─── Componentes consumidores ────────────────────────────────────────────────
function ThemeControls() {
  const { mode, primaryColor, fontSize, toggleMode, setColor, setFontSize } = useTheme();

  const colors = [
    { value: '#3b82f6', label: 'Azul' },
    { value: '#10b981', label: 'Verde' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#ef4444', label: 'Rojo' },
    { value: '#8b5cf6', label: 'Violeta' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Controles del Tema</h2>
      <p className="text-sm text-gray-500 mb-4">
        Este componente usa <code className="bg-gray-100 px-1 rounded">useTheme()</code> para leer y modificar el contexto.
        Los cambios se propagan a todos los componentes consumidores.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Modo:</label>
          <button
            onClick={toggleMode}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-800 text-white hover:bg-gray-900"
          >
            {mode === 'light' ? '🌞 Light' : '🌙 Dark'} → Cambiar
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Color primario:</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  primaryColor === c.value ? 'scale-125 border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Tamaño de fuente:</label>
          <div className="flex gap-2">
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  fontSize === size
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size === 'sm' ? 'Pequeño' : size === 'base' ? 'Normal' : 'Grande'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemePreview() {
  const { mode, primaryColor, fontSize } = useTheme();

  const fontSizeMap = { sm: '0.875rem', base: '1rem', lg: '1.25rem' };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Vista previa</h2>
      <p className="text-sm text-gray-500 mb-4">
        Este componente <strong>también</strong> consume el mismo contexto con <code className="bg-gray-100 px-1 rounded">useTheme()</code>,
        sin necesidad de pasar props manualmente (sin prop drilling).
      </p>
      <div
        className="rounded-lg p-6 transition-all"
        style={{
          backgroundColor: mode === 'dark' ? '#1f2937' : '#f9fafb',
          color: mode === 'dark' ? '#f3f4f6' : '#1f2937',
          fontSize: fontSizeMap[fontSize],
        }}
      >
        <h3 style={{ color: primaryColor }} className="font-bold mb-2">
          Título con color primario
        </h3>
        <p>
          Este es un texto de ejemplo que cambia según el tema.
          El modo es <strong>{mode}</strong>, el tamaño es <strong>{fontSize}</strong>.
        </p>
        <button
          className="mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          Botón de ejemplo
        </button>
      </div>
    </div>
  );
}

function ContextStateViewer() {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Estado del contexto</h2>
      <p className="text-sm text-gray-500 mb-4">
        Un tercer componente independiente que muestra el estado crudo del contexto.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
        <pre className="text-gray-700 overflow-x-auto">
          {JSON.stringify({ mode: theme.mode, primaryColor: theme.primaryColor, fontSize: theme.fontSize }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ─── Componente intermedio (no recibe props de tema) ─────────────────────────
function IntermediateWrapper() {
  return (
    <div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
        <strong>Nota:</strong> Este componente intermedio <strong>no recibe ni pasa</strong> ninguna prop de tema.
        Los componentes hijos acceden al contexto directamente. Esto elimina el prop drilling.
      </div>
      <ThemePreview />
      <ContextStateViewer />
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
export function ContextApiPage() {
  const [showDemo, setShowDemo] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-blue-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.CONCEPTS_USE_REDUCER} className="text-blue-600 hover:underline">← useReducer</Link>
            <Link to={appRoutes.CONCEPTS_CUSTOM_HOOKS} className="text-blue-600 hover:underline">Custom Hooks →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Context API</h1>
          <p className="text-gray-500 text-sm mt-1">
            <code className="bg-gray-100 px-1 rounded">createContext</code> + <code className="bg-gray-100 px-1 rounded">useContext</code> permiten
            compartir estado entre componentes sin pasar props por cada nivel del árbol (prop drilling).
          </p>
        </div>

        {/* Callout */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-sm text-purple-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><code className="bg-purple-100 px-1 rounded">createContext(defaultValue)</code> crea un contexto.</li>
            <li><code className="bg-purple-100 px-1 rounded">&lt;Context.Provider value={'{...}'}&gt;</code> envuelve el árbol y provee el valor.</li>
            <li><code className="bg-purple-100 px-1 rounded">useContext(Context)</code> consume el valor más cercano del Provider.</li>
            <li>Se combina frecuentemente con <code className="bg-purple-100 px-1 rounded">useReducer</code> para estado complejo.</li>
            <li>Un custom hook (ej: <code className="bg-purple-100 px-1 rounded">useTheme()</code>) encapsula <code className="bg-purple-100 px-1 rounded">useContext</code> + validación.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-purple-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del patrón ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// 1. Crear contexto
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 2. Provider con useReducer
function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  return (
    <ThemeContext.Provider value={{ ...state, toggleMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook para consumir
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be within ThemeProvider');
  return context;
}

// 4. Componentes consumen sin prop drilling
function ThemePreview() {
  const { mode, primaryColor } = useTheme();
  return <div style={{ color: primaryColor }}>...</div>;
}`}</pre>
        </details>

        {/* Árbol visual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Árbol de componentes</h2>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs space-y-1">
            <p className="text-purple-600 font-bold">&lt;ThemeProvider&gt;</p>
            <p className="ml-4 text-gray-600">&lt;ThemeControls /&gt; <span className="text-purple-500">← useTheme()</span></p>
            <p className="ml-4 text-gray-600">&lt;IntermediateWrapper&gt; <span className="text-yellow-600">← NO recibe props de tema</span></p>
            <p className="ml-8 text-gray-600">&lt;ThemePreview /&gt; <span className="text-purple-500">← useTheme()</span></p>
            <p className="ml-8 text-gray-600">&lt;ContextStateViewer /&gt; <span className="text-purple-500">← useTheme()</span></p>
            <p className="ml-4 text-gray-600">&lt;/IntermediateWrapper&gt;</p>
            <p className="text-purple-600 font-bold">&lt;/ThemeProvider&gt;</p>
          </div>
        </div>

        {/* Toggle demo */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowDemo((prev) => !prev)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            {showDemo ? 'Ocultar' : 'Mostrar'} demo interactivo
          </button>
        </div>

        {/* Demo envuelto en el Provider */}
        {showDemo && (
          <ThemeProvider>
            <ThemeControls />
            <IntermediateWrapper />
          </ThemeProvider>
        )}
      </div>
    </div>
  );
}
