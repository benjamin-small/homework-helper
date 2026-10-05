import { MODES, RESULT_MODES, emptyProgress, gapParts, makeQueue, mastered, needsReview, totals } from './engine.js';
import { SETTINGS_KEY, progressKey, createProgressStore, readSettings, writeSettings } from './storage.js';
import { validateCatalog } from './list-schema.js';
import { gapMarkup, mountGapChoices } from './gap-exercise.js';
import { createSession, questionFor, answerQuestion, goToQuestion, finishSession, canAutoAdvance, createAdvanceTimer } from './session.js';
import { mountQuestionSwipes, captureQuestionCard, slideQuestionCards } from './question-navigation.js';

export function startApp(lists, defaultListId = lists[0]?.id) {
  validateCatalog(lists);
  const $ = selector => document.querySelector(selector);
  const app = $('#app');
  const speakerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke-linejoin="round"/><path d="M15 8a6 6 0 0 1 0 8M18 4a11 11 0 0 1 0 16" stroke-linecap="round"/></svg>';
  $('#sound-button').innerHTML = speakerIcon;
  let storage;
  try { storage = window.localStorage; } catch { /* Private or restricted browser. */ }
  const settings = readSettings(storage, lists, defaultListId);
  let activeList = lists.find(list => list.id === settings.selectedListId);
  const records = createProgressStore(storage);
  const loaded = records.load(activeList);
  let progress = loaded.progress;
  const includeBonus = () => settings.bonusByList[activeList.id];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  let session = null;
  let question = null;
  let reviewingQuestion = false;
  const advanceTimer = createAdvanceTimer();
  let view = 'home';
  let speechId = 0;
  let speechTimer;
  let utterance;
  let voices = [];
  let disposeGapChoices = null;
  let disposeQuestionSwipes = null;
  let cancelQuestionAnimation = null;

  function notice(message) {
    $('#storage-notice').textContent = message;
    $('#storage-notice').hidden = !message;
  }
  if (loaded.error) notice(loaded.error);
  function save() {
    if (!records.save(activeList, progress)) {
      notice('Your browser cannot save progress right now. You can keep practicing, but these results will be lost when this page closes.');
      $('#save-status').textContent = 'Practice works · saving unavailable';
    } else {
      notice('');
      $('#save-status').textContent = 'Progress saved on this browser';
    }
  }
  // Check write access without touching the learning record.
  try { storage.setItem(`${SETTINGS_KEY}:check`, '1'); storage.removeItem(`${SETTINGS_KEY}:check`); }
  catch { notice('Saving is unavailable in this browser. Practice still works, but results will not survive a reload.'); $('#save-status').textContent = 'Practice works · saving unavailable'; }
  function saveSettings() {
    if (!writeSettings(storage, settings)) notice('Your selection and preferences cannot be saved right now. They will last until this page closes.');
  }
  const modeById = id => MODES.find(mode => mode.id === id);
  const preferredGoogleVoice = () => voices.find(voice => voice.lang === 'en-US' && voice.name.toLowerCase() === 'google us english');
  function stopSpeech() {
    speechId++;
    clearTimeout(speechTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  function speechStatus(message) {
    const status = $('#speech-status');
    if (status) status.textContent = message;
    $('#settings-speech-status').textContent = message;
  }
  function speak(text) {
    stopSpeech();
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      speechStatus('This browser cannot read aloud. Try another browser, or ask a grown-up to read from the word list.');
      return;
    }
    const id = speechId;
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = settings.rate;
    const voice = voices.find(item => item.voiceURI === settings.voice)
      || preferredGoogleVoice()
      || voices.find(item => item.lang === 'en-US' && item.localService)
      || voices.find(item => item.lang.startsWith('en') && item.localService)
      || voices.find(item => item.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    speechStatus('');
    speechTimer = setTimeout(() => {
      if (id === speechId) speechStatus('No sound? Check your volume and tap Listen again. You can also choose a different voice in Sound settings.');
    }, 4500);
    utterance.onstart = () => { if (id === speechId) { clearTimeout(speechTimer); speechStatus(''); } };
    utterance.onerror = event => {
      if (id !== speechId || ['canceled', 'interrupted'].includes(event.error)) return;
      clearTimeout(speechTimer);
      speechStatus('The voice could not play. Tap Listen again, or try a different voice in Sound settings.');
    };
    try { window.speechSynthesis.speak(utterance); }
    catch { speechStatus('The voice could not play. Please try another browser or voice.'); }
  }
  function refreshVoices() {
    voices = window.speechSynthesis?.getVoices().filter(voice => voice.lang.startsWith('en')) || [];
    const select = $('#voice-select');
    select.replaceChildren(new Option(preferredGoogleVoice() ? 'Automatic · Google US English' : 'Automatic · your device’s English voice', ''));
    for (const voice of voices) select.add(new Option(`${voice.name} (${voice.lang})${voice.localService ? ' · device' : ''}`, voice.voiceURI));
    select.value = voices.some(voice => voice.voiceURI === settings.voice) ? settings.voice : '';
  }
  refreshVoices();
  window.speechSynthesis?.addEventListener('voiceschanged', refreshVoices);
  $('#sound-button').addEventListener('click', () => {
    cancelAutoAdvance();
    refreshVoices(); $('#speed-select').value = String(settings.rate); $('#settings-dialog').showModal();
  });
  $('#voice-select').addEventListener('change', event => { settings.voice = event.target.value; saveSettings(); });
  $('#speed-select').addEventListener('change', event => { settings.rate = Number(event.target.value); saveSettings(); });
  $('#test-voice').addEventListener('click', () => speak('Hello! Let’s practice spelling together.'));
  $('#settings-dialog').addEventListener('close', stopSpeech);
  $('#progress-button').addEventListener('click', () => showProgress());

  function setView(name, html) {
    cancelAutoAdvance();
    disposeQuestionSwipes?.(); disposeQuestionSwipes = null;
    cancelQuestionAnimation?.(); cancelQuestionAnimation = null;
    disposeGapChoices?.();
    disposeGapChoices = null;
    view = name;
    $('#progress-button').textContent = name === 'quiz' ? session.finished ? 'Results' : 'Finish practice' : 'My progress';
    stopSpeech();
    app.innerHTML = (name === 'home' || name === 'quiz' ? '' : `<p class="list-context">${escapeHtml(activeList.title)}</p>`) + html;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function focusTitle() { app.querySelector('h1')?.focus({ preventScroll: true }); }
  function progressAside() {
    const total = totals(activeList.words, progress);
    return `<aside class="progress-panel"><span class="eyebrow">LITTLE STEPS, BIG THINGS</span>
      <h2>Your words are<br>taking shape.</h2>
      <div class="progress-orbit" style="--progress:${total.mastered / activeList.words.length * 100}%"><div><strong>${total.mastered}<span> / ${activeList.words.length}</span></strong><small>words feeling solid</small></div><span class="orbit-star" aria-hidden="true">✦</span></div>
      <p class="aside-copy">A word feels solid after you spell it correctly twice in a row without hints.</p>
      <div class="mini-stats"><div><strong>${total.practiced}</strong><span>words tried</span></div><div><strong>${total.attempts ? total.accuracy + '%' : '—'}</strong><span>answers correct</span></div></div>
      <div class="gentle-note"><span aria-hidden="true">✧</span><p>Getting stuck is part of learning. We’ll give tricky words a little extra love.</p></div>
    </aside>`;
  }
  function showHome() {
    session = null; question = null;
    const total = totals(activeList.words, progress);
    const eligibleReview = activeList.words.filter(entry => (includeBonus() || !entry.bonus) && needsReview(progress.words[entry.word])).length;
    const available = activeList.words.filter(entry => includeBonus() || !entry.bonus).length;
    const bonusCount = activeList.words.filter(entry => entry.bonus).length;
    const questionCount = Math.min(12, available);
    setView('home', `<section class="list-picker" aria-label="Vocabulary list"><div><label for="list-select">Practice list</label><select id="list-select">${lists.map(list => `<option value="${list.id}" ${list.id === activeList.id ? 'selected' : ''}>${escapeHtml(list.title)}</option>`).join('')}</select></div><p>${escapeHtml(activeList.description || 'Choose a list and start practicing.')}<span>Each list has its own saved progress.</span></p></section>
      <section class="intro"><div><span class="eyebrow">${escapeHtml(activeList.title)}</span>
      <h1 tabindex="-1">Small steps.<br><span>Strong spellers.</span></h1><p>A few words, a little practice, and a whole lot of “I did it.”<br class="desktop-break"> Let’s build your spelling confidence.</p></div>
      <div class="letter-art" aria-hidden="true"><span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✦</span><div class="tile tile-w">w</div><div class="tile tile-o">o</div><div class="tile tile-r">r</div><div class="tile tile-d">d</div><span class="art-caption">good things take practice</span><span class="pencil">✎</span></div></section>
      <div class="home-grid"><div class="home-main"><section class="start-card"><div class="start-top"><span class="pill"><span class="tiny-star">✦</span> MADE FOR YOUR NEXT STEP</span><span class="session-length">${questionCount} questions · about ${Math.max(1, Math.ceil(questionCount * 5 / 12))} min</span></div>
        <h2>${total.attempts ? 'A little more practice?' : 'Ready, set, spell.'}</h2><p>${total.attempts ? 'We’ll mix in fresh practice and give your trickiest words another turn.' : 'Start with meanings, build up your spelling, and finish with the whole word. We’ll find your next step as you go.'}</p>
        <div class="start-actions"><button class="primary" id="start-practice">${total.attempts ? 'Keep practicing' : 'Let’s practice'} <span aria-hidden="true">→</span></button><button class="text-button" id="review-practice" ${eligibleReview ? '' : 'disabled'}>Practice tricky words${eligibleReview ? ` (${eligibleReview})` : ''} <span aria-hidden="true">↗</span></button></div>
        <div class="bonus-row">${bonusCount ? `<label><input id="bonus-toggle" type="checkbox" ${includeBonus() ? 'checked' : ''}> Include the bonus ${bonusCount === 1 ? 'word' : 'words'}</label>` : ''}<span>${available} words to explore</span></div>
      </section><section class="activities"><div class="section-heading"><h2>Find your own rhythm</h2><span>Or pick an activity</span></div><div class="mode-grid">${MODES.map(mode => `<button class="mode-card mode-${mode.id}" data-mode="${mode.id}"><span class="mode-icon">${mode.icon}</span><strong>${mode.title}</strong><span>${mode.description}</span><span class="mode-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
      <p class="quiet-line">No timers. No rush. Just you, getting a little better.</p></div>${progressAside()}</div>`);
    $('#list-select').addEventListener('change', event => {
      const next = lists.find(list => list.id === event.target.value);
      if (!next || next.id === activeList.id || view !== 'home') return;
      activeList = next;
      const loaded = records.load(activeList);
      progress = loaded.progress;
      settings.selectedListId = activeList.id;
      notice(loaded.error || '');
      saveSettings();
      showHome();
      $('#list-select').focus();
    });
    $('#start-practice').addEventListener('click', () => startSession());
    $('#review-practice').addEventListener('click', () => startSession('adaptive', true));
    $('#bonus-toggle')?.addEventListener('change', event => { settings.bonusByList[activeList.id] = event.target.checked; saveSettings(); showHome(); $('#bonus-toggle').focus(); });
    app.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => startSession(button.dataset.mode)));
  }
  function startSession(mode = 'adaptive', review = false, wordList = null) {
    const queue = wordList || makeQueue(activeList.words, progress, { review, includeBonus: includeBonus() });
    if (!queue.length) { showHome(); return; }
    session = createSession(activeList.id, queue, mode, review);
    showQuestion();
  }
  function showQuestion() {
    question = questionFor(session, activeList.words, progress);
    const { entry, mode, gapMethod } = question;
    reviewingQuestion = question.graded;
    const current = modeById(mode);
    const gaps = mode === 'gaps' ? gapParts(entry) : null;
    const prompt = { meaning: 'Which word fits this meaning?', choice: 'Which spelling looks right?', gaps: 'Make the word complete.', spell: 'You’ve got the whole word.' }[mode];
    const instruction = { meaning: entry.definition, choice: 'Listen carefully, then choose the correct spelling.', gaps: gapMethod === 'choose' ? 'Listen, then find the letters that complete the word.' : 'Listen, then type the missing letters.', spell: 'Listen, then type what you hear.' }[mode];
    let answerArea;
    if (mode === 'meaning' || mode === 'choice') {
      answerArea = `<div class="answer-options" role="group" aria-label="Answer choices">${question.options.map((choice, i) => `<button class="answer-option" data-answer="${choice}"><span class="option-number" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span>${choice}</span><span class="option-result" aria-hidden="true"></span></button>`).join('')}</div>`;
    } else {
      answerArea = `<form id="answer-form" autocomplete="off">
        ${gaps ? gapMarkup(entry, gapMethod, question.gapOptions)
          : '<label class="input-label" for="spelling-input">Your spelling</label><input id="spelling-input" class="spell-input" type="text" maxlength="40" placeholder="Type the word here…" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" required aria-describedby="input-help"><p class="fine-print" id="input-help">Take your time. Capital letters are okay.</p>'}
        <button class="primary full" type="submit" id="submit-answer" disabled>Check my spelling <span aria-hidden="true">→</span></button></form>`;
    }
    setView('quiz', `<button type="button" class="previous-edge" id="previous-edge" aria-label="Go to previous question" title="Previous question" ${session.index === 0 ? 'hidden' : ''}><span aria-hidden="true">‹</span></button><div class="quiz-topline practice-header"><button class="text-button" id="end-practice">← ${session.finished ? 'Back to results' : 'Finish for now'}</button><p class="practice-list-title">${escapeHtml(activeList.title)}</p><span class="practice-activity">${session.review ? 'TRICKY WORD PRACTICE' : session.mode === 'adaptive' ? 'YOUR PERSONAL PRACTICE' : current.title.toUpperCase()}</span></div>
      <div class="quiz-layout"><section class="quiz-card"><div class="question-top"><span class="pill">${current.icon} / ${current.short}</span><span>Question <strong>${session.index + 1}</strong> of ${session.queue.length}</span></div>
        <div class="session-track" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${session.queue.length}" aria-valuenow="${session.answers.length}"><span style="width:${session.answers.length / session.queue.length * 100}%"></span></div>
        <div class="quiz-controls"><button type="button" class="text-button" id="previous-question" ${session.index === 0 ? 'disabled' : ''}>← Previous question</button><label class="auto-advance-toggle"><input id="auto-advance-toggle" type="checkbox" ${settings.autoAdvance ? 'checked' : ''}> Auto-advance correct answers</label></div>
        <p class="swipe-hint" ${session.index === 0 ? 'hidden' : ''}>Swipe right on the card to go back.</p>
        ${reviewingQuestion ? `<div class="history-note"><p>Previously answered. Reviewing won’t change your score.</p>${!session.finished && session.answers.length < session.queue.length ? '<button class="text-button" id="return-current">Back to current question →</button>' : ''}</div>` : ''}
        <h1 tabindex="-1">${prompt}</h1><p class="question-instruction ${mode === 'meaning' ? 'definition' : ''}">${escapeHtml(instruction)}</p>
        <div class="listen-controls"><button class="listen-button" id="listen-button">${speakerIcon}<span>${mode === 'meaning' ? 'Read the clue' : 'Listen to the word'}</span></button>${mode === 'meaning' ? `<label class="auto-advance-toggle"><input id="auto-read-clue-toggle" type="checkbox" ${settings.autoReadClue ? 'checked' : ''}> Auto-read the clue</label>` : ''}</div><p class="speech-status" id="speech-status" role="status"></p>
        ${answerArea}<div id="feedback" role="status" aria-live="polite" aria-atomic="true"></div><div class="question-bottom"><button class="text-button" id="skip-answer">I’m not sure yet</button><span>It’s okay to give it a try.</span></div>
      </section><aside class="quiz-aside"><div class="small-art" aria-hidden="true">a<span>✦</span></div><span class="eyebrow">PRACTICE MAKES PROGRESS</span><h2>Every try<br>counts.</h2><p>A mistake is just a word asking for a little more practice.</p><div class="session-score"><strong>${session.answers.filter(answer => answer.correct).length}</strong><span>correct so far</span></div><div class="stage-path">${MODES.map(stage => `<div class="${stage.id === mode ? 'current-stage' : ''}"><span>${stage.icon}</span>${stage.short}${stage.id === mode ? '<small>YOU ARE HERE</small>' : ''}</div>`).join('')}</div></aside></div>`);
    $('#listen-button').addEventListener('click', () => { cancelAutoAdvance(); speak(mode === 'meaning' ? entry.definition : entry.word); });
    $('#auto-read-clue-toggle')?.addEventListener('change', event => {
      settings.autoReadClue = event.target.checked;
      saveSettings();
      if (!settings.autoReadClue) { stopSpeech(); speechStatus(''); }
      else if (!question.graded) speak(entry.definition);
    });
    $('#previous-question').addEventListener('click', () => navigateQuestion(session.index - 1));
    $('#previous-edge').addEventListener('click', () => navigateQuestion(session.index - 1));
    disposeQuestionSwipes = mountQuestionSwipes($('.quiz-card'), direction => {
      if (direction === 'back') navigateQuestion(session.index - 1);
      else if (question.graded) advanceQuestion();
    }, cancelAutoAdvance);
    $('#return-current')?.addEventListener('click', () => navigateQuestion(session.answers.length));
    $('#auto-advance-toggle').addEventListener('change', event => {
      settings.autoAdvance = event.target.checked;
      saveSettings();
      scheduleAutoAdvance();
    });
    $('#end-practice').addEventListener('click', () => showSummary());
    $('#skip-answer').addEventListener('click', () => grade(''));
    app.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => grade(button.dataset.answer)));
    if ($('#answer-form')) {
      if (gapMethod === 'choose') {
        disposeGapChoices = mountGapChoices(app, letters => {
          question.gapAnswer = letters;
          $('#submit-answer').disabled = !letters;
        }, question.gapAnswer);
      } else {
        $('#spelling-input').value = question.draft;
        $('#submit-answer').disabled = !question.draft.trim();
        $('#spelling-input').addEventListener('input', event => {
          question.draft = event.target.value;
          $('#submit-answer').disabled = !question.draft.trim();
        });
      }
      $('#answer-form').addEventListener('submit', event => {
        event.preventDefault();
        const typed = gapMethod === 'choose' ? question.gapAnswer : $('#spelling-input').value.trim();
        if (!typed) return;
        grade(gaps ? gaps.before + typed.toLowerCase() + gaps.after : typed);
      });
    }
    if (question.graded) renderFeedback();
    focusTitle();
    if (!question.graded && (mode !== 'meaning' || settings.autoReadClue)) speak(mode === 'meaning' ? entry.definition : entry.word);
  }
  function grade(answer) {
    if (!question || question.graded || view !== 'quiz' || session.listId !== activeList.id) return;
    const updated = answerQuestion(session, progress, answer);
    if (!updated) return;
    progress = updated;
    save();
    renderFeedback();
    $('#next-question').focus({ preventScroll: true });
    $('#feedback').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    scheduleAutoAdvance();
  }
  function renderFeedback() {
    const { entry, answerMode, answer, correct, gapUnlocked } = question;
    $('.session-score strong').textContent = session.answers.filter(item => item.correct).length;
    $('.session-track').setAttribute('aria-valuenow', session.answers.length);
    $('.session-track > span').style.width = `${session.answers.length / session.queue.length * 100}%`;
    app.querySelectorAll('[data-answer]').forEach(button => {
      button.disabled = true;
      if (button.dataset.answer === entry.word) { button.classList.add('correct'); button.querySelector('.option-result').textContent = '✓'; }
      else if (button.dataset.answer === answer) { button.classList.add('incorrect'); button.querySelector('.option-result').textContent = '×'; }
    });
    if ($('#spelling-input')) { $('#spelling-input').disabled = true; $('#submit-answer').hidden = true; }
    if ($('#gap-drop')) {
      disposeGapChoices?.(); disposeGapChoices = null;
      app.querySelectorAll('.letter-tile, #gap-drop').forEach(button => { button.disabled = true; });
      $('#submit-answer').hidden = true;
      $('#tile-status').hidden = true;
      $('#input-help').hidden = true;
    }
    $('.question-bottom').hidden = true;
    const feedback = $('#feedback');
    feedback.className = `feedback ${correct ? 'positive' : 'keep-going'}`;
    feedback.innerHTML = `<div class="feedback-heading"><span aria-hidden="true">${correct ? '✓' : '↗'}</span><strong>${correct ? 'That’s it. Nicely done!' : answer ? 'Not quite. Let’s learn this one.' : 'Let’s learn this one together.'}</strong></div>
      <p class="submitted-answer">Your answer: <strong>${answer ? escapeHtml(answer) : 'I’m not sure yet'}</strong></p><div class="correct-word">${entry.word}</div><p>${escapeHtml(entry.hint)}</p><p class="word-example">${escapeHtml(entry.sentence)}</p>${answerMode === 'gaps-choice' && correct ? `<p class="tile-milestone">${gapUnlocked ? 'Next time, you’ll type the missing letters for this word!' : 'One more correct tile answer for this word unlocks typing.'}</p>` : ''}<button class="primary full" id="next-question">${session.index + 1 < (session.finished ? session.answers.length : session.queue.length) ? 'Next question' : session.finished ? 'Back to results' : 'See how you did'} <span aria-hidden="true">→</span></button><p id="auto-advance-status" class="auto-advance-status" role="status" hidden></p><button type="button" class="text-button" id="pause-auto-advance" hidden>Stay on this question</button>`;
    $('#next-question').addEventListener('click', advanceQuestion);
    $('#pause-auto-advance').addEventListener('click', () => {
      cancelAutoAdvance();
      $('#auto-advance-status').textContent = 'Paused. Choose Next when you’re ready.';
      $('#auto-advance-status').hidden = false;
      $('#next-question').focus({ preventScroll: true });
    });
  }
  function navigateQuestion(index) {
    cancelAutoAdvance();
    if (!session || index === session.index) return;
    cancelQuestionAnimation?.(); cancelQuestionAnimation = null;
    const previous = captureQuestionCard($('.quiz-card'));
    const direction = index < session.index ? 'back' : 'forward';
    if (goToQuestion(session, index)) {
      showQuestion();
      cancelQuestionAnimation = slideQuestionCards(previous, $('.quiz-card'), direction);
    }
  }
  function advanceQuestion() {
    cancelAutoAdvance();
    if (view !== 'quiz' || !question?.graded) return;
    const limit = session.finished ? session.answers.length : session.queue.length;
    if (session.index + 1 >= limit) showSummary();
    else navigateQuestion(session.index + 1);
  }
  function cancelAutoAdvance() {
    advanceTimer.stop();
    if ($('#auto-advance-status')) $('#auto-advance-status').hidden = true;
    if ($('#pause-auto-advance')) $('#pause-auto-advance').hidden = true;
  }
  function scheduleAutoAdvance() {
    cancelAutoAdvance();
    if (view !== 'quiz' || document.hidden || $('#settings-dialog').open
      || !canAutoAdvance(session, question, settings.autoAdvance, reviewingQuestion)) return;
    const expectedSession = session;
    const expectedQuestion = question;
    $('#auto-advance-status').textContent = session.index + 1 < session.queue.length ? 'Moving to the next question…' : 'Opening your results…';
    $('#auto-advance-status').hidden = false;
    $('#pause-auto-advance').hidden = false;
    advanceTimer.start(() => {
      if (session === expectedSession && question === expectedQuestion && view === 'quiz'
        && !document.hidden && !$('#settings-dialog').open
        && canAutoAdvance(session, question, settings.autoAdvance, reviewingQuestion)) advanceQuestion();
    });
  }
  function showSummary() {
    if (!session || session.answers.length === 0) { showHome(); focusTitle(); return; }
    const answers = session.answers;
    const correct = answers.filter(answer => answer.correct).length;
    const missed = [...new Set(answers.filter(answer => !answer.correct).map(answer => answer.word))];
    const finished = finishSession(session, progress);
    if (finished !== progress) { progress = finished; save(); }
    question = null;
    setView('summary', `<section class="summary-card"><div class="celebration" aria-hidden="true">✦</div><span class="eyebrow">LOOK AT YOU GO</span><h1 tabindex="-1">${correct === answers.length ? 'A lovely little victory.' : 'That’s progress.'}</h1><p>You showed up. You practiced. Your words are getting stronger.</p><div class="summary-score"><strong>${correct}<span> / ${answers.length}</span></strong><span>answers correct · ${Math.round(correct / answers.length * 100)}%</span></div>
      ${missed.length ? `<div class="review-box"><h2>A little more love for these words</h2><div class="word-chips">${missed.map(word => `<span>${word}</span>`).join('')}</div><p>We’ll bring back helpful hints and give these words another turn.</p></div>` : '<div class="review-box"><h2>Keep that confidence growing.</h2><p>More practice helps these words stick. Try spelling them all the way out when you’re ready.</p></div>'}
      <div class="button-row"><button class="primary" id="summary-practice">${missed.length ? 'Retry these words' : 'Keep practicing'} <span aria-hidden="true">→</span></button><button class="secondary" id="summary-review">Review answers</button><button class="secondary" id="summary-home">Back to home</button></div></section>`);
    $('#summary-practice').addEventListener('click', () => missed.length ? startSession('adaptive', true, missed) : startSession());
    $('#summary-review').addEventListener('click', () => navigateQuestion(0));
    $('#summary-home').addEventListener('click', () => { showHome(); focusTitle(); });
    focusTitle();
  }
  function showProgress() {
    if (view === 'quiz') { showSummary(); return; }
    const total = totals(activeList.words, progress);
    setView('progress', `<div class="quiz-topline"><button class="text-button" id="back-home">← Back to practice</button><span>YOUR LEARNING NOTEBOOK</span></div><section class="progress-page"><span class="eyebrow">ONE WORD AT A TIME</span><h1 tabindex="-1">Look how far you’ve come.</h1><p>${total.mastered} words feeling solid. ${total.practiced} words tried. Every little bit adds up.</p><div class="progress-legend"><span>○ Not tried</span><span>◐ Practicing</span><span>✓ Feeling solid</span></div><div class="word-list">${activeList.words.map(entry => {
      const stats = progress.words[entry.word];
      const status = mastered(stats) ? 'solid' : stats ? 'practicing' : 'new';
      return `<details class="word-row status-${status}"><summary><span class="word-status" role="img" aria-label="${status === 'solid' ? 'Feeling solid' : status === 'new' ? 'Not tried' : 'Practicing'}">${status === 'solid' ? '✓' : status === 'new' ? '○' : '◐'}</span><strong>${entry.word}${entry.bonus ? '<small> BONUS</small>' : ''}</strong><span class="word-result">${stats ? `${stats.correct} / ${stats.attempts} correct` : 'Ready to try'}</span><span aria-hidden="true">＋</span></summary><div class="word-detail"><p>${escapeHtml(entry.definition)}</p><p class="fine-print">${escapeHtml(entry.hint)}</p><div class="mode-results">${RESULT_MODES.map(mode => `<span>${mode.short}: ${stats?.modes[mode.id] ? `${stats.modes[mode.id].correct}/${stats.modes[mode.id].attempts}` : 'not tried'}</span>`).join('')}</div><button class="secondary" data-practice-word="${entry.word}">Practice this word →</button></div></details>`;
    }).join('')}</div><div class="data-note"><p>Saved only in this browser. Clearing site data or using a different browser starts a new record. Private browsing may erase results when you close it.</p><button class="text-button" id="reset-progress">Reset progress</button></div></section>`);
    $('#back-home').addEventListener('click', () => { showHome(); focusTitle(); });
    $('#reset-progress').addEventListener('click', () => {
      $('#reset-list-name').textContent = activeList.title;
      $('#reset-dialog').showModal();
    });
    app.querySelectorAll('[data-practice-word]').forEach(button => button.addEventListener('click', () => startSession('adaptive', false, [button.dataset.practiceWord])));
    focusTitle();
  }
  $('#cancel-reset').addEventListener('click', () => $('#reset-dialog').close());
  $('#confirm-reset').addEventListener('click', () => {
    progress = emptyProgress(); save(); $('#reset-dialog').close(); showProgress();
  });
  // Follow another tab's latest saved totals before the next answer is recorded.
  window.addEventListener('storage', event => {
    if (event.key !== progressKey(activeList) && event.key !== null) return;
    const fresh = records.load(activeList);
    if (!fresh.error) { progress = fresh.progress; if (view === 'home') showHome(); else if (view === 'progress') showProgress(); }
  });
  window.addEventListener('pagehide', () => { cancelAutoAdvance(); stopSpeech(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAutoAdvance(); });
  showHome();
}
