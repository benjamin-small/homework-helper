// Activity contains only minute timestamps, active intervals, and answer counts.
export const ACTIVITY_PREFIX = 'word-workshop:activity:v1:';
export const IDLE_MS = 60_000;
const MINUTE = 60_000;

export function mergeRanges(ranges) {
  const result = [];
  for (const [start, end] of [...ranges].sort((a, b) => a[0] - b[0])) {
    const last = result.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}

export function createActivityClock(now, enabled = true) {
  let previous = now;
  let lastInput = now;
  let running = enabled;
  const minutes = {};
  function bucket(time) {
    const key = Math.floor(time / MINUTE) * MINUTE;
    return minutes[key] ||= { ranges: [], answers: 0, correct: 0 };
  }
  function tick(time) {
    const end = Math.min(time, lastInput + IDLE_MS);
    if (running && end > previous) {
      for (let cursor = previous; cursor < end;) {
        const base = Math.floor(cursor / MINUTE) * MINUTE;
        const next = Math.min(end, base + MINUTE);
        const entry = bucket(cursor);
        entry.ranges = mergeRanges([...entry.ranges, [cursor - base, next - base]]);
        cursor = next;
      }
    }
    previous = time;
  }
  return {
    minutes,
    tick,
    interact(time) { tick(time); lastInput = time; },
    setEnabled(time, enabled) { tick(time); running = enabled; if (enabled) lastInput = time; },
    answer(time, correct) {
      tick(time);
      if (!running) return;
      lastInput = time;
      const entry = bucket(time);
      entry.answers++;
      if (correct) entry.correct++;
    },
  };
}

export function validMinutes(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const output = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!/^\d+$/.test(key) || !Number.isSafeInteger(Number(key)) || Number(key) % MINUTE || !entry
      || !Number.isSafeInteger(entry.answers) || entry.answers < 0
      || !Number.isSafeInteger(entry.correct) || entry.correct < 0 || entry.correct > entry.answers
      || !Array.isArray(entry.ranges)) continue;
    if (!entry.ranges.every(range => Array.isArray(range) && range.length === 2 && range.every(Number.isFinite)
      && range[0] >= 0 && range[1] <= MINUTE && range[1] > range[0])) continue;
    output[key] = { ranges: mergeRanges(entry.ranges), answers: entry.answers, correct: entry.correct };
  }
  return output;
}

export function combineMinutes(records) {
  const output = {};
  for (const record of records) for (const [key, entry] of Object.entries(validMinutes(record))) {
    const combined = output[key] ||= { ranges: [], answers: 0, correct: 0 };
    combined.ranges = mergeRanges([...combined.ranges, ...entry.ranges]);
    combined.answers += entry.answers;
    combined.correct += entry.correct;
  }
  return output;
}

export function summarize(minutes) {
  const result = { activeMs: 0, answers: 0, correct: 0, perMinute: null };
  for (const entry of Object.values(minutes)) {
    result.activeMs += entry.ranges.reduce((total, [start, end]) => total + end - start, 0);
    result.answers += entry.answers;
    result.correct += entry.correct;
  }
  if (result.activeMs > 0) result.perMinute = result.answers / (result.activeMs / MINUTE);
  return result;
}

export function rollups(minutes, period = 'day') {
  const groups = {};
  for (const [timestamp, entry] of Object.entries(minutes)) {
    const date = new Date(Number(timestamp));
    if (period === 'week') date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    if (period === 'month') date.setDate(1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    (groups[key] ||= {})[timestamp] = entry;
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => ({ date, ...summarize(entries) }));
}

export function startActivityTracking(storage, { window: host = window, document: doc = document, now = Date.now, onError = () => {} } = {}) {
  const key = ACTIVITY_PREFIX + host.crypto.randomUUID();
  const clock = createActivityClock(now(), !doc.hidden && doc.hasFocus());
  let failed = !storage;
  function flush() {
    clock.tick(now());
    if (!Object.keys(clock.minutes).length) return;
    try { storage.setItem(key, JSON.stringify(clock.minutes)); failed = false; }
    catch { failed = true; onError(); }
  }
  const interact = event => { if (event.isTrusted) { clock.interact(now()); } };
  const visibility = () => { clock.setEnabled(now(), !doc.hidden && doc.hasFocus()); flush(); };
  for (const event of ['pointerdown', 'pointermove', 'keydown', 'input', 'scroll']) doc.addEventListener(event, interact, { passive: true });
  doc.addEventListener('visibilitychange', visibility);
  host.addEventListener('focus', visibility);
  host.addEventListener('pageshow', visibility);
  host.addEventListener('blur', () => { clock.setEnabled(now(), false); flush(); });
  host.addEventListener('pagehide', () => { clock.setEnabled(now(), false); flush(); });
  host.setInterval(flush, 5000);
  return {
    answer(correct) { clock.answer(now(), correct); flush(); },
    read() {
      flush();
      const records = [clock.minutes];
      try {
        for (let i = 0; i < storage.length; i++) {
          const item = storage.key(i);
          if (item?.startsWith(ACTIVITY_PREFIX) && item !== key) {
            try { records.push(JSON.parse(storage.getItem(item))); } catch { /* Ignore one damaged record. */ }
          }
        }
      } catch { failed = true; }
      return { minutes: combineMinutes(records), failed };
    },
  };
}
