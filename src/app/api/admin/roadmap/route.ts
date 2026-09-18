import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapRoadmap } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM roadmap_milestones ORDER BY phase_number ASC');
    const milestones = res.rows.map(mapRoadmap);
    return NextResponse.json({
      success: true,
      total: milestones.length,
      milestones
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `roadmap-p${body.phaseNumber || 1}-m${Date.now()}`;
    const phaseNumber = Number(body.phaseNumber) || 1;
    const phaseName = body.phaseName || `Phase ${body.phaseNumber || 1}`;
    const phaseTheme = body.phaseTheme || 'Cyan Neon';
    const title = body.title;
    const timeline = body.timeline || 'Q1 2026';
    const status = body.status || 'UPCOMING';
    const description = body.description || '';
    const keyTopics = Array.isArray(body.keyTopics) ? body.keyTopics : ['Core Concept'];
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : ['Required Deliverable'];
    const toolsAndTech = Array.isArray(body.toolsAndTech) ? body.toolsAndTech : ['Python'];
    const completionPercentage = Number(body.completionPercentage) || 0;
    const featured = Boolean(body.featured);

    await query(
      `INSERT INTO roadmap_milestones (id, phase_number, phase_name, phase_theme, title, timeline, status, description, key_topics, deliverables, tools_and_tech, completion_percentage, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET
         phase_number = EXCLUDED.phase_number,
         phase_name = EXCLUDED.phase_name,
         phase_theme = EXCLUDED.phase_theme,
         title = EXCLUDED.title,
         timeline = EXCLUDED.timeline,
         status = EXCLUDED.status,
         description = EXCLUDED.description,
         key_topics = EXCLUDED.key_topics,
         deliverables = EXCLUDED.deliverables,
         tools_and_tech = EXCLUDED.tools_and_tech,
         completion_percentage = EXCLUDED.completion_percentage,
         featured = EXCLUDED.featured`,
      [
        id,
        phaseNumber,
        phaseName,
        phaseTheme,
        title,
        timeline,
        status,
        description,
        JSON.stringify(keyTopics),
        JSON.stringify(deliverables),
        JSON.stringify(toolsAndTech),
        completionPercentage,
        featured
      ]
    );

    return NextResponse.json({
      success: true,
      milestone: {
        id,
        phaseNumber,
        phaseName,
        phaseTheme,
        title,
        timeline,
        status,
        description,
        keyTopics,
        deliverables,
        toolsAndTech,
        completionPercentage,
        featured
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid milestone payload' }, { status: 400 });
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

    await query('DELETE FROM roadmap_milestones WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Milestone deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
