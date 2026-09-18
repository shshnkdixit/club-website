import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapSiteSettings } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM site_settings WHERE id = $1', ['default']);
    const settings = res.rows[0] ? mapSiteSettings(res.rows[0]) : null;
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clubName = body.clubName || 'AI & ML Club';
    const tagline = body.tagline || '';
    const heroHeadline = body.heroHeadline || '';
    const heroSubheadline = body.heroSubheadline || '';
    const stats = body.stats || {};
    const announcement = body.announcement ?? null;
    const socialLinks = body.socialLinks || {};

    await query(
      `INSERT INTO site_settings (id, club_name, tagline, hero_headline, hero_subheadline, stats, announcement, social_links)
       VALUES ('default', $1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         club_name = EXCLUDED.club_name,
         tagline = EXCLUDED.tagline,
         hero_headline = EXCLUDED.hero_headline,
         hero_subheadline = EXCLUDED.hero_subheadline,
         stats = EXCLUDED.stats,
         announcement = EXCLUDED.announcement,
         social_links = EXCLUDED.social_links`,
      [
        clubName,
        tagline,
        heroHeadline,
        heroSubheadline,
        JSON.stringify(stats),
        announcement === null ? null : JSON.stringify(announcement),
        JSON.stringify(socialLinks)
      ]
    );

    return NextResponse.json({
      success: true,
      settings: { clubName, tagline, heroHeadline, heroSubheadline, stats, announcement, socialLinks }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Invalid settings payload' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
