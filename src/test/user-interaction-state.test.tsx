/**
 * TEST SUITE 1: User Interaction & State
 *
 * Estos tests verifican que los componentes responden correctamente a las
 * acciones del usuario (clicks, escritura) y que el estado local (useState)
 * se actualiza y re-renderiza como se espera.
 *
 * Herramientas:
 *  - @testing-library/react  → render, screen, queries
 *  - @testing-library/user-event → simula interacciones reales del usuario
 *  - vitest                  → describe, it, expect
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { InspectionStatus } from '@/types/inspection';

// ─── Componente 1: Contador ───────────────────────────────────────────────────
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p data-testid="count">Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Incrementar</button>
      <button onClick={() => setCount((c) => c - 1)}>Decrementar</button>
      <button onClick={() => setCount(0)}>Resetear</button>
    </div>
  );
}

// ─── Componente 2: Lista con filtro en tiempo real ────────────────────────────
const ALL_STATUSES: InspectionStatus[] = ['aprobada', 'rechazada', 'pendiente', 'en_progreso'];

function FilterList() {
  const [query, setQuery] = useState('');
  const filtered = ALL_STATUSES.filter((s) => s.includes(query));
  return (
    <div>
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filtrar estados..."
      />
      <p data-testid="count-label">{filtered.length} resultado(s)</p>
      <ul>
        {filtered.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── Componente 3: Toggle de visibilidad ──────────────────────────────────────
function VisibilityToggle() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setVisible((v) => !v)}>
        {visible ? 'Ocultar' : 'Mostrar'}
      </button>
      {visible && <p data-testid="panel">Contenido visible</p>}
    </div>
  );
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('User Interaction & State', () => {
  // ── Counter ────────────────────────────────────────────────────────────────
  describe('Counter — actualizaciones de estado por click', () => {
    it('inicia en 0', () => {
      render(<Counter />);
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
    });

    it('incrementa al hacer click en Incrementar', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
    });

    it('decrementa al hacer click en Decrementar', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      await user.click(screen.getByRole('button', { name: 'Decrementar' }));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: -1');
    });

    it('múltiples clicks acumulan el estado', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 3');
    });

    it('resetea a 0 después de varios incrementos', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      await user.click(screen.getByRole('button', { name: 'Incrementar' }));
      await user.click(screen.getByRole('button', { name: 'Resetear' }));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
    });
  });

  // ── FilterList ─────────────────────────────────────────────────────────────
  describe('FilterList — filtrado en tiempo real al escribir', () => {
    it('muestra todos los items cuando el input está vacío', () => {
      render(<FilterList />);
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(screen.getByTestId('count-label')).toHaveTextContent('4 resultado(s)');
    });

    it('filtra al escribir en el input', async () => {
      const user = userEvent.setup();
      render(<FilterList />);
      await user.type(screen.getByTestId('search-input'), 'apro');
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      expect(screen.getByText('aprobada')).toBeInTheDocument();
    });

    it('muestra 0 resultados cuando no hay coincidencia', async () => {
      const user = userEvent.setup();
      render(<FilterList />);
      await user.type(screen.getByTestId('search-input'), 'xyz');
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      expect(screen.getByTestId('count-label')).toHaveTextContent('0 resultado(s)');
    });

    it('remueve el filtro al limpiar el input', async () => {
      const user = userEvent.setup();
      render(<FilterList />);
      await user.type(screen.getByTestId('search-input'), 'apro');
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      await user.clear(screen.getByTestId('search-input'));
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });
  });

  // ── VisibilityToggle ───────────────────────────────────────────────────────
  describe('VisibilityToggle — toggle de visibilidad booleano', () => {
    it('no muestra el panel inicialmente', () => {
      render(<VisibilityToggle />);
      expect(screen.queryByTestId('panel')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Mostrar');
    });

    it('muestra el panel al hacer click en Mostrar', async () => {
      const user = userEvent.setup();
      render(<VisibilityToggle />);
      await user.click(screen.getByRole('button', { name: 'Mostrar' }));
      expect(screen.getByTestId('panel')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Ocultar');
    });

    it('oculta el panel al hacer click nuevamente', async () => {
      const user = userEvent.setup();
      render(<VisibilityToggle />);
      await user.click(screen.getByRole('button', { name: 'Mostrar' }));
      await user.click(screen.getByRole('button', { name: 'Ocultar' }));
      expect(screen.queryByTestId('panel')).not.toBeInTheDocument();
    });
  });
});
