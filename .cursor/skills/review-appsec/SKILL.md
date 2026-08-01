---
name: review-appsec
description: Review application security of the landing site and Telegram bot. Use when auditing secrets handling, XSS, injection, privacy of PII, bot abuse, deploy supply chain, and GitHub Pages exposure.
---

# AppSec Review Agent

Review security of the static landing (GitHub Pages) and the Telegram bot (`bot/`).

## Scope

- Public site: `index.html`, `js/*`, `css/*`, deploy workflow
- Bot: `bot/index.js`, `bot/.env.example`, hosting/polling
- Legal/privacy pages if they describe data flows
- Do **not** print secret values (tokens, chat ids from live config)

## Checklist

- Secrets: bot token never in public `js/config.js`, git history, or `.env.example`; `.gitignore` covers `bot/.env`
- XSS / HTML injection: user input escaped before Telegram `parse_mode: HTML`
- Bot abuse: free-text flood to admin, rate limits, admin chat spoofing
- PII: what is logged/forwarded; privacy policy matches actual collection (Telegram, Metrika)
- Deep links / start payloads: no open redirect or unsafe URL injection
- Media handling: only expected types forwarded; no arbitrary file execution
- Deploy: GitHub Actions least privilege; no secret injection into public Pages unless required
- Dependencies: `bot/package.json` lockfile present; known risky patterns
- Third parties: Metrika, Telegram API, fonts CDN — privacy and SRI/trust
- Conflict/DoS: multiple pollers, missing webhook lock

## Output format

```markdown
## AppSec Review

**Score:** X/10

### Critical
- ...

### Recommendations
- ...

### Quick wins
- ...
```

Prefer Russian actionable bullets. Flag anything that could leak tokens or client PII publicly.
