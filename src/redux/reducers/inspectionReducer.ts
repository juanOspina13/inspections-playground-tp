import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Inspection } from '@/types/inspection';

interface InspectionState {
  selectedInspection: Inspection | null;
}

const initialState: InspectionState = {
  selectedInspection: null,
};

const inspectionSlice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    setSelectedInspection(state, action: PayloadAction<Inspection | null>) {
      state.selectedInspection = action.payload;
    },
  },
});

export const { setSelectedInspection } = inspectionSlice.actions;
export default inspectionSlice.reducer;
