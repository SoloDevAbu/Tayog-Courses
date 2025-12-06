import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";
import type { ScheduleClassFormValues } from "@/validation/schedule";
import type { Schedule } from "@/types";

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const { selectedCourseId } = useCourseStore();

  return useMutation({
    mutationFn: async (data: ScheduleClassFormValues): Promise<Schedule> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.post<Schedule>("/teacher/schedule", {
        ...data,
        courseId: selectedCourseId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", "schedules", selectedCourseId],
      });
    },
  });
}
