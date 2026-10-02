import { emptyProgress, MODES } from './engine.js';
import { LIST_ID, WORDS } from './words.js';
export const STORAGE_KEY = `word-workshop:${LIST_ID}:v1`;
export const SETTINGS_KEY = 'word-workshop:settings:v1';
const integer = value => Number.isSafeInteger(value) && value >= 0;
export function validProgress(value) {
  if (!value || value.version !== 1 || !value.words || typeof value.words !== 'object' || Array.isArray(value.words) || !integer(value.sessions)) return false;
  return Object.entries(value.words).every(([word, stat]) => WORDS.some(entry => entry.word === word)
    && stat && integer(stat.attempts) && integer(stat.correct) && integer(stat.misses)
    && stat.correct + stat.misses === stat.attempts && typeof stat.lastCorrect === 'boolean'
    && MODES.some(mode => mode.id === stat.lastMode) && Number.isFinite(stat.lastAt)
    && stat.modes && typeof stat.modes === 'object' && !Array.isArray(stat.modes)
    && Object.entries(stat.modes).every(([mode, result]) => MODES.some(item => item.id === mode)
      && result && integer(result.attempts) && integer(result.correct) && integer(result.streak)
      && result.correct <= result.attempts && result.streak <= result.correct && typeof result.lastCorrect === 'boolean'));
}
export function readProgress(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { progress: emptyProgress(), error: null };
    const parsed = JSON.parse(raw);
    if (!validProgress(parsed)) throw new Error('Invalid saved progress');
    return { progress: parsed, error: null };
  } catch {
    return { progress: emptyProgress(), error: 'Your saved progress could not be read. You can still practice; new answers will start a fresh record.' };
  }
}
export function writeProgress(storage, progress) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; } catch { return false; }
}
