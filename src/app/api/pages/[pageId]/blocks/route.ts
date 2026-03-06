import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody, parseParams } from '@/lib/api/validation';
import { badRequest, internalServerError, notFound, unauthorized } from '@/lib/api/errors';

interface RouteParams {
  params: Promise<{ pageId: string }>;
}

const routeParamsSchema = z.object({
  pageId: z.string().trim().min(1),
});

const blockTypeSchema = z.enum([
  'LINK',
  'HIGHLIGHT',
  'MEDIA',
  'CATALOG',
  'FORM',
  'SOCIAL_ICONS',
  'TEXT',
  'DIVIDER',
]);

const createBlockSchema = z.object({
  type: blockTypeSchema,
  order: z.number().int().min(0),
  content: z.record(z.string(), z.unknown()).optional(),
});

const reorderBlocksSchema = z.object({
  blocks: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        order: z.number().int().min(0),
      }),
    )
    .min(1),
});

// GET - Get all blocks for a page
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

    // Verify page ownership
    const page = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.userId !== session.user.id) {
      return notFound('Página não encontrada');
    }

    const blocks = await db.block.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return internalServerError();
  }
}

// POST - Create a new block
export async function POST(request: Request, { params }: RouteParams) {
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

    const parsedBody = await parseBody(request, createBlockSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { type, order, content = {} } = parsedBody.data;

    // Verify page ownership
    const page = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.userId !== session.user.id) {
      return notFound('Página não encontrada');
    }

    // Create the block
    const block = await db.block.create({
      data: {
        pageId,
        type,
        order,
        content: content as Prisma.InputJsonValue,
        visible: true,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return internalServerError();
  }
}

// PATCH - Reorder blocks
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

    const parsedBody = await parseBody(request, reorderBlocksSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { blocks } = parsedBody.data;

    // Verify page ownership
    const page = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.userId !== session.user.id) {
      return notFound('Página não encontrada');
    }

    const blockIds = blocks.map((block) => block.id);
    const uniqueBlockIds = new Set(blockIds);

    if (uniqueBlockIds.size !== blockIds.length) {
      return badRequest('Duplicate block ids are not allowed');
    }

    const ownedBlocksCount = await db.block.count({
      where: {
        id: { in: blockIds },
        pageId,
      },
    });

    if (ownedBlocksCount !== blockIds.length) {
      return notFound('One or more blocks were not found for this page');
    }

    // Update block orders
    await Promise.all(
      blocks.map((block) =>
        db.block.update({
          where: { id: block.id },
          data: { order: block.order },
        }),
      ),
    );

    return NextResponse.json({ message: 'Blocos reordenados' });
  } catch (error) {
    console.error('Error reordering blocks:', error);
    return internalServerError();
  }
}
