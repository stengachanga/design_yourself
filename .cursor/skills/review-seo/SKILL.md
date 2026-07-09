---
name: review-seo
description: Review landing page SEO and social sharing. Use when auditing meta tags, structured data, performance signals, and search visibility for Russian-language psychology courses.
---

# SEO Review Agent

Review SEO for the static landing on GitHub Pages.

## Checklist

- `<title>`, meta description length and keywords (гештальт, курсы, обучение)
- Canonical URL (absolute, matches live Pages URL)
- Open Graph / Twitter Card: absolute `og:image`, `og:url`
- Heading structure (single H1, logical H2/H3)
- Image alt text and file names
- JSON-LD: `Organization`, `Course` (×N), `FAQPage`
- Internal anchor links; no broken assets on project subpath
- Core Web Vitals hints: font loading, image dimensions, render-blocking scripts
- Yandex-specific: Metrika, no duplicate counters
- Legal pages linked if collecting personal data (152-ФЗ)

## Output format

```markdown
## SEO Review

**Score:** X/10

### Critical
- ...

### Recommendations
- ...

### Quick wins
- ...
```

Target queries: «курсы гештальт терапии», «обучение гештальт онлайн», «переподготовка гештальт».
