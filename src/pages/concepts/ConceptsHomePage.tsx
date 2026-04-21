import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

interface ConceptCard {
  title: string;
  description: string;
  route: string;
  color: string;
  icon: string;
  category: string;
}

const concepts: ConceptCard[] = [
  // Hooks
  {
    title: 'useState',
    description: 'Estado local en componentes funcionales. Cada cambio dispara un re-render.',
    route: appRoutes.CONCEPTS_USE_STATE,
    color: 'blue',
    icon: '🔄',
    category: 'Hooks',
  },
  {
    title: 'useEffect',
    description: 'Efectos secundarios: suscripciones, event listeners y limpieza.',
    route: appRoutes.CONCEPTS_USE_EFFECT,
    color: 'green',
    icon: '⚡',
    category: 'Hooks',
  },
  {
    title: 'useRef',
    description: 'Referencias al DOM y valores persistentes sin causar re-renders.',
    route: appRoutes.CONCEPTS_USE_REF,
    color: 'amber',
    icon: '📌',
    category: 'Hooks',
  },
  {
    title: 'useMemo / useCallback / memo',
    description: 'Optimización de rendimiento: memoización de valores, funciones y componentes.',
    route: appRoutes.CONCEPTS_USE_MEMO_CALLBACK,
    color: 'cyan',
    icon: '🧠',
    category: 'Hooks',
  },
  {
    title: 'Stable vs Unstable References',
    description: 'Cómo las referencias de objetos y funciones impactan memo, effects y renders.',
    route: appRoutes.CONCEPTS_STABLE_REFERENCES,
    color: 'sky',
    icon: '🧷',
    category: 'Hooks',
  },
  {
    title: 'useReducer',
    description: 'Manejo de estado complejo con acciones y un reducer, similar a Redux.',
    route: appRoutes.CONCEPTS_USE_REDUCER,
    color: 'indigo',
    icon: '⚙️',
    category: 'Hooks',
  },
  {
    title: 'useTransition',
    description: 'Marca actualizaciones como no urgentes para mantener la UI fluida.',
    route: appRoutes.CONCEPTS_USE_TRANSITION,
    color: 'teal',
    icon: '⏳',
    category: 'Hooks',
  },
  {
    title: 'useDeferredValue',
    description: 'Difiere la versión de un valor para que renders costosos no bloqueen la UI.',
    route: appRoutes.CONCEPTS_USE_DEFERRED_VALUE,
    color: 'violet',
    icon: '🔮',
    category: 'Hooks',
  },
  // Patrones
  {
    title: 'Context API',
    description: 'Compartir estado entre componentes sin prop drilling.',
    route: appRoutes.CONCEPTS_CONTEXT_API,
    color: 'purple',
    icon: '🌐',
    category: 'Patrones',
  },
  {
    title: 'Custom Hooks',
    description: 'Extraer y reutilizar lógica de estado en hooks personalizados.',
    route: appRoutes.CONCEPTS_CUSTOM_HOOKS,
    color: 'pink',
    icon: '🪝',
    category: 'Patrones',
  },
  // Design Patterns
  {
    title: 'Hooks Pattern',
    description: 'Reemplazar clases y HOCs con custom hooks reutilizables.',
    route: appRoutes.PATTERNS_HOOKS,
    color: 'teal',
    icon: '🎣',
    category: 'Design Patterns',
  },
  {
    title: 'Compound Pattern',
    description: 'Componentes que trabajan juntos compartiendo estado implícito.',
    route: appRoutes.PATTERNS_COMPOUND,
    color: 'orange',
    icon: '🧩',
    category: 'Design Patterns',
  },
  {
    title: 'Container / Presentational',
    description: 'Separar lógica de datos de la presentación visual.',
    route: appRoutes.PATTERNS_CONTAINER_PRESENTATIONAL,
    color: 'lime',
    icon: '📦',
    category: 'Design Patterns',
  },
  {
    title: 'Render Props',
    description: 'Compartir lógica pasando una función como prop que retorna JSX.',
    route: appRoutes.PATTERNS_RENDER_PROPS,
    color: 'sky',
    icon: '🔄',
    category: 'Design Patterns',
  },
  {
    title: 'AI UI Patterns',
    description: 'Chat, streaming, debouncing y componentes para interfaces de IA.',
    route: appRoutes.PATTERNS_AI_UI,
    color: 'fuchsia',
    icon: '🤖',
    category: 'Design Patterns',
  },
  // Estado global
  {
    title: 'Redux Toolkit',
    description: 'Estado global con slices, acciones y selectores tipados.',
    route: appRoutes.CONCEPTS_REDUX,
    color: 'violet',
    icon: '🏪',
    category: 'Estado Global',
  },
  // Estilos
  {
    title: 'styled-components',
    description: 'CSS-in-JS con template literals y props dinámicas.',
    route: appRoutes.CONCEPTS_STYLED_COMPONENTS,
    color: 'rose',
    icon: '💅',
    category: 'Estilos',
  },
  // Formularios
  {
    title: 'Formulario Controlado',
    description: 'Cada input enlazado a useState con onChange.',
    route: appRoutes.FORMS_CONTROLLED,
    color: 'blue',
    icon: '📋',
    category: 'Formularios',
  },
  {
    title: 'Formulario No Controlado',
    description: 'Inputs manejados por el DOM, leídos con useRef al hacer submit.',
    route: appRoutes.FORMS_UNCONTROLLED,
    color: 'amber',
    icon: '📋',
    category: 'Formularios',
  },
  {
    title: 'React Hook Form + Zod',
    description: 'Librería de formularios con validación por schema y re-renders mínimos.',
    route: appRoutes.FORMS_HOOK_FORM,
    color: 'violet',
    icon: '📋',
    category: 'Formularios',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', hover: 'hover:border-blue-400' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', hover: 'hover:border-green-400' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', hover: 'hover:border-amber-400' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', hover: 'hover:border-cyan-400' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', hover: 'hover:border-indigo-400' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', hover: 'hover:border-purple-400' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', hover: 'hover:border-pink-400' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', hover: 'hover:border-violet-400' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', hover: 'hover:border-rose-400' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', hover: 'hover:border-teal-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', hover: 'hover:border-orange-400' },
  lime: { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-800', hover: 'hover:border-lime-400' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', hover: 'hover:border-sky-400' },
  fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-800', hover: 'hover:border-fuchsia-400' },
};

const categories = [...new Set(concepts.map((c) => c.category))];

export function ConceptsHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">⚛️ React Concepts Playground</h1>
          <p className="text-gray-500 mt-2">
            Explora cada concepto de React con ejemplos interactivos y explicaciones detalladas.
          </p>
          <Link
            to={appRoutes.DASHBOARD}
            className="inline-block mt-3 px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            🚗 Ver Dashboard completo (todos los conceptos combinados)
          </Link>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts
                .filter((c) => c.category === category)
                .map((concept) => {
                  const colors = colorClasses[concept.color];
                  return (
                    <Link
                      key={concept.route}
                      to={concept.route}
                      className={`block rounded-xl border p-4 transition-all ${colors.bg} ${colors.border} ${colors.hover}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{concept.icon}</span>
                        <div>
                          <h3 className={`font-semibold ${colors.text}`}>{concept.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{concept.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
