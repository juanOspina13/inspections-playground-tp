import { useInspectionContext } from '@/features/inspections/context/InspectionContext';

export function NextInspection() {
    const { proximaInspeccion } = useInspectionContext();

    return <div className="next-inspection">
        <div className="detail-item">
                <span className="detail-item__label">Próxima Inspección</span>
                <span className="detail-item__value">{proximaInspeccion ?? 'No programada'}</span>
              </div>
    </div>
}