import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapEvent } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter')?.toLowerCase();

    let sql = 'SELECT * FROM events';
    const params: any[] = [];

    if (filter === 'upcoming') {
      sql += " WHERE status = 'UPCOMING' OR is_upcoming = true";
    } else if (filter === 'live') {
      sql += " WHERE status = 'LIVE' OR is_live = true";
    } else if (filter === 'completed') {
      sql += " WHERE status = 'COMPLETED' OR (is_upcoming = false AND is_live = false)";
    }

    sql += ' ORDER BY date ASC';

    const res = await query(sql, params);
    const events = res.rows.map(mapEvent);

    return NextResponse.json({
      success: true,
      total: events.length,
      events
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
