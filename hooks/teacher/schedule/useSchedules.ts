import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";
import type { Schedule } from "@/types";

export function useSchedules() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["teacher", "schedules", selectedCourseId],
    queryFn: async (): Promise<Schedule[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<Schedule[]>(
        `/teacher/schedule?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
