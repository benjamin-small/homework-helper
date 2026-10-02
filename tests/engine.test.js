import test from 'node:test';
import assert from 'node:assert/strict';
import { WORDS } from '../src/words.js';
import { MODES, choices, emptyProgress, gapParts, isCorrect, makeQueue, mastered, needsReview, nextMode, priority, recordAnswer, totals } from '../src/engine.js';
import { STORAGE_KEY, readProgress, validProgress, writeProgress } from '../src/storage.js';

test('printed list has exactly 25 words and the mechanization bonus', () => {
  assert.equal(WORDS.length, 26);
  assert.equal(new Set(WORDS.map(entry => entry.word)).size, 26);
  assert.deepEqual(WORDS.filter(entry => entry.bonus).map(entry => entry.word), ['mechanization']);
  assert.ok(WORDS.some(entry => entry.word === 'manufacture'));
  assert.ok(!WORDS.some(entry => entry.word === 'manufacturer'));
});
test('each gap reconstructs its word and distractors never include the answer', () => {
  for (const entry of WORDS) {
    const { before, missing, after } = gapParts(entry);
    assert.equal(before + missing + after, entry.word);
    assert.ok(missing.length > 0 && missing.length < entry.word.length);
    assert.equal(new Set([entry.word, ...entry.misspellings]).size, 3);
    for (const mode of ['meaning', 'choice']) {
      const options = choices(entry, mode);
      assert.equal(options.length, 3);
      assert.equal(options.filter(option => option === entry.word).length, 1);
      assert.equal(new Set(options).size, 3);
    }
  }
});
test('grading accepts case and outer spaces, rejects incorrect and empty answers', () => {
  assert.ok(isCorrect('  INDUSTRY  ', 'industry'));
  for (const value of ['', 'industery', 'ind ustry', 'industry!']) assert.ok(!isCorrect(value, 'industry'));
});
test('adaptive stages lead to full spelling and two unassisted successes', () => {
  let progress = emptyProgress();
  for (const mode of MODES) {
    assert.equal(nextMode(progress.words.machine), mode.id);
    progress = recordAnswer(progress, 'machine', mode.id, 'machine');
  }
  assert.equal(mastered(progress.words.machine), false);
  progress = recordAnswer(progress, 'machine', 'spell', 'machine');
  assert.equal(mastered(progress.words.machine), true);
  assert.equal(totals(progress).mastered, 1);
});
test('a failed full spelling restores support and requires a new spelling streak', () => {
  let progress = emptyProgress();
  for (const mode of MODES) progress = recordAnswer(progress, 'machine', mode.id, 'machine');
  progress = recordAnswer(progress, 'machine', 'spell', 'mashine');
  assert.equal(nextMode(progress.words.machine), 'gaps');
  assert.equal(needsReview(progress.words.machine), true);
  assert.equal(progress.words.machine.modes.spell.streak, 0);
  progress = recordAnswer(progress, 'machine', 'gaps', 'machine');
  assert.equal(nextMode(progress.words.machine), 'spell');
  progress = recordAnswer(progress, 'machine', 'spell', 'machine');
  assert.equal(mastered(progress.words.machine), false);
});
test('updates do not mutate prior state and retain separate mode results', () => {
  const initial = emptyProgress();
  const once = recordAnswer(initial, 'industry', 'meaning', 'industry', 100);
  const twice = recordAnswer(once, 'industry', 'choice', 'industery', 200);
  assert.equal(initial.words.industry, undefined);
  assert.equal(once.words.industry.attempts, 1);
  assert.equal(twice.words.industry.modes.meaning.correct, 1);
  assert.equal(twice.words.industry.modes.choice.correct, 0);
  assert.equal(twice.words.industry.lastAt, 200);
  assert.deepEqual(totals(twice), { attempts: 2, correct: 1, accuracy: 50, practiced: 1, mastered: 0, review: 1 });
});
test('a supported-mode miss cannot regain mastery without new full spelling', () => {
  let progress = emptyProgress();
  for (const mode of MODES) progress = recordAnswer(progress, 'machine', mode.id, 'machine');
  progress = recordAnswer(progress, 'machine', 'spell', 'machine');
  assert.equal(mastered(progress.words.machine), true);
  progress = recordAnswer(progress, 'machine', 'gaps', 'mashine');
  progress = recordAnswer(progress, 'machine', 'meaning', 'machine');
  assert.equal(mastered(progress.words.machine), false);
  assert.equal(needsReview(progress.words.machine), true);
  assert.equal(progress.words.machine.modes.spell.streak, 0);
});
test('repeat quizzes prioritize misses, are bounded, and honor bonus choice', () => {
  let progress = recordAnswer(emptyProgress(), 'machine', 'choice', 'mashine');
  progress = recordAnswer(progress, 'mechanization', 'choice', 'mecanization');
  assert.ok(priority(progress.words.machine) > priority(undefined));
  const queue = makeQueue(progress, { random: () => 0.5 });
  assert.equal(queue[0], 'machine');
  assert.equal(queue[1], 'mechanization');
  assert.equal(queue.length, 12);
  assert.equal(new Set(queue).size, 12);
  assert.deepEqual(makeQueue(progress, { review: true, includeBonus: false }), ['machine']);
  assert.deepEqual(makeQueue(emptyProgress(), { review: true }), []);
  assert.equal(makeQueue(progress, { count: 40, includeBonus: false }).length, 25);
});
test('persisted state round trips and unsupported or malformed state recovers', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const progress = recordAnswer(emptyProgress(), 'resource', 'spell', 'resource');
  assert.ok(validProgress(progress));
  assert.equal(writeProgress(storage, progress), true);
  assert.deepEqual(readProgress(storage).progress, progress);
  for (const malformed of ['broken', 'null', '{}', '{"version":2}', '{"version":1,"sessions":0,"words":[]}']) {
    data.set(STORAGE_KEY, malformed);
    assert.ok(readProgress(storage).error);
    assert.deepEqual(readProgress(storage).progress, emptyProgress());
  }
  const bad = structuredClone(progress);
  bad.words.resource.correct = 500;
  assert.equal(validProgress(bad), false);
});
test('blocked storage does not stop practice and reports failed persistence', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
  assert.ok(readProgress(blocked).error);
  assert.equal(writeProgress(blocked, emptyProgress()), false);
  assert.ok(readProgress(undefined).error);
  assert.equal(writeProgress(undefined, emptyProgress()), false);
});
