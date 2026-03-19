import { useState, useMemo } from 'react';
import type { Inspection, InspectionStatus, VehicleType, DashboardStats } from '@/types/inspection';
import { mockInspections } from '@/data/mockData';

function computeStats(inspections: Inspection[]): DashboardStats {
  const total = inspections.length;
  const aprobadas = inspections.filter((i) => i.estado === 'aprobada').length;
  const rechazadas = inspections.filter((i) => i.estado === 'rechazada').length;
  const pendientes = inspections.filter((i) => i.estado === 'pendiente').length;
  const enProgreso = inspections.filter((i) => i.estado === 'en_progreso').length;
  const finalizadas = aprobadas + rechazadas;
  const tasaAprobacion = finalizadas > 0 ? Math.round((aprobadas / finalizadas) * 100) : 0;
  return { total, aprobadas, rechazadas, pendientes, enProgreso, tasaAprobacion };
}

export const useInspectionDashboard = () => {
  // Manejo de el estado con useState
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'todas'>('todas');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  const stats = useMemo(() => computeStats(mockInspections), []);

  const filteredInspections = useMemo(() => {
    return mockInspections.filter((insp) => {
      if (statusFilter !== 'todas' && insp.estado !== statusFilter) return false;
      if (vehicleFilter !== 'todos' && insp.tipoVehiculo !== vehicleFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${insp.placa} ${insp.marca} ${insp.modelo} ${insp.inspector} ${insp.id}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [statusFilter, vehicleFilter, searchQuery]);

  return {
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    searchQuery,
    setSearchQuery,
    selectedInspection,
    setSelectedInspection,
    stats,
    filteredInspections,
  };
};
