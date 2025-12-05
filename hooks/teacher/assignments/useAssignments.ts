import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attachment?: string | null;
  submissions: number;
}

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async (): Promise<Assignment[]> => {
      const response = await api.get<Assignment[]>('/teacher/assignments');
      return response.data;
    },
  });
}

