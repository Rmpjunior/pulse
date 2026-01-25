import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Track a block click
export async function POST(request: Request) {
  try {
    const { blockId } = await request.json();

    if (!blockId) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 });
    }

    // Verify the block exists
    const block = await db.block.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    // Generate a simple visitor ID
    const visitorId = Math.random().toString(36).substring(2, 15);

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
