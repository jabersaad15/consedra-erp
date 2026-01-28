import { useQuery as useRQ, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useList<T = any>(key: string, endpoint: string) {
  return useRQ<T[]>({ queryKey: [key], queryFn: () => api(endpoint) });
}

export function useDetail<T = any>(key: string, endpoint: string) {
  return useRQ<T>({ queryKey: [key], queryFn: () => api(endpoint) });
}

export function useCreate(key: string, endpoint: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
