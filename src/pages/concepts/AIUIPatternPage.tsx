import { useState, useEffect, useRef, useCallback,  type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { mockInspections } from '@/data/mockData';
import type { Inspection } from '@/types/inspection';

// ═══════════════════════════════════════════════════════════════════════════════
// Simulated AI Chat Hook (no real API, simulates streaming)
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatMessage {
  id: string;
  role: any;
  content: string;
}

function generateInspectionAnswer(query: string, inspections: Inspection[]): string {
  const q = query.toLowerCase();
  if (q.includes('cuántas') || q.includes('total') || q.includes('cuantas')) {
    return `Hay un total de ${inspections.length} inspecciones registradas. De estas, ${inspections.filter((i) => i.estado === 'aprobada').length} están aprobadas, ${inspections.filter((i) => i.estado === 'rechazada').length} rechazadas y ${inspections.filter((i) => i.estado === 'pendiente' || i.estado === 'en_progreso').length} pendientes o en progreso.`;
  }
  if (q.includes('aprobada') || q.includes('aprobadas')) {
    const aprobadas = inspections.filter((i) => i.estado === 'aprobada');
    return `Hay ${aprobadas.length} inspecciones aprobadas: ${aprobadas.map((i) => `${i.id} (${i.marca} ${i.modelo})`).join(', ')}.`;
  }
  if (q.includes('rechazada') || q.includes('rechazadas')) {
    const rechazadas = inspections.filter((i) => i.estado === 'rechazada');
    return `Hay ${rechazadas.length} inspecciones rechazadas: ${rechazadas.map((i) => `${i.id} (${i.marca} ${i.modelo})`).join(', ')}. ${rechazadas.length > 0 ? 'Revisa las observaciones para más detalles.' : ''}`;
  }
  if (q.includes('inspector') || q.includes('quién') || q.includes('quien')) {
    const inspectors = [...new Set(inspections.map((i) => i.inspector))];
    return `Los inspectores registrados son: ${inspectors.join(', ')}. En total han realizado ${inspections.length} inspecciones.`;
  }
  if (q.includes('placa') || q.includes('vehículo') || q.includes('vehiculo')) {
    return `Vehículos registrados:\n${inspections.map((i) => `• ${i.placa} — ${i.marca} ${i.modelo} (${i.anio})`).join('\n')}`;
  }
  return `Puedo ayudarte con información sobre las ${inspections.length} inspecciones registradas. Prueba preguntar:\n• "¿Cuántas inspecciones hay?"\n• "¿Cuáles están aprobadas?"\n• "¿Cuáles están rechazadas?"\n• "¿Quién es el inspector?"\n• "¿Qué vehículos hay?"`;
}

function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'system', content: 'Eres un asistente de inspecciones vehiculares.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);
      setStreamingText('');

      // Simulate streaming response
      const fullAnswer = generateInspectionAnswer(input, mockInspections);
      let index = 0;

      const interval = setInterval(() => {
        index += Math.floor(Math.random() * 3) + 1;
        if (index >= fullAnswer.length) {
          index = fullAnswer.length;
          clearInterval(interval);
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fullAnswer,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStreamingText('');
          setIsLoading(false);
        } else {
          setStreamingText(fullAnswer.slice(0, index));
        }
      }, 30);
    },
    [input, isLoading],
  );

  return { messages: messages.filter((m) => m.role !== 'system'), input, setInput, handleSubmit, isLoading, streamingText };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Debounced Search Hook
// ═══════════════════════════════════════════════════════════════════════════════

