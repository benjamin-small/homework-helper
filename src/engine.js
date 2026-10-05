export const MODES = [
  { id: 'meaning', title: 'Match the meaning', short: 'Meaning', icon: '01', description: 'Read a clue. Find its word.' },
  { id: 'choice', title: 'Spot the spelling', short: 'Choose', icon: '02', description: 'Listen. Pick the right spelling.' },
  { id: 'gaps', title: 'Fill the gaps', short: 'Complete', icon: '03', description: 'Give the tricky letters a try.' },
  { id: 'spell', title: 'Spell it out', short: 'Spell', icon: '04', description: 'Listen and write the whole word.' },
];
export const RESULT_MODES = [
  ...MODES.slice(0, 2),
  { id: 'gaps-choice', short: 'Gap tiles' },
  { id: 'gaps', short: 'Typed gaps' },
  MODES[3],
];
export const emptyProgress = () => ({ version: 1, words: {}, sessions: 0 });
export const normalize = value => String(value).trim().toLowerCase();
export const isCorrect = (answer, word) => normalize(answer) === word;
export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function gapParts(entry) {
  const [, before, missing, after] = entry.pattern.match(/^(.*)\[([a-z]+)\](.*)$/);
  return { before, missing, after };
}
export function gapChoices(entry, random = Math.random) {
  const { missing } = gapParts(entry);
  return shuffle([missing, ...entry.gapDistractors], random);
}
export function gapInputMethod(stats) {
  // Preserve existing typed practice. A tile success never counts as typed work.
  return stats?.modes?.gaps?.attempts > 0 || (stats?.modes?.['gaps-choice']?.streak || 0) >= 2 ? 'type' : 'choose';
}
export function choices(words, entry, mode, random = Math.random) {
  const alternatives = mode === 'meaning'
    ? entry.meaningDistractors || shuffle(words.filter(item => item.word !== entry.word), random).slice(0, 2).map(item => item.word)
    : entry.misspellings;
  return shuffle([entry.word, ...alternatives], random);
}
export function mastered(stats) {
  return (stats?.modes?.spell?.streak || 0) >= 2 && stats?.lastCorrect === true;
}
export function nextMode(stats) {
  if (!stats) return 'meaning';
  // A miss returns to supported practice, without erasing past achievements.
  if (stats.lastCorrect === false && stats.lastMode === 'spell') return 'gaps';
  for (const mode of MODES.slice(0, 3)) {
    if (!stats.modes?.[mode.id]?.lastCorrect) return mode.id;
  }
  return 'spell';
}
export function recordAnswer(progress, word, mode, answer, now = Date.now()) {
  const correct = isCorrect(answer, word);
  const previous = progress.words[word] || { attempts: 0, correct: 0, misses: 0, modes: {} };
  const previousMode = previous.modes[mode] || { attempts: 0, correct: 0, streak: 0 };
  const modes = { ...previous.modes };
  // Any new mistake means this word needs fresh unassisted spelling evidence.
  if (!correct && mode !== 'spell' && modes.spell) modes.spell = { ...modes.spell, streak: 0 };
  const updated = {
    ...previous,
    attempts: previous.attempts + 1,
    correct: previous.correct + Number(correct),
    misses: previous.misses + Number(!correct),
    lastCorrect: correct,
    lastMode: mode,
    lastAt: now,
    modes: { ...modes, [mode]: {
      attempts: previousMode.attempts + 1,
      correct: previousMode.correct + Number(correct),
      streak: correct ? previousMode.streak + 1 : 0,
      lastCorrect: correct,
    } },
  };
  return { ...progress, words: { ...progress.words, [word]: updated } };
}
export function needsReview(stats) {
  return Boolean(stats?.attempts && !mastered(stats) && (stats.misses > 0));
}
export function priority(stats) {
  if (!stats) return 3;
  if (mastered(stats)) return 0.35;
  if (stats.lastCorrect === false) return 12;
  return needsReview(stats) ? 7 : 4;
}
export function makeQueue(words, progress, { review = false, includeBonus = true, random = Math.random, count = 12 } = {}) {
  const pool = words.filter(word => (includeBonus || !word.bonus) && (!review || needsReview(progress.words[word.word])));
  // Weighted sampling without replacement: difficult words are more likely and
  // appear earlier, while unseen words still get a turn. No immediate repeats.
  return pool.map(entry => ({ word: entry.word, key: -Math.log(Math.max(random(), Number.EPSILON)) / priority(progress.words[entry.word]) }))
    .sort((a, b) => a.key - b.key).slice(0, count).map(item => item.word);
}
export function totals(words, progress) {
  const stats = words.map(word => progress.words[word.word]).filter(Boolean);
  const attempts = stats.reduce((n, stat) => n + stat.attempts, 0);
  const correct = stats.reduce((n, stat) => n + stat.correct, 0);
  return { attempts, correct, accuracy: attempts ? Math.round(100 * correct / attempts) : 0,
    practiced: stats.length, mastered: stats.filter(mastered).length, review: stats.filter(needsReview).length };
}
