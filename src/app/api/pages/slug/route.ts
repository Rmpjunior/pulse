import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseQuery } from '@/lib/api/validation';
import { internalServerError, unauthorized } from '@/lib/api/errors';

const slugQuerySchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]{3,20}$/),
  pageId: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = parseQuery(searchParams, slugQuerySchema);
    if (!parsedQuery.success) {
      return parsedQuery.response;
    }

    const { slug, pageId } = parsedQuery.data;

    const existing = await db.page.findUnique({
      where: { username: slug },
      select: { id: true, userId: true },
    });

    const available =
      !existing ||
      (existing.userId === session.user.id && (!pageId || existing.id === pageId));

    return Response.json({ available });
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return internalServerError();
  }
}
