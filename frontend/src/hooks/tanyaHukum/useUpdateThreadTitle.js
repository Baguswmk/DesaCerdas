import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateThreadTitle } from '../../services/apiHukum';

export const useUpdateThreadTitle = ( ) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, title }) => updateThreadTitle(threadId, title  ),
    onSuccess: () => {
      queryClient.invalidateQueries(['threads']);
    },
  });
};
