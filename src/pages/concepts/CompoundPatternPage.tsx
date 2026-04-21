import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { mockInspections } from '@/data/mockData';
import type { Inspection, InspectionStatus } from '@/types/inspection';

// ═══════════════════════════════════════════════════════════════════════════════
// Compound Component: InspectionCard
// Componentes que trabajan juntos compartiendo estado via Context
// ═══════════════════════════════════════════════════════════════════════════════

interface InspectionCardContextType {
  inspection: Inspection;
  expanded: boolean;
  toggle: () => void;
}

const InspectionCardContext = createContext<InspectionCardContextType | null>(null);

function useInspectionCard() {
  const ctx = useContext(InspectionCardContext);
  if (!ctx) throw new Error('InspectionCard.* debe usarse dentro de <InspectionCard>');
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function InspectionCardRoot({ inspection, children }: { inspection: Inspection; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <InspectionCardContext.Provider value={{ inspection, expanded, toggle: () => setExpanded((p) => !p) }}>
      <div className="bg-white rounded-xl border p-4 shadow-sm">{children}</div>
    </InspectionCardContext.Provider>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const { inspection, toggle, expanded } = useInspectionCard();
  return (
    <div className="flex justify-between items-center cursor-pointer" onClick={toggle}>
      <div>
        <span className="font-semibold text-gray-800">{inspection.id}</span>
        <span className="text-gray-500 ml-2 text-sm">{inspection.placa}</span>
      </div>
      <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
    </div>
  );
}

// ─── Status ───────────────────────────────────────────────────────────────────
function Status() {
  const { inspection } = useInspectionCard();
  const colors: Record<InspectionStatus, string> = {
    aprobada: 'bg-green-100 text-green-700',
    rechazada: 'bg-red-100 text-red-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    en_progreso: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${colors[inspection.estado]}`}>
      {inspection.estado}
    </span>
  );
}

// ─── Details (expandable) ─────────────────────────────────────────────────────
function Details() {
  const { inspection, expanded } = useInspectionCard();
  if (!expanded) return null;
  return (
    <div className="mt-3 border-t pt-3 text-sm text-gray-600 space-y-1">
      <p><strong>Vehículo:</strong> {inspection.marca} {inspection.modelo} ({inspection.anio})</p>
      <p><strong>Kilometraje:</strong> {inspection.kilometraje.toLocaleString()} km</p>
      <p><strong>Inspector:</strong> {inspection.inspector}</p>
      <p><strong>Fecha:</strong> {inspection.fecha}</p>
      {inspection.observacionesGenerales && (
        <p><strong>Observaciones:</strong> {inspection.observacionesGenerales}</p>
      )}
    </div>
  );
}

// ─── Categories (expandable) ──────────────────────────────────────────────────
function Categories() {
  const { inspection, expanded } = useInspectionCard();
  if (!expanded) return null;
  return (
    <div className="mt-2 space-y-2">
      {inspection.categorias.map((cat) => (
        <div key={cat.categoria} className="bg-gray-50 rounded-lg p-2">
          <h4 className="text-xs font-semibold text-gray-600 mb-1">{cat.categoria}</h4>
          <div className="flex flex-wrap gap-1">
            {cat.items.map((item) => (
              <span key={item.nombre} className={`text-xs px-1.5 py-0.5 rounded ${
                item.resultado === 'bien' ? 'bg-green-100 text-green-700' :
                item.resultado === 'observacion' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.nombre}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Compound Component Assembly ──────────────────────────────────────────────
const InspectionCard = Object.assign(InspectionCardRoot, {
  Header,
  Status,
  Details,
  Categories,
});

// ═══════════════════════════════════════════════════════════════════════════════
// Compound Component 2: Tabs
// ═══════════════════════════════════════════════════════════════════════════════
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* debe usarse dentro de <Tabs>');
  return ctx;
}

function TabsRoot({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="flex border-b mb-3 gap-1">{children}</div>;
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1.5 text-sm rounded-t transition-colors ${
        activeTab === value ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return <div>{children}</div>;
}

const Tabs = Object.assign(TabsRoot, { List: TabList, Tab, Panel: TabPanel });

// ═══════════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════════

export function CompoundPatternPage() {
  const aprobadas = mockInspections.filter((i) => i.estado === 'aprobada');
  const rechazadas = mockInspections.filter((i) => i.estado === 'rechazada');
  const pendientes = mockInspections.filter((i) => i.estado === 'pendiente' || i.estado === 'en_progreso');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-orange-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_HOOKS} className="text-orange-600 hover:underline">← Hooks Pattern</Link>
            <Link to={appRoutes.PATTERNS_CONTAINER_PRESENTATIONAL} className="text-orange-600 hover:underline">Container/Presentational →</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Compound Pattern</h1>
          <p className="text-gray-500 text-sm mt-1">
            El <strong>Compound Pattern</strong> permite crear componentes que trabajan juntos compartiendo estado implícito.
            Al igual que <code>&lt;select&gt;</code> y <code>&lt;option&gt;</code> en HTML, los sub-componentes se coordinan sin que el consumidor maneje el estado.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fuente: <a href="https://www.patterns.dev/react/compound-pattern" target="_blank" rel="noreferrer" className="underline">patterns.dev/react/compound-pattern</a>
          </p>
        </div>

        {/* Callout */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-sm text-orange-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Un componente <strong>raíz</strong> mantiene el estado y lo comparte via <code className="bg-orange-100 px-1 rounded">Context</code>.</li>
            <li>Los <strong>sub-componentes</strong> consumen el contexto con <code className="bg-orange-100 px-1 rounded">useContext</code>.</li>
            <li>Se asignan como propiedades estáticas: <code className="bg-orange-100 px-1 rounded">Card.Header</code>, <code className="bg-orange-100 px-1 rounded">Card.Details</code>.</li>
            <li>El consumidor compone libremente los sub-componentes dentro del raíz.</li>
            <li>Alternativa: <code className="bg-orange-100 px-1 rounded">React.Children.map</code> + <code className="bg-orange-100 px-1 rounded">cloneElement</code> (más limitada).</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-orange-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del Compound Component ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// 1. Crear contexto y hook interno
const InspectionCardContext = createContext<...>(null);

function useInspectionCard() {
  const ctx = useContext(InspectionCardContext);
  if (!ctx) throw new Error('Debe usarse dentro de <InspectionCard>');
  return ctx;
}

// 2. Componente raíz con Provider
function InspectionCardRoot({ inspection, children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <InspectionCardContext.Provider value={{ inspection, expanded, toggle }}>
      <div>{children}</div>
    </InspectionCardContext.Provider>
  );
}

// 3. Sub-componentes que consumen el contexto
function Header() {
  const { inspection, toggle, expanded } = useInspectionCard();
  return <div onClick={toggle}>{inspection.id} {expanded ? '▲' : '▼'}</div>;
}

function Details() {
  const { inspection, expanded } = useInspectionCard();
  if (!expanded) return null;
  return <div>{inspection.marca} {inspection.modelo}</div>;
}

// 4. Asignar como propiedades estáticas
const InspectionCard = Object.assign(InspectionCardRoot, {
  Header,
  Status,
  Details,
  Categories,
});

// ─── Uso ────────────────────────────────────
<InspectionCard inspection={insp}>
  <InspectionCard.Header />
  <InspectionCard.Status />
  <InspectionCard.Details />
  <InspectionCard.Categories />
</InspectionCard>`}</pre>
        </details>

        {/* ─── Demo 1: InspectionCard Compound ─────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 1 — <code className="bg-orange-100 px-1 rounded text-orange-700">InspectionCard</code> Compound
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Cada card comparte estado <code>expanded</code> entre Header, Status, Details y Categories via Context. Click en el header para expandir.
          </p>
          <div className="space-y-3">
            {mockInspections.slice(0, 3).map((insp) => (
              <InspectionCard key={insp.id} inspection={insp}>
                <InspectionCard.Header />
                <InspectionCard.Status />
                <InspectionCard.Details />
                <InspectionCard.Categories />
              </InspectionCard>
            ))}
          </div>
        </div>

        {/* ─── Demo 2: Tabs Compound ────────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 2 — <code className="bg-orange-100 px-1 rounded text-orange-700">Tabs</code> Compound
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Tabs, Tab.List, Tab y Tab.Panel trabajan juntos. El estado de "tab activo" se comparte implícitamente.
          </p>

          <Tabs defaultTab="aprobadas">
            <Tabs.List>
              <Tabs.Tab value="aprobadas">✅ Aprobadas ({aprobadas.length})</Tabs.Tab>
              <Tabs.Tab value="rechazadas">❌ Rechazadas ({rechazadas.length})</Tabs.Tab>
              <Tabs.Tab value="pendientes">⏳ Pendientes ({pendientes.length})</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="aprobadas">
              {aprobadas.map((i) => (
                <div key={i.id} className="py-1 text-sm text-gray-600">{i.id} — {i.placa} — {i.marca} {i.modelo}</div>
              ))}
              {aprobadas.length === 0 && <p className="text-sm text-gray-400">Ninguna</p>}
            </Tabs.Panel>

            <Tabs.Panel value="rechazadas">
              {rechazadas.map((i) => (
                <div key={i.id} className="py-1 text-sm text-gray-600">{i.id} — {i.placa} — {i.marca} {i.modelo}</div>
              ))}
              {rechazadas.length === 0 && <p className="text-sm text-gray-400">Ninguna</p>}
            </Tabs.Panel>

            <Tabs.Panel value="pendientes">
              {pendientes.map((i) => (
                <div key={i.id} className="py-1 text-sm text-gray-600">{i.id} — {i.placa} — {i.marca} {i.modelo}</div>
              ))}
              {pendientes.length === 0 && <p className="text-sm text-gray-400">Ninguna</p>}
            </Tabs.Panel>
          </Tabs>
        </div>

        {/* Pros / Cons */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
          <strong>Pros y Contras</strong>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">✅ Ventajas</p>
              <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                <li>API declarativa y flexible para el consumidor.</li>
                <li>Estado interno oculto — bajo acoplamiento.</li>
                <li>Import único: <code>InspectionCard</code> trae todo.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">⚠️ Desventajas</p>
              <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                <li><code>cloneElement</code> limita a hijos directos.</li>
                <li>Contexto puede causar re-renders innecesarios.</li>
                <li>Debugging más complejo que props explícitas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
