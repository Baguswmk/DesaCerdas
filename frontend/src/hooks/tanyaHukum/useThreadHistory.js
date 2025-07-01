import { useQuery } from '@tanstack/react-query';
import { getThreadHistory } from '../../services/apiHukum';

export const useThreadHistory = ( ) => {
  return useQuery({
    queryKey: ['threadHistory'],
    queryFn: () => getThreadHistory( ),
    enabled: true,
  });
};
