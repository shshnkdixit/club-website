import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapResearch } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM research_papers ORDER BY year DESC');
    const research = res.rows.map(mapResearch);
    return NextResponse.json({ success: true, total: research.length, research });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `paper-${Date.now()}`;
    const title = body.title;
    const authors = Array.isArray(body.authors) ? body.authors : [];
    const domain = body.domain || 'computer-vision';
    const status = body.status || 'In Progress';
    const conference = body.conference || null;
    const year = Number(body.year) || new Date().getFullYear();
    const abstract = body.abstract || '';
    const pdfUrl = body.pdfUrl || null;
    const codeUrl = body.codeUrl || null;
    const demoUrl = body.demoUrl || null;
    const citationBibtex = body.citationBibtex || null;
    const keywords = Array.isArray(body.keywords) ? body.keywords : [];
    const metrics = body.metrics ?? null;

    if (!title) {
      return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO research_papers (id, title, authors, domain, status, conference, year, abstract, pdf_url, code_url, demo_url, citation_bibtex, keywords, metrics)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         authors = EXCLUDED.authors,
         domain = EXCLUDED.domain,
         status = EXCLUDED.status,
         conference = EXCLUDED.conference,
         year = EXCLUDED.year,
         abstract = EXCLUDED.abstract,
         pdf_url = EXCLUDED.pdf_url,
         code_url = EXCLUDED.code_url,
         demo_url = EXCLUDED.demo_url,
         citation_bibtex = EXCLUDED.citation_bibtex,
         keywords = EXCLUDED.keywords,
         metrics = EXCLUDED.metrics`,
      [
        id,
        title,
        JSON.stringify(authors),
        domain,
        status,
        conference,
        year,
        abstract,
        pdfUrl,
        codeUrl,
        demoUrl,
        citationBibtex,
        JSON.stringify(keywords),
        metrics === null ? null : JSON.stringify(metrics)
      ]
    );

    return NextResponse.json({
      success: true,
      paper: { id, title, authors, domain, status, conference, year, abstract, pdfUrl, codeUrl, demoUrl, citationBibtex, keywords, metrics }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid research paper payload' }, { status: 400 });
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
    await query('DELETE FROM research_papers WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Research paper deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
