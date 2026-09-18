import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapProject } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM projects ORDER BY featured DESC, stars DESC');
    const projects = res.rows.map(mapProject);
    return NextResponse.json({
      success: true,
      total: projects.length,
      projects
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `proj-${Date.now()}`;
    const title = body.title;
    const domain = body.domain || 'computer-vision';
    const category = body.category || 'Computer Vision';
    const tagline = body.tagline || '';
    const description = body.description || '';
    const longDescription = body.longDescription || body.description || '';
    const technologies = Array.isArray(body.technologies) ? body.technologies : ['Python', 'AI'];
    const teamMembers = Array.isArray(body.teamMembers) ? body.teamMembers : ['Lead Developer'];
    const githubUrl = body.githubUrl || '';
    const demoUrl = body.demoUrl || '';
    const paperUrl = body.paperUrl || '';
    const stars = body.stars || 0;
    const featured = Boolean(body.featured);
    const simulatorType = body.simulatorType || 'none';
    const metrics = body.metrics || [];
    const image = body.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000';

    await query(
      `INSERT INTO projects (id, title, domain, category, tagline, description, long_description, technologies, team_members, github_url, demo_url, paper_url, stars, featured, simulator_type, metrics, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         domain = EXCLUDED.domain,
         category = EXCLUDED.category,
         tagline = EXCLUDED.tagline,
         description = EXCLUDED.description,
         long_description = EXCLUDED.long_description,
         technologies = EXCLUDED.technologies,
         team_members = EXCLUDED.team_members,
         github_url = EXCLUDED.github_url,
         demo_url = EXCLUDED.demo_url,
         paper_url = EXCLUDED.paper_url,
         stars = EXCLUDED.stars,
         featured = EXCLUDED.featured,
         simulator_type = EXCLUDED.simulator_type,
         metrics = EXCLUDED.metrics,
         image = EXCLUDED.image`,
      [
        id,
        title,
        domain,
        category,
        tagline,
        description,
        longDescription,
        JSON.stringify(technologies),
        JSON.stringify(teamMembers),
        githubUrl,
        demoUrl,
        paperUrl,
        stars,
        featured,
        simulatorType,
        JSON.stringify(metrics),
        image
      ]
    );

    return NextResponse.json({
      success: true,
      project: {
        id,
        title,
        domain,
        category,
        tagline,
        description,
        longDescription,
        technologies,
        teamMembers,
        githubUrl,
        demoUrl,
        paperUrl,
        stars,
        featured,
        simulatorType,
        metrics,
        image
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid project payload' }, { status: 400 });
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

    await query('DELETE FROM projects WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Project deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
