import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import LocalStorageService from '../services/LocalStorageService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      accessToken: LocalStorageService.get("accessToken"),
      refreshToken: LocalStorageService.get("refreshToken"),
      isAuthenticated: !!LocalStorageService.get("accessToken"),
      loading: false,
      error: null,

      // Auth actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        
        try {
          // Import axios service dynamically to avoid circular dependencies
          const { postRequest } = await import('../services/AxiosBaseService');
          
          const response = await postRequest("users/login", credentials);
          debugger
          if (response?.data && response?.data.accessToken) {
            const { accessToken, refreshToken, user } = response.data;
            
            // Store tokens
            LocalStorageService.set("accessToken", accessToken);
            if (refreshToken) {
              LocalStorageService.set("refreshToken", refreshToken);
            }
            
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              loading: false,
              error: null
            });
            
            return { success: true, user, accessToken };
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || "Login failed";
          set({
            loading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          const { postRequest } = await import('../services/AxiosBaseService');
          const token = LocalStorageService.get("accessToken");
          await postRequest("users/logout", {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error("Logout API failed:", error);
        }
        LocalStorageService.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          const { postRequest } = await import('../services/AxiosBaseService');
          
          const response = await postRequest("users/register", userData);
          
          set({
            loading: false,
            error: null
          });
          
          return { success: true, data: response };
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || "Signup failed";
          set({
            loading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      updateProfile: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;