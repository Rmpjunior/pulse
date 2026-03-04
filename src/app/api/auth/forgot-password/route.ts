import { randomUUID } from 'node:crypto';
import { addHours } from 'date-fns';
import { z } from 'zod';
import { db } from '@/lib/db';
import { parseBody } from '@/lib/api/validation';
import { internalServerError } from '@/lib/api/errors';

const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export async function POST(request: Request) {
  try {
    const parsedBody = await parseBody(request, forgotPasswordSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const { email } = parsedBody.data;

    const user = await db.user.findUnique({ where: { email } });

    // Always return success-like response to prevent account enumeration
    if (!user || !user.password) {
      return Response.json({ ok: true });
    }

    const token = randomUUID();
    const expires = addHours(new Date(), 1);

    await db.verificationToken.create({
      data: {
        identifier: `password-reset:${email}`,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Placeholder for email provider integration
    console.info('[password-reset] generated link', { email, resetUrl, expires });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Error creating password reset token:', error);
    return internalServerError();
  }
}
