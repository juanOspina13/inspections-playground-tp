import type { InspectionStatus, VehicleType } from '@/types/inspection';
import { useRef } from 'react';
import { SecondaryButton } from './SecondaryButton';

interface FiltersProps {
  statusFilter: InspectionStatus | 'todas';
  vehicleFilter: VehicleType | 'todos';
  searchQuery: string;
  onStatusChange: (status: InspectionStatus | 'todas') => void;
  onVehicleChange: (type: VehicleType | 'todos') => void;
  onSearchChange: (query: string) => void;
}

const vehicleLabels: Record<VehicleType, string> = {
  sedan: 'Sedán',
  suv: 'SUV',
  camioneta: 'Camioneta',
  camion: 'Camión',
  motocicleta: 'Motocicleta',
  bus: 'Bus',
};

export function InspectionFilters({
  statusFilter,
  vehicleFilter,
  searchQuery,
  onStatusChange,
  onVehicleChange,
  onSearchChange,
}: FiltersProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };
  return (
    <div className="filters">
      <div className="filters__search">
        <span className="filters__search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
               ref={inputRef}
     className="filters__input"
        />
      </div>

      <div className="filters__selects">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as InspectionStatus | 'todas')}
          className="filters__select"
        >
          <option value="todas">Todos los estados</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
        </select>

        <select
          value={vehicleFilter}
          onChange={(e) => onVehicleChange(e.target.value as VehicleType | 'todos')}
          className="filters__select"
        >
          <option value="todos">Todos los vehículos</option>
          {Object.entries(vehicleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <SecondaryButton onClick={handleFocus} className="filters__button">
          Focus search
        </SecondaryButton>
      </div>
    </div>
  );
}
