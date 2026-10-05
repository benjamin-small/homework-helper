const text = value => typeof value === 'string' && value.trim().length > 0;
const letters = value => typeof value === 'string' && /^[a-z]{1,40}$/.test(value);
const pair = (values, answer) => Array.isArray(values) && values.length === 2
  && values.every(letters) && new Set([answer, ...values]).size === 3;

export function validateCatalog(lists) {
  if (!Array.isArray(lists) || !lists.length) throw new Error('The catalog needs at least one list.');
  const ids = new Set();
  for (const list of lists) {
    const fail = message => { throw new Error(`List ${list?.id || '(missing ID)'}: ${message}`); };
    if (!list || typeof list.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(list.id) || ids.has(list.id)) fail('use a unique, lowercase slug ID.');
    ids.add(list.id);
    if (!text(list.title) || (list.description !== undefined && !text(list.description))) fail('provide a title and a nonempty description if present.');
    if (!Array.isArray(list.words) || list.words.length < 3) fail('at least three words are required for meaning choices.');
    const seen = new Set();
    for (const entry of list.words) {
      if (!entry || !letters(entry.word) || seen.has(entry.word)) fail('words must be unique lowercase letters, at most 40 characters.');
      seen.add(entry.word);
      if (!['definition', 'hint', 'sentence'].every(field => text(entry[field]))) fail(`${entry.word} needs a definition, hint, and sentence.`);
      if (entry.bonus !== undefined && typeof entry.bonus !== 'boolean') fail(`${entry.word} has an invalid bonus flag.`);
      if (!pair(entry.misspellings, entry.word)) fail(`${entry.word} needs two distinct incorrect spellings.`);
      if (entry.meaningDistractors !== undefined && (!pair(entry.meaningDistractors, entry.word)
        || !entry.meaningDistractors.every(word => list.words.some(item => item?.word === word)))) fail(`${entry.word} needs two different meaning alternatives from this list.`);
      const match = typeof entry.pattern === 'string' && entry.pattern.match(/^([a-z]*)\[([a-z]+)\]([a-z]*)$/);
      if (!match || match[1] + match[2] + match[3] !== entry.word || match[2] === entry.word) fail(`${entry.word} needs one gap that reconstructs the word and leaves visible letters.`);
      if (!pair(entry.gapDistractors, match[2])) fail(`${entry.word} needs two distinct incorrect gap options.`);
    }
    if (list.words.every(entry => entry.bonus)) fail('include at least one non-bonus word.');
  }
  return lists;
}
