import { choices, gapChoices, gapInputMethod, nextMode, recordAnswer } from './engine.js';

export const AUTO_ADVANCE_MS = 2000;

export function createSession(listId, queue, mode = 'adaptive', review = false) {
  return { listId, queue: [...queue], mode, review, index: 0, questions: [], answers: [], finished: false };
}

// Freeze the exercise when first visited. Reviewing it must not reshuffle choices
// or pick a new adaptive mode from the learner's now-updated progress.
export function questionFor(session, words, progress, random = Math.random) {
  if (session.questions[session.index]) return session.questions[session.index];
  const entry = words.find(word => word.word === session.queue[session.index]);
  const mode = session.mode === 'adaptive' ? nextMode(progress.words[entry.word]) : session.mode;
  const gapMethod = mode === 'gaps' ? gapInputMethod(progress.words[entry.word]) : null;
  const question = {
    entry, mode, gapMethod, answerMode: gapMethod === 'choose' ? 'gaps-choice' : mode,
    options: ['meaning', 'choice'].includes(mode) ? choices(words, entry, mode, random) : [],
    gapOptions: gapMethod === 'choose' ? gapChoices(entry, random) : [],
    draft: '', gapAnswer: '', graded: false,
  };
  session.questions[session.index] = question;
  return question;
}

export function answerQuestion(session, progress, answer) {
  const question = session.questions[session.index];
  if (!question || question.graded || session.finished || session.index !== session.answers.length) return null;
  const updated = recordAnswer(progress, question.entry.word, question.answerMode, answer);
  question.graded = true;
  question.answer = answer;
  question.correct = updated.words[question.entry.word].lastCorrect;
  question.gapUnlocked = gapInputMethod(updated.words[question.entry.word]) === 'type';
  session.answers.push({ word: question.entry.word, correct: question.correct, mode: question.mode });
  return updated;
}

export function goToQuestion(session, index) {
  const last = session.finished ? session.answers.length - 1 : Math.min(session.answers.length, session.queue.length - 1);
  if (!Number.isInteger(index) || index < 0 || index > last) return false;
  session.index = index;
  return true;
}

export function finishSession(session, progress) {
  if (session.finished) return progress;
  session.finished = true;
  return session.answers.length ? { ...progress, sessions: progress.sessions + 1 } : progress;
}

export function canAutoAdvance(session, question, enabled, reviewing) {
  return Boolean(enabled && !reviewing && !session.finished && question.graded && question.correct);
}

export function createAdvanceTimer(schedule = setTimeout, cancel = clearTimeout) {
  let handle;
  let generation = 0;
  function stop() {
    generation++;
    if (handle !== undefined) cancel(handle);
    handle = undefined;
  }
  return {
    stop,
    start(callback) {
      stop();
      const current = generation;
      handle = schedule(() => {
        if (generation !== current) return;
        handle = undefined;
        generation++;
        callback();
      }, AUTO_ADVANCE_MS);
    },
  };
}
