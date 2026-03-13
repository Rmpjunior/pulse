import { afterAll, describe, expect, it } from 'vitest';
import { config } from 'dotenv';

config({ path: '.env.local' });

import { db } from '@/lib/db';

const shouldRunDbSmoke =
  process.env.RUN_DB_SMOKE_TESTS === 'true' && Boolean(process.env.DATABASE_URL);
const testSuite = shouldRunDbSmoke ? describe : describe.skip;

let createdUserId: string | null = null;

testSuite('multi-site stress smoke (3 pages + context switch + publish sequence)', () => {
  afterAll(async () => {
    if (createdUserId) {
      await db.user.delete({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  it('handles 3 pages with repeated pageId switches and publish toggles', async () => {
    const nonce = Date.now().toString(36);

    const user = await db.user.create({
      data: {
        email: `multisite-${nonce}@pulse.local`,
        name: 'Multi Site QA',
        password: 'not-used-in-this-test',
      },
    });
    createdUserId = user.id;

    const pages = await Promise.all(
      [1, 2, 3].map((n) =>
        db.page.create({
          data: {
            userId: user.id,
            username: `multi-${nonce}-${n}`,
            displayName: `Multi Site ${n}`,
            bio: `Bio ${n}`,
            theme: {},
            published: false,
          },
        }),
      ),
    );

    // Simula alternância de contexto por pageId com updates em sequência
    for (let i = 0; i < 6; i += 1) {
      const page = pages[i % pages.length];

      await db.block.create({
        data: {
          pageId: page.id,
          type: 'LINK',
          order: i,
          visible: true,
          content: {
            title: `Link ${i}`,
            url: `https://example.com/${i}`,
          },
        },
      });

      await db.page.update({
        where: { id: page.id },
        data: {
          bio: `Bio updated ${i}`,
          published: i % 2 === 0,
        },
      });

      const contextPage = await db.page.findUnique({
        where: { id: page.id },
        include: { blocks: true },
      });

      expect(contextPage).not.toBeNull();
      expect(contextPage?.id).toBe(page.id);
      expect(contextPage?.blocks.length).toBeGreaterThan(0);
    }

    // Publicar todas em sequência (simula salvar/publicar por página)
    for (const page of pages) {
      await db.page.update({
        where: { id: page.id },
        data: { published: true },
      });
    }

    const publishedCount = await db.page.count({
      where: {
        userId: user.id,
        published: true,
      },
    });

    expect(publishedCount).toBe(3);
  });
});
