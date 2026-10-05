import test from 'node:test';
import assert from 'node:assert/strict';
import { swipeDirection, captureQuestionCard, slideQuestionCards } from '../src/question-navigation.js';

test('swipes distinguish navigation from taps, vertical scrolling, and slow drags', () => {
  const start = { x: 100, y: 100, time: 1000 };
  assert.equal(swipeDirection(start, { x: 210, y: 115, time: 1300 }), 'back');
  assert.equal(swipeDirection(start, { x: 20, y: 90, time: 1400 }), 'forward');
  assert.equal(swipeDirection(start, { x: 104, y: 102, time: 1100 }), null);
  assert.equal(swipeDirection(start, { x: 125, y: 250, time: 1400 }), null);
  assert.equal(swipeDirection(start, { x: 200, y: 200, time: 1400 }), null);
  assert.equal(swipeDirection(start, { x: 210, y: 100, time: 2300 }), null);
});

test('reduced motion skips snapshots and card animations entirely', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { matchMedia: () => ({ matches: true }) };
  try {
    const card = { cloneNode: () => { throw new Error('must not clone'); }, animate: () => { throw new Error('must not animate'); } };
    assert.equal(captureQuestionCard(card), null);
    slideQuestionCards({}, card, 'forward')();
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
