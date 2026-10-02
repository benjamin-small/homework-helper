# Word Workshop

[![Repository maturity: Alpha](https://raw.githubusercontent.com/benjamin-small/agentic-harness-development/v2026.1001.190334/docs/badges/maturity-alpha.svg)](https://github.com/benjamin-small/agentic-harness-development/blob/v2026.1001.190334/docs/repository-maturity.md#alpha)

A small, static spelling tutor for the Industrial Revolution, Week 7: 25 words plus the bonus word **mechanization**. Built for GitHub Pages, with no server, accounts, API keys, trackers, runtime dependencies, or externally loaded fonts.

**Maturity: Alpha.** Core grading, practice selection, data validation, and persistence have repeatable automated checks. Device speech and real use with a learner still need validation on the target device.

## Run locally

Use Node.js 22 or later. There are no packages to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Use `npm run check` to run the tests and create `dist/`, containing only public website files. All asset paths are relative, so the site works under a GitHub Pages repository path.

## The activities

1. **Match the meaning:** choose the word matching a short definition.
2. **Spot the spelling:** hear a word and choose from the correct spelling and two plausible misspellings.
3. **Fill the gaps:** hear a word and drag one of three letter tiles into its tricky part (or tap a tile / select it with the keyboard). Two consecutive correct tile answers for that word unlock typing the missing letters. Gaps have a uniform width, no letter-count label, and no answer-length input limit.
4. **Spell it out:** hear a word, type its entire spelling, and submit.

Each question is graded once, including “I’m not sure yet” as a miss. Feedback shows the correct spelling, a teaching hint, and a sample sentence. Case and surrounding whitespace are ignored; internal letters must match exactly. Spellcheck and autocorrection are disabled where the browser supports those controls.

Adaptive sessions contain up to 12 distinct words. A word advances through meaning, spelling choice, gap tiles, and typed missing letters before full spelling. Tile and typed results are tracked separately, and existing typed-gap progress is preserved. A full-spelling miss returns to missing-letter practice. Two consecutive correct full-spelling answers make a word “feeling solid.” Missed words have greater selection weight; the dedicated tricky-word activity includes only previously missed words that are not solid yet. A session’s retry button practices exactly the words missed in that session with appropriate support. No machine learning model is involved: adaptation is a transparent set of rules.

## Words and privacy

`src/words.js` contains the transcribed printed list, original child-friendly definitions, plausible distractors, bracketed missing-letter patterns, hints, and example sentences. The printed answer key says **manufacture**; it takes precedence over the handwritten correction. The downloaded photo, handwriting, name, and original test score are not included in the project or deployment. The app starts with no imported grades.

Results are kept in `localStorage`, scoped to this list and origin. It stores aggregate counts, latest attempt time, per-mode correct counts and streaks, and preferences; it does not store a learner name or typed answers. No app code sends results anywhere. A different device, browser, localhost port, or deployed origin has its own record. Clearing site data removes progress; private browsing may remove it on close. A visible warning explains when saving is blocked. Reset requires confirmation and affects only this app’s record.

Speech uses the browser’s Web Speech API. Local English voices are preferred; voices marked “device” in settings are local. Other system/browser voices may use a remote speech service. The app sends only the prompt to speech synthesis, never grades. Voice quality and availability depend on the device; use Sound settings to test it. If speech fails, a visible message suggests retrying or asking a grown-up to read aloud. Native synthesis is not bundled audio or a guaranteed offline voice. Sources: [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN speech voice locality](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService).

The app is a static load; once loaded, interactions need no application server. It has no service worker and does not guarantee reloading offline. There is no cross-device synchronization. Separate open tabs update from storage events; truly simultaneous submissions in multiple tabs can overwrite each other, so use one practice tab at a time.

## Publish on GitHub Pages

The included `.github/workflows/pages.yml` verifies the app, builds `dist/`, and publishes that directory on a push to `main` or a manual workflow run. In the destination repository, choose **Settings → Pages → Source → GitHub Actions**. The workflow publishes only site files, not project tooling or the source photo. See [GitHub’s custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The public website is at [Word Workshop](https://benjamin-small.github.io/homework-helper/). Its word list is public; learner results stay in each visitor’s browser. The repository contains only the app, tests, portable build scripts, and this documentation. Local development records are excluded.
