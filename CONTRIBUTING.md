# Contributing

Open an issue before substantial changes so scope and expected behavior are clear. Keep pull requests focused and describe the learner-visible change and validation. Review ownership belongs to @benjamin-small.

## Local setup

Use Node.js 24 or later. With nvm, run `nvm install` and `nvm use` to select the version in .nvmrc. No dependencies need installing. Run `npm run dev` and open http://127.0.0.1:4173. See [CONFIGURATION.md](CONFIGURATION.md) for the optional local port and browser preferences.

## Validation

Before opening a pull request:

```sh
npm run check
npm run test:coverage
```

The first command checks syntax, runs tests, validates the vocabulary catalog, and builds dist/. See [TESTING.md](TESTING.md) for measured coverage and manual checks; update its baseline when tested source changes. PR CI runs these commands without installing packages or requiring a lockfile.

Follow README.md's vocabulary-list schema and registration instructions. Preserve existing list IDs and storage keys. Keep examples age-appropriate and avoid ambiguous meaning choices. Never include learner identities, grades, private photos, credentials, or generated dist/ files in a contribution.

CI's validate check must pass before merging to main. Main pushes publish dist/ through GitHub Pages. See [docs/releases.md](docs/releases.md) for release notes and deployment verification. Contributions are covered by the repository's [MIT license](LICENSE).
