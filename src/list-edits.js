export const EDITS_PREFIX = 'word-workshop:list-edits:v1:';
const letters = /^[a-z]{2,40}$/;
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export function customEntry(word, definition, sentence = '') {
  word = typeof word === 'string' ? word.trim().toLowerCase() : '';
  definition = clean(definition, 400);
  if (!letters.test(word)) throw new Error('Use a word with 2–40 English letters, without spaces or punctuation.');
  if (!definition) throw new Error('Add a meaning so the tutor can ask a meaning question.');
  const missing = word.at(-1);
  const alternatives = ['a', 'e', 'i', 'o', 'u', 'x'].filter(letter => letter !== missing).slice(0, 2);
  return { word, definition, sentence: clean(sentence, 400) || `The word is ${word}.`,
    hint: `Start with ${word[0]} and end with ${missing}.`,
    misspellings: alternatives.map(letter => word.slice(0, -1) + letter),
    pattern: `${word.slice(0, -1)}[${missing}]`, gapDistractors: alternatives, bonus: false };
}

export function readEdits(storage, list) {
  try {
    const raw = storage?.getItem(EDITS_PREFIX + list.id);
    if (!raw) return { hidden: [], custom: [], revision: null, error: null };
    const data = JSON.parse(raw);
    if (!Array.isArray(data.hidden) || !Array.isArray(data.custom)) throw new Error();
    const seen = new Set(list.words.map(entry => entry.word));
    const custom = data.custom.map(item => {
      const entry = customEntry(item.word, item.definition, item.sentence);
      if (seen.has(entry.word) || typeof item.deleted !== 'boolean') throw new Error();
      seen.add(entry.word);
      return { ...entry, deleted: item.deleted };
    });
    if (!data.hidden.every(word => typeof word === 'string' && seen.has(word))) throw new Error();
    return { hidden: [...new Set(data.hidden)], custom, revision: raw, error: null };
  } catch { return { hidden: [], custom: [], error: 'Saved list edits could not be read. Your original list is available; list editing is disabled to protect the saved edits.' }; }
}

export function saveEdits(storage, list, edits) {
  try {
    const key = EDITS_PREFIX + list.id;
    if (storage.getItem(key) !== (edits.revision ?? null)) return false;
    const raw = JSON.stringify({ hidden: edits.hidden, custom: edits.custom });
    storage.setItem(key, raw); edits.revision = raw; return true;
  }
  catch { return false; }
}

export function editedList(list, edits) {
  return { ...list, words: [...list.words, ...edits.custom] };
}
export function practiceWords(list, edits) {
  return list.words.filter(entry => !entry.deleted && !edits.hidden.includes(entry.word)).map(entry => {
    if (!entry.meaningDistractors || entry.meaningDistractors.every(word => !edits.hidden.includes(word))) return entry;
    const copy = { ...entry }; delete copy.meaningDistractors; return copy;
  });
}
