import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useCourseStore } from "@/lib/courseStore";

export interface StudentResource {
  id: string;
  title: string;
  type: "PDF_DOCUMENT" | "VIDEO_CLASS" | "IMAGE";
  attachment: string;
  createdAt: string;
}

export function useResources() {
  const { selectedCourseId } = useCourseStore();

  return useQuery({
    queryKey: ["student", "resources", selectedCourseId],
    queryFn: async (): Promise<StudentResource[]> => {
      if (!selectedCourseId) {
        throw new Error("Course ID is required");
      }
      const response = await api.get<StudentResource[]>(
        `/student/resources?courseId=${selectedCourseId}`
      );
      return response.data;
    },
    enabled: !!selectedCourseId,
  });
}
