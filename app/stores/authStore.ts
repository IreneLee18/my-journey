import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      return {
        isAuthenticated: false,
        setAuthenticated: (value: boolean) => {
          return set({ isAuthenticated: value });
        },
        onLogin: () => {
          return set({ isAuthenticated: true });
        },
        onLogout: () => {
          return set({ isAuthenticated: false });
        },
      };
    },
    {
      name: 'auth-storage',
    }
  )
);
