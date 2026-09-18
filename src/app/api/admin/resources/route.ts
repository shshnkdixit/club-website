import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapResource } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM resources ORDER BY featured DESC, added_at DESC');
    const resources = res.rows.map(mapResource);
    return NextResponse.json({
      success: true,
      total: resources.length,
      resources
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `res-${Date.now()}`;
    const title = body.title;
    const description = body.description || '';
    const category = body.category || 'AI';
    const type = body.type || 'Course';
    const author = body.author || 'AI & ML Club';
    const url = body.url || '#';
    const iconName = body.iconName || 'BookOpen';
    const tags = Array.isArray(body.tags) ? body.tags : ['Study Material'];
    const featured = Boolean(body.featured);
    const addedAt = body.addedAt || new Date().toISOString().split('T')[0];

    await query(
      `INSERT INTO resources (id, title, description, category, type, author, url, icon_name, tags, featured, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         type = EXCLUDED.type,
         author = EXCLUDED.author,
         url = EXCLUDED.url,
         icon_name = EXCLUDED.icon_name,
         tags = EXCLUDED.tags,
         featured = EXCLUDED.featured,
         added_at = EXCLUDED.added_at`,
      [
        id,
        title,
        description,
        category,
        type,
        author,
        url,
        iconName,
        JSON.stringify(tags),
        featured,
        addedAt
      ]
    );

    return NextResponse.json({
      success: true,
      resource: {
        id,
        title,
        description,
        category,
        type,
        author,
        url,
        iconName,
        tags,
        featured,
        addedAt
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid resource payload' }, { status: 400 });
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

    await query('DELETE FROM resources WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Resource deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
