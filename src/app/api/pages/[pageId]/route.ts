import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ pageId: string }>;
}

// GET - Get a specific page
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { pageId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a page
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { pageId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, bio, theme, published } = body;

    // Verify ownership
    const existingPage = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Update the page
    const page = await db.page.update({
      where: { id: pageId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(theme !== undefined && { theme }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a page
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { pageId } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingPage = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await db.page.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ message: 'Page deleted' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
