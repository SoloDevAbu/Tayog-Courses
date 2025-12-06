import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";

export interface StudentAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attachment?: string | null;
  status: "pending" | "submitted" | "graded";
  submission?: string | null;
  submittedFile?: string | null;
  feedback?: string | null;
  grade?: string | null;
}

export function useAssignments() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["student", "assignments", selectedCourseId],
    queryFn: async (): Promise<StudentAssignment[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<StudentAssignment[]>(
        `/student/assignments?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
