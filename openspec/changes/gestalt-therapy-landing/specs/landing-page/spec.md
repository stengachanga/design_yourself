## ADDED Requirements

### Requirement: Single-page structure
The landing page SHALL be a single HTML document with anchor-based navigation between sections. All primary content MUST be accessible without page reloads.

#### Scenario: User navigates between sections
- **WHEN** user clicks a navigation link in the header
- **THEN** the page scrolls smoothly to the corresponding section without reloading

### Requirement: Hero section
The landing page SHALL display a hero section with a headline about gestalt therapy courses, a supporting subtitle, and a primary call-to-action button.

#### Scenario: Hero CTA visible on load
- **WHEN** user opens the landing page
- **THEN** the hero section is visible above the fold with headline, subtitle, and primary CTA button

### Requirement: About gestalt approach section
The landing page SHALL include a section explaining the gestalt therapy approach and its relevance to the offered courses.

#### Scenario: About section content
- **WHEN** user scrolls to the about section
- **THEN** the section displays explanatory text about gestalt therapy in Russian

### Requirement: Courses program section
The landing page SHALL list available psychological courses with title, brief description, and duration or format for each course.

#### Scenario: Course cards displayed
- **WHEN** user views the courses section
- **THEN** at least one course card is shown with title and description

### Requirement: Benefits section
The landing page SHALL present key benefits of enrolling in the courses (e.g., practical skills, certification, community).

#### Scenario: Benefits list visible
- **WHEN** user scrolls to the benefits section
- **THEN** a list or grid of at least three benefits is displayed

### Requirement: Social proof section
The landing page SHALL include a trust section with testimonials or credentials (instructor info, reviews, or partner logos).

#### Scenario: Testimonial displayed
- **WHEN** user views the social proof section
- **THEN** at least one testimonial or credential block is shown

### Requirement: FAQ section
The landing page SHALL include a frequently asked questions section with expandable or visible question-answer pairs.

#### Scenario: FAQ answers available
- **WHEN** user views the FAQ section
- **THEN** at least three question-answer pairs are displayed

### Requirement: Contact or application CTA
The landing page SHALL provide a contact form or prominent CTA (e.g., Telegram, email, or application button) for lead capture.

#### Scenario: Lead capture action
- **WHEN** user clicks the main application CTA in the contact section
- **THEN** a form is shown or user is directed to a contact channel

### Requirement: Responsive layout
The landing page SHALL render correctly on viewports from 320px to 1920px width without horizontal scrolling.

#### Scenario: Mobile layout
- **WHEN** user views the page on a 375px-wide viewport
- **THEN** all sections stack vertically and remain readable without horizontal overflow

### Requirement: SEO and social meta tags
The landing page SHALL include `<title>`, `<meta name="description">`, and Open Graph tags (`og:title`, `og:description`, `og:image`) for search engines and social sharing.

#### Scenario: Meta tags present
- **WHEN** the HTML document is inspected
- **THEN** title, description, and Open Graph meta tags are present with non-empty values

### Requirement: Russian language content
All user-facing text on the landing page SHALL be in Russian.

#### Scenario: Page language
- **WHEN** user reads any section of the landing page
- **THEN** the content is displayed in Russian
