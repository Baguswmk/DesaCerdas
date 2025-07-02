import { useQuery } from "@tanstack/react-query";
import { getFarmAnalysis } from "@/services/apiFarm";

export const useGetFarmAnalysis = (farmEntryId, options = {}) => {
  return useQuery({
    queryKey: ["farm-analysis", farmEntryId],
    queryFn: () => getFarmAnalysis(farmEntryId),
    enabled: !!farmEntryId,
    ...options,
  });
};
