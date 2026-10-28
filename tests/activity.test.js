import test from 'node:test';
import assert from 'node:assert/strict';
import { createActivityClock, combineMinutes, summarize, rollups, validMinutes, startActivityTracking } from '../src/activity.js';

test('active clock splits minutes, caps idle time, and resumes only from interaction', () => {
  const clock = createActivityClock(30_000);
  clock.tick(150_000);
  assert.equal(summarize(clock.minutes).activeMs, 60_000);
  clock.interact(180_000);
  clock.tick(195_000);
  assert.equal(summarize(clock.minutes).activeMs, 75_000);
  assert.deepEqual(clock.minutes[0].ranges, [[30_000, 60_000]]);
  assert.deepEqual(clock.minutes[60_000].ranges, [[0, 30_000]]);
});

test('hidden and unfocused intervals are excluded, answers track correctness', () => {
  const clock = createActivityClock(0);
  clock.setEnabled(10_000, false);
  clock.answer(20_000, true);
  clock.setEnabled(120_000, true);
  clock.answer(135_000, false);
  clock.answer(140_000, true);
  clock.setEnabled(150_000, false);
  assert.deepEqual(summarize(clock.minutes), { activeMs: 40_000, answers: 2, correct: 1, perMinute: 3 });
});

test('overlapping tabs union active time and sum independent answers', () => {
  const a = createActivityClock(0), b = createActivityClock(10_000);
  a.answer(20_000, true); a.tick(40_000);
  b.answer(30_000, false); b.tick(50_000);
  assert.deepEqual(summarize(combineMinutes([a.minutes, b.minutes])), { activeMs: 50_000, answers: 2, correct: 1, perMinute: 2.4 });
});

test('rates use total active time, and empty time has no rate', () => {
  assert.equal(summarize({}).perMinute, null);
  const clock = createActivityClock(0);
  clock.answer(10_000, true); clock.tick(60_000);
  clock.setEnabled(60_000, false); clock.setEnabled(120_000, true); clock.tick(180_000);
  assert.equal(summarize(clock.minutes).perMinute, 0.5);
});

test('damaged activity is ignored without discarding valid records', () => {
  assert.deepEqual(validMinutes(null), {});
  assert.deepEqual(validMinutes({ 0: { ranges: [[-1, 5]], answers: 1, correct: 1 } }), {});
  assert.deepEqual(validMinutes({ 0: { ranges: [[0, 60001]], answers: 1, correct: 1 } }), {});
  assert.deepEqual(validMinutes({ 0: { ranges: [], answers: 1, correct: 2 } }), {});
  const valid = { 0: { ranges: [[0, 5]], answers: 1, correct: 0 } };
  assert.equal(summarize(combineMinutes([null, valid])).answers, 1);
});

test('rollups use local calendar days, Monday weeks, and months', () => {
  const monday = new Date(2026, 9, 26, 12).getTime();
  const tuesday = new Date(2026, 9, 27, 12).getTime();
  const minutes = { [monday]: { ranges: [[0, 60000]], answers: 2, correct: 1 }, [tuesday]: { ranges: [[0, 30000]], answers: 1, correct: 1 } };
  assert.equal(rollups(minutes).length, 2);
  assert.deepEqual(rollups(minutes, 'week'), [{ date: '2026-10-26', activeMs: 90000, answers: 3, correct: 2, perMinute: 2 }]);
  assert.equal(rollups(minutes, 'month')[0].date, '2026-10-01');
});

test('browser tracker persists once per page key, survives blocked storage, and ignores synthetic activity', () => {
  const data = new Map();
  const storage = { get length() { return data.size; }, key: i => [...data.keys()][i], getItem: k => data.get(k), setItem: (k, v) => data.set(k, v) };
  const events = {};
  const doc = { hidden: false, hasFocus: () => true, addEventListener: (name, fn) => { events[name] = fn; } };
  const host = { crypto: { randomUUID: () => 'test-page' }, addEventListener: (name, fn) => { events[name] = fn; }, setInterval: () => {} };
  let time = 0;
  const tracker = startActivityTracking(storage, { window: host, document: doc, now: () => time });
  time = 10_000; tracker.answer(true);
  time = 20_000; tracker.read(); tracker.read();
  assert.equal(data.size, 1);
  assert.equal(summarize(tracker.read().minutes).answers, 1);
  time = 70_000; events.pointermove({ isTrusted: false });
  time = 100_000;
  assert.equal(summarize(tracker.read().minutes).activeMs, 70_000);
  events.blur(); time = 200_000;
  assert.equal(summarize(tracker.read().minutes).activeMs, 70_000);
  const blocked = startActivityTracking(undefined, { window: host, document: doc, now: () => time });
  blocked.answer(false);
  assert.equal(blocked.read().failed, true);
  assert.equal(summarize(blocked.read().minutes).answers, 1);
});
