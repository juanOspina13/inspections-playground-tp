import type { DashboardStats } from '@/types/inspection';

const icons: Record<string, string> = {
  total: '📋',
  aprobadas: '✅',
  rechazadas: '❌',
  pendientes: '⏳',
  tasa: '📊',
};

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { key: 'total', label: 'Total Inspecciones', value: stats.total, icon: icons.total },
    { key: 'aprobadas', label: 'Aprobadas', value: stats.aprobadas, icon: icons.aprobadas },
    { key: 'rechazadas', label: 'Rechazadas', value: stats.rechazadas, icon: icons.rechazadas },
    { key: 'pendientes', label: 'Pendientes', value: stats.pendientes + stats.enProgreso, icon: icons.pendientes },
    { key: 'tasa', label: 'Tasa Aprobación', value: `${stats.tasaAprobacion}%`, icon: icons.tasa },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.key} className={`stat-card stat-card--${card.key}`}>
          <div className="stat-card__icon">{card.icon}</div>
          <div className="stat-card__content">
            <span className="stat-card__value">{card.value}</span>
            <span className="stat-card__label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
