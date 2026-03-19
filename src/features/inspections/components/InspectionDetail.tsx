import type { Inspection, InspectionItem, Severity } from '@/types/inspection';
import { StatusBadge } from './StatusBadge';
import { NextInspection } from './NextInspection';

interface InspectionDetailProps {
  inspection: Inspection;
  onClose: () => void;
  searchQuery: string;
}

const resultLabels: Record<InspectionItem['resultado'], { label: string; className: string }> = {
  bien: { label: '✓ Bien', className: 'result result--ok' },
  observacion: { label: '⚠ Observación', className: 'result result--warning' },
  falla: { label: '✗ Falla', className: 'result result--fail' },
};

const severityLabels: Record<Severity, { label: string; className: string }> = {
  baja: { label: 'Baja', className: 'severity severity--low' },
  media: { label: 'Media', className: 'severity severity--medium' },
  alta: { label: 'Alta', className: 'severity severity--high' },
  critica: { label: 'Crítica', className: 'severity severity--critical' },
};

export function InspectionDetail({ inspection, onClose, searchQuery }: InspectionDetailProps) {
  const totalItems = inspection.categorias.reduce((sum, cat) => sum + cat.items.length, 0);
  const failItems = inspection.categorias.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.resultado === 'falla').length,
    0,
  );
  const obsItems = inspection.categorias.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.resultado === 'observacion').length,
    0,
  );
  const okItems = totalItems - failItems - obsItems;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <h2 className="modal__title">
              Inspección {inspection.id} - Query: {searchQuery}
            </h2>
            <p className="modal__subtitle">
              {inspection.marca} {inspection.modelo} ({inspection.anio}) — {inspection.placa}
            </p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Estado</span>
              <StatusBadge status={inspection.estado} />
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Inspector</span>
              <span className="detail-item__value">{inspection.inspector}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Fecha</span>
              <span className="detail-item__value">{inspection.fecha}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Kilometraje</span>
              <span className="detail-item__value">{inspection.kilometraje.toLocaleString()} km</span>
            </div>

            <NextInspection></NextInspection>
          </div>

          <div className="detail-summary">
            <div className="detail-summary__item detail-summary__item--ok">
              <span className="detail-summary__number">{okItems}</span>
              <span className="detail-summary__label">Bien</span>
            </div>
            <div className="detail-summary__item detail-summary__item--warning">
              <span className="detail-summary__number">{obsItems}</span>
              <span className="detail-summary__label">Observaciones</span>
            </div>
            <div className="detail-summary__item detail-summary__item--fail">
              <span className="detail-summary__number">{failItems}</span>
              <span className="detail-summary__label">Fallas</span>
            </div>
          </div>

          {inspection.categorias.map((cat) => (
            <div key={cat.categoria} className="category-section">
              <h3 className="category-section__title">{cat.categoria}</h3>
              <div className="category-section__items">
                {cat.items.map((item) => {
                  const resultConfig = resultLabels[item.resultado];
                  return (
                    <div key={item.nombre} className="check-item">
                      <div className="check-item__header">
                        <span className="check-item__name">{item.nombre}</span>
                        <span className={resultConfig.className}>{resultConfig.label}</span>
                      </div>
                      {item.observacion && (
                        <div className="check-item__detail">
                          <span className="check-item__obs">{item.observacion}</span>
                          {item.severidad && (
                            <span className={severityLabels[item.severidad].className}>
                              {severityLabels[item.severidad].label}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {inspection.observacionesGenerales && (
            <div className="general-observations">
              <h3 className="general-observations__title">Observaciones Generales</h3>
              <p className="general-observations__text">{inspection.observacionesGenerales}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
