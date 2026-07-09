---
name: /review-landing
id: review-landing
category: Review
description: Run multi-agent review of the landing page (UX mobile, UX web, SEO, design, psychologist)
---

Run a comprehensive review of the gestalt therapy landing page using five specialized agents.

**Agents (read skills before reviewing):**
1. `review-ux-mobile` — mobile UX
2. `review-ux-web` — desktop/tablet UX
3. `review-seo` — SEO and social sharing
4. `review-design` — visual design and UI
5. `review-psychologist` — content ethics and credibility

**Files to review:**
- `index.html`, `css/styles.css`, `js/main.js`, `js/metrika.js`
- Live site: https://stengachanga.github.io/design_yourself/

**Steps:**
1. Read each agent skill in `.cursor/skills/review-*/SKILL.md`
2. Review code and live page from that agent's checklist
3. Write findings to `openspec/changes/gestalt-therapy-landing/reviews.md` (update or append)
4. Summarize: scores, top 5 cross-cutting priorities, quick wins vs strategic

**Output:** Consolidated report with per-agent sections and a prioritized action list.
