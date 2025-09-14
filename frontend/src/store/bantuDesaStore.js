import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBantuDesaStore = create(
  persist(
    (set, get) => ({
      // State untuk kegiatan
      kegiatan: [],
      kegiatanDetail: null,
      kegiatanFilters: {
        status: "AKTIF",
        search: "",
        page: 1,
        limit: 9,
      },
      kegiatanLoading: false,
      kegiatanError: null,

      // State untuk donasi
      donasi: [],
      donasiPending: [],
      donasiHistory: [],
      donasiLoading: false,
      donasiError: null,

      // State untuk form donasi
      donasiForm: {
        amount: "",
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        isAnonymous: false,
        message: "",
        bukti_transfer_url: "",
      },

      // State untuk admin dashboard
      dashboardStats: {
        totalKegiatan: 0,
        kegiatanAktif: 0,
        kegiatanSelesai: 0,
        totalDonasi: 0,
        donasiPending: 0,
        donasiApproved: 0,
        totalDanaTermasuk: 0,
        totalDanaPending: 0,
      },

      // Actions untuk kegiatan
      setKegiatan: (kegiatan) => set({ kegiatan }),
      setKegiatanDetail: (detail) => set({ kegiatanDetail: detail }),
      setKegiatanFilters: (filters) =>
        set((state) => ({
          kegiatanFilters: { ...state.kegiatanFilters, ...filters },
        })),
      setKegiatanLoading: (loading) => set({ kegiatanLoading: loading }),
      setKegiatanError: (error) => set({ kegiatanError: error }),

      // Actions untuk donasi
      setDonasi: (donasi) => set({ donasi }),
      setDonasiPending: (pending) => set({ donasiPending: pending }),
      setDonasiHistory: (history) => set({ donasiHistory: history }),
      setDonasiLoading: (loading) => set({ donasiLoading: loading }),
      setDonasiError: (error) => set({ donasiError: error }),

      // Actions untuk form donasi
      updateDonasiForm: (data) =>
        set((state) => ({
          donasiForm: { ...state.donasiForm, ...data },
        })),
      resetDonasiForm: () =>
        set({
          donasiForm: {
            amount: "",
            donorName: "",
            donorEmail: "",
            donorPhone: "",
            isAnonymous: false,
            message: "",
            bukti_transfer_url: "",
          },
        }),

      // Actions untuk dashboard stats
      updateDashboardStats: (stats) => set({ dashboardStats: stats }),
      calculateDashboardStats: () => {
        const { kegiatan, donasiPending } = get();

        const safeKegiatan = Array.isArray(kegiatan) ? kegiatan : [];
        const safeDonasi = Array.isArray(donasiPending) ? donasiPending : [];

        const totalKegiatan = safeKegiatan.filter(
          (k) => k.status === "AKTIF"
        ).length;
        const totalDonasiPending = safeDonasi.filter(
          (d) => d.status === "PENDING"
        ).length;

        set({
          stats: {
            totalKegiatan,
            totalDonasiPending,
            totalKegiatanSelesai: safeKegiatan.filter(
              (k) => k.status === "SELESAI"
            ).length,
          },
        });
      },

      // Action untuk clear semua data
      clearAll: () =>
        set({
          kegiatan: [],
          kegiatanDetail: null,
          donasi: [],
          donasiPending: [],
          donasiHistory: [],
          kegiatanError: null,
          donasiError: null,
        }),
    }),
    {
      name: "bantu-desa-storage",
      partialize: (state) => ({
        kegiatanFilters: state.kegiatanFilters,
        donasiForm: state.donasiForm,
      }),
    }
  )
);

export default useBantuDesaStore;
