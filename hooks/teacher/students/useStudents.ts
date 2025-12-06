import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";
import type { Student } from "@/types";

export function useStudents() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["teacher", "students", selectedCourseId],
    queryFn: async (): Promise<Student[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<Student[]>(
        `/teacher/students?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
