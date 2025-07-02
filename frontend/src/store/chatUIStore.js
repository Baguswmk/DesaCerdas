import { create } from 'zustand';

const useChatUIStore = create((set) => ({
  renameThreadId: null,
  renameInput: "",
  activeThreadId: null, 
  setRenameThreadId: (id) => set({ renameThreadId: id }),
  setRenameInput: (input) => set({ renameInput: input }),
  closeRenameModal: () =>
    set({ renameThreadId: null, renameInput: "" }),
  setActiveThreadId: (id) => set({ activeThreadId: id }),
    sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useChatUIStore;
