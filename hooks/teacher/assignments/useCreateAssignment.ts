import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";
import type { CreateAssignmentFormValues } from "@/validation/assignments";
import type { Assignment } from "@/types";

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  const { selectedCourseId } = useCourseStore();

  return useMutation({
    mutationFn: async (
      data: CreateAssignmentFormValues & { attachment?: string }
    ): Promise<Assignment> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.post<Assignment>("/teacher/assignments", {
        ...data,
        courseId: selectedCourseId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", "assignments", selectedCourseId],
      });
    },
  });
}
