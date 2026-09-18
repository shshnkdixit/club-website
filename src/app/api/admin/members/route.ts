import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapClubMember } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase();

    let sql = 'SELECT * FROM club_members';
    const params: any[] = [];

    if (q) {
      sql += ` WHERE LOWER(name) LIKE $1 
               OR LOWER(uid) LIKE $1 
               OR LOWER(email) LIKE $1 
               OR LOWER(department) LIKE $1 
               OR LOWER(member_id) LIKE $1`;
      params.push(`%${q}%`);
    }

    sql += ' ORDER BY joined_date DESC';

    const res = await query(sql, params);
    const members = res.rows.map(mapClubMember);

    return NextResponse.json({
      success: true,
      total: members.length,
      members
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `mem-${Date.now()}`;
    const memberId = body.memberId || `AIML-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = body.name;
    const uid = body.uid;
    const email = body.email;
    const phone = body.phone || '+1 (555) 000-0000';
    const department = body.department || 'Computer Science & Engineering';
    const year = body.year || '1st Year';
    const skills = Array.isArray(body.skills) ? body.skills : ['Python', 'AI'];
    const joinedDate = body.joinedDate || new Date().toISOString().split('T')[0];
    const role = body.role || 'Student Member';
    const status = body.status || 'Active';
    const githubUrl = body.githubUrl || '';
    const avatar = body.avatar || '';

    await query(
      `INSERT INTO club_members (id, member_id, name, uid, email, phone, department, year, skills, joined_date, role, status, github_url, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         member_id = EXCLUDED.member_id,
         name = EXCLUDED.name,
         uid = EXCLUDED.uid,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         department = EXCLUDED.department,
         year = EXCLUDED.year,
         skills = EXCLUDED.skills,
         joined_date = EXCLUDED.joined_date,
         role = EXCLUDED.role,
         status = EXCLUDED.status,
         github_url = EXCLUDED.github_url,
         avatar = EXCLUDED.avatar`,
      [
        id,
        memberId,
        name,
        uid,
        email,
        phone,
        department,
        year,
        JSON.stringify(skills),
        joinedDate,
        role,
        status,
        githubUrl,
        avatar
      ]
    );

    return NextResponse.json({
      success: true,
      member: {
        id,
        memberId,
        name,
        uid,
        email,
        phone,
        department,
        year,
        skills,
        joinedDate,
        role,
        status,
        githubUrl,
        avatar
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid member data' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await query('DELETE FROM club_members WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Member removed from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
