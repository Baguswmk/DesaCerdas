import { useMutation } from "@tanstack/react-query";
import { createFarmAnalysis } from "@/services/apiFarm";

export const useCreateFarmAnalysis = () => {
  return useMutation({
    mutationFn: createFarmAnalysis,
  });
};
