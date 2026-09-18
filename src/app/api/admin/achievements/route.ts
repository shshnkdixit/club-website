import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapAchievement } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM achievements ORDER BY year DESC');
    const achievements = res.rows.map(mapAchievement);
    return NextResponse.json({ success: true, total: achievements.length, achievements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `ach-${Date.now()}`;
    const title = body.title;
    const category = body.category || 'Hackathon';
    const year = body.year || String(new Date().getFullYear());
    const description = body.description || '';
    const issuer = body.issuer || '';
    const rankOrMetric = body.rankOrMetric || null;
    const badgeIcon = body.badgeIcon || 'Trophy';

    if (!title) {
      return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO achievements (id, title, category, year, description, issuer, rank_or_metric, badge_icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         category = EXCLUDED.category,
         year = EXCLUDED.year,
         description = EXCLUDED.description,
         issuer = EXCLUDED.issuer,
         rank_or_metric = EXCLUDED.rank_or_metric,
         badge_icon = EXCLUDED.badge_icon`,
      [id, title, category, year, description, issuer, rankOrMetric, badgeIcon]
    );

    return NextResponse.json({
      success: true,
      achievement: { id, title, category, year, description, issuer, rankOrMetric, badgeIcon }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid achievement payload' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || body.id;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    return POST(request);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    await query('DELETE FROM achievements WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Achievement deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
