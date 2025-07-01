import { create } from "zustand";
import axios from "axios";

const useHukumStore = create((set) => ({
  questions: [],
  isLoading: false,
  error: null,

  fetchQuestions: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/api/hukum");
      set({ questions: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  askQuestion: async (questionText) => {
    set({ isLoading: true });
    try {
      const res = await axios.post("/api/hukum", { question: questionText });
      set((state) => ({
        questions: [res.data, ...state.questions],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useHukumStore;
