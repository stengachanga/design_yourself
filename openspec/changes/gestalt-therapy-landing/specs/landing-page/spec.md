## ADDED Requirements

### Requirement: Brand identity
The landing page SHALL present the brand name «Собери Себя Сам» as a primary visual signal (logo from label asset and/or hero-level wordmark). The mission phrase «Конструктор личности» SHALL appear in the hero.

#### Scenario: Brand visible in first viewport
- **WHEN** user opens the landing page
- **THEN** brand name or label logo and mission are visible without scrolling

### Requirement: Hero with consultation CTA
The landing page SHALL display a hero with supporting copy about structuring (not rebuilding) personality, a primary CTA «Записаться на консультацию», and the psychologist photo as the dominant visual.

#### Scenario: Hero CTA
- **WHEN** user clicks the primary hero CTA
- **THEN** the page scrolls to the contact/application section

### Requirement: Methods section
The landing page SHALL list working methods: КПТ, гештальт, коучинг, and state that only classical evidence-based psychological methods are used.

#### Scenario: Methods visible
- **WHEN** user views the approach section
- **THEN** КПТ, гештальт and коучинг are named explicitly

### Requirement: Specialist credentials
The landing page SHALL include education (Московский институт психологии, психолог-консультант) and prior experience (8 years state service, 8 years transnational corporation, 8 years research/teaching).

#### Scenario: Credentials listed
- **WHEN** user views the about-specialist section
- **THEN** education and three experience blocks are displayed

### Requirement: Principles and boundaries
The landing page SHALL communicate what is not offered (no «magic pill», no quantum leap, no reality transurfing) and what is used (classical scientifically supported methods).

#### Scenario: Boundaries shown
- **WHEN** user views the principles section
- **THEN** both «do not» and «do use» statements are visible

### Requirement: Guarantees
The landing page SHALL state guarantees: safe space, setting transparency, absolute confidentiality.

#### Scenario: Guarantees listed
- **WHEN** user views the guarantees section
- **THEN** all three guarantees are shown

### Requirement: Outcome statement
The landing page SHALL describe the intended outcome as sequential organic transformation with sustainable improvement without emotional rollback to ineffective patterns.

#### Scenario: Outcome copy present
- **WHEN** user reads the results section
- **THEN** the outcome statement from site description is present in Russian

### Requirement: Consultation lead capture
The landing page SHALL provide a contact form or CTA to book a consultation, with consent for personal data processing.

#### Scenario: Form submit path
- **WHEN** user submits a valid consultation request
- **THEN** a success or delivery path is shown and analytics goal may fire

### Requirement: Label-based color scheme
The visual theme SHALL use navy/teal neutrals and orange accent derived from `Label.jpg` (CSS variables), not the previous sage/cream psychology palette.

#### Scenario: Accent CTA uses label orange
- **WHEN** primary CTA buttons are inspected
- **THEN** their background uses the label orange accent token

### Requirement: Responsive layout
The landing page SHALL render correctly on viewports from 320px to 1920px without horizontal scrolling.

#### Scenario: Mobile layout
- **WHEN** user views the page on a 375px-wide viewport
- **THEN** sections stack vertically without horizontal overflow

### Requirement: SEO and social meta tags
The landing page SHALL include title, description, canonical, and Open Graph tags reflecting consultation branding.

#### Scenario: Meta tags present
- **WHEN** the HTML document is inspected
- **THEN** title, description, and Open Graph tags reference the brand and consultation offer

### Requirement: Russian language content
All user-facing text on the landing page SHALL be in Russian.

#### Scenario: Page language
- **WHEN** user reads any section
- **THEN** content is displayed in Russian
