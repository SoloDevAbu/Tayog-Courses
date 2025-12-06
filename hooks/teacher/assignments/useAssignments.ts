import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";
import type { Assignment } from "@/types";

export function useAssignments() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["teacher", "assignments", selectedCourseId],
    queryFn: async (): Promise<Assignment[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<Assignment[]>(
        `/teacher/assignments?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
