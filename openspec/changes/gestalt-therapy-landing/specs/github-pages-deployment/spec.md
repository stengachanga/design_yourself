## ADDED Requirements

### Requirement: Static site output
The project SHALL produce a deployable static output directory (`docs/` or `dist/`) containing `index.html`, assets, and all required files for GitHub Pages hosting.

#### Scenario: Build produces static files
- **WHEN** the build or copy step runs
- **THEN** the output directory contains `index.html` and linked CSS/JS/image assets

### Requirement: GitHub Pages source configuration
The repository SHALL be configured to publish from the designated output branch and folder (e.g., `main` branch `/docs` or `gh-pages` branch root) compatible with GitHub Pages.

#### Scenario: Pages source documented
- **WHEN** a developer reads the project README
- **THEN** GitHub Pages source branch and folder are documented with setup instructions

### Requirement: Automated deployment on push
A GitHub Actions workflow SHALL deploy the site to GitHub Pages automatically when changes are pushed to the main branch.

#### Scenario: Push triggers deploy
- **WHEN** code is pushed to the main branch
- **THEN** the GitHub Actions workflow runs and publishes the updated site to GitHub Pages

### Requirement: Correct asset paths for project sites
When deployed as a GitHub Pages project site (`username.github.io/repo-name`), all asset paths (CSS, JS, images) SHALL resolve correctly without 404 errors.

#### Scenario: Assets load on project site
- **WHEN** user opens the deployed GitHub Pages project URL
- **THEN** all stylesheets, scripts, and images load successfully

### Requirement: HTTPS by default
The deployed site SHALL be accessible over HTTPS via GitHub Pages default certificate.

#### Scenario: HTTPS access
- **WHEN** user navigates to the GitHub Pages URL
- **THEN** the site is served over HTTPS without mixed-content warnings for same-origin assets

### Requirement: Custom domain support (optional)
The deployment setup SHOULD support adding a custom domain via `CNAME` file without code changes.

#### Scenario: CNAME file placement
- **WHEN** a custom domain is configured
- **THEN** a `CNAME` file can be placed in the publish directory with the domain name
