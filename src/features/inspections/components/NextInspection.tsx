import { useInspectionContext } from '@/features/inspections/context/InspectionContext';
import { SecondaryButton } from './SecondaryButton';

export function NextInspection() {
    const {
        proximaInspeccion,
        postponeInspectionByDays,
        clearInspectionSchedule,
        reprogramInspection,
    } = useInspectionContext();

    return (
        <div className="next-inspection">
            <div className="detail-item">
                <span className="detail-item__label">Próxima Inspección</span>
                <span className="detail-item__value">{proximaInspeccion ?? 'No programada'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <SecondaryButton type="button" onClick={() => postponeInspectionByDays(30)}>
                    Posponer 30 días
                </SecondaryButton>

                <SecondaryButton type="button" onClick={() => reprogramInspection('2026-12-01')}>
                    Fijar fecha ejemplo
                </SecondaryButton>

                <SecondaryButton type="button" onClick={clearInspectionSchedule}>
                    Limpiar fecha
                </SecondaryButton>
            </div>
        </div>
    );
}