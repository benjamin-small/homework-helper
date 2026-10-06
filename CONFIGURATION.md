# Configuration

Use Node.js 24 or later for development and validation. There are no application packages to install, server accounts, API keys, build-time secrets, or externally loaded fonts.

## Local preview

`npm run dev` listens on 127.0.0.1:4173. Its only environment variable is optional `PORT`:

```sh
PORT=4174 npm run dev
```

PORT affects only the local development server, not the build or deployed app. Use a valid unused TCP port. The browser's storage is scoped to the origin, so changing ports gives the preview a separate progress record. [.env.example](.env.example) documents the optional value for reference; `.env` files are not loaded, so pass PORT in the shell. No secrets are required.

## Browser preferences and content

Practice list, bonus words, auto-advance, auto-read clues, voice, and reading speed are controlled in the interface and saved in localStorage. Voice availability depends on the device. List progress is stored separately under `word-workshop:<list-id>:v1`; see README.md for privacy and reset behavior. There is no cross-device configuration service.

Add vocabulary modules in src/lists/ and register them in src/lists.js as documented in README.md. Test-only previews at /test-lists.html are served locally and excluded from production.

## Deployment

The Pages workflow and PR CI both use Node.js 24, the minimum supported runtime. Pages publishes only dist/. Use the repository's .nvmrc (`nvm use`, or `nvm install` if needed) to select Node.js 24 locally. Set GitHub Settings → Pages → Source to GitHub Actions. Relative asset paths support the repository site at https://benjamin-small.github.io/homework-helper/ without a configurable base URL. GitHub's workflow token handles deployment; no application secret needs provisioning.
