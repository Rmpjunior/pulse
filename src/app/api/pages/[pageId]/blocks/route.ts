import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ pageId: string }>;
}

// GET - Get all blocks for a page
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { pageId } = await params;
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
    const { pageId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, order, content = {} } = await request.json();

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
        content,
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
    const { pageId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blocks } = await request.json();

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
