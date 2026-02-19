import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody, parseParams } from '@/lib/api/validation';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify page ownership
    const page = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.userId !== session.user.id) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const blocks = await db.block.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Update block orders
    await Promise.all(
      blocks.map((block: { id: string; order: number }) =>
        db.block.update({
          where: { id: block.id },
          data: { order: block.order },
        })
      )
    );

    return NextResponse.json({ message: 'Blocks reordered' });
  } catch (error) {
    console.error('Error reordering blocks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
