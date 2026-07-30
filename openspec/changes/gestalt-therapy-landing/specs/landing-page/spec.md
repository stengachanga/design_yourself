## ADDED Requirements

### Requirement: Brand identity
The landing page SHALL present «Конструктор Личности» as the primary header/logo wordmark. The mission phrase «Конструктор личности» MAY also appear in the hero. The label asset from `Label.jpg` SHALL remain visible as brand imagery.

#### Scenario: Brand visible in first viewport
- **WHEN** user opens the landing page
- **THEN** header shows «Конструктор Личности» and hero shows mission/task copy without scrolling

### Requirement: Hero with consultation CTA
The landing page SHALL display a hero with task copy «Задача: не пересобрать, а структурировать», a primary CTA that opens the Telegram bot for booking, and the psychologist photo as the dominant visual.

#### Scenario: Hero CTA opens bot
- **WHEN** user clicks the primary hero CTA
- **THEN** the Telegram bot chat opens (new tab or Telegram deep link)

### Requirement: Methods section
The landing page SHALL include an approach section with a «Методы» heading listing КПТ, гештальт, коучинг, and state that only classical evidence-based psychological methods are used.

#### Scenario: Methods visible
- **WHEN** user views the approach section
- **THEN** the heading «Методы» and КПТ, гештальт, коучинг are named explicitly

### Requirement: Specialist credentials
The landing page SHALL include education (Московский институт психологии, психолог-консультант) and prior experience (8 years state service, 8 years transnational corporation, 8 years research/teaching).

#### Scenario: Credentials listed
- **WHEN** user views the about-specialist section
- **THEN** education and three experience blocks are displayed

### Requirement: Principles
The landing page SHALL communicate that only classical scientifically supported methods are used. The page SHALL NOT require a «Не предлагаю» block.

#### Scenario: Principles shown
- **WHEN** user views the principles section
- **THEN** the «use only classical methods» statement is visible

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

### Requirement: Telegram bot as booking channel
The landing page SHALL NOT include an on-page lead capture form with name/contact fields. The contact section SHALL provide a clear CTA that opens the practice Telegram bot (`telegramUsername` from config). The landing page SHALL NOT list bot menu actions (book / ask / pay) as on-page feature items — those actions exist only inside the bot.

#### Scenario: Contact CTA opens bot
- **WHEN** user clicks the contact-section booking CTA
- **THEN** the Telegram bot opens and no web form fields are required on the page
- **AND** book/ask/pay actions are not presented as a feature list on the website

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
