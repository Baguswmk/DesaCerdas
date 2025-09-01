import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginAPI, registerAPI, getMeAPI, logoutAPI } from "../services/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      name: null,
      isLoading: false,
      error: null,
      successMessage: "",

      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setUserData: (user) => set({ user, name: user?.name }),
      setShowSuccessMessage: (msg) => set({ successMessage: msg }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await loginAPI(credentials);
          set({
            user,
            name: user.name,
            isLoggedIn: true,
            isLoading: false,
            successMessage: "Login berhasil!",
          });
          
          
          setTimeout(() => set({ successMessage: "" }), 3000);
          return { success: true };
        } catch (err) {
          console.error('Login error:', err);
          const errorMessage = err.response?.data?.message || err.message || "Login gagal";
          set({
            error: errorMessage,
            isLoading: false,
            isLoggedIn: false,
            user: null
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerAPI(data);
          set({
            isLoading: false,
            successMessage: "Registrasi berhasil! Silakan login.",
          });
          
          setTimeout(() => set({ successMessage: "" }), 3000);
          return { success: true };
        } catch (err) {
          console.error('Register error:', err);
          const errorMessage = err.response?.data?.message || err.message || "Registrasi gagal";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await logoutAPI();
        } catch (err) {
          console.error('Logout error:', err);
        }
        
        
        set({
          user: null,
          name: null,
          isLoggedIn: false,
          successMessage: "Berhasil logout",
        });
        
        
        localStorage.removeItem("csrfToken");
        
        setTimeout(() => set({ successMessage: "" }), 3000);
      },

      autoLogin: async () => {
        try {
          const { user } = await getMeAPI();
          console.log("✅ Auto login success:", user);
          set({
            user,
            name: user.name,
            isLoggedIn: true,
          });
          return true;
        } catch (err) {
          console.log("❌ Auto login failed:", err.response?.data?.message || err.message);
          set({
            user: null,
            name: null,
            isLoggedIn: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        name: state.name,
      }),
    }
  )
);

export default useAuthStore;