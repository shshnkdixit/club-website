import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapAdminUser } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM admin_users ORDER BY created_at ASC');
    const users = res.rows.map(mapAdminUser).map(({ password, ...u }) => u);
    return NextResponse.json({
      success: true,
      total: users.length,
      users
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ success: false, error: 'Name, Email, and Role are required' }, { status: 400 });
    }

    const id = body.id || `user-${Date.now()}`;
    const name = body.name;
    const email = body.email;
    const role = body.role === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN';
    const password = body.password || 'temp2026password';
    const createdAt = body.createdAt || new Date().toISOString().split('T')[0];
    const lastLogin = body.lastLogin || null;
    const avatar = body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400';

    await query(
      `INSERT INTO admin_users (id, name, email, role, password, created_at, last_login, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         role = EXCLUDED.role,
         password = EXCLUDED.password,
         avatar = EXCLUDED.avatar`,
      [id, name, email, role, password, createdAt, lastLogin, avatar]
    );

    return NextResponse.json({
      success: true,
      user: {
        id,
        name,
        email,
        role,
        createdAt,
        lastLogin,
        avatar
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'User creation failed' }, { status: 400 });
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

    const countRes = await query('SELECT COUNT(*) as count FROM admin_users');
    if (Number(countRes.rows[0]?.count) <= 1) {
      return NextResponse.json({ success: false, error: 'Cannot delete the only remaining SuperAdmin account' }, { status: 400 });
    }

    await query('DELETE FROM admin_users WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Administrator account deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
