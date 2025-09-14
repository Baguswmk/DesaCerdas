import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getKegiatanAktif,
  getDetailKegiatan,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan
} from "@/services/apiBantuDesa";

export const useKegiatanAktif = (params = {}) => {
  return useQuery({
    queryKey: ["kegiatan-aktif", params],
    queryFn: () => getKegiatanAktif(params),
    select: (response) => {
      // Backend response structure: { success: true, data: { data: [...], total: number } }
      return {
        data: response.data?.data || [],
        total: response.data?.total || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 menit
    cacheTime: 10 * 60 * 1000, // 10 menit
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Utility function untuk safe JSON parsing
const safeJSONParse = (jsonString, fallback = null) => {
  try {
    if (!jsonString || jsonString.trim() === '' || jsonString === 'null') {
      return fallback;
    }
    // Jika sudah berupa object, return as is
    if (typeof jsonString === 'object') {
      return jsonString;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON in hook:', jsonString, error);
    return fallback;
  }
};

export const useDetailKegiatan = (id) => {
  return useQuery({
    queryKey: ["detail-kegiatan", id],
    queryFn: () => getDetailKegiatan(id),
    enabled: !!id,
    select: (response) => {
      // Backend response structure bisa bervariasi
      const kegiatan = response.data?.data || response.data;
      
      if (!kegiatan) return null;
      
      // Safe parse JSON fields
      const parsedKegiatan = {
        ...kegiatan,
        jadwal: safeJSONParse(kegiatan.jadwal, []),
        persyaratan: safeJSONParse(kegiatan.persyaratan, {}),
        galeri: safeJSONParse(kegiatan.galeri, []),
        progress_percentage: kegiatan.progress_percentage || (
          kegiatan.target_dana > 0 
            ? Math.round(((kegiatan.dana_terkumpul || 0) / kegiatan.target_dana) * 100)
            : 0
        )
      };

      return parsedKegiatan;
    },
    staleTime: 2 * 60 * 1000, // 2 menit
    retry: 2,
    onError: (error) => {
      console.error('Detail Kegiatan Error:', error);
    }
  });
};

export const useCreateKegiatan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKegiatan,
    onSuccess: () => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
    },
    onError: (error) => {
      console.error("Create Kegiatan Error:", error);
    }
  });
};

export const useUpdateKegiatan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKegiatan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
      queryClient.invalidateQueries(["detail-kegiatan", id]);
    },
    onError: (error) => {
      console.error("Update Kegiatan Error:", error);
    }
  });
};

export const useDeleteKegiatan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKegiatan,
    onSuccess: () => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
    },
    onError: (error) => {
      console.error("Delete Kegiatan Error:", error);
    }
  });
};