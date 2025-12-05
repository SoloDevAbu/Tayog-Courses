import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getSession";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        students: {
          some: { id: user.id },
        },
      },
      include: {
        assignments: {
          include: {
            submissions: {
              where: { studentId: user.id },
              include: {
                feedback: true,
              },
            },
          },
          orderBy: { dueDate: "asc" },
        },
      },
    });

    const assignments = courses.flatMap((course) =>
      course.assignments.map((assignment) => {
        const submission = assignment.submissions[0];
        const hasSubmission = !!submission;
        const hasFeedback = !!submission?.feedback;

        let status: "pending" | "submitted" | "graded" = "pending";
        if (hasFeedback) {
          status = "graded";
        } else if (hasSubmission) {
          status = "submitted";
        }

        return {
          success: true,
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate.toISOString(),
          attachment: assignment.attachment,
          status,
          submission: submission?.summary || null,
          submittedFile: submission?.fileUrl || null,
          feedback: submission?.feedback?.comment || null,
          grade: submission?.feedback?.grade
            ? `${submission.feedback.grade}/100`
            : null,
        };
      })
    );

    return NextResponse.json(assignments);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

