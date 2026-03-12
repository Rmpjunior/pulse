import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';

const waitlistSchema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const parsedBody = await parseBody(request, waitlistSchema);
  if (!parsedBody.success) {
    return parsedBody.response;
  }

  const { email } = parsedBody.data;

  const existing = await db.waitlistEntry.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'already_on_waitlist' });
  }

  await db.waitlistEntry.create({ data: { email } });

  return NextResponse.json({ message: 'added' });
}
