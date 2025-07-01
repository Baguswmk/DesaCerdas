import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../../services/apiHukum';

export const useThreadMessages = (threadId ) => {
  return useQuery({
    queryKey: ['threadMessages', threadId],
    queryFn: () => getMessages(threadId  ),
    enabled: !!threadId ,
  });
};
