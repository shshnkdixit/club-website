import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapDomain } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM domains ORDER BY name ASC');
    const domains = res.rows.map(mapDomain);
    return NextResponse.json({ success: true, total: domains.length, domains });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `domain-${Date.now()}`;
    const name = body.name;
    const shortDesc = body.shortDesc || '';
    const fullDesc = body.fullDesc || '';
    const iconName = body.iconName || 'Brain';
    const technologies = Array.isArray(body.technologies) ? body.technologies : [];
    const keyConcepts = Array.isArray(body.keyConcepts) ? body.keyConcepts : [];
    const activeProjectsCount = Number(body.activeProjectsCount) || 0;
    const researchFocus = body.researchFocus || '';
    const color = body.color || '#00CFFF';
    const glowColor = body.glowColor || '#00CFFF';

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO domains (id, name, short_desc, full_desc, icon_name, technologies, key_concepts, active_projects_count, research_focus, color, glow_color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         short_desc = EXCLUDED.short_desc,
         full_desc = EXCLUDED.full_desc,
         icon_name = EXCLUDED.icon_name,
         technologies = EXCLUDED.technologies,
         key_concepts = EXCLUDED.key_concepts,
         active_projects_count = EXCLUDED.active_projects_count,
         research_focus = EXCLUDED.research_focus,
         color = EXCLUDED.color,
         glow_color = EXCLUDED.glow_color`,
      [
        id,
        name,
        shortDesc,
        fullDesc,
        iconName,
        JSON.stringify(technologies),
        JSON.stringify(keyConcepts),
        activeProjectsCount,
        researchFocus,
        color,
        glowColor
      ]
    );

    return NextResponse.json({
      success: true,
      domain: { id, name, shortDesc, fullDesc, iconName, technologies, keyConcepts, activeProjectsCount, researchFocus, color, glowColor }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid domain payload' }, { status: 400 });
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
    await query('DELETE FROM domains WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Domain deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
