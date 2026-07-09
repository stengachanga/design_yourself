## ADDED Requirements

### Requirement: Yandex Metrika counter initialization
The site SHALL load the Yandex Metrika tracking script on every page view. The counter ID MUST be configurable via an environment variable or config file (not hardcoded in source).

#### Scenario: Counter loads on page open
- **WHEN** user opens the landing page with a valid Metrika counter ID configured
- **THEN** the Yandex Metrika script is injected and initializes successfully

#### Scenario: Counter ID missing
- **WHEN** the Metrika counter ID is not configured
- **THEN** the site renders without errors and analytics script is not loaded

### Requirement: Page view tracking
Yandex Metrika SHALL automatically track page views (hit) on initial load.

#### Scenario: First visit recorded
- **WHEN** user loads the landing page for the first time in a session
- **THEN** Metrika records a page view event

### Requirement: CTA click goals
The site SHALL send Metrika reach-goal events when users click primary and secondary CTA buttons.

#### Scenario: Hero CTA click tracked
- **WHEN** user clicks the primary hero CTA button
- **THEN** Metrika receives a `cta_hero_click` goal event

#### Scenario: Contact CTA click tracked
- **WHEN** user clicks the contact/application CTA button
- **THEN** Metrika receives a `cta_contact_click` goal event

### Requirement: Form submission goal
The site SHALL send a Metrika reach-goal event when the user successfully submits the contact or application form.

#### Scenario: Form submit tracked
- **WHEN** user submits the contact form with valid required fields
- **THEN** Metrika receives a `form_submit` goal event

### Requirement: Section scroll depth goals
The site SHALL send Metrika reach-goal events when the user scrolls to key sections (courses, benefits, contact) for the first time per session.

#### Scenario: Courses section viewed
- **WHEN** user scrolls the courses section into viewport for the first time
- **THEN** Metrika receives a `scroll_courses` goal event

### Requirement: Webvisor and click map
Yandex Metrika SHALL be configured with Webvisor and click map enabled for behavioral analysis.

#### Scenario: Webvisor enabled in config
- **WHEN** the Metrika counter is initialized
- **THEN** Webvisor and clickmap options are set to enabled
