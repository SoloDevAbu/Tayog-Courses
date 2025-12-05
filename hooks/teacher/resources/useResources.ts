import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Resource {
  id: string;
  title: string;
  type: 'PDF_DOCUMENT' | 'VIDEO_CLASS' | 'IMAGE';
  attachment: string;
  createdAt: string;
}

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async (): Promise<Resource[]> => {
      const response = await api.get<Resource[]>('/teacher/resources');
      return response.data;
    },
  });
}

