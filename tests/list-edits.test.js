import test from 'node:test';
import assert from 'node:assert/strict';
import { LISTS } from '../src/lists.js';
import { validateCatalog } from '../src/list-schema.js';
import { customEntry, readEdits, saveEdits, editedList, practiceWords, EDITS_PREFIX } from '../src/list-edits.js';
import { emptyProgress, recordAnswer, makeQueue, choices } from '../src/engine.js';
import { writeProgress, readProgress } from '../src/storage.js';
const list = LISTS[0];
const store = () => { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }; };

test('custom entries validate for every activity, normalize case, and reject invalid input', () => {
  for (const word of ['Ox', 'piano', 'a'.repeat(40)]) {
    const entry = customEntry(word, 'A parent-written clue.', 'A parent-written example.');
    validateCatalog([{ ...list, words: [...list.words, entry] }]);
  }
  for (const word of ['', 'a', 'ice cream', 'word!', 'a'.repeat(41)]) assert.throws(() => customEntry(word, 'Clue'));
  assert.throws(() => customEntry('piano', '   '));
});

test('hiding preserves source data and excludes words from queues and meaning choices', () => {
  const edits = { hidden: [list.words[0].word], custom: [] };
  const visible = practiceWords(editedList(list, edits), edits);
  assert.equal(list.words.length, 26);
  assert.ok(!makeQueue(visible, emptyProgress(), { count: 40 }).includes(edits.hidden[0]));
  for (const entry of visible) assert.ok(!choices(visible, entry, 'meaning').includes(edits.hidden[0]));
  const pair = { ...list.words[1], meaningDistractors: [list.words[0].word, list.words[2].word] };
  assert.equal(practiceWords({ ...list, words: [list.words[0], pair, ...list.words.slice(2)] }, edits).find(e => e.word === pair.word).meaningDistractors, undefined);
});

test('custom edits roundtrip per list, retain deleted history, and restore hidden words', () => {
  const storage = store();
  const edits = readEdits(storage, list);
  const entry = customEntry('piano', 'A musical instrument.');
  edits.custom.push({ ...entry, deleted: false });
  assert.equal(saveEdits(storage, list, edits), true);
  assert.equal(readEdits(storage, LISTS[1]).custom.length, 0);
  const full = editedList(list, readEdits(storage, list));
  const progress = recordAnswer(emptyProgress(), 'piano', 'spell', true);
  writeProgress(storage, full, progress);
  edits.custom[0].deleted = true;
  saveEdits(storage, list, edits);
  const reopened = readEdits(storage, list);
  assert.ok(!practiceWords(editedList(list, reopened), reopened).some(e => e.word === 'piano'));
  assert.deepEqual(readProgress(storage, editedList(list, reopened)).progress, progress);
  reopened.custom[0].deleted = false;
  reopened.hidden.push('piano');
  assert.ok(!practiceWords(editedList(list, reopened), reopened).some(e => e.word === 'piano'));
  reopened.hidden = [];
  assert.ok(practiceWords(editedList(list, reopened), reopened).some(e => e.word === 'piano'));
});

test('corrupt or duplicate edits fail closed and blocked or stale writes do not succeed', () => {
  const storage = store();
  for (const raw of ['broken', JSON.stringify({ hidden: [], custom: [{ ...list.words[0], deleted: false }] }), JSON.stringify({ hidden: ['unknown'], custom: [] })]) {
    storage.setItem(EDITS_PREFIX + list.id, raw);
    assert.ok(readEdits(storage, list).error);
  }
  const clean = store(); const a = readEdits(clean, list), b = readEdits(clean, list);
  a.hidden = [list.words[0].word]; assert.equal(saveEdits(clean, list, a), true);
  b.hidden = [list.words[1].word]; assert.equal(saveEdits(clean, list, b), false);
  assert.deepEqual(readEdits(clean, list).hidden, a.hidden);
  assert.equal(saveEdits(undefined, list, a), false);
});
