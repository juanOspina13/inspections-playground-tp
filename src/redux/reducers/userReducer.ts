import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  roles: string[];
}

interface UserState {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  rolePermissions: string | null;
}

const initialState: UserState = {
  isLoggedIn: true,
  userProfile: null,
  rolePermissions: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn(state) {
      state.isLoggedIn = true;
    },
    logOut(state) {
      state.isLoggedIn = false;
      state.userProfile = null;
      state.rolePermissions = null;
    },
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = action.payload;
    },
    setRolePermissions(state, action: PayloadAction<string | null>) {
      state.rolePermissions = action.payload;
    },
  },
});

export const { logIn, logOut, setUserProfile, setRolePermissions } = userSlice.actions;
export default userSlice.reducer;
