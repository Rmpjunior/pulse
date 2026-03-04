import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody, parseParams } from '@/lib/api/validation';
import { internalServerError, notFound, unauthorized } from '@/lib/api/errors';

interface RouteParams {
  params: Promise<{ pageId: string }>;
}

const routeParamsSchema = z.object({
  pageId: z.string().trim().min(1),
});

const updatePageSchema = z
  .object({
    displayName: z.string().trim().max(80).optional(),
    bio: z.string().max(500).optional(),
    theme: z.record(z.string(), z.unknown()).optional(),
    published: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

// GET - Get a specific page
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId } = parsedParams.data;
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
    }

    const page = await db.page.findUnique({
      where: { id: pageId, userId: session.user.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return notFound('Page not found');
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return internalServerError();
  }
}

// PATCH - Update a page
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId } = parsedParams.data;
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsedBody = await parseBody(request, updatePageSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { displayName, bio, theme, published } = parsedBody.data;

    // Verify ownership
    const existingPage = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return notFound('Page not found');
    }

    // Update the page
    const page = await db.page.update({
      where: { id: pageId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(theme !== undefined && { theme: theme as Prisma.InputJsonValue }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return internalServerError();
  }
}

// DELETE - Delete a page
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId } = parsedParams.data;
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
    }

    // Verify ownership
    const existingPage = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return notFound('Page not found');
    }

    await db.page.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ message: 'Page deleted' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return internalServerError();
  }
}
