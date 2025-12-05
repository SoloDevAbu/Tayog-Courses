import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Schedule {
  id: string;
  subject: string;
  topic: string;
  time: string;
  meetingLink: string;
}

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async (): Promise<Schedule[]> => {
      const response = await api.get<Schedule[]>('/teacher/schedule');
      return response.data;
    },
  });
}

