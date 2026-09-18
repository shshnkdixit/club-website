import { query, ensureInitialized } from './index';
import {
  INITIAL_DOMAINS,
  INITIAL_PROJECTS,
  INITIAL_EVENTS,
  INITIAL_RESEARCH,
  INITIAL_TEAM,
  INITIAL_TESTIMONIALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SETTINGS,
  INITIAL_QUESTS,
  INITIAL_ROADMAP,
  INITIAL_RESOURCES,
  INITIAL_ADMIN_USERS,
  INITIAL_MEMBERS,
  INITIAL_EVENT_RSVPS,
  INITIAL_JOIN_CONFIG,
  INITIAL_SUBMISSIONS
} from '../lib/data';

export async function seedDatabase() {
  console.log('🚀 Initializing PostgreSQL Database Schema...');
  await ensureInitialized();

  console.log('🌱 Starting Database Seeding...');

  // 1. Domains
  for (const d of INITIAL_DOMAINS) {
    await query(
      `INSERT INTO domains (id, name, short_desc, full_desc, icon_name, technologies, key_concepts, active_projects_count, research_focus, color, glow_color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         short_desc = EXCLUDED.short_desc,
         full_desc = EXCLUDED.full_desc,
         icon_name = EXCLUDED.icon_name,
         technologies = EXCLUDED.technologies,
         key_concepts = EXCLUDED.key_concepts,
         active_projects_count = EXCLUDED.active_projects_count,
         research_focus = EXCLUDED.research_focus,
         color = EXCLUDED.color,
         glow_color = EXCLUDED.glow_color`,
      [
        d.id,
        d.name,
        d.shortDesc,
        d.fullDesc,
        d.iconName,
        JSON.stringify(d.technologies || []),
        JSON.stringify(d.keyConcepts || []),
        d.activeProjectsCount || 0,
        d.researchFocus || '',
        d.color,
        d.glowColor
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_DOMAINS.length} Domains`);

  // 2. Projects
  for (const p of INITIAL_PROJECTS) {
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
        p.id,
        p.title,
        p.domain,
        p.category,
        p.tagline,
        p.description,
        p.longDescription || '',
        JSON.stringify(p.technologies || []),
        JSON.stringify(p.teamMembers || []),
        p.githubUrl || '',
        p.demoUrl || '',
        p.paperUrl || '',
        p.stars || 0,
        Boolean(p.featured),
        p.simulatorType || 'none',
        JSON.stringify(p.metrics || []),
        p.image
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_PROJECTS.length} Projects`);

  // 3. Events
  for (const e of INITIAL_EVENTS) {
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
        e.id,
        e.title,
        e.type,
        e.date,
        e.time || '',
        e.endDate || '',
        e.venue,
        e.location || '',
        JSON.stringify(e.speaker || null),
        e.description,
        e.longDescription || '',
        e.registrationUrl || '',
        e.totalSeats || 100,
        e.registeredCount || 0,
        Boolean(e.isUpcoming),
        Boolean(e.isLive),
        e.status || 'UPCOMING',
        JSON.stringify(e.tags || []),
        JSON.stringify(e.requirements || []),
        JSON.stringify(e.agenda || []),
        e.bannerImage || '',
        e.posterUrl || '',
        e.mediaType || 'image',
        e.recapUrl || ''
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_EVENTS.length} Events`);

  // 4. Event RSVPs
  for (const r of INITIAL_EVENT_RSVPS) {
    await query(
      `INSERT INTO event_rsvps (id, event_id, event_title, student_name, student_uid, email, phone, department, year, registered_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         status = EXCLUDED.status`,
      [
        r.id,
        r.eventId,
        r.eventTitle,
        r.studentName,
        r.studentUid,
        r.email,
        r.phone || '',
        r.department,
        r.year,
        r.registeredAt,
        r.status || 'Confirmed'
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_EVENT_RSVPS.length} Event RSVPs`);

  // 5. Research Papers
  for (const p of INITIAL_RESEARCH) {
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
        p.id,
        p.title,
        JSON.stringify(p.authors || []),
        p.domain,
        p.status,
        p.conference || '',
        p.year,
        p.abstract,
        p.pdfUrl || '',
        p.codeUrl || '',
        p.demoUrl || '',
        p.citationBibtex || '',
        JSON.stringify(p.keywords || []),
        JSON.stringify(p.metrics || null)
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_RESEARCH.length} Research Papers`);

  // 6. Team Members
  for (const t of INITIAL_TEAM) {
    await query(
      `INSERT INTO team_members (id, name, role, domain, department, year, bio, avatar, linkedin, github, twitter, email, skills, is_faculty, is_mentor, specialization, org_level, reports_to_id, tree_order, spoc_title, initials)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         domain = EXCLUDED.domain,
         department = EXCLUDED.department,
         year = EXCLUDED.year,
         bio = EXCLUDED.bio,
         avatar = EXCLUDED.avatar,
         linkedin = EXCLUDED.linkedin,
         github = EXCLUDED.github,
         twitter = EXCLUDED.twitter,
         email = EXCLUDED.email,
         skills = EXCLUDED.skills,
         is_faculty = EXCLUDED.is_faculty,
         is_mentor = EXCLUDED.is_mentor,
         specialization = EXCLUDED.specialization,
         org_level = EXCLUDED.org_level,
         reports_to_id = EXCLUDED.reports_to_id,
         tree_order = EXCLUDED.tree_order,
         spoc_title = EXCLUDED.spoc_title,
         initials = EXCLUDED.initials`,
      [
        t.id,
        t.name,
        t.role,
        t.domain,
        t.department,
        t.year || '',
        t.bio,
        t.avatar,
        t.linkedin || '',
        t.github || '',
        t.twitter || '',
        t.email || '',
        JSON.stringify(t.skills || []),
        Boolean(t.isFaculty),
        Boolean(t.isMentor),
        t.specialization || '',
        t.orgLevel || 4,
        t.reportsToId || null,
        t.treeOrder || 99,
        t.spocTitle || '',
        t.initials || ''
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_TEAM.length} Team Members`);

  // 7. Testimonials
  for (const tm of INITIAL_TESTIMONIALS) {
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
      [
        tm.id,
        tm.name,
        tm.program,
        tm.year,
        tm.role,
        tm.companyOrPlacement || '',
        tm.quote,
        tm.avatar,
        tm.domain
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_TESTIMONIALS.length} Testimonials`);

  // 8. Achievements
  for (const a of INITIAL_ACHIEVEMENTS) {
    await query(
      `INSERT INTO achievements (id, title, category, year, description, issuer, rank_or_metric, badge_icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         category = EXCLUDED.category,
         year = EXCLUDED.year,
         description = EXCLUDED.description,
         issuer = EXCLUDED.issuer,
         rank_or_metric = EXCLUDED.rank_or_metric,
         badge_icon = EXCLUDED.badge_icon`,
      [
        a.id,
        a.title,
        a.category,
        a.year,
        a.description,
        a.issuer,
        a.rankOrMetric || '',
        a.badgeIcon
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_ACHIEVEMENTS.length} Achievements`);

  // 9. Site Settings
  await query(
    `INSERT INTO site_settings (id, club_name, tagline, hero_headline, hero_subheadline, stats, announcement, social_links)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       club_name = EXCLUDED.club_name,
       tagline = EXCLUDED.tagline,
       hero_headline = EXCLUDED.hero_headline,
       hero_subheadline = EXCLUDED.hero_subheadline,
       stats = EXCLUDED.stats,
       announcement = EXCLUDED.announcement,
       social_links = EXCLUDED.social_links`,
    [
      'default',
      INITIAL_SETTINGS.clubName,
      INITIAL_SETTINGS.tagline,
      INITIAL_SETTINGS.heroHeadline,
      INITIAL_SETTINGS.heroSubheadline,
      JSON.stringify(INITIAL_SETTINGS.stats),
      JSON.stringify(INITIAL_SETTINGS.announcement || null),
      JSON.stringify(INITIAL_SETTINGS.socialLinks)
    ]
  );
  console.log('✓ Seeded Site Settings');

  // 10. Coding Quests
  for (const q of INITIAL_QUESTS) {
    await query(
      `INSERT INTO coding_quests (id, title, slug, domain, category, difficulty, bounty_points, solvers_count, tags, is_problem_of_the_week, expires_at, short_summary, problem_statement, input_format, output_format, constraints, sample_test_cases, starter_code, hints)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         domain = EXCLUDED.domain,
         category = EXCLUDED.category,
         difficulty = EXCLUDED.difficulty,
         bounty_points = EXCLUDED.bounty_points,
         solvers_count = EXCLUDED.solvers_count,
         tags = EXCLUDED.tags,
         is_problem_of_the_week = EXCLUDED.is_problem_of_the_week,
         expires_at = EXCLUDED.expires_at,
         short_summary = EXCLUDED.short_summary,
         problem_statement = EXCLUDED.problem_statement,
         input_format = EXCLUDED.input_format,
         output_format = EXCLUDED.output_format,
         constraints = EXCLUDED.constraints,
         sample_test_cases = EXCLUDED.sample_test_cases,
         starter_code = EXCLUDED.starter_code,
         hints = EXCLUDED.hints`,
      [
        q.id,
        q.title,
        q.slug,
        q.domain,
        q.category,
        q.difficulty,
        q.bountyPoints,
        q.solversCount || 0,
        JSON.stringify(q.tags || []),
        Boolean(q.isProblemOfTheWeek),
        q.expiresAt || null,
        q.shortSummary,
        q.problemStatement,
        q.inputFormat,
        q.outputFormat,
        JSON.stringify(q.constraints || []),
        JSON.stringify(q.sampleTestCases || []),
        JSON.stringify(q.starterCode || { python: '' }),
        JSON.stringify(q.hints || [])
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_QUESTS.length} Coding Quests`);

  // 11. Quest Submissions
  for (const s of INITIAL_SUBMISSIONS) {
    await query(
      `INSERT INTO quest_submissions (id, quest_id, quest_title, student_name, student_uid, github_repo_url, solution_notes, submitted_code, status, submitted_at, points_awarded, reviewer_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         status = EXCLUDED.status,
         points_awarded = EXCLUDED.points_awarded`,
      [
        s.id,
        s.questId,
        s.questTitle,
        s.studentName,
        s.studentUID,
        s.githubRepoUrl || '',
        s.solutionNotes || '',
        s.submittedCode || '',
        s.status || 'Pending Review',
        s.submittedAt,
        s.pointsAwarded || 0,
        s.reviewerNotes || ''
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_SUBMISSIONS.length} Quest Submissions`);

  // 12. Roadmap Milestones
  for (const r of INITIAL_ROADMAP) {
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
        r.id,
        r.phaseNumber,
        r.phaseName,
        r.phaseTheme,
        r.title,
        r.timeline,
        r.status,
        r.description,
        JSON.stringify(r.keyTopics || []),
        JSON.stringify(r.deliverables || []),
        JSON.stringify(r.toolsAndTech || []),
        r.completionPercentage || 0,
        Boolean(r.featured)
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_ROADMAP.length} Roadmap Milestones`);

  // 13. Resources
  for (const res of INITIAL_RESOURCES) {
    await query(
      `INSERT INTO resources (id, title, description, category, type, author, url, icon_name, tags, featured, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         type = EXCLUDED.type,
         author = EXCLUDED.author,
         url = EXCLUDED.url,
         icon_name = EXCLUDED.icon_name,
         tags = EXCLUDED.tags,
         featured = EXCLUDED.featured,
         added_at = EXCLUDED.added_at`,
      [
        res.id,
        res.title,
        res.description,
        res.category,
        res.type,
        res.author,
        res.url,
        res.iconName || '',
        JSON.stringify(res.tags || []),
        Boolean(res.featured),
        res.addedAt || new Date().toISOString().split('T')[0]
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_RESOURCES.length} Resources`);

  // 14. Admin Users
  for (const u of INITIAL_ADMIN_USERS) {
    await query(
      `INSERT INTO admin_users (id, name, email, role, password, created_at, last_login, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         password = EXCLUDED.password,
         avatar = EXCLUDED.avatar`,
      [
        u.id,
        u.name,
        u.email,
        u.role,
        u.password,
        u.createdAt,
        u.lastLogin || null,
        u.avatar || ''
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_ADMIN_USERS.length} Admin Users`);

  // 15. Club Members
  for (const m of INITIAL_MEMBERS) {
    await query(
      `INSERT INTO club_members (id, member_id, name, uid, email, phone, department, year, skills, joined_date, role, status, github_url, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         uid = EXCLUDED.uid,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         department = EXCLUDED.department,
         year = EXCLUDED.year,
         skills = EXCLUDED.skills,
         role = EXCLUDED.role,
         status = EXCLUDED.status,
         github_url = EXCLUDED.github_url`,
      [
        m.id,
        m.memberId,
        m.name,
        m.uid,
        m.email,
        m.phone || '',
        m.department,
        m.year,
        JSON.stringify(m.skills || []),
        m.joinedDate,
        m.role,
        m.status,
        m.githubUrl || '',
        m.avatar || ''
      ]
    );
  }
  console.log(`✓ Seeded ${INITIAL_MEMBERS.length} Club Members`);

  // 16. Join Form Configuration
  await query(
    `INSERT INTO join_form_config (id, admissions_open, closure_notice, next_cohort_date, portal_badge, form_title, form_subtitle, submit_button_text, success_title, success_message, departments, academic_years, domain_interests, membership_perks, custom_fields, show_phone_field, show_portfolio_field, show_social_links, show_domain_interests, show_statement_of_purpose, sop_prompt, last_updated)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
     ON CONFLICT (id) DO UPDATE SET
       admissions_open = EXCLUDED.admissions_open,
       closure_notice = EXCLUDED.closure_notice,
       next_cohort_date = EXCLUDED.next_cohort_date,
       portal_badge = EXCLUDED.portal_badge,
       form_title = EXCLUDED.form_title,
       form_subtitle = EXCLUDED.form_subtitle,
       submit_button_text = EXCLUDED.submit_button_text,
       success_title = EXCLUDED.success_title,
       success_message = EXCLUDED.success_message,
       departments = EXCLUDED.departments,
       academic_years = EXCLUDED.academic_years,
       domain_interests = EXCLUDED.domain_interests,
       membership_perks = EXCLUDED.membership_perks,
       custom_fields = EXCLUDED.custom_fields,
       show_phone_field = EXCLUDED.show_phone_field,
       show_portfolio_field = EXCLUDED.show_portfolio_field,
       show_social_links = EXCLUDED.show_social_links,
       show_domain_interests = EXCLUDED.show_domain_interests,
       show_statement_of_purpose = EXCLUDED.show_statement_of_purpose,
       sop_prompt = EXCLUDED.sop_prompt,
       last_updated = EXCLUDED.last_updated`,
    [
      'default',
      Boolean(INITIAL_JOIN_CONFIG.admissionsOpen),
      INITIAL_JOIN_CONFIG.closureNotice || '',
      INITIAL_JOIN_CONFIG.nextCohortDate || '',
      INITIAL_JOIN_CONFIG.portalBadge || '',
      INITIAL_JOIN_CONFIG.formTitle || '',
      INITIAL_JOIN_CONFIG.formSubtitle || '',
      INITIAL_JOIN_CONFIG.submitButtonText || '',
      INITIAL_JOIN_CONFIG.successTitle || '',
      INITIAL_JOIN_CONFIG.successMessage || '',
      JSON.stringify(INITIAL_JOIN_CONFIG.departments || []),
      JSON.stringify(INITIAL_JOIN_CONFIG.academicYears || []),
      JSON.stringify(INITIAL_JOIN_CONFIG.domainInterests || []),
      JSON.stringify(INITIAL_JOIN_CONFIG.membershipPerks || []),
      JSON.stringify(INITIAL_JOIN_CONFIG.customFields || []),
      Boolean(INITIAL_JOIN_CONFIG.showPhoneField !== false),
      Boolean(INITIAL_JOIN_CONFIG.showPortfolioField !== false),
      Boolean(INITIAL_JOIN_CONFIG.showSocialLinks !== false),
      Boolean(INITIAL_JOIN_CONFIG.showDomainInterests !== false),
      Boolean(INITIAL_JOIN_CONFIG.showStatementOfPurpose !== false),
      INITIAL_JOIN_CONFIG.sopPrompt || '',
      INITIAL_JOIN_CONFIG.lastUpdated || new Date().toISOString()
    ]
  );
  console.log('✓ Seeded Join Form Configuration');

  console.log('🎉 All database collections successfully seeded into PostgreSQL file.db!');
}

// Execute directly if run via CLI
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
