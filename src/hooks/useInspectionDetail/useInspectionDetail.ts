import type { Inspection } from "@/types/inspection";
import { useEffect } from "react";

export function useInspectionDetail(onClose: () => void, inspection: Inspection) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        //este es el cleanup que se ejecuta cuando el componente se desmonta o cuando cambie la inspección
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [inspection]);

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
    return { okItems, obsItems, failItems };
}