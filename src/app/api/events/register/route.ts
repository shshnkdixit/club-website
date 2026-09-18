import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { EventRSVP } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, eventTitle, name, uid, email, contactNo, department, year } = body;

    if (!eventId || !name || !email) {
      return NextResponse.json({ success: false, error: 'Missing required RSVP fields' }, { status: 400 });
    }

    const id = `rsvp-${Date.now()}`;
    const studentUid = uid || `26${Math.floor(10000 + Math.random() * 90000)}`;
    const phone = contactNo || '';
    const dept = department || 'Engineering';
    const yr = year || '1st Year';
    const registeredAt = new Date().toISOString();
    const status = 'Confirmed';

    await query(
      `INSERT INTO event_rsvps (id, event_id, event_title, student_name, student_uid, email, phone, department, year, registered_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, eventId, eventTitle || 'Club Event', name, studentUid, email, phone, dept, yr, registeredAt, status]
    );

    // Increment registered count for the event
    await query(
      'UPDATE events SET registered_count = registered_count + 1 WHERE id = $1',
      [eventId]
    );

    const rsvpRecord: EventRSVP = {
      id,
      eventId,
      eventTitle: eventTitle || 'Club Event',
      studentName: name,
      studentUid,
      email,
      phone,
      department: dept,
      year: yr,
      registeredAt,
      status: 'Confirmed'
    };

    return NextResponse.json({
      success: true,
      message: 'SEAT CONFIRMED! Your ticket has been logged into the PostgreSQL database.',
      rsvp: rsvpRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'RSVP registration failed' }, { status: 500 });
  }
}
