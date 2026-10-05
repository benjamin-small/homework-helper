# Agent instructions

Word Workshop is a static spelling tutor. Use Node.js 22 or later; there are no packages to install. Run `npm run dev` for the local preview at http://127.0.0.1:4173.

At session start, run `$poietic-harness-start` when available. Initial user-scope setup is authorized. Preserve project pins; startup does not authorize upgrades. Use Jev by default for suitable bounded structured decisions when available; read its installed SKILL.md and pass the entrypoint and authorized execution access to subagents. Do not delegate without authorization.

## Validation and completion

- Run `npm run check` for syntax, automated tests, catalog validation, and the production build.
- Run `npm run test:coverage` when changing tested logic; update TESTING.md with measured values and scope changes.
- For interface changes, check all four activities, keyboard controls, mobile gaps, reduced motion, and browser speech as relevant. Follow the installed ui-standards skill when available.
- Review the diff and preserve unrelated work. Report local checks, remote CI, merge, and live deployment separately.

## Constraints

- Keep the app static and dependency-free; use relative asset paths compatible with GitHub Pages.
- Keep learner progress browser-local. Do not commit learner names, grades, source photos, credentials, or local environment files.
- Preserve list IDs, words, storage keys, and existing achievements. Follow README.md for list additions; new lists belong in src/lists/ and the src/lists.js registry.
- Keep preview-only lists and fixtures outside src/ and dist/. scripts/build.mjs copies the entire src/ tree to production.
- Do not commit dist/, private tooling records, or local skill knowledge. Keep docs and tests aligned with behavior.
- Use pull requests for main; CI's validate check is required before merge. Deployment runs from main through the Pages workflow.
