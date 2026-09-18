import { NextResponse } from 'next/server';
import { query } from '@/db';
import {
  mapDomain,
  mapProject,
  mapEvent,
  mapResearch,
  mapTeamMember,
  mapTestimonial,
  mapAchievement,
  mapSiteSettings,
  mapQuest,
  mapRoadmap,
  mapResource,
  mapAdminUser,
  mapClubMember,
  mapEventRSVP,
  mapJoinConfig,
  mapSubmission
} from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      domainsRes,
      projectsRes,
      eventsRes,
      researchRes,
      teamRes,
      testimonialsRes,
      achievementsRes,
      settingsRes,
      questsRes,
      roadmapRes,
      resourcesRes,
      adminUsersRes,
      membersRes,
      rsvpsRes,
      joinConfigRes,
      submissionsRes
    ] = await Promise.all([
      query('SELECT * FROM domains ORDER BY name ASC'),
      query('SELECT * FROM projects ORDER BY featured DESC, stars DESC'),
      query('SELECT * FROM events ORDER BY is_upcoming DESC, date ASC'),
      query('SELECT * FROM research_papers ORDER BY year DESC'),
      query('SELECT * FROM team_members ORDER BY org_level ASC, tree_order ASC'),
      query('SELECT * FROM testimonials'),
      query('SELECT * FROM achievements ORDER BY year DESC'),
      query('SELECT * FROM site_settings WHERE id = $1', ['default']),
      query('SELECT * FROM coding_quests ORDER BY bounty_points ASC'),
      query('SELECT * FROM roadmap_milestones ORDER BY phase_number ASC'),
      query('SELECT * FROM resources ORDER BY featured DESC'),
      query('SELECT * FROM admin_users'),
      query('SELECT * FROM club_members ORDER BY joined_date DESC'),
      query('SELECT * FROM event_rsvps ORDER BY registered_at DESC'),
      query('SELECT * FROM join_form_config WHERE id = $1', ['default']),
      query('SELECT * FROM quest_submissions ORDER BY submitted_at DESC')
    ]);

    return NextResponse.json({
      success: true,
      domains: domainsRes.rows.map(mapDomain),
      projects: projectsRes.rows.map(mapProject),
      events: eventsRes.rows.map(mapEvent),
      research: researchRes.rows.map(mapResearch),
      team: teamRes.rows.map(mapTeamMember),
      testimonials: testimonialsRes.rows.map(mapTestimonial),
      achievements: achievementsRes.rows.map(mapAchievement),
      settings: settingsRes.rows[0] ? mapSiteSettings(settingsRes.rows[0]) : null,
      quests: questsRes.rows.map(mapQuest),
      roadmap: roadmapRes.rows.map(mapRoadmap),
      resources: resourcesRes.rows.map(mapResource),
      adminUsers: adminUsersRes.rows.map(mapAdminUser),
      members: membersRes.rows.map(mapClubMember),
      eventRsvps: rsvpsRes.rows.map(mapEventRSVP),
      joinConfig: joinConfigRes.rows[0] ? mapJoinConfig(joinConfigRes.rows[0]) : null,
      submissions: submissionsRes.rows.map(mapSubmission)
    });
  } catch (error: any) {
    console.error('Error fetching CMS data from database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load CMS data' },
      { status: 500 }
    );
  }
}
