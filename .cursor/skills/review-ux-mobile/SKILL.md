---
name: review-ux-mobile
description: Review landing page UX on mobile (320–768px). Use when auditing mobile usability, touch targets, navigation, forms, and conversion on phones.
---

# UX Mobile Review Agent

Review the gestalt therapy landing (`index.html`, `css/styles.css`, `js/main.js`) from a **mobile-first UX** perspective.

## Checklist

- Touch targets ≥ 44×44px; spacing between tappable elements
- Hero readable above the fold on 375px; CTA visible without scroll
- Burger menu: open/close, focus trap, body scroll lock, escape key
- Fixed header overlap with anchor targets (`scroll-padding-top`)
- Form usability: input types, keyboard types, validation messages, success state
- Thumb zone: primary CTA reachable; sticky mobile CTA if page is long
- Performance: image sizes, font loading, no horizontal scroll
- Course cards scannability on narrow screens
- FAQ `<details>` usability on touch devices

## Output format

```markdown
## UX Mobile Review

**Score:** X/10

### Critical
- ...

### Recommendations
- ...

### Quick wins
- ...
```

Prioritize conversion impact for ad traffic from mobile social networks.
