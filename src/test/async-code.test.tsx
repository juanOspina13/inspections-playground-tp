/**
 * TEST SUITE 3: Async Code
 *
 * Los tests de código asíncrono verifican que los componentes manejan
 * correctamente las tres fases de una operación async:
 *
 *  1. LOADING  → La UI muestra un indicador mientras espera la respuesta.
 *  2. SUCCESS  → La UI muestra los datos una vez que la promesa resuelve.
 *  3. ERROR    → La UI muestra un mensaje de error si la promesa rechaza.
 *
 * Herramientas clave:
 *  - waitFor()      → espera a que una aserción sea verdadera (re-intenta).
 *  - findByRole()   → equivalente a getByRole + waitFor (async query).
 *  - vi.fn()        → mock de la función de fetch para controlar el resultado.
 *  - Promise never  → promesa que nunca resuelve, para fijar el estado loading.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { mockInspections } from '@/data/mockData';
import type { Inspection } from '@/types/inspection';

// ─── Servicio de inspecciones (bajo prueba) ───────────────────────────────────
// En un test, le pasamos un fetchFn como prop para poder controlarlo.
// Este es el patrón de "inyección de dependencia" para código async.
interface InspectionListProps {
  fetchFn: () => Promise<Inspection[]>;
}

function InspectionList({ fetchFn }: InspectionListProps) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setInspections(data);
    } catch {
      setError('Error al cargar las inspecciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLoad}>Cargar inspecciones</button>
      {loading && <p data-testid="loading">Cargando...</p>}
      {error && <p data-testid="error">{error}</p>}
      {!loading && !error && inspections.length > 0 && (
        <ul data-testid="list">
          {inspections.map((insp) => (
            <li key={insp.id} data-testid={`item-${insp.id}`}>
              {insp.placa} — {insp.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Componente async con carga automática (useEffect-like) ──────────────────
interface AutoLoadProps {
  fetchFn: () => Promise<Inspection[]>;
}

function AutoLoadList({ fetchFn }: AutoLoadProps) {
  const [data, setData] = useState<Inspection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simula useEffect con una función async IIFE
  useState(() => {
    fetchFn()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError('Fallo al cargar');
        setLoading(false);
      });
  });

  if (loading) return <p data-testid="loading">Cargando...</p>;
  if (error) return <p data-testid="error">{error}</p>;
  return (
    <ul data-testid="auto-list">
      {(data ?? []).map((i) => (
        <li key={i.id}>{i.placa}</li>
      ))}
    </ul>
  );
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Async Code', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Estado de carga ────────────────────────────────────────────────────────
  describe('InspectionList — estados loading / success / error', () => {
    it('muestra el indicador de carga mientras la promesa está pendiente', async () => {
      // Una promesa que nunca resuelve congela el componente en "loading"
      const neverResolves = vi.fn(() => new Promise<Inspection[]>(() => {}));
      const user = userEvent.setup();
      render(<InspectionList fetchFn={neverResolves} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('renderiza las inspecciones tras una fetch exitosa', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockInspections.slice(0, 3));
      const user = userEvent.setup();
      render(<InspectionList fetchFn={mockFetch} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));

      // waitFor re-intenta la aserción hasta que sea verdadera (o timeout)
      await waitFor(() =>
        expect(screen.getByTestId('list')).toBeInTheDocument(),
      );
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('muestra la placa y estado de cada inspección', async () => {
      const first = mockInspections[0];
      const mockFetch = vi.fn().mockResolvedValue([first]);
      const user = userEvent.setup();
      render(<InspectionList fetchFn={mockFetch} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));

      await waitFor(() =>
        expect(screen.getByTestId(`item-${first.id}`)).toBeInTheDocument(),
      );
      expect(screen.getByText(`${first.placa} — ${first.estado}`)).toBeInTheDocument();
    });

    it('muestra el mensaje de error cuando la promesa rechaza', async () => {
      const failFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      render(<InspectionList fetchFn={failFetch} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));

      await waitFor(() =>
        expect(screen.getByTestId('error')).toBeInTheDocument(),
      );
      expect(screen.getByTestId('error')).toHaveTextContent('Error al cargar las inspecciones');
    });

    it('no muestra la lista cuando hay un error', async () => {
      const failFetch = vi.fn().mockRejectedValue(new Error('fail'));
      const user = userEvent.setup();
      render(<InspectionList fetchFn={failFetch} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));

      await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument());
      expect(screen.queryByTestId('list')).not.toBeInTheDocument();
    });

    it('el loading desaparece tras una fetch exitosa', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockInspections.slice(0, 1));
      const user = userEvent.setup();
      render(<InspectionList fetchFn={mockFetch} />);
      await user.click(screen.getByRole('button', { name: 'Cargar inspecciones' }));

      await waitFor(() =>
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument(),
      );
    });
  });

  // ── findBy* — queries async ────────────────────────────────────────────────
  describe('AutoLoadList — queries async con findBy*', () => {
    it('findByTestId espera a que el elemento aparezca en el DOM', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockInspections.slice(0, 2));
      render(<AutoLoadList fetchFn={mockFetch} />);

      // findByTestId internamente usa waitFor — no necesitamos click aquí
      const list = await screen.findByTestId('auto-list');
      expect(list).toBeInTheDocument();
    });

    it('verifica que se llamó a fetchFn exactamente una vez', async () => {
      const mockFetch = vi.fn().mockResolvedValue([]);
      render(<AutoLoadList fetchFn={mockFetch} />);
      await screen.findByTestId('auto-list');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
