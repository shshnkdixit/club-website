import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapResource } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const q = searchParams.get('q')?.toLowerCase();

    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      params.push(category.toLowerCase());
      sql += ` AND LOWER(category) = $${params.length}`;
    }

    if (type && type !== 'All') {
      params.push(type.toLowerCase());
      sql += ` AND LOWER(type) = $${params.length}`;
    }

    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(author) LIKE $${params.length})`;
    }

    sql += ' ORDER BY featured DESC, added_at DESC';

    const res = await query(sql, params);
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
    const id = body.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const title = body.title;
    const description = body.description || '';
    const category = body.category || 'AI';
    const type = body.type || 'Course';
    const author = body.author || 'AI & ML Club';
    const url = body.url || '#';
    const iconName = body.iconName || 'BookOpen';
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []);
    const featured = Boolean(body.featured);
    const addedAt = new Date().toISOString().split('T')[0];

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
      message: 'Resource registered in PostgreSQL Knowledge Vault',
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Invalid resource payload' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return POST(request);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID parameter required' }, { status: 400 });
    }

    await query('DELETE FROM resources WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Resource removed from PostgreSQL vault' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
