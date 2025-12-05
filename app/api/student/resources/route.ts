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
        resources: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const resources = courses.flatMap((course) =>
      course.resources.map((resource) => ({
        success: true,
        id: resource.id,
        title: resource.title,
        type: resource.type,
        attachment: resource.attachment,
        createdAt: resource.createdAt.toISOString(),
      }))
    );

    return NextResponse.json(resources);
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

