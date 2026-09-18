import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapQuest } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM coding_quests ORDER BY bounty_points ASC');
    const challenges = res.rows.map(mapQuest);
    return NextResponse.json({
      success: true,
      total: challenges.length,
      challenges
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `quest-${Date.now()}`;
    const title = body.title;
    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-');
    const domain = body.domain || 'deep-learning';
    const category = body.category || 'PyTorch & Deep Learning';
    const difficulty = body.difficulty || 'Medium';
    const bountyPoints = Number(body.bountyPoints) || 250;
    const solversCount = body.solversCount ?? 0;
    const tags = Array.isArray(body.tags) ? body.tags : ['Algorithm', 'Python'];
    const isProblemOfTheWeek = Boolean(body.isProblemOfTheWeek);
    const expiresAt = body.expiresAt || null;
    const shortSummary = body.shortSummary || '';
    const problemStatement = body.problemStatement || '';
    const inputFormat = body.inputFormat || '';
    const outputFormat = body.outputFormat || '';
    const constraints = body.constraints || ['No constraints specified.'];
    const sampleTestCases = body.sampleTestCases || [{ input: 'x = 1', output: '1' }];
    const starterCode = body.starterCode || { python: 'def solve():\n    pass\n' };
    const hints = body.hints || [];

    if (isProblemOfTheWeek) {
      await query('UPDATE coding_quests SET is_problem_of_the_week = false');
    }

    await query(
      `INSERT INTO coding_quests (id, title, slug, domain, category, difficulty, bounty_points, solvers_count, tags, is_problem_of_the_week, expires_at, short_summary, problem_statement, input_format, output_format, constraints, sample_test_cases, starter_code, hints)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         domain = EXCLUDED.domain,
         category = EXCLUDED.category,
         difficulty = EXCLUDED.difficulty,
         bounty_points = EXCLUDED.bounty_points,
         solvers_count = EXCLUDED.solvers_count,
         tags = EXCLUDED.tags,
         is_problem_of_the_week = EXCLUDED.is_problem_of_the_week,
         expires_at = EXCLUDED.expires_at,
         short_summary = EXCLUDED.short_summary,
         problem_statement = EXCLUDED.problem_statement,
         input_format = EXCLUDED.input_format,
         output_format = EXCLUDED.output_format,
         constraints = EXCLUDED.constraints,
         sample_test_cases = EXCLUDED.sample_test_cases,
         starter_code = EXCLUDED.starter_code,
         hints = EXCLUDED.hints`,
      [
        id,
        title,
        slug,
        domain,
        category,
        difficulty,
        bountyPoints,
        solversCount,
        JSON.stringify(tags),
        isProblemOfTheWeek,
        expiresAt,
        shortSummary,
        problemStatement,
        inputFormat,
        outputFormat,
        JSON.stringify(constraints),
        JSON.stringify(sampleTestCases),
        JSON.stringify(starterCode),
        JSON.stringify(hints)
      ]
    );

    return NextResponse.json({
      success: true,
      challenge: {
        id,
        title,
        slug,
        domain,
        category,
        difficulty,
        bountyPoints,
        solversCount,
        tags,
        isProblemOfTheWeek,
        expiresAt,
        shortSummary,
        problemStatement,
        inputFormat,
        outputFormat,
        constraints,
        sampleTestCases,
        starterCode,
        hints
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid challenge data' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || body.id;

    if (body.setFeaturedPOTW && id) {
      await query('UPDATE coding_quests SET is_problem_of_the_week = (id = $1)', [id]);
      return NextResponse.json({ success: true, message: 'Problem of the Week updated' });
    }

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

    await query('DELETE FROM coding_quests WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Challenge deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
