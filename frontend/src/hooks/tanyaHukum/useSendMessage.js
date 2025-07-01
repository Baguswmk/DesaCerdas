import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../../services/apiHukum';

export const useSendMessage = ( ) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, message }) => sendMessage(threadId, message ),
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries(['threadMessages', threadId]);
    },
  });
};
