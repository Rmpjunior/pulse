import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';
import { badRequest, internalServerError, unauthorized } from '@/lib/api/errors';

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  image: z.url().optional(),
});

const deleteUserSchema = z.object({
  confirmation: z.literal('DELETE_MY_ACCOUNT'),
  password: z.string().min(6).optional(),
});

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return unauthorized();
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
    return internalServerError();
  }
}

// DELETE - Delete user account
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsedBody = await parseBody(request, deleteUserSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const { password } = parsedBody.data;

    const existingUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (existingUser?.password) {
      if (!password) {
        return badRequest('Password is required to delete this account');
      }

      const passwordValid = await bcrypt.compare(password, existingUser.password);
      if (!passwordValid) {
        return badRequest('Invalid password');
      }
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
    return internalServerError();
  }
}
