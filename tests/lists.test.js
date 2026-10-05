import test from 'node:test';
import assert from 'node:assert/strict';
import { LISTS, DEFAULT_LIST_ID } from '../src/lists.js';
import { validateCatalog } from '../src/list-schema.js';
import { choices, emptyProgress, gapChoices, gapParts, gapInputMethod, makeQueue, recordAnswer, totals } from '../src/engine.js';
import { createProgressStore, progressKey, readProgress, writeProgress, readSettings, writeSettings, SETTINGS_KEY } from '../src/storage.js';
import sample from './fixtures/sample-list.js';

const week7 = LISTS.find(list => list.id === 'industrial-revolution-week-7');
const week8 = LISTS.find(list => list.id === 'number-the-stars-week-8');
const memoryStorage = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};

test('Week 8 matches the supplied words in order and has the annihilate bonus', () => {
  assert.deepEqual(week8.words.filter(word => !word.bonus).map(entry => entry.word), 'occupation resistance refugee soldier uniform curfew rescue courage danger disguise betrayal loyalty friendship journey escape secret suspicious protect sacrifice truth deceive neighbor bravery hardship freedom'.split(' '));
  assert.deepEqual(week8.words.filter(word => word.bonus).map(entry => entry.word), ['annihilate']);
  assert.equal(week8.title, 'Week 8 · Number the Stars');
});

test('all lists validate and every exercise has three distinct choices', () => {
  const catalog = [...LISTS, sample];
  validateCatalog(catalog);
  for (const list of catalog) for (const entry of list.words) {
    const { before, missing, after } = gapParts(entry);
    assert.equal(before + missing + after, entry.word);
    for (const mode of ['meaning', 'choice']) {
      const options = choices(list.words, entry, mode);
      assert.equal(new Set(options).size, 3);
      assert.equal(options.filter(word => word === entry.word).length, 1);
      if (mode === 'meaning') assert.ok(options.every(word => list.words.some(entry => entry.word === word)));
    }
    assert.equal(new Set(gapChoices(entry)).size, 3);
    assert.equal(gapChoices(entry).filter(value => value === missing).length, 1);
  }
  const pizza = sample.words.find(entry => entry.word === 'pizza');
  assert.deepEqual(gapChoices(pizza).sort(), ['z', 'zs', 'zz']);
  for (const word of ['bravery', 'courage']) {
    const options = choices(week8.words, week8.words.find(entry => entry.word === word), 'meaning');
    assert.ok(!options.includes(word === 'bravery' ? 'courage' : 'bravery'));
  }
});

test('invalid catalogs fail with actionable errors before publication', () => {
  assert.throws(() => validateCatalog([]), /at least one/);
  assert.throws(() => validateCatalog([week7, week7]), /unique/);
  for (const mutate of [
    list => { list.words = []; },
    list => { list.words[0].word = 'Uppercase'; },
    list => { list.words[0].word = list.words[1].word; },
    list => { list.words[0].pattern = 'un[related]'; },
    list => { list.words[0].gapDistractors = ['cc', 'c']; },
    list => { list.words[0].misspellings = ['occupation', 'ocupation']; },
    list => { list.words[0].meaningDistractors = ['factory', 'machine']; },
    list => { list.words[0].hint = ''; },
    list => { list.words.forEach(word => { word.bonus = true; }); },
  ]) {
    const list = structuredClone(week8); mutate(list);
    assert.throws(() => validateCatalog([list]), /List number-the-stars-week-8:/);
  }
});

test('queues, retries, and totals use only the selected list', () => {
  let progress = recordAnswer(emptyProgress(), 'machine', 'spell', 'mashine');
  progress = recordAnswer(progress, 'courage', 'spell', 'corage');
  assert.deepEqual(makeQueue(week8.words, progress, { review: true }), ['courage']);
  assert.deepEqual(makeQueue(week7.words, progress, { review: true }), ['machine']);
  assert.equal(totals(week8.words, progress).attempts, 1);
  assert.equal(makeQueue(sample.words, emptyProgress()).length, 3);
  assert.ok(!makeQueue(week8.words, emptyProgress(), { count: 40, includeBonus: false }).includes('annihilate'));
  assert.equal(makeQueue(week8.words, emptyProgress(), { count: 40 }).length, 26);
});

