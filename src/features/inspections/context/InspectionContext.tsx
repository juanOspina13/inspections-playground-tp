import { createContext, useContext } from 'react';

interface InspectionContextValue {
  proximaInspeccion: string | null;
}

const InspectionContext = createContext<InspectionContextValue>({ proximaInspeccion: null });

export const InspectionProvider = InspectionContext.Provider;

export function useInspectionContext() {
  return useContext(InspectionContext);
}
