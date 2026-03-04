import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';
import { conflict, internalServerError, unauthorized } from '@/lib/api/errors';

const createPageSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]{3,20}$/, 'Invalid username format'),
  displayName: z.string().trim().max(80).optional(),
  bio: z.string().max(500).optional(),
});

// GET - Get user's page
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
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
    return internalServerError();
  }
}

// POST - Create a new page
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsedBody = await parseBody(request, createPageSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { username, displayName, bio } = parsedBody.data;

    // Check if username is taken
    const existingPage = await db.page.findUnique({
      where: { username },
    });

    if (existingPage) {
      return conflict('Username already taken');
    }

    // Check if user already has a page
    const userPage = await db.page.findFirst({
      where: { userId: session.user.id },
    });

    if (userPage) {
      return conflict('User already has a page');
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
    return internalServerError();
  }
}
