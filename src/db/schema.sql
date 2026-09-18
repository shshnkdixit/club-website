-- AIML Club Platform PostgreSQL Schema
-- Fully compatible with local file.db (PGlite) and Neon Serverless PostgreSQL

-- 1. AI Domains
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_projects_count INT NOT NULL DEFAULT 0,
  research_focus TEXT NOT NULL,
  color TEXT NOT NULL,
  glow_color TEXT NOT NULL
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
  github_url TEXT,
  demo_url TEXT,
  paper_url TEXT,
  stars INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  simulator_type TEXT DEFAULT 'none',
  metrics JSONB DEFAULT '[]'::jsonb,
  image TEXT NOT NULL
);

-- 3. Club Events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  end_date TEXT,
  venue TEXT NOT NULL,
  location TEXT,
  speaker JSONB,
  description TEXT NOT NULL,
  long_description TEXT,
  registration_url TEXT,
  total_seats INT DEFAULT 100,
  registered_count INT DEFAULT 0,
  is_upcoming BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'UPCOMING',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  banner_image TEXT,
  poster_url TEXT,
  media_type TEXT DEFAULT 'image',
  recap_url TEXT
);

-- 4. Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_uid TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  registered_at TEXT NOT NULL,
  status TEXT DEFAULT 'Confirmed'
);

-- 5. Research Papers
CREATE TABLE IF NOT EXISTS research_papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authors JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain TEXT NOT NULL,
  status TEXT NOT NULL,
  conference TEXT,
  year INT NOT NULL,
  abstract TEXT NOT NULL,
  pdf_url TEXT,
  code_url TEXT,
  demo_url TEXT,
  citation_bibtex TEXT,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB
);

-- 6. Team Members & Leadership
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  domain TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  email TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_faculty BOOLEAN DEFAULT false,
  is_mentor BOOLEAN DEFAULT false,
  specialization TEXT,
  org_level INT DEFAULT 4,
  reports_to_id TEXT,
  tree_order INT DEFAULT 99,
  spoc_title TEXT,
  initials TEXT
);

-- 7. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  program TEXT NOT NULL,
  year TEXT NOT NULL,
  role TEXT NOT NULL,
  company_or_placement TEXT,
  quote TEXT NOT NULL,
  avatar TEXT NOT NULL,
  domain TEXT NOT NULL
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  issuer TEXT NOT NULL,
  rank_or_metric TEXT,
  badge_icon TEXT NOT NULL
);

-- 9. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  club_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  hero_subheadline TEXT NOT NULL,
  stats JSONB NOT NULL,
  announcement JSONB,
  social_links JSONB NOT NULL
);

-- 10. Coding Quests / Challenges
CREATE TABLE IF NOT EXISTS coding_quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  domain TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  bounty_points INT NOT NULL DEFAULT 50,
  solvers_count INT NOT NULL DEFAULT 0,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_problem_of_the_week BOOLEAN DEFAULT false,
  expires_at TEXT,
  short_summary TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  input_format TEXT NOT NULL,
  output_format TEXT NOT NULL,
  constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_code JSONB NOT NULL DEFAULT '{"python": ""}'::jsonb,
  hints JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 11. Quest Submissions
CREATE TABLE IF NOT EXISTS quest_submissions (
  id TEXT PRIMARY KEY,
  quest_id TEXT NOT NULL,
  quest_title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_uid TEXT NOT NULL,
  github_repo_url TEXT,
  solution_notes TEXT,
  submitted_code TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  submitted_at TEXT NOT NULL,
  points_awarded INT DEFAULT 0,
  reviewer_notes TEXT
);

-- 12. Roadmap Milestones
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id TEXT PRIMARY KEY,
  phase_number INT NOT NULL,
  phase_name TEXT NOT NULL,
  phase_theme TEXT NOT NULL,
  title TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  key_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  tools_and_tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  completion_percentage INT NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false
);

-- 13. Resources
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  added_at TEXT
);

-- 14. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  password TEXT,
  created_at TEXT NOT NULL,
  last_login TEXT,
  avatar TEXT
);

-- 15. Club Members Directory
CREATE TABLE IF NOT EXISTS club_members (
  id TEXT PRIMARY KEY,
  member_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  uid TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  joined_date TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  github_url TEXT,
  avatar TEXT
);

-- 16. Join Applications
CREATE TABLE IF NOT EXISTS join_applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program TEXT NOT NULL,
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  statement_of_purpose TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  application_id TEXT NOT NULL
);

-- 17. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program_or_company TEXT,
  purpose TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  read BOOLEAN DEFAULT false
);

-- 18. Join Form Configuration
CREATE TABLE IF NOT EXISTS join_form_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  admissions_open BOOLEAN DEFAULT true,
  closure_notice TEXT,
  next_cohort_date TEXT,
  portal_badge TEXT,
  form_title TEXT,
  form_subtitle TEXT,
  submit_button_text TEXT,
  success_title TEXT,
  success_message TEXT,
  departments JSONB NOT NULL DEFAULT '[]'::jsonb,
  academic_years JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain_interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  membership_perks JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_fields JSONB DEFAULT '[]'::jsonb,
  show_phone_field BOOLEAN DEFAULT true,
  show_portfolio_field BOOLEAN DEFAULT true,
  show_social_links BOOLEAN DEFAULT true,
  show_domain_interests BOOLEAN DEFAULT true,
  show_statement_of_purpose BOOLEAN DEFAULT true,
  sop_prompt TEXT,
  last_updated TEXT NOT NULL
);

-- 19. Robot Command Logs
CREATE TABLE IF NOT EXISTS robot_command_logs (
  id TEXT PRIMARY KEY,
  command TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  action_triggered TEXT NOT NULL,
  response TEXT NOT NULL
);
