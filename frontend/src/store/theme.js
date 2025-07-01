import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (val) => set({ isDarkMode: val }),
}));

export default useThemeStore;
