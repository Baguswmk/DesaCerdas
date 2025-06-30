import { create } from "zustand";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  isLoggedIn: !!Cookies.get("token"),

  setUser: (user) => set({ user, isLoggedIn: true }),
  setToken: (token) => {
    Cookies.set("token", token, { expires: 7 });
    set({ token, isLoggedIn: true });
  },
  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null, isLoggedIn: false });
  },
}));

export default useAuthStore;
