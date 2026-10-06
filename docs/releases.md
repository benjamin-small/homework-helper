# Releases

Word Workshop is a continuously deployed static website. Every push to main runs the Pages workflow, which validates and builds dist/ before deploying. Deployment identity is the source commit and workflow run; an npm package is not published.

package.json currently records version 1.0.0. For explicitly tagged releases, use semantic versioning and matching vX.Y.Z tags: patch for fixes, minor for compatible additions, and major for incompatible behavior or saved-data changes. Routine website deployments do not require a version bump or tag.

PR descriptions must summarize learner-visible changes and validation. Tagged releases also need GitHub release notes describing improvements, fixes, limitations, and any required steps. Preserve existing progress keys and provide a migration plan before changing saved-data formats.

Before release, run `npm run check` and `npm run test:coverage`, update the coverage baseline when source changes, and complete relevant manual checks in TESTING.md. Confirm remote CI passes. After deployment, verify the exact main commit's successful Pages run and smoke-test the public site; a local build alone does not prove publication.

For rollback, revert the offending commit through a PR, validate, merge, and verify the resulting Pages deployment. Browser-local progress is separate from deployment; avoid rollback changes that cannot read data already written by the newer version. The build versions CSS and module imports to refresh cached application assets.
