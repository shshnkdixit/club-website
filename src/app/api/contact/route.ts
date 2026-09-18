import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM contact_messages ORDER BY submitted_at DESC');
    return NextResponse.json({
      success: true,
      total: res.rows.length,
      messages: res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        programOrCompany: r.program_or_company,
        purpose: r.purpose,
        message: r.message,
        submittedAt: r.submitted_at,
        read: Boolean(r.read)
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id || `msg-${Date.now()}`;
    const name = data.name || 'Anonymous Sender';
    const email = data.email || '';
    const phone = data.phone || '';
    const programOrCompany = data.programOrCompany || '';
    const purpose = data.purpose || 'General Inquiry';
    const message = data.message || '';
    const submittedAt = data.submittedAt || new Date().toISOString();
    const read = Boolean(data.read);

    await query(
      `INSERT INTO contact_messages (id, name, email, phone, program_or_company, purpose, message, submitted_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         read = EXCLUDED.read`,
      [id, name, email, phone, programOrCompany, purpose, message, submittedAt, read]
    );

    return NextResponse.json({
      success: true,
      message: 'Transmission saved to PostgreSQL database.',
      messageId: id,
      contact: { id, name, email, purpose, submittedAt }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid payload' }, { status: 400 });
  }
}
