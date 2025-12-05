import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  initials: string;
  email: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async (): Promise<Student[]> => {
      const response = await api.get<Student[]>('/teacher/students');
      return response.data;
    },
  });
}

