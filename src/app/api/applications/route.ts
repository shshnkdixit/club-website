import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM join_applications ORDER BY submitted_at DESC');
    return NextResponse.json({
      success: true,
      total: res.rows.length,
      applications: res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        program: r.program,
        year: r.year,
        department: r.department,
        skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : r.skills,
        aiInterests: typeof r.ai_interests === 'string' ? JSON.parse(r.ai_interests) : r.ai_interests,
        githubUrl: r.github_url,
        linkedinUrl: r.linkedin_url,
        portfolioUrl: r.portfolio_url,
        statementOfPurpose: r.statement_of_purpose,
        submittedAt: r.submitted_at,
        status: r.status,
        applicationId: r.application_id
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id || `app-${Date.now()}`;
    const applicationId = data.applicationId || 'AIML-2026-' + Math.floor(10000 + Math.random() * 90000);
    const submittedAt = data.submittedAt || new Date().toISOString();

    await query(
      `INSERT INTO join_applications (id, name, email, phone, program, year, department, skills, ai_interests, github_url, linkedin_url, portfolio_url, statement_of_purpose, submitted_at, status, application_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (id) DO UPDATE SET
         status = EXCLUDED.status`,
      [
        id,
        data.name || data.fullName || 'Anonymous Candidate',
        data.email || '',
        data.phone || '',
        data.program || data.uid || 'B.Tech CSE',
        data.year || '1st Year',
        data.department || 'Computer Science & Engineering',
        JSON.stringify(data.skills || []),
        JSON.stringify(data.aiInterests || []),
        data.githubUrl || '',
        data.linkedinUrl || '',
        data.portfolioUrl || '',
        data.statementOfPurpose || data.sop || '',
        submittedAt,
        data.status || 'Pending',
        applicationId
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Application recorded into AI/ML Club PostgreSQL database.',
      applicationId,
      application: {
        id,
        name: data.name,
        email: data.email,
        applicationId,
        submittedAt
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid payload' }, { status: 400 });
  }
}
