// frontend/src/hooks/tanyaHukum/useGuestUsage.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuestUsage, askGuestQuestion } from '../../services/apiHukum';

// Hook untuk mendapatkan usage guest user
export const useGuestUsage = () => {
  return useQuery({
    queryKey: ['guestUsage'],
    queryFn: getGuestUsage,
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook untuk mengirim pertanyaan guest
export const useAskGuestQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (question) => askGuestQuestion(question),
    onSuccess: () => {
      // Refresh usage after successful question
      queryClient.invalidateQueries(['guestUsage']);
    },
    onError: (error) => {
      console.error('Guest question error:', error);
    }
  });
};