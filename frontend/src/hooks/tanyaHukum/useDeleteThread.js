import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteThread } from '../../services/apiHukum';

export const useDeleteThread = ( ) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteThread(id  ),
    onSuccess: () => {
      queryClient.invalidateQueries(['threads']);
    },
  });
};
