import { create } from "zustand";

const useFarmSmartStore = create((set) => ({
  location: "Pringsewu Barat, Pringsewu",
  plant: "",
  date: new Date(),
  question: "",
  savedResults: [],

  setLocation: (val) => set({ location: val }),
  setPlant: (val) => set({ plant: val }),
  setDate: (val) => set({ date: val }),
  setQuestion: (val) => set({ question: val }),
  addResult: (result) =>
    set((state) => ({
      savedResults: [...state.savedResults, result],
    })),
}));

export default useFarmSmartStore;
