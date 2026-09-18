import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapEvent, mapEventRSVP } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (eventId) {
      const eventRes = await query('SELECT * FROM events WHERE id = $1', [eventId]);
      const rsvpsRes = await query('SELECT * FROM event_rsvps WHERE event_id = $1 ORDER BY registered_at DESC', [eventId]);

      if (eventRes.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        event: mapEvent(eventRes.rows[0]),
        rsvps: rsvpsRes.rows.map(mapEventRSVP)
      });
    }

    const res = await query('SELECT * FROM events ORDER BY date ASC');
    const events = res.rows.map(mapEvent);

    return NextResponse.json({
      success: true,
      total: events.length,
      events
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || `event-${Date.now()}`;
    const title = body.title;
    const type = body.type || 'Workshop';
    const date = body.date || new Date().toISOString();
    const time = body.time || '';
    const endDate = body.endDate || '';
    const venue = body.venue || 'Turing Hall 402';
    const location = body.location || '';
    const speaker = body.speaker || null;
    const description = body.description || '';
    const longDescription = body.longDescription || '';
    const registrationUrl = body.registrationUrl || '';
    const totalSeats = body.totalSeats || 100;
    const registeredCount = body.registeredCount || 0;
    const isUpcoming = body.isUpcoming ?? true;
    const isLive = body.isLive ?? false;
    const status = body.status || 'UPCOMING';
    const tags = Array.isArray(body.tags) ? body.tags : ['AI', 'Workshop'];
    const requirements = body.requirements || [];
    const agenda = body.agenda || [];
    const bannerImage = body.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000';
    const posterUrl = body.posterUrl || '';
    const mediaType = body.mediaType || 'image';
    const recapUrl = body.recapUrl || '';

    await query(
      `INSERT INTO events (id, title, type, date, time, end_date, venue, location, speaker, description, long_description, registration_url, total_seats, registered_count, is_upcoming, is_live, status, tags, requirements, agenda, banner_image, poster_url, media_type, recap_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         type = EXCLUDED.type,
         date = EXCLUDED.date,
         time = EXCLUDED.time,
         end_date = EXCLUDED.end_date,
         venue = EXCLUDED.venue,
         location = EXCLUDED.location,
         speaker = EXCLUDED.speaker,
         description = EXCLUDED.description,
         long_description = EXCLUDED.long_description,
         registration_url = EXCLUDED.registration_url,
         total_seats = EXCLUDED.total_seats,
         registered_count = EXCLUDED.registered_count,
         is_upcoming = EXCLUDED.is_upcoming,
         is_live = EXCLUDED.is_live,
         status = EXCLUDED.status,
         tags = EXCLUDED.tags,
         requirements = EXCLUDED.requirements,
         agenda = EXCLUDED.agenda,
         banner_image = EXCLUDED.banner_image,
         poster_url = EXCLUDED.poster_url,
         media_type = EXCLUDED.media_type,
         recap_url = EXCLUDED.recap_url`,
      [
        id,
        title,
        type,
        date,
        time,
        endDate,
        venue,
        location,
        JSON.stringify(speaker),
        description,
        longDescription,
        registrationUrl,
        totalSeats,
        registeredCount,
        isUpcoming,
        isLive,
        status,
        JSON.stringify(tags),
        JSON.stringify(requirements),
        JSON.stringify(agenda),
        bannerImage,
        posterUrl,
        mediaType,
        recapUrl
      ]
    );

    return NextResponse.json({
      success: true,
      event: {
        id,
        title,
        type,
        date,
        time,
        endDate,
        venue,
        location,
        speaker,
        description,
        longDescription,
        registrationUrl,
        totalSeats,
        registeredCount,
        isUpcoming,
        isLive,
        status,
        tags,
        requirements,
        agenda,
        bannerImage,
        posterUrl,
        mediaType,
        recapUrl
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid payload' }, { status: 400 });
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

    await query('DELETE FROM events WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Event deleted from PostgreSQL database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
