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
    select: (response) => response.data
  });
};

export const useDetailKegiatan = (id) => {
  return useQuery({
    queryKey: ["detail-kegiatan", id],
    queryFn: () => getDetailKegiatan(id),
    enabled: !!id,
    select: (response) => response.data
  });
};

export const useCreateKegiatan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKegiatan,
    onSuccess: () => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
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
    }
  });
};

export const useDeleteKegiatan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKegiatan,
    onSuccess: () => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
    }
  });
};