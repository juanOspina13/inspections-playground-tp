import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import type { Inspection, VehicleType } from '@/types/inspection';
import { SecondaryButton } from './SecondaryButton';

interface HooksExampleProps {
  inspections: Inspection[];
}

interface ExampleActionsProps {
  refreshCount: number;
  onRefresh: () => void;
}

const vehicleOptions: Array<{ value: VehicleType | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'camion', label: 'Camión' },
  { value: 'motocicleta', label: 'Motocicleta' },
  { value: 'bus', label: 'Bus' },
];

const mileageFormatter = new Intl.NumberFormat('es-CO');

const ExampleActions = memo(function ExampleActions({
  refreshCount,
  onRefresh,
}: ExampleActionsProps) {
  return (
    <div className="hooks-example__actions">
      <p className="hooks-example__hint">
        `useCallback` mantiene estable la referencia de este handler mientras no cambien sus
        dependencias.
      </p>
      <SecondaryButton onClick={onRefresh}>Actualizar contador</SecondaryButton>
      <span className="hooks-example__counter">Clicks: {refreshCount}</span>
    </div>
  );
});

export function HooksExample({ inspections }: HooksExampleProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | 'todos'>('todos');
  const [refreshCount, setRefreshCount] = useState(0);

  const handleVehicleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(event.target.value as VehicleType | 'todos');
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshCount((currentCount) => currentCount + 1);
  }, []);

  const summary = useMemo(() => {
    const visibleInspections = inspections.filter((inspection) => {
      return selectedVehicle === 'todos' || inspection.tipoVehiculo === selectedVehicle;
    });

    const totalMileage = visibleInspections.reduce((sum, inspection) => {
      return sum + inspection.kilometraje;
    }, 0);

    const inspectors = new Set(visibleInspections.map((inspection) => inspection.inspector)).size;

    const nextInspection =
      visibleInspections
        .map((inspection) => inspection.proximaInspeccion)
        .filter((date): date is string => Boolean(date))
        .sort()[0] ?? 'Sin fecha programada';

    return {
      total: visibleInspections.length,
      totalMileage,
      inspectors,
      nextInspection,
    };
  }, [inspections, selectedVehicle]);

  return (
    <section className="hooks-example">
      <div className="hooks-example__header">
        <div>
          <h2 className="hooks-example__title">Ejemplo de useMemo y useCallback</h2>
          <p className="hooks-example__description">
            `useMemo` recalcula este resumen solo cuando cambian las inspecciones visibles o el
            tipo de vehiculo seleccionado.
          </p>
        </div>

        <label className="hooks-example__control">
          Tipo de vehiculo
          <select
            value={selectedVehicle}
            onChange={handleVehicleChange}
            className="hooks-example__select"
          >
            {vehicleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hooks-example__grid">
        <article className="hooks-example__card">
          <span className="hooks-example__label">Inspecciones</span>
          <strong className="hooks-example__value">{summary.total}</strong>
        </article>

        <article className="hooks-example__card">
          <span className="hooks-example__label">Kilometraje acumulado</span>
          <strong className="hooks-example__value">
            {mileageFormatter.format(summary.totalMileage)} km
          </strong>
        </article>

        <article className="hooks-example__card">
          <span className="hooks-example__label">Inspectores unicos</span>
          <strong className="hooks-example__value">{summary.inspectors}</strong>
        </article>

        <article className="hooks-example__card">
          <span className="hooks-example__label">Proxima inspeccion</span>
          <strong className="hooks-example__value">{summary.nextInspection}</strong>
        </article>
      </div>

      <ExampleActions refreshCount={refreshCount} onRefresh={handleRefresh} />
    </section>
  );
}