function useDebouncedSearch(inspections: Inspection[], delay = 500) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query) {
      setDebouncedQuery('');
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setSearching(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  const results = debouncedQuery
    ? inspections.filter(
        (i) =>
          i.placa.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          i.marca.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          i.modelo.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          i.inspector.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : [];

  return { query, setQuery, results, searching, hasSearched: debouncedQuery !== '' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Presentational Components
// ═══════════════════════════════════════════════════════════════════════════════

function ChatMessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
          isUser ? 'bg-fuchsia-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-400 flex gap-1">
        <span className="animate-bounce">●</span>
        <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  disabled: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 border rounded-lg px-3 py-2 text-sm disabled:opacity-50"
        placeholder="Pregunta sobre las inspecciones..."
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 disabled:opacity-50"
      >
        Enviar
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════════

export function AIUIPatternPage() {
  const chat = useChat();
  const search = useDebouncedSearch(mockInspections);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, chat.streamingText]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex gap-4 text-sm mb-4 flex-wrap">
            <Link to={appRoutes.HOME} className="text-fuchsia-600 hover:underline">← Inicio</Link>
            <Link to={appRoutes.PATTERNS_RENDER_PROPS} className="text-fuchsia-600 hover:underline">← Render Props</Link>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">AI UI Patterns</h1>
          <p className="text-gray-500 text-sm mt-1">
            Patrones para construir interfaces de IA: chat conversacional, streaming de respuestas,
            debouncing de input, manejo de errores y componentes reutilizables para UIs de chat.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fuente: <a href="https://www.patterns.dev/react/ai-ui-patterns" target="_blank" rel="noreferrer" className="underline">patterns.dev/react/ai-ui-patterns</a>
          </p>
        </div>

        {/* Callout */}
        <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4 mb-6 text-sm text-fuchsia-800">
          <strong>¿Cómo funciona?</strong>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><strong>Streaming:</strong> Las respuestas se muestran token por token conforme se generan, mejorando la percepción de velocidad.</li>
            <li><strong>Conversation State:</strong> Un array de <code className="bg-fuchsia-100 px-1 rounded">{'{role, content}'}</code> mantiene el historial del chat.</li>
            <li><strong>Debouncing:</strong> Para features como autocompletado, retrasa la llamada al API hasta que el usuario deje de escribir.</li>
            <li><strong>Componentes separados:</strong> <code className="bg-fuchsia-100 px-1 rounded">ChatMessage</code>, <code className="bg-fuchsia-100 px-1 rounded">ChatInput</code>, <code className="bg-fuchsia-100 px-1 rounded">TypingIndicator</code> — presentacionales y reutilizables.</li>
            <li><strong>Auto-scroll:</strong> <code className="bg-fuchsia-100 px-1 rounded">useEffect</code> + <code className="bg-fuchsia-100 px-1 rounded">useRef</code> para scroll automático al último mensaje.</li>
          </ul>
        </div>

        {/* Code preview */}
        <details className="mb-6 bg-gray-800 rounded-lg text-xs text-fuchsia-300 font-mono">
          <summary className="cursor-pointer px-4 py-3 text-gray-300 hover:text-white">
            Ver código del chat hook ▾
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto">{`// Hook que maneja estado del chat y simula streaming
function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([...]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const handleSubmit = useCallback((e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // 1. Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    // 2. Simular streaming (en producción: fetch + ReadableStream)
    const fullAnswer = generateAnswer(input);
    let index = 0;
    const interval = setInterval(() => {
      index += Math.random() * 3 + 1;
      if (index >= fullAnswer.length) {
        clearInterval(interval);
        setMessages(prev => [...prev, { role: 'assistant', content: fullAnswer }]);
        setStreamingText('');
        setIsLoading(false);
      } else {
        setStreamingText(fullAnswer.slice(0, index));
      }
    }, 30);
  }, [input, isLoading]);

  return { messages, input, setInput, handleSubmit, isLoading, streamingText };
}

// ─── Debounced search ─────────────────────────────
function useDebouncedSearch(inspections, delay = 500) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  const results = inspections.filter(i =>
    i.placa.includes(debouncedQuery) || ...
  );

  return { query, setQuery, results, searching };
}

// ─── Componentes presentacionales ─────────────────
function ChatMessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={isUser ? 'justify-end' : 'justify-start'}>
      <div className={isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
        {content}
      </div>
    </div>
  );
}

// ─── Auto-scroll ──────────────────────────────────
const messagesEndRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, streamingText]);`}</pre>
        </details>

        {/* ─── Demo 1: Chat simulado con streaming ──────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 1 — Chat con Streaming simulado
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Simula un chatbot de inspecciones. Las respuestas aparecen token por token (streaming simulado con <code>setInterval</code>).
            En producción usarías <code>fetch</code> + <code>ReadableStream</code> o Vercel AI SDK <code>useChat()</code>.
          </p>

          <div className="border rounded-lg overflow-hidden">
            {/* Messages area */}
            <div className="h-64 overflow-y-auto p-3 bg-gray-50 space-y-1">
              {chat.messages.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Pregunta algo sobre las inspecciones...
                </p>
              )}
              {chat.messages.map((msg) => (
                <ChatMessageBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {chat.isLoading && chat.streamingText && (
                <ChatMessageBubble role="assistant" content={chat.streamingText + '▌'} />
              )}
              {chat.isLoading && !chat.streamingText && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 border-t bg-white">
              <ChatInput
                value={chat.input}
                onChange={chat.setInput}
                onSubmit={chat.handleSubmit}
                disabled={chat.isLoading}
              />
            </div>
          </div>
          <div className="mt-2 flex gap-1 flex-wrap">
            <span className="text-xs text-gray-400">Prueba:</span>
            {['¿Cuántas inspecciones hay?', '¿Cuáles están rechazadas?', '¿Quién es el inspector?'].map((q) => (
              <button
                key={q}
                onClick={() => {
                  chat.setInput(q);
                }}
                className="text-xs bg-fuchsia-50 text-fuchsia-600 px-2 py-0.5 rounded border border-fuchsia-200 hover:bg-fuchsia-100"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Demo 2: Debounced search ────────────────────────── */}
        <div className="bg-white rounded-xl border p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">
            Demo 2 — Búsqueda con Debounce
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            La búsqueda espera 500ms después de que dejas de escribir antes de filtrar. Evita llamadas excesivas al API.
          </p>

          <input
            type="text"
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
            placeholder="Buscar por placa, marca, modelo o inspector..."
          />

          <div className="min-h-[60px]">
            {search.searching && (
              <p className="text-sm text-fuchsia-500 animate-pulse">Buscando...</p>
            )}
            {!search.searching && search.hasSearched && search.results.length === 0 && (
              <p className="text-sm text-gray-400">Sin resultados para "{search.query}"</p>
            )}
            {!search.searching && search.results.length > 0 && (
              <div className="space-y-1">
                {search.results.map((insp) => (
                  <div key={insp.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                    <span className="font-mono text-xs text-gray-500">{insp.id}</span>
                    <span>{insp.placa}</span>
                    <span>{insp.marca} {insp.modelo}</span>
                    <span className="text-xs text-gray-400">{insp.inspector}</span>
                  </div>
                ))}
              </div>
            )}
            {!search.searching && !search.hasSearched && (
              <p className="text-xs text-gray-400">Escribe para buscar (debounce de 500ms)</p>
            )}
          </div>
        </div>

        {/* Architecture comparison */}
        <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4 text-sm text-fuchsia-800">
          <strong>Arquitectura: Next.js vs Vite</strong>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-fuchsia-200">
                  <th className="py-1 text-left">Aspecto</th>
                  <th className="py-1 text-left">Next.js</th>
                  <th className="py-1 text-left">Vite + Backend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-fuchsia-100">
                  <td className="py-1">API Routes</td>
                  <td className="py-1">Built-in (app/api/)</td>
                  <td className="py-1">Express/Node separado</td>
                </tr>
                <tr className="border-b border-fuchsia-100">
                  <td className="py-1">Streaming</td>
                  <td className="py-1">Nativo (Edge Runtime)</td>
                  <td className="py-1">Manual con res.write()</td>
                </tr>
                <tr className="border-b border-fuchsia-100">
                  <td className="py-1">Deploy</td>
                  <td className="py-1">Vercel (optimizado)</td>
                  <td className="py-1">Frontend + Backend separados</td>
                </tr>
                <tr>
                  <td className="py-1">Complejidad</td>
                  <td className="py-1">Menor (todo-en-uno)</td>
                  <td className="py-1">Mayor (dos codebases)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            En producción, usa <code className="bg-fuchsia-100 px-1 rounded">useChat()</code> del Vercel AI SDK para manejar streaming, estado y errores automáticamente.
            Nunca expongas API keys en el cliente — siempre usa un backend/proxy.
          </p>
        </div>
      </div>
    </div>
  );
}
