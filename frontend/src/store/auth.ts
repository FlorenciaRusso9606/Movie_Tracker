import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  idUser: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hasHydrated: false,
      clearAuth: () => set({ 
        user: null, 
        token: null,
        hasHydrated: true 
      }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      login: (user, token) => {
        set({ 
          user: {
            idUser: user.idUser,
            name: user.name,
            email: user.email
          },
          token,
          hasHydrated: true
        });
      },
      
      logout: () => set({ 
        user: null, 
        token: null,
        hasHydrated: true 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      version: 1,
    }
  )
);