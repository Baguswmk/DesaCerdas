import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDonasi,
  getDonasiPending,
  verifyDonasi,
  getDonasiHistory
} from "@/services/apiBantuDesa";

export const useCreateDonasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kegiatanId, data }) => createDonasi(kegiatanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["kegiatan-aktif"]);
    }
  });
};

export const useDonasiPending = () => {
  return useQuery({
    queryKey: ["donasi-pending"],
    queryFn: getDonasiPending,
    select: (response) => response.data
  });
};

export const useVerifyDonasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ donasiId, data }) => verifyDonasi(donasiId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["donasi-pending"]);
      queryClient.invalidateQueries(["kegiatan-aktif"]);
    }
  });
};

export const useDonasiHistory = () => {
  return useQuery({
    queryKey: ["donasi-history"],
    queryFn: getDonasiHistory,
    select: (response) => response.data
  });
};
