import { useQuery } from '@tanstack/react-query';
import { fetchThreads } from '../../services/apiHukum';

export const useThreads = ( ) => {
  return useQuery({
    queryKey: ['threads'],
    queryFn: () => fetchThreads( ),
    enabled: true, 
  });
};
