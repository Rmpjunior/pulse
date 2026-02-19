import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  image: z.url().optional(),
});

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsedBody = await parseBody(request, updateUserSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const { name, image } = parsedBody.data;

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete user account
export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all user data
    await db.$transaction([
      // Delete block clicks
      db.blockClick.deleteMany({
        where: { block: { page: { userId: session.user.id } } },
      }),
      // Delete page views
      db.pageView.deleteMany({
        where: { page: { userId: session.user.id } },
      }),
      // Delete blocks
      db.block.deleteMany({
        where: { page: { userId: session.user.id } },
      }),
      // Delete pages
      db.page.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete subscription
      db.subscription.deleteMany({
        where: { userId: session.user.id },
      }),
      // Delete user
      db.user.delete({
        where: { id: session.user.id },
      }),
    ]);

    return NextResponse.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
