import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapAdminUser } from '@/db/mappers';

export const dynamic = 'force-dynamic';

// Server-side credential check against the admin_users table in the database.
// This keeps staff passwords out of the client bundle: the browser only ever
// sends the typed credentials over the wire and gets back a user object
// (password stripped) on success.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const res = await query('SELECT * FROM admin_users WHERE LOWER(email) = $1', [email]);
    const row = res.rows[0];

    if (!row || row.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const now = new Date().toISOString();
    await query('UPDATE admin_users SET last_login = $1 WHERE id = $2', [now, row.id]);

    const user = mapAdminUser({ ...row, last_login: now });
    const { password: _pw, ...safeUser } = user as any;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Login failed' }, { status: 500 });
  }
}
