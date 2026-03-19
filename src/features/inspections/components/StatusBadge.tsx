import type { InspectionStatus } from '@/types/inspection';

const statusConfig: Record<InspectionStatus, { label: string; className: string }> = {
  aprobada: { label: 'Aprobada', className: 'badge badge--success' },
  rechazada: { label: 'Rechazada', className: 'badge badge--danger' },
  pendiente: { label: 'Pendiente', className: 'badge badge--warning' },
  en_progreso: { label: 'En Progreso', className: 'badge badge--info' },
};

export function StatusBadge({ status }: { status: InspectionStatus }) {
  const config = statusConfig[status];
  return <span className={config.className}>{config.label}</span>;
}
