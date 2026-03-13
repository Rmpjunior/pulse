import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody, parseParams } from '@/lib/api/validation';
import { internalServerError, notFound, unauthorized } from '@/lib/api/errors';

interface RouteParams {
  params: Promise<{ pageId: string; blockId: string }>;
}

const routeParamsSchema = z.object({
  pageId: z.string().trim().min(1),
  blockId: z.string().trim().min(1),
});

const updateBlockSchema = z
  .object({
    content: z.record(z.string(), z.unknown()).optional(),
    visible: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser informado',
  });

async function findOwnedBlock(params: {
  blockId: string;
  pageId: string;
  userId: string;
}) {
  const { blockId, pageId, userId } = params;

  return db.block.findFirst({
    where: {
      id: blockId,
      pageId,
      page: {
        userId,
      },
    },
    include: {
      page: {
        select: { userId: true, id: true },
      },
    },
  });
}

// GET - Get a specific block
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId, blockId } = parsedParams.data;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const block = await findOwnedBlock({
      blockId,
      pageId,
      userId: session.user.id,
    });

    if (!block) {
      return notFound('Block not found');
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    return internalServerError();
  }
}

// PATCH - Update a block
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId, blockId } = parsedParams.data;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsedBody = await parseBody(request, updateBlockSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { content, visible, order } = parsedBody.data;

    // Verify ownership
    const existingBlock = await findOwnedBlock({
      blockId,
      pageId,
      userId: session.user.id,
    });

    if (!existingBlock) {
      return notFound('Block not found');
    }

    // Update the block
    const block = await db.block.update({
      where: { id: blockId },
      data: {
        ...(content !== undefined && {
          content: content as Prisma.InputJsonValue,
        }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return internalServerError();
  }
}

// DELETE - Delete a block
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const parsedParams = parseParams(await params, routeParamsSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }
    const { pageId, blockId } = parsedParams.data;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    // Verify ownership
    const existingBlock = await findOwnedBlock({
      blockId,
      pageId,
      userId: session.user.id,
    });

    if (!existingBlock) {
      return notFound('Block not found');
    }

    // Delete the block
    await db.block.delete({
      where: { id: blockId },
    });

    // Reorder remaining blocks
    const remainingBlocks = await db.block.findMany({
      where: { pageId: existingBlock.page.id },
      orderBy: { order: 'asc' },
    });

    await Promise.all(
      remainingBlocks.map((block, index) =>
        db.block.update({
          where: { id: block.id },
          data: { order: index },
        }),
      ),
    );

    return NextResponse.json({ message: 'Módulo excluído' });
  } catch (error) {
    console.error('Error deleting block:', error);
    return internalServerError();
  }
}
