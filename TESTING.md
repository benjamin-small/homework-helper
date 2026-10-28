# Tests and coverage

Run `npm run check` to check app syntax, run the Node.js tests, validate all registered vocabulary lists, and build the public site. No dependency installation is needed. Pull-request CI also runs `npm run test:coverage`.

## Measured baseline

Measured on October 28, 2026 with Node.js 26.10.0: **41 tests pass**, with **84.67% line coverage**, **95.30% branch coverage**, and **94.12% function coverage** for the source modules loaded by the tests. Activity tracking adds a loaded logic module; these percentages do not establish browser interaction coverage.

Reproduce the native Node.js coverage report with:

```sh
npm run test:coverage
```

This command filters coverage to src/**/*.js and excludes test fixtures and tooling. Node.js reports loaded modules only: src/app.js, src/main.js, and src/tracker.js are not imported by the unit tests and are absent from the denominator. These percentages are not whole-application coverage. No minimum coverage threshold is currently imposed. Update the dated measurement and scope when tested source changes.

| Loaded source | Line coverage |
| --- | ---: |
| activity.js | 98.55% |
| engine.js | 100.00% |
| gap-exercise.js | 20.20% |
| list-schema.js | 100.00% |
| lists.js | 100.00% |
| lists/week-7.js | 100.00% |
| lists/week-8.js | 100.00% |
| lists/week-9.js | 100.00% |
| lists/week-10.js | 100.00% |
| lists/week-11.js | 100.00% |
| question-navigation.js | 38.81% |
| session.js | 100.00% |
| storage.js | 100.00% |

## Automated test scope

- Activity timing across minute boundaries, idle and focus pauses, overlapping tabs, weighted rates, calendar rollups, malformed data, and blocked storage.

- Grading, adaptive mode progression, mastery and review streaks, queue size, bonus-word selection, and gap choices.
- Vocabulary schemas, all five production lists, exact Weeks 8–11 word order and bonus status, an independent sample catalog, distinct answer choices, and invalid catalog rejection.
- Storage validation, malformed or blocked storage, list isolation, resets, legacy Week 7 progress, and preference defaults/migration.
- Session history, saved question choices and drafts, single grading, single session counting, and canceled/stale auto-advance timers.
- Gap markup without answer-length hints, swipe-direction classification, and reduced-motion animation guards.

The tests do not exercise most DOM event wiring, real drag/drop, non-reduced-motion animations, browser speech synthesis, deployed caching, or end-to-end app rendering. The build validates list content and creates versioned static assets but is not an end-to-end browser test.

## Manual checks

Use `npm run dev`; /test-lists.html includes a local-only sample list. For interface or list changes, check all four activities, keyboard navigation, tile and typed gaps on narrow mobile and desktop widths, backtracking without regrading, reduced motion, and preference persistence. Test browser/device speech separately; unit tests cannot establish that audio works. Before declaring a deployment verified, confirm its source commit and successful Pages run, then smoke-test the public site.

### Activity dashboard acceptance (October 28, 2026)

Local browser checks used synthetic submissions, not learner evidence. One submission in each of the four activities produced four total answers (three correct); skipping and reviewing an earlier question did not add submissions. Dashboard totals stayed unchanged while it was open. Daily, Monday-based weekly, and monthly selections preserved the same totals. A 375px viewport had matching innerWidth and document scrollWidth, with the wider detail tables contained in focusable scroll regions. Reduced-motion rendering was checked. Idle cutoffs, focus loss, overlapping records, calendar grouping, and blocked storage are covered by deterministic tests; physical-device interaction and audible speech were not revalidated for this change.
