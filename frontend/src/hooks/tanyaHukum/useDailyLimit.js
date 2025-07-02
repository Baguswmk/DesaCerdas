import { useQuery } from '@tanstack/react-query';
import { getTodayQuestionCount } from '../../services/apiHukum';

export const useDailyLimit = () => {
  return useQuery({
    queryKey: ['dailyLimit'],
    queryFn: () => getTodayQuestionCount(),
    enabled: true,
  });
}