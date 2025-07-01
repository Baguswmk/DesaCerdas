import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchThreads,
  createThread,
  sendMessage,
  getMessages,
  getThreadHistory,
  updateThreadTitle,
  deleteThread,
} from '@/services/legalApi';
