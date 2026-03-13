import { afterAll, describe, expect, it } from 'vitest';
import { config } from 'dotenv';

config({ path: '.env.local' });

import { db } from '@/lib/db';

const shouldRunDbSmoke =
  process.env.RUN_DB_SMOKE_TESTS === 'true' && Boolean(process.env.DATABASE_URL);
const testSuite = shouldRunDbSmoke ? describe : describe.skip;

let createdUserId: string | null = null;

testSuite('creator journey smoke (create -> edit -> publish -> view)', () => {
  afterAll(async () => {
    if (createdUserId) {
      await db.user.delete({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  it('completes the core lifecycle with persisted data', async () => {
    const nonce = Date.now().toString(36);

    const user = await db.user.create({
      data: {
        email: `smoke-${nonce}@pulse.local`,
        name: 'Smoke Tester',
        password: 'not-used-in-this-test',
      },
    });
    createdUserId = user.id;

    const page = await db.page.create({
      data: {
        userId: user.id,
        username: `smoke-${nonce}`,
        displayName: 'Smoke Site',
        bio: 'Initial bio',
        theme: {},
        published: false,
      },
    });

    const block = await db.block.create({
      data: {
        pageId: page.id,
        type: 'LINK',
        order: 0,
        visible: true,
        content: {
          title: 'Initial link',
          url: 'https://example.com',
        },
      },
    });

    await db.page.update({
      where: { id: page.id },
      data: {
        displayName: 'Smoke Site Updated',
        bio: 'Updated bio',
      },
    });

    await db.block.update({
      where: { id: block.id },
      data: {
        content: {
          title: 'Updated link',
          url: 'https://openclaw.ai',
        },
      },
    });

    await db.page.update({
      where: { id: page.id },
      data: { published: true },
    });

    const publishedPage = await db.page.findFirst({
      where: {
        id: page.id,
        published: true,
      },
      include: {
        blocks: {
          where: { visible: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    expect(publishedPage).not.toBeNull();
    expect(publishedPage?.displayName).toBe('Smoke Site Updated');
    expect(publishedPage?.blocks).toHaveLength(1);
    expect(publishedPage?.blocks[0]?.content).toMatchObject({
      title: 'Updated link',
      url: 'https://openclaw.ai',
    });
  });
});
