import { useRef } from 'react';
import type { Inspection, VehicleType } from '@/types/inspection';
import { StatusBadge } from './StatusBadge';

const vehicleIcons: Record<VehicleType, string> = {
  sedan: '🚗',
  suv: '🚙',
  camioneta: '🛻',
  camion: '🚛',
  motocicleta: '🏍️',
  bus: '🚌',
};

interface InspectionTableProps {
  inspections: Inspection[];
  onSelect: (inspection: Inspection) => void;
  searchQuery: string;
}

export function InspectionTable({ inspections, onSelect, searchQuery }: InspectionTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);

  const scrollToTop = () => {
    console.log("html element", tableRef.current);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (inspections.length === 0) {
    return (
      <div className="empty-state">
        Searchquery:{searchQuery}
        <span className="empty-state__icon">📭</span>
        <p>No se encontraron inspecciones con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      {searchQuery}
      <table ref={tableRef} className="inspection-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Placa</th>
            <th>Inspector</th>
            <th>Fecha</th>
            <th>Kilometraje</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((insp) => (
            <tr key={insp.id} onClick={() => onSelect(insp)} className="inspection-table__row">
              <td className="inspection-table__id">{insp.id}</td>
              <td>
                <div className="vehicle-info">
                  <span className="vehicle-info__icon">{vehicleIcons[insp.tipoVehiculo]}</span>
                  <div>
                    <span className="vehicle-info__name">{insp.marca} {insp.modelo}</span>
                    <span className="vehicle-info__year">{insp.anio}</span>
                  </div>
                </div>
              </td>
              <td className="inspection-table__placa">{insp.placa}</td>
              <td className={insp.inspector === 'Carlos Méndez' ? 'p-4 bg-green-500 text-white' : ''}>{insp.inspector === 'Carlos Méndez' ? '✔ Carlitos' : insp.inspector}</td>
              <td>{formatDate(insp.fecha)}</td>
              <td>{insp.kilometraje.toLocaleString()} km</td>
              <td><StatusBadge status={insp.estado} /></td>
              <td>
                <div className='flex gap-4'>
                  <button disabled={insp.estado !== 'pendiente'} className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={(e) => { e.stopPropagation(); onSelect(insp); }}>
                    Ver detalle
                  </button>
                 
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inspections.length > 5 && (
        <button className="px-3 py-1.5 mt-2 text-sm text-gray-500 hover:text-gray-700" onClick={scrollToTop}>
          ↑ Volver arriba
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}
