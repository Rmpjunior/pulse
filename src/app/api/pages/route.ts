import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Get user's page
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await db.page.findFirst({
      where: { userId: session.user.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new page
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, displayName, bio } = await request.json();

    // Validate username
    if (!username || !/^[a-z0-9_-]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingPage = await db.page.findUnique({
      where: { username },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Check if user already has a page
    const userPage = await db.page.findFirst({
      where: { userId: session.user.id },
    });

    if (userPage) {
      return NextResponse.json(
        { error: 'User already has a page' },
        { status: 400 }
      );
    }

    // Create the page
    const page = await db.page.create({
      data: {
        userId: session.user.id,
        username,
        displayName,
        bio,
        theme: {},
        published: false,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
