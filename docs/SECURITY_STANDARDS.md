# Security Standards — hdkit-project-1 Todo App
# Last updated: 2026-02-27
#
# This file is the project-specific extension loaded by hd-security-review and
# other security-aware skills. It is additive on top of the base standard at
# .claude/skills/hd-security-review/SECURITY_STANDARDS.md.
# Project rules do not waive any generic rule — they extend or strengthen them.

## Project Context

- **Type:** Personal todo web app — no auth, no multi-user, no PII beyond self-entered task text
- **Data classification:** Public (no sensitive data)
- **Compliance scope:** N/A (no user accounts, no payment data, no health data)

---

## Applicable Compliance Frameworks

```yaml
# Project: hdkit-project-1
applicable_compliance:
  # No compliance frameworks active — single-user personal tool with no PII, no auth.
  # Add frameworks here if the scope expands (e.g., user accounts → GDPR consideration).
  []
```

---

## Project Rules

```yaml
project_rules:
  # SQL injection: Protected by Drizzle ORM parameterized queries. No raw SQL allowed.
  - "All database mutations must use Drizzle ORM methods (insert/update/delete). No raw SQL strings."

  # Input validation: Server Actions validate title at the boundary.
  - "Server Actions must call validateTitle() before any DB write. Max title length: 500 chars."

  # Secrets: Turso auth token must never be committed.
  - "TURSO_AUTH_TOKEN must only be set as a Vercel env var. Never committed to .env.local or source."

  # XSS: React escapes by default. No dangerouslySetInnerHTML.
  - "No dangerouslySetInnerHTML usage anywhere in the codebase."

  # No auth surface: This is intentional — single-user personal tool.
  - "No authentication layer — single-user tool. If multi-user scope is added, revisit this file."
```

---

## Notes

- The base SECURITY_STANDARDS.md covers the CRITICAL gate, severity levels, and full OWASP Top 10 rules.
- This file only needs to declare what is **specific to this project**.
- Review and update this file if the app adds user accounts, payments, or processes third-party data.
