/**
 * TEST SUITE 4: Working with Mocks
 *
 * Los mocks permiten aislar la unidad bajo prueba sustituyendo dependencias
 * externas (servicios, módulos, APIs) por versiones controladas.
 *
 * Tipos de mocks en Vitest:
 *
 *  vi.fn()          → Crea una función mock vacía que registra sus llamadas.
 *  vi.fn(impl)      → Mock con implementación personalizada.
 *  mockReturnValue  → Fija el valor de retorno para todas las llamadas.
 *  mockResolvedValue→ Igual pero para promesas (async).
 *  mockRejectedValue→ Hace que la promesa rechace con el valor dado.
 *  mockImplementation → Implementación completa del mock.
 *  vi.spyOn()       → Envuelve un método real para espiar sus llamadas
 *                     sin reemplazarlo (o reemplazándolo opcionalmente).
 *  vi.mock()        → Reemplaza un módulo completo con mocks automáticos.
 *  vi.clearAllMocks → Limpia historial de llamadas (no la implementación).
 *  vi.resetAllMocks → Limpia historial + resetea implementación.
 *  vi.restoreAllMocks→ Restaura spies a la implementación original.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Inspection } from '@/types/inspection';
import { mockInspections } from '@/data/mockData';

// ─── 1. vi.fn() — función mock básica ────────────────────────────────────────
describe('vi.fn() — funciones mock básicas', () => {
  it('registra las llamadas a la función', () => {
    const onClick = vi.fn();
    // Llamamos la función directamente (sin componente)
    onClick('a');
    onClick('b');

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledWith('a');
    expect(onClick).toHaveBeenLastCalledWith('b');
  });

  it('retorna undefined por defecto', () => {
    const fn = vi.fn();
    expect(fn()).toBeUndefined();
  });

  it('mockReturnValue fija el valor de retorno', () => {
    const getStatus = vi.fn().mockReturnValue('aprobada');
    expect(getStatus()).toBe('aprobada');
    expect(getStatus()).toBe('aprobada'); // siempre retorna lo mismo
  });

  it('mockReturnValueOnce retorna valores distintos por llamada', () => {
    const getNext = vi.fn()
      .mockReturnValueOnce('pendiente')
      .mockReturnValueOnce('en_progreso')
      .mockReturnValue('aprobada'); // fallback

    expect(getNext()).toBe('pendiente');
    expect(getNext()).toBe('en_progreso');
    expect(getNext()).toBe('aprobada'); // fallback
    expect(getNext()).toBe('aprobada');
  });

  it('mockImplementation reemplaza la lógica completa', () => {
    const calcScore = vi.fn().mockImplementation((passed: number, total: number) =>
      Math.round((passed / total) * 100),
    );

    expect(calcScore(8, 10)).toBe(80);
    expect(calcScore(3, 4)).toBe(75);
    expect(calcScore).toHaveBeenCalledTimes(2);
  });
});

// ─── 2. vi.fn() con promesas (async mocks) ────────────────────────────────────
describe('vi.fn() — mocks asíncronos', () => {
  it('mockResolvedValue simula una fetch exitosa', async () => {
    const fetchFn = vi.fn().mockResolvedValue(mockInspections.slice(0, 2));
    const result = await fetchFn();
    expect(result).toHaveLength(2);
    expect(result[0].placa).toBe('ABC-123');
  });

  it('mockRejectedValue simula un error de red', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    await expect(fetchFn()).rejects.toThrow('Network error');
  });

  it('mockResolvedValueOnce permite controlar secuencias', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce([mockInspections[0]])
      .mockResolvedValueOnce([mockInspections[1]])
      .mockRejectedValue(new Error('Sin más datos'));

    const first = await fetchFn();
    expect(first[0].id).toBe('INS-001');

    const second = await fetchFn();
    expect(second[0].id).toBe('INS-002');

    await expect(fetchFn()).rejects.toThrow('Sin más datos');
  });
});

// ─── 3. vi.spyOn() — espiar métodos de objetos ───────────────────────────────
const inspectionService = {
  getAll(): Inspection[] {
    return mockInspections;
  },
  getById(id: string): Inspection | undefined {
    return mockInspections.find((i) => i.id === id);
  },
  count(): number {
    return mockInspections.length;
  },
};

describe('vi.spyOn() — espiar sin reemplazar', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // restaura el método original
  });

  it('espía sin alterar la implementación original', () => {
    const spy = vi.spyOn(inspectionService, 'count');
    const result = inspectionService.count();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBeGreaterThan(0); // la función real sigue corriendo
  });

  it('puede reemplazar la implementación temporalmente', () => {
    vi.spyOn(inspectionService, 'getAll').mockReturnValue([mockInspections[0]]);
    const result = inspectionService.getAll();
    expect(result).toHaveLength(1); // solo devuelve 1, no todos
  });

  it('después de restoreAllMocks la función original regresa', () => {
    vi.spyOn(inspectionService, 'getAll').mockReturnValue([]);
    expect(inspectionService.getAll()).toHaveLength(0); // mockeado

    vi.restoreAllMocks();
    expect(inspectionService.getAll().length).toBeGreaterThan(0); // original
  });
});

// ─── 4. Mocks en componentes React ───────────────────────────────────────────
interface SaveButtonProps {
  onSave: (data: { placa: string }) => Promise<void>;
}

function SaveButton({ onSave }: SaveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleClick = async () => {
    setStatus('saving');
    try {
      await onSave({ placa: 'XYZ-999' });
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={status === 'saving'}>
        {status === 'saving' ? 'Guardando...' : 'Guardar'}
      </button>
      {status === 'saved' && <p data-testid="success">Guardado correctamente</p>}
      {status === 'error' && <p data-testid="error">Error al guardar</p>}
    </div>
  );
}

describe('Mocks en componentes React', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama a onSave con los datos correctos al hacer click', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SaveButton onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ placa: 'XYZ-999' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('muestra "Guardado correctamente" tras una operación exitosa', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SaveButton onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() =>
      expect(screen.getByTestId('success')).toBeInTheDocument(),
    );
  });

  it('muestra "Error al guardar" cuando onSave rechaza', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Server error'));
    const user = userEvent.setup();
    render(<SaveButton onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() =>
      expect(screen.getByTestId('error')).toBeInTheDocument(),
    );
  });

  it('el botón se deshabilita mientras guarda', async () => {
    // Promesa que no resuelve de inmediato → el botón permanece deshabilitado
    const onSave = vi.fn(() => new Promise<void>(() => {}));
    const user = userEvent.setup();
    render(<SaveButton onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Guardando...');
  });
});

// ─── 5. clearAllMocks vs resetAllMocks vs restoreAllMocks ─────────────────────
describe('Ciclo de vida de los mocks', () => {
  it('clearAllMocks limpia las llamadas pero mantiene la implementación', () => {
    const fn = vi.fn().mockReturnValue(42);
    fn();
    fn();
    expect(fn).toHaveBeenCalledTimes(2);

    vi.clearAllMocks();

    expect(fn).toHaveBeenCalledTimes(0); // historial limpio
    expect(fn()).toBe(42);               // implementación intacta
  });

  it('resetAllMocks limpia llamadas Y resetea la implementación', () => {
    const fn = vi.fn().mockReturnValue(42);
    fn();

    vi.resetAllMocks();

    expect(fn).toHaveBeenCalledTimes(0); // historial limpio
    expect(fn()).toBeUndefined();         // implementación reseteda
  });
});
