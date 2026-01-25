import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ pageId: string; blockId: string }>;
}

// GET - Get a specific block
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const block = await db.block.findUnique({
      where: { id: blockId },
      include: {
        page: {
          select: { userId: true },
        },
      },
    });

    if (!block || block.page.userId !== session.user.id) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a block
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, visible, order } = body;

    // Verify ownership
    const existingBlock = await db.block.findUnique({
      where: { id: blockId },
      include: {
        page: {
          select: { userId: true },
        },
      },
    });

    if (!existingBlock || existingBlock.page.userId !== session.user.id) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    // Update the block
    const block = await db.block.update({
      where: { id: blockId },
      data: {
        ...(content !== undefined && { content }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a block
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingBlock = await db.block.findUnique({
      where: { id: blockId },
      include: {
        page: {
          select: { userId: true, id: true },
        },
      },
    });

    if (!existingBlock || existingBlock.page.userId !== session.user.id) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
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
        })
      )
    );

    return NextResponse.json({ message: 'Block deleted' });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
