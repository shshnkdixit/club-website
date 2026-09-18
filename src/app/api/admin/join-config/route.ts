import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/db';
import { mapJoinConfig } from '@/db/mappers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT * FROM join_form_config WHERE id = $1', ['default']);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Config not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      config: mapJoinConfig(res.rows[0])
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lastUpdated = new Date().toISOString().split('T')[0];

    await query(
      `INSERT INTO join_form_config (id, admissions_open, closure_notice, next_cohort_date, portal_badge, form_title, form_subtitle, submit_button_text, success_title, success_message, departments, academic_years, domain_interests, membership_perks, custom_fields, show_phone_field, show_portfolio_field, show_social_links, show_domain_interests, show_statement_of_purpose, sop_prompt, last_updated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
       ON CONFLICT (id) DO UPDATE SET
         admissions_open = COALESCE(EXCLUDED.admissions_open, join_form_config.admissions_open),
         closure_notice = COALESCE(EXCLUDED.closure_notice, join_form_config.closure_notice),
         next_cohort_date = COALESCE(EXCLUDED.next_cohort_date, join_form_config.next_cohort_date),
         portal_badge = COALESCE(EXCLUDED.portal_badge, join_form_config.portal_badge),
         form_title = COALESCE(EXCLUDED.form_title, join_form_config.form_title),
         form_subtitle = COALESCE(EXCLUDED.form_subtitle, join_form_config.form_subtitle),
         submit_button_text = COALESCE(EXCLUDED.submit_button_text, join_form_config.submit_button_text),
         success_title = COALESCE(EXCLUDED.success_title, join_form_config.success_title),
         success_message = COALESCE(EXCLUDED.success_message, join_form_config.success_message),
         departments = COALESCE(EXCLUDED.departments, join_form_config.departments),
         academic_years = COALESCE(EXCLUDED.academic_years, join_form_config.academic_years),
         domain_interests = COALESCE(EXCLUDED.domain_interests, join_form_config.domain_interests),
         membership_perks = COALESCE(EXCLUDED.membership_perks, join_form_config.membership_perks),
         custom_fields = COALESCE(EXCLUDED.custom_fields, join_form_config.custom_fields),
         show_phone_field = COALESCE(EXCLUDED.show_phone_field, join_form_config.show_phone_field),
         show_portfolio_field = COALESCE(EXCLUDED.show_portfolio_field, join_form_config.show_portfolio_field),
         show_social_links = COALESCE(EXCLUDED.show_social_links, join_form_config.show_social_links),
         show_domain_interests = COALESCE(EXCLUDED.show_domain_interests, join_form_config.show_domain_interests),
         show_statement_of_purpose = COALESCE(EXCLUDED.show_statement_of_purpose, join_form_config.show_statement_of_purpose),
         sop_prompt = COALESCE(EXCLUDED.sop_prompt, join_form_config.sop_prompt),
         last_updated = EXCLUDED.last_updated`,
      [
        'default',
        body.admissionsOpen ?? true,
        body.closureNotice || '',
        body.nextCohortDate || '',
        body.portalBadge || '',
        body.formTitle || '',
        body.formSubtitle || '',
        body.submitButtonText || '',
        body.successTitle || '',
        body.successMessage || '',
        JSON.stringify(body.departments || []),
        JSON.stringify(body.academicYears || []),
        JSON.stringify(body.domainInterests || []),
        JSON.stringify(body.membershipPerks || []),
        JSON.stringify(body.customFields || []),
        body.showPhoneField ?? true,
        body.showPortfolioField ?? true,
        body.showSocialLinks ?? true,
        body.showDomainInterests ?? true,
        body.showStatementOfPurpose ?? true,
        body.sopPrompt || '',
        lastUpdated
      ]
    );

    const updatedRes = await query('SELECT * FROM join_form_config WHERE id = $1', ['default']);
    return NextResponse.json({ success: true, config: mapJoinConfig(updatedRes.rows[0]) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update form config' }, { status: 400 });
  }
}
