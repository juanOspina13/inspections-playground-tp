import { useInspectionDashboard } from '@/hooks/useInspectionDashboard';
import { InspectionProvider } from '@/features/inspections/context/InspectionContext';
import {
  StatsCards,
  InspectionFilters,
  InspectionTable,
  InspectionDetail,
} from '@/features/inspections/components';

export function DashboardPage() {
  const {
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
    dialog
  } = useInspectionDashboard();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1 className="dashboard__title">🚗 Inspecciones Vehiculares</h1>
          <p className="dashboard__subtitle">Panel de control y seguimiento de inspecciones</p>
        </div>
      </header>

      <StatsCards stats={stats} />

      <div className="dashboard__content">
        <InspectionFilters
          statusFilter={statusFilter}
          vehicleFilter={vehicleFilter}
          searchQuery={searchQuery}
          onStatusChange={setStatusFilter}
          onVehicleChange={setVehicleFilter}
          onSearchChange={setSearchQuery}
        />

        <InspectionTable
          inspections={filteredInspections}
          onSelect={setSelectedInspection}
          searchQuery={searchQuery}
        />
      </div>

      {selectedInspection && (
        <InspectionProvider value={{ proximaInspeccion: selectedInspection.proximaInspeccion ?? null }}>
          {/* Proveemos el contexto de inspección para que el hijo del detalle acceder la data sin prop drilling */}

          <InspectionDetail
            inspection={selectedInspection}
            onClose={() => setSelectedInspection(null)}
            searchQuery={searchQuery}
          />
        </InspectionProvider>
      )}
    </div>
  );
}
