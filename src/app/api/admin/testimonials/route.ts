import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapTestimonial } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM testimonials');
    const testimonials = res.rows.map(mapTestimonial);
    return NextResponse.json({ success: true, total: testimonials.length, testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `testi-${Date.now()}`;
    const name = body.name;
    const program = body.program || '';
    const year = body.year || '';
    const role = body.role || '';
    const companyOrPlacement = body.companyOrPlacement || null;
    const quote = body.quote || '';
    const avatar = body.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400';
    const domain = body.domain || 'computer-vision';

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO testimonials (id, name, program, year, role, company_or_placement, quote, avatar, domain)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         program = EXCLUDED.program,
         year = EXCLUDED.year,
         role = EXCLUDED.role,
         company_or_placement = EXCLUDED.company_or_placement,
         quote = EXCLUDED.quote,
         avatar = EXCLUDED.avatar,
         domain = EXCLUDED.domain`,
      [id, name, program, year, role, companyOrPlacement, quote, avatar, domain]
    );

    return NextResponse.json({
      success: true,
      testimonial: { id, name, program, year, role, companyOrPlacement, quote, avatar, domain }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid testimonial payload' }, { status: 400 });
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
    await query('DELETE FROM testimonials WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Testimonial deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
