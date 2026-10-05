import { emptyProgress, RESULT_MODES } from './engine.js';
export const progressKey = list => `word-workshop:${list.id}:v1`;
export const SETTINGS_KEY = 'word-workshop:settings:v1';
const LEGACY_LIST_ID = 'industrial-revolution-week-7';
const integer = value => Number.isSafeInteger(value) && value >= 0;
export function validProgress(value, list) {
  if (!value || value.version !== 1 || !value.words || typeof value.words !== 'object' || Array.isArray(value.words) || !integer(value.sessions)) return false;
  return Object.entries(value.words).every(([word, stat]) => list.words.some(entry => entry.word === word)
    && stat && integer(stat.attempts) && integer(stat.correct) && integer(stat.misses)
    && stat.correct + stat.misses === stat.attempts && typeof stat.lastCorrect === 'boolean'
    && RESULT_MODES.some(mode => mode.id === stat.lastMode) && Number.isFinite(stat.lastAt)
    && stat.modes && typeof stat.modes === 'object' && !Array.isArray(stat.modes)
    && Object.entries(stat.modes).every(([mode, result]) => RESULT_MODES.some(item => item.id === mode)
      && result && integer(result.attempts) && integer(result.correct) && integer(result.streak)
      && result.correct <= result.attempts && result.streak <= result.correct && typeof result.lastCorrect === 'boolean'));
}
export function readProgress(storage, list) {
  try {
    const raw = storage.getItem(progressKey(list));
    if (raw === null) return { progress: emptyProgress(), error: null };
    const parsed = JSON.parse(raw);
    if (!validProgress(parsed, list)) throw new Error('Invalid saved progress');
    return { progress: parsed, error: null };
  } catch {
    return { progress: emptyProgress(), error: 'Your saved progress could not be read. You can still practice; new answers will start a fresh record.' };
  }
}
export function writeProgress(storage, list, progress) {
  try { storage.setItem(progressKey(list), JSON.stringify(progress)); return true; } catch { return false; }
}

// A failed write must not lose this tab's answers when switching lists or when
// another tab writes an older record. Successful reads still refresh clean lists.
export function createProgressStore(storage) {
  const cache = new Map();
  const dirty = new Set();
  return {
    load(list) {
      if (dirty.has(list.id)) return { progress: cache.get(list.id), error: 'These results are kept in this tab for now. Saving is unavailable; they will be lost when this page closes.' };
      const loaded = readProgress(storage, list);
      if (loaded.error && cache.has(list.id)) return { ...loaded, progress: cache.get(list.id) };
      cache.set(list.id, loaded.progress);
      return loaded;
    },
    save(list, progress) {
      cache.set(list.id, progress);
      const saved = writeProgress(storage, list, progress);
      if (saved) dirty.delete(list.id); else dirty.add(list.id);
      return saved;
    },
  };
}

export function readSettings(storage, lists, defaultListId = lists[0].id) {
  let saved;
  try { saved = JSON.parse(storage?.getItem(SETTINGS_KEY)); } catch { /* Safe defaults. */ }
  const defaultId = lists.some(list => list.id === defaultListId) ? defaultListId : lists[0].id;
  return {
    voice: typeof saved?.voice === 'string' ? saved.voice : '',
    rate: [0.7, 0.85, 1].includes(saved?.rate) ? saved.rate : 0.85,
    selectedListId: lists.some(list => list.id === saved?.selectedListId) ? saved.selectedListId : defaultId,
    bonusByList: Object.fromEntries(lists.map(list => [list.id,
      typeof saved?.bonusByList?.[list.id] === 'boolean' ? saved.bonusByList[list.id]
        : list.id === LEGACY_LIST_ID && typeof saved?.bonus === 'boolean' ? saved.bonus : true,
    ])),
  };
}

export function writeSettings(storage, settings) {
  try { storage.setItem(SETTINGS_KEY, JSON.stringify(settings)); return true; } catch { return false; }
}
