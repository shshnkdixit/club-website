import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapTeamMember } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM team_members ORDER BY org_level ASC, tree_order ASC');
    const team = res.rows.map(mapTeamMember);
    return NextResponse.json({ success: true, total: team.length, team });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `team-${Date.now()}`;
    const name = body.name;
    const role = body.role || '';
    const domain = body.domain || 'computer-vision';
    const department = body.department || '';
    const year = body.year || null;
    const bio = body.bio || '';
    const avatar = body.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400';
    const linkedin = body.linkedin || null;
    const github = body.github || null;
    const twitter = body.twitter || null;
    const email = body.email || null;
    const skills = Array.isArray(body.skills) ? body.skills : [];
    const isFaculty = Boolean(body.isFaculty);
    const isMentor = Boolean(body.isMentor);
    const specialization = body.specialization || null;
    const orgLevel = Number.isFinite(Number(body.orgLevel)) ? Number(body.orgLevel) : 4;
    const reportsToId = body.reportsToId || null;
    const treeOrder = Number.isFinite(Number(body.treeOrder)) ? Number(body.treeOrder) : 99;
    const spocTitle = body.spocTitle || null;
    const initials = body.initials || null;

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO team_members (id, name, role, domain, department, year, bio, avatar, linkedin, github, twitter, email, skills, is_faculty, is_mentor, specialization, org_level, reports_to_id, tree_order, spoc_title, initials)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         domain = EXCLUDED.domain,
         department = EXCLUDED.department,
         year = EXCLUDED.year,
         bio = EXCLUDED.bio,
         avatar = EXCLUDED.avatar,
         linkedin = EXCLUDED.linkedin,
         github = EXCLUDED.github,
         twitter = EXCLUDED.twitter,
         email = EXCLUDED.email,
         skills = EXCLUDED.skills,
         is_faculty = EXCLUDED.is_faculty,
         is_mentor = EXCLUDED.is_mentor,
         specialization = EXCLUDED.specialization,
         org_level = EXCLUDED.org_level,
         reports_to_id = EXCLUDED.reports_to_id,
         tree_order = EXCLUDED.tree_order,
         spoc_title = EXCLUDED.spoc_title,
         initials = EXCLUDED.initials`,
      [
        id, name, role, domain, department, year, bio, avatar, linkedin, github, twitter, email,
        JSON.stringify(skills), isFaculty, isMentor, specialization, orgLevel, reportsToId, treeOrder, spocTitle, initials
      ]
    );

    return NextResponse.json({
      success: true,
      member: { id, name, role, domain, department, year, bio, avatar, linkedin, github, twitter, email, skills, isFaculty, isMentor, specialization, orgLevel, reportsToId, treeOrder, spocTitle, initials }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid team member payload' }, { status: 400 });
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
    await query('DELETE FROM team_members WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Team member deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
