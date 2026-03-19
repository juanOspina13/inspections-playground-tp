import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import inspectionReducer from './reducers/inspectionReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    inspection: inspectionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
