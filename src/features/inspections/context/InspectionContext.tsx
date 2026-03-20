import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

interface InspectionState {
  proximaInspeccion: string | null;
}

type InspectionAction =
  | { type: 'sync'; payload: string | null }
  | { type: 'reprogram'; payload: string | null }
  | { type: 'clear' };

interface InspectionContextValue extends InspectionState {
  reprogramInspection: (nextDate: string | null) => void;
  clearInspectionSchedule: () => void;
  postponeInspectionByDays: (days: number) => void;
}

interface InspectionProviderProps {
  children: ReactNode;
  initialProximaInspeccion?: string | null;
}

const InspectionContext = createContext<InspectionContextValue | undefined>(undefined);

function inspectionReducer(state: InspectionState, action: InspectionAction): InspectionState {
  switch (action.type) {
    case 'sync':
      return { ...state, proximaInspeccion: action.payload };
    case 'reprogram':
      return { ...state, proximaInspeccion: action.payload };
    case 'clear':
      return { ...state, proximaInspeccion: null };
    default:
      return state;
  }
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function InspectionProvider({
  children,
  initialProximaInspeccion = null,
}: InspectionProviderProps) {
  const [state, dispatch] = useReducer(inspectionReducer, {
    proximaInspeccion: initialProximaInspeccion,
  });

  useEffect(() => {
    dispatch({ type: 'sync', payload: initialProximaInspeccion });
  }, [initialProximaInspeccion]);

  const reprogramInspection = (nextDate: string | null) => {
    dispatch({ type: 'reprogram', payload: nextDate });
  };

  const clearInspectionSchedule = () => {
    dispatch({ type: 'clear' });
  };

  const postponeInspectionByDays = (days: number) => {
    const baseDate = state.proximaInspeccion ? new Date(`${state.proximaInspeccion}T00:00:00`) : new Date();
    const nextDate = addDays(baseDate, days);
    dispatch({ type: 'reprogram', payload: formatDate(nextDate) });
  };

  return (
    <InspectionContext.Provider
      value={{
        proximaInspeccion: state.proximaInspeccion,
        reprogramInspection,
        clearInspectionSchedule,
        postponeInspectionByDays,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspectionContext() {
  const context = useContext(InspectionContext);

  if (!context) {
    throw new Error('useInspectionContext must be used within an InspectionProvider');
  }

  return context;
}
