# Code Review: `working tree` → `HEAD (2cb08ab)`

**Reviewed:** 2026-03-03
**Task:** No task context
**Standards:** defaults only (feature flags: no, observability: no, i18n: no — all required: no)

**Scope:** Uncommitted changes on `main` — search + sort feature (search-sort-bar, todo-list pipeline, ui store, page layout, docs)

---

## Review Findings

✓ Aspect 1 (Requirements Coverage) — N/A (no task context)

✓ Aspect 2 (Correctness) — no issues

✓ Aspect 3 (Possible Breakage) — no issues

✓ Aspect 4 (Better Approach) — no issues

**Aspect 5 — Redundancy** 🟡 Advisory
- `searchQuery.trim()` is re-computed at `todo-list.tsx:52` when `trimmedQuery` (already trimmed + lowercased) is in scope and could be used for the same truthiness check — `src/components/todo-list.tsx:52`
- `.gitignore` adds `.claude/agents/hd-*` and `.claude/skills/*` which are already covered by the broader `.claude/` rule at `.gitignore:51` — redundant entries — `.gitignore:52-54`

**Aspect 6 — Tests** 🟡 Advisory
- The three-step pipeline (search substring match, sort with nulls-at-bottom, `created_desc` order-preservation via `return 0`) introduces the most logic-dense code in this diff. No test infrastructure exists in the project. Consider adding tests for the sort logic in particular (null due_date handling, direction flip) when a testing framework is introduced.

✓ Aspect 7 (Security) — no issues

✓ Aspect 8 (Breaking Changes) — see Breaking Changes block below

✓ Aspect 9 (Implication Assessment) — no issues

✓ Aspect 10 (Code Quality) — no issues

✓ Aspect 11 (Completeness) — N/A (no task context)

---

### ⚠️ Breaking Changes

No breaking changes detected.

The `useUIStore` expansion is purely additive. Default state (`searchQuery: ''`, `sortOrder: 'created_desc'`) produces output identical to previous behavior. `SortOrder` is a new named export only — no removals or renames.

---

## Verdict: ⚠️ Approved with Comments

All 🟡 Advisory findings — safe to merge as-is. Advisories are low-effort to address if desired.

**Advisory resolution (optional):**
1. `todo-list.tsx:52` — change `searchQuery.trim()` to `trimmedQuery` (already in scope)
2. `.gitignore` — remove the two redundant lines under `# hdkit-managed` (`.claude/agents/hd-*`, `.claude/skills/*`) since `.claude/` already covers them

---

> This is AI-assisted code review. It complements but does not replace human review,
> automated testing, and security scanning.
