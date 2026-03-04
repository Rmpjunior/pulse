import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';
import { internalServerError, notFound } from '@/lib/api/errors';
import { resolveVisitorIdFromHeaders } from '@/lib/analytics/visitor';

const clickSchema = z.object({
  blockId: z.string().trim().min(1),
});

// POST - Track a block click
export async function POST(request: Request) {
  try {
    const parsedBody = await parseBody(request, clickSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { blockId } = parsedBody.data;

    // Verify the block exists
    const block = await db.block.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      return notFound('Block not found');
    }

    const visitorId = resolveVisitorIdFromHeaders(request.headers);

    // Create the click record
    await db.blockClick.create({
      data: {
        blockId,
        visitorId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return internalServerError();
  }
}
