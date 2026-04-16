import { Link } from 'react-router-dom';
import { useInspectionDashboard } from '@/hooks/useInspectionDashboard';
import { InspectionProvider } from '@/features/inspections/context/InspectionContext';
import {
  StatsCards,
  InspectionFilters,
  InspectionTable,
  InspectionDetail,
  HooksExample,
} from '@/features/inspections/components';
import { appRoutes } from '@/routes';

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
  } = useInspectionDashboard();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1 className="dashboard__title">🚗 Inspecciones Vehiculares</h1>
          <p className="dashboard__subtitle">Panel de control y seguimiento de inspecciones</p>
        </div>
        <nav className="flex gap-3 mt-3 flex-wrap">
          <Link
            to={appRoutes.FORMS_CONTROLLED}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📋 Formulario Controlado
          </Link>
          <Link
            to={appRoutes.FORMS_UNCONTROLLED}
            className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            📋 Formulario No Controlado
          </Link>
          <Link
            to={appRoutes.FORMS_HOOK_FORM}
            className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            📋 React Hook Form + Zod
          </Link>
        </nav>
      </header>

      <StatsCards stats={stats} />
      <HooksExample inspections={filteredInspections} />

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
        <InspectionProvider initialProximaInspeccion={selectedInspection.proximaInspeccion ?? null}>
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
