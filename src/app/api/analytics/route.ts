import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Get analytics for user's page
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get user's page
    const page = await db.page.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!page) {
      return NextResponse.json({ 
        views: 0, 
        clicks: 0, 
        viewsData: [], 
        clicksData: [],
        topBlocks: [],
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get page views
    const pageViews = await db.pageView.findMany({
      where: {
        pageId: page.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get block clicks
    const blockClicks = await db.blockClick.findMany({
      where: {
        block: { pageId: page.id },
        createdAt: { gte: startDate },
      },
      include: {
        block: {
          select: {
            id: true,
            type: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Aggregate views by day
    const viewsByDay = aggregateByDay(pageViews.map(v => v.createdAt), days);
    
    // Aggregate clicks by day
    const clicksByDay = aggregateByDay(blockClicks.map(c => c.createdAt), days);

    // Get top blocks by clicks
    const blockClickCounts = blockClicks.reduce((acc, click) => {
      const blockId = click.block.id;
      if (!acc[blockId]) {
        acc[blockId] = {
          id: blockId,
          type: click.block.type,
          label: getBlockLabel(click.block),
          clicks: 0,
        };
      }
      acc[blockId].clicks++;
      return acc;
    }, {} as Record<string, { id: string; type: string; label: string; clicks: number }>);

    const topBlocks = Object.values(blockClickCounts)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    return NextResponse.json({
      views: pageViews.length,
      clicks: blockClicks.length,
      viewsData: viewsByDay,
      clicksData: clicksByDay,
      topBlocks,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function aggregateByDay(timestamps: Date[], days: number) {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = timestamps.filter(t => {
      const tDate = new Date(t).toISOString().split('T')[0];
      return tDate === dateStr;
    }).length;
    
    result.push({ date: dateStr, count });
  }
  
  return result;
}

function getBlockLabel(block: { type: string; content: unknown }): string {
  const content = block.content as Record<string, unknown>;
  
  switch (block.type) {
    case 'LINK':
      return (content.label as string) || 'Link';
    case 'HIGHLIGHT':
      return (content.title as string) || 'Destaque';
    case 'TEXT':
      return ((content.text as string) || 'Texto').slice(0, 30);
    default:
      return block.type;
  }
}