test('Week 7 keeps its exact old key and all existing achievements', () => {
  const storage = memoryStorage();
  const progress = recordAnswer(emptyProgress(), 'machine', 'gaps', 'machine', 123);
  progress.sessions = 8;
  storage.setItem('word-workshop:industrial-revolution-week-7:v1', JSON.stringify(progress));
  assert.equal(progressKey(week7), 'word-workshop:industrial-revolution-week-7:v1');
  assert.deepEqual(readProgress(storage, week7).progress, progress);
  assert.equal(gapInputMethod(readProgress(storage, week7).progress.words.machine), 'type');
  assert.deepEqual(readProgress(storage, week8).progress, emptyProgress());
});

test('overlapping words, refreshes, and resets stay isolated by list', () => {
  const storage = memoryStorage();
  const store = createProgressStore(storage);
  const learned = recordAnswer(emptyProgress(), 'machine', 'gaps', 'machine');
  store.save(week7, learned);
  assert.deepEqual(store.load(sample).progress, emptyProgress());
  const missed = recordAnswer(emptyProgress(), 'machine', 'choice', 'mashine');
  store.save(sample, missed);
  assert.deepEqual(store.load(week7).progress, learned);
  // Simulate another tab writing the sample list, then reselect it.
  const updated = recordAnswer(missed, 'pizza', 'spell', 'pizza');
  writeProgress(storage, sample, updated);
  assert.deepEqual(store.load(sample).progress, updated);
  store.save(sample, emptyProgress());
  assert.deepEqual(readProgress(storage, sample).progress, emptyProgress());
  assert.deepEqual(readProgress(storage, week7).progress, learned);
});

test('failed writes and malformed data do not discard unsaved work on switches', () => {
  const original = memoryStorage();
  let blocked = true;
  const storage = { getItem: original.getItem, setItem(key, value) { if (blocked) throw new Error('quota'); original.setItem(key, value); } };
  const store = createProgressStore(storage);
  const learned = recordAnswer(emptyProgress(), 'machine', 'gaps', 'machine');
  assert.equal(store.save(week7, learned), false);
  store.load(sample);
  assert.deepEqual(store.load(week7).progress, learned);
  assert.ok(store.load(week7).error);
  blocked = false;
  assert.equal(store.save(week7, learned), true);
  original.setItem(progressKey(week7), 'broken');
  assert.deepEqual(store.load(week7).progress, learned);
  assert.ok(store.load(week7).error);
  const unavailable = createProgressStore(undefined);
  assert.equal(unavailable.save(sample, emptyProgress()), false);
  assert.deepEqual(unavailable.load(sample).progress, emptyProgress());
});

test('settings default to the newest list without losing per-list or legacy preferences', () => {
  const storage = memoryStorage();
  storage.setItem(SETTINGS_KEY, JSON.stringify({ voice: 'device-voice', rate: 0.7, bonus: false }));
  const settings = readSettings(storage, LISTS, DEFAULT_LIST_ID);
  assert.equal(settings.voice, 'device-voice');
  assert.equal(settings.rate, 0.7);
  assert.equal(settings.autoAdvance, true);
  assert.equal(settings.selectedListId, week8.id);
  assert.equal(settings.bonusByList[week7.id], false);
  assert.equal(settings.bonusByList[week8.id], true);
  settings.selectedListId = week8.id;
  settings.bonusByList[week8.id] = false;
  settings.autoAdvance = false;
  assert.equal(writeSettings(storage, settings), true);
  assert.deepEqual(readSettings(storage, LISTS), settings);
  settings.selectedListId = week7.id;
  writeSettings(storage, settings);
  const reopened = readSettings(storage, LISTS);
  assert.equal(reopened.selectedListId, week8.id);
  assert.deepEqual(reopened.bonusByList, settings.bonusByList);
  assert.equal(reopened.voice, 'device-voice');
  assert.equal(reopened.autoAdvance, false);
  // A newly added non-weekly list becomes the default just like a new week.
  assert.equal(readSettings(storage, [sample, ...LISTS]).selectedListId, sample.id);
  storage.setItem(SETTINGS_KEY, JSON.stringify({ autoAdvance: false }));
  assert.equal(readSettings(storage, LISTS).autoAdvance, true);
  storage.setItem(SETTINGS_KEY, 'broken');
  assert.equal(readSettings(storage, LISTS).rate, 0.85);
  assert.equal(readSettings(storage, LISTS).autoAdvance, true);
  assert.equal(writeSettings(undefined, settings), false);
});
