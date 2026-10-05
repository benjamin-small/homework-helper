# Word Workshop

[![Repository maturity: Alpha](https://raw.githubusercontent.com/benjamin-small/agentic-harness-development/v2026.1001.190334/docs/badges/maturity-alpha.svg)](https://github.com/benjamin-small/agentic-harness-development/blob/v2026.1001.190334/docs/repository-maturity.md#alpha)

A small, static spelling tutor with selectable vocabulary lists. It includes **Week 7 · The Industrial Revolution** (25 words plus **mechanization**) and **Week 8 · Number the Stars** (25 words plus **annihilate**). Built for GitHub Pages, with no server, accounts, API keys, trackers, runtime dependencies, or externally loaded fonts.

**Maturity: Alpha.** Core grading, practice selection, data validation, and persistence have repeatable automated checks. Device speech and real use with a learner still need validation on the target device.

## Run locally

Use Node.js 22 or later. There are no packages to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Use `npm run check` to run the tests and create `dist/`, containing only public website files. All asset paths are relative, so the site works under a GitHub Pages repository path.

Select a **Practice list** on the home screen. Lists appear newest first, and opening or reloading the app selects the most recently added list. You can switch to an older list for the current visit, with separate progress, tricky-word practice, bonus preferences, and resets for each list. Finish practice before switching lists. Voice and reading speed are shared. Existing Week 7 results load unchanged.

For local testing, open http://127.0.0.1:4173/test-lists.html. This adds a three-word sample with an overlapping word, unfamiliar gap letters, a long title, and no bonus words. The preview entrypoint and fixtures live outside `src/` and are excluded from `dist/` and GitHub Pages.

## The activities

1. **Match the meaning:** choose the word matching a short definition.
2. **Spot the spelling:** hear a word and choose from the correct spelling and two plausible misspellings.
3. **Fill the gaps:** hear a word and drag one of three letter tiles into its tricky part (or tap a tile / select it with the keyboard). Two consecutive correct tile answers for that word unlock typing the missing letters. Gaps have a uniform width, no letter-count label, and no answer-length input limit.
4. **Spell it out:** hear a word, type its entire spelling, and submit.

Each question is graded once, including “I’m not sure yet” as a miss. Feedback shows the correct spelling, a teaching hint, and a sample sentence. Case and surrounding whitespace are ignored; internal letters must match exactly. Spellcheck and autocorrection are disabled where the browser supports those controls.

Use **Previous question**, click the left edge of the page on larger screens, or swipe right on an open area of the card to revisit answered questions in the current session. Swipe left after answering to continue. Cards slide left as you advance and right as you go back; reduced-motion settings disable the animation. Swipes ignore inputs and letter tiles and distinguish horizontal gestures from scrolling. Original choices, your answer, and feedback stay visible without changing scores or streaks. **Back to current question** restores an unfinished typed answer or selected tile. The results screen also offers **Review answers**; reviewing and returning to results never counts another session. Question history and drafts last only for the current page visit and are not saved to browser storage.

**Auto-advance correct answers** is an optional checkbox on the question card, on by default and remembered across lists. This update applies the new default once to existing preferences; switching it off afterward stays off. When enabled, a new correct answer advances after 0.8 seconds (or opens results after the last question). Missed and skipped answers stay on screen. **Stay on this question**, turning the toggle off, navigating back, listening again, opening sound settings, or hiding/leaving the page cancels a pending advance. Reviewing old answers never starts the timer.

**Auto-read the clue** appears beside **Read the clue** on meaning questions. It is off by default and remembered across lists and page reloads. Enabling it reads the current unanswered clue immediately and each new unanswered clue as it appears. Turning it off stops the reading; revisiting answered questions stays quiet until you choose **Read the clue**.

Adaptive sessions contain up to 12 distinct words. A word advances through meaning, spelling choice, gap tiles, and typed missing letters before full spelling. Tile and typed results are tracked separately, and existing typed-gap progress is preserved. A full-spelling miss returns to missing-letter practice. Two consecutive correct full-spelling answers make a word “feeling solid.” Missed words have greater selection weight; the dedicated tricky-word activity includes only previously missed words that are not solid yet. A session’s retry button practices exactly the words missed in that session with appropriate support. No machine learning model is involved: adaptation is a transparent set of rules.

## Words and privacy

`src/lists/` contains the supplied lists with original child-friendly definitions, plausible distractors, bracketed missing-letter patterns, hints, and example sentences. Week 7's printed answer key says **manufacture**; it takes precedence over the handwritten correction. Week 8 uses the supplied “Number the Stars” vocabulary; definitions and sentences are original practice material, not quotations from the book. The downloaded photo, handwriting, learner name, and original test score are not included in the project or deployment. The app starts with no imported grades.

Results are kept in `localStorage`, scoped to each list and origin, using `word-workshop:<list-id>:v1`. It stores aggregate counts, latest attempt time, per-mode correct counts and streaks, and preferences; it does not store a learner name or typed answers. Identical words in different lists have independent records. No app code sends results anywhere. A different device, browser, localhost port, or deployed origin has its own record. Clearing site data removes progress; private browsing may remove it on close. A visible warning explains when saving is blocked, and unsaved answers remain available while switching lists in the same tab. Reset requires confirmation and affects only the named list’s record.

Speech uses the browser’s Web Speech API. The automatic voice prefers Google US English when available, then falls back to a local English voice. An explicitly selected voice takes priority. Voices marked “device” in settings are local. Other system/browser voices may use a remote speech service. The app sends only the prompt to speech synthesis, never grades. Voice quality and availability depend on the device; use Sound settings to test it. If speech fails, a visible message suggests retrying or asking a grown-up to read aloud. Native synthesis is not bundled audio or a guaranteed offline voice. Sources: [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN speech voice locality](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService).

The app is a static load; once loaded, interactions need no application server. It has no service worker and does not guarantee reloading offline. There is no cross-device synchronization. Separate open tabs update from storage events; truly simultaneous submissions in multiple tabs can overwrite each other, so use one practice tab at a time.

## Publish on GitHub Pages

The included `.github/workflows/pages.yml` verifies the app, builds `dist/`, and publishes that directory on a push to `main` or a manual workflow run. In the destination repository, choose **Settings → Pages → Source → GitHub Actions**. The workflow publishes only site files, not project tooling or the source photo. See [GitHub’s custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The public website is at [Word Workshop](https://benjamin-small.github.io/homework-helper/). Its vocabulary lists are public; learner results stay in each visitor’s browser. The repository contains only the app, tests, portable build scripts, and this documentation. Local development records are excluded.

## Add or maintain a vocabulary list

1. Add a module in `src/lists/` exporting `{ id, title, description, words }`. Give a new assignment a new lowercase slug ID. Keep an existing ID stable when correcting its title or teaching text; saved progress follows the ID, not the display title. Avoid removing or renaming words in a practiced list; use a new list ID for a replacement assignment.
2. Add each word as an object with `word`, `definition`, `misspellings` (two incorrect spellings), `pattern` (one bracketed tricky part), `gapDistractors` (two incorrect letter groups), `hint`, `sentence`, and optional `bonus: true`. For example:

   ```js
   { word: 'pizza', definition: 'A baked dish with a flat bread base and toppings.',
     misspellings: ['piza', 'pizsa'], pattern: 'pi[zz]a', gapDistractors: ['z', 'zs'],
     hint: 'Use two z letters.', sentence: 'We shared a pizza.' }
   ```

   Lists need at least three words and at least one non-bonus word. Words and spelling choices use lowercase English letters, up to 40 characters. Gaps must reconstruct the word and leave some letters visible. Definitions, hints, and sentences are required. Choose gap groups short enough for the uniform field and check their layout on mobile. Optional `meaningDistractors` names two different words from the same list when random choices could be ambiguous; for example, Week 8 keeps **bravery** and **courage** from competing against each other.
3. Import and append the module to the registration array in `src/lists.js`. The exported catalog reverses that addition order, so the most recently added list appears first and automatically becomes the default on every page load. This applies to weekly and other custom lists alike; no date or week-number sorting is needed. No quiz engine or storage changes are needed to add a list.
4. Run `npm run check`. Catalog validation also runs before every build and fails with the list ID and offending content. Verify all four activities, bonus counts, speech, and mobile gaps before publishing.

The app entrypoint calls `startApp(catalog, defaultListId)`; local previews can supply a different catalog without adding test lists to production. The quiz engine accepts the active word collection, and persistence accepts the list identity explicitly. There is no in-browser list editor, import/export, or separate learner-profile system.
