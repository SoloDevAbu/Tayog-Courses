import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getSession';
import { updateProfileSchema } from '@/validation/auth/profile.schema';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: 'Profile updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.issues
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

