import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/axios';
import { updateProfileSchema, type UpdateProfileFormValues } from '@/validation/auth/profile.schema';

interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'TEACHER' | 'STUDENT';
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileFormValues): Promise<UpdateProfileResponse> => {
      const response = await api.patch<UpdateProfileResponse>('/profile', {
        name: data.name,
      });
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

