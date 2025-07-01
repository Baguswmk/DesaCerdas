import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginAPI, registerAPI } from "../services/auth";
import axiosInstance from "../services/api"; // pastikan ini mengarah ke axiosInstance dengan withCredentials: true

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      name: null,
      isLoading: false,
      error: null,
      successMessage: "",

      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setUserData: (user) => set({ user }),
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
            successMessage: "Login berhasil",
          });
          setTimeout(() => set({ successMessage: "" }), 3000);
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login gagal",
            isLoading: false,
          });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await registerAPI(data);
          set({
            user,
            isLoggedIn: true,
            isLoading: false,
            successMessage: "Registrasi berhasil",
          });
          setTimeout(() => set({ successMessage: "" }), 3000);
        } catch (err) {
          set({
            error: err.response?.data?.message || "Registrasi gagal",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
        } catch (_) {}
        set({
          user: null,
          isLoggedIn: false,
          successMessage: "Berhasil logout",
        });
        setTimeout(() => set({ successMessage: "" }), 3000);
      },

      autoLogin: async () => {
        try {
          const res = await axiosInstance.get('/auth/me');
          console.log("Auto login response:", res.data);
          set({
            user: res.data,
            name: res.data.name,
            isLoggedIn: true,
          });
        } catch (err) {
          set({
            user: null,
            name: null,
            isLoggedIn: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
