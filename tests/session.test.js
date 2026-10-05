import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, recordAnswer } from '../src/engine.js';
import { createSession, questionFor, answerQuestion, goToQuestion, finishSession, canAutoAdvance, createAdvanceTimer, AUTO_ADVANCE_MS } from '../src/session.js';
import sample from './fixtures/sample-list.js';

const words = sample.words;
const start = mode => createSession(sample.id, words.map(word => word.word), mode);

test('backtracking preserves the original exercise and never regrades an answer', () => {
  const session = start('adaptive');
  let progress = emptyProgress();
  const first = questionFor(session, words, progress, () => 0.2);
  const originalOptions = [...first.options];
  progress = answerQuestion(session, progress, 'machine');
  assert.equal(goToQuestion(session, 1), true);
  questionFor(session, words, progress);
  assert.equal(goToQuestion(session, 0), true);
  const reviewed = questionFor(session, words, progress, () => { throw new Error('must not reshuffle'); });
  assert.equal(reviewed.mode, 'meaning');
  assert.deepEqual(reviewed.options, originalOptions);
  assert.equal(reviewed.answer, 'machine');
  assert.equal(reviewed.correct, true);
  assert.equal(answerQuestion(session, progress, 'mashine'), null);
  assert.equal(session.answers.length, 1);
  assert.equal(progress.words.machine.attempts, 1);
  assert.equal(progress.words.machine.modes.meaning.streak, 1);
});

test('unfinished text and tile choices survive a trip through question history', () => {
  for (const mode of ['spell', 'gaps']) {
    const session = start(mode);
    let progress = emptyProgress();
    questionFor(session, words, progress);
    progress = answerQuestion(session, progress, 'machine');
    goToQuestion(session, 1);
    const unfinished = questionFor(session, words, progress);
    unfinished.draft = 'PiZ';
    unfinished.gapAnswer = 'z';
    const tiles = [...unfinished.gapOptions];
    goToQuestion(session, 0);
    questionFor(session, words, progress);
    goToQuestion(session, 1);
    const resumed = questionFor(session, words, progress);
    assert.equal(resumed.draft, 'PiZ');
    assert.equal(resumed.gapAnswer, 'z');
    assert.deepEqual(resumed.gapOptions, tiles);
    assert.equal(resumed.graded, false);
  }
});

test('reviewed gap tiles do not turn into typed gaps after unlocking typing', () => {
  const session = start('gaps');
  let progress = recordAnswer(emptyProgress(), 'machine', 'gaps-choice', 'machine');
  const question = questionFor(session, words, progress);
  assert.equal(question.gapMethod, 'choose');
  question.gapAnswer = 'chi';
  progress = answerQuestion(session, progress, 'machine');
  assert.equal(question.gapUnlocked, true);
  assert.equal(questionFor(session, words, progress).gapMethod, 'choose');
  assert.equal(question.answerMode, 'gaps-choice');
  assert.equal(progress.words.machine.modes.gaps, undefined);
});

test('navigation cannot bypass an unanswered question or reopen unfinished work after finishing', () => {
  const session = start('meaning');
  let progress = emptyProgress();
  assert.equal(goToQuestion(session, -1), false);
  assert.equal(goToQuestion(session, 1), false);
  questionFor(session, words, progress);
  progress = answerQuestion(session, progress, '');
  assert.equal(goToQuestion(session, 1), true);
  assert.equal(goToQuestion(session, 2), false);
  assert.equal(goToQuestion(session, 0.5), false);
  progress = finishSession(session, progress);
  assert.equal(goToQuestion(session, 1), false);
  assert.equal(goToQuestion(session, 0), true);
  assert.equal(questionFor(session, words, progress).answer, '');
  assert.equal(progress.words.machine.misses, 1);
});

test('reviewing summary answers does not add sessions or erase misses', () => {
  const session = start('spell');
  let progress = emptyProgress();
  for (let i = 0; i < words.length; i++) {
    goToQuestion(session, i);
    questionFor(session, words, progress);
    progress = answerQuestion(session, progress, i === 1 ? 'piza' : words[i].word);
  }
  const finished = finishSession(session, progress);
  assert.equal(finished.sessions, 1);
  for (let i = 0; i < words.length; i++) {
    assert.equal(goToQuestion(session, i), true);
    questionFor(session, words, finished);
    assert.equal(answerQuestion(session, finished, words[i].word), null);
  }
  assert.equal(finishSession(session, finished), finished);
  assert.deepEqual(session.answers.filter(answer => !answer.correct).map(answer => answer.word), ['pizza']);
  assert.equal(finished.words.pizza.attempts, 1);
  assert.equal(finished.words.pizza.misses, 1);
});

test('auto-advance is opt-in and applies only to freshly graded correct answers', () => {
  for (const answer of ['machine', 'mashine', '']) {
    const session = start('spell');
    let progress = emptyProgress();
    const question = questionFor(session, words, progress);
    assert.equal(canAutoAdvance(session, question, true, false), false);
    progress = answerQuestion(session, progress, answer);
    assert.equal(canAutoAdvance(session, question, false, false), false);
    assert.equal(canAutoAdvance(session, question, true, true), false);
    assert.equal(canAutoAdvance(session, question, true, false), answer === 'machine');
    finishSession(session, progress);
    assert.equal(canAutoAdvance(session, question, true, false), false);
  }
});

test('canceled and stale timers cannot skip questions or trigger duplicate summaries', () => {
  const callbacks = [];
  const canceled = [];
  const timer = createAdvanceTimer((callback, delay) => { assert.equal(delay, AUTO_ADVANCE_MS); callbacks.push(callback); return callbacks.length; }, id => canceled.push(id));
  let advances = 0;
  timer.start(() => advances++);
  timer.stop(); // Back, toggle off, listen, finish, or hidden tab.
  callbacks[0](); // Even an already queued callback is harmless.
  assert.equal(advances, 0);
  timer.start(() => advances++);
  timer.start(() => advances++); // Replace a pending timer.
  callbacks[1]();
  assert.equal(advances, 0);
  callbacks[2]();
  callbacks[2]();
  assert.equal(advances, 1);
  assert.deepEqual(canceled, [1, 2]);
});
