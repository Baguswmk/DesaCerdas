import { create } from "zustand";

const usePageStore = create((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePageStore;
