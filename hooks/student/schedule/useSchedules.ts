import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";

export interface StudentSchedule {
  id: string;
  subject: string;
  topic: string;
  time: string;
  meetingLink: string;
}

export function useSchedules() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["student", "schedule", selectedCourseId],
    queryFn: async (): Promise<StudentSchedule[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<StudentSchedule[]>(
        `/student/schedule?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
