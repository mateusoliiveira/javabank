import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../context/PermissionContext';

export interface UserAccount {
  id: number;
  accountHolderName: string;
  accountNumber: string;
  balance: number;
}

export interface UserSetting {
  id: number;
  key: string;
  value: string | null;
}

export interface UserInfo {
  id: number;
  name: string;
  username: string;
  email?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  authorities?: any[];
  account?: UserAccount;
  settings?: UserSetting[];
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: 'user',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string; role: UserRole }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    updateUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
    },
    updateAccount: (state, action: PayloadAction<UserAccount>) => {
      if (state.user) {
        state.user.account = action.payload;
      }
    },
    updateSettings: (state, action: PayloadAction<UserSetting[]>) => {
      if (state.user) {
        state.user.settings = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = 'user';
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setRole, updateUser, updateAccount, updateSettings, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentRole = (state: { auth: AuthState }) => state.auth.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export type { AuthState };
