import { query, isRemotePostgres } from './index';

async function verify() {
  console.log('🔍 Checking database connection mode:', isRemotePostgres() ? 'Remote PostgreSQL (Neon)' : 'Local file.db (PGlite)');

  const tables = [
    'domains',
    'projects',
    'events',
    'event_rsvps',
    'research_papers',
    'team_members',
    'testimonials',
    'achievements',
    'site_settings',
    'coding_quests',
    'quest_submissions',
    'roadmap_milestones',
    'resources',
    'admin_users',
    'club_members',
    'join_applications',
    'contact_messages',
    'join_form_config'
  ];

  console.log('--------------------------------------------------');
  console.log('| Table Name              | Row Count            |');
  console.log('--------------------------------------------------');

  for (const table of tables) {
    try {
      const res = await query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = res.rows[0]?.count ?? 0;
      console.log(`| ${table.padEnd(23)} | ${String(count).padEnd(20)} |`);
    } catch (e: any) {
      console.log(`| ${table.padEnd(23)} | ERROR: ${e.message.slice(0, 15)} |`);
    }
  }
  console.log('--------------------------------------------------');
}

verify()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
