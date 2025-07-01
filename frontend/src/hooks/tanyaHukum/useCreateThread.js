import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createThread as createThreadAPI } from "@/services/apiHukum";

export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title) => createThreadAPI(title),
    onSuccess: () => {
      queryClient.invalidateQueries(["threads"]);
    },
  });
};
