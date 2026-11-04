import { customEntry, saveEdits } from './list-edits.js';

export function mountParentEditor({ app, list, edits, storage, escapeHtml: esc, onDone }) {
  let editing = null;
  function render(message = '') {
    const row = (entry, custom) => {
      const hidden = edits.hidden.includes(entry.word);
      return `<li class="parent-word"><div><strong>${esc(entry.word)}</strong>${entry.bonus ? ' · Bonus' : ''}<span>${custom ? 'Custom' : 'Supplied'}${hidden ? ' · Hidden from practice' : ''}</span><p>${esc(entry.definition)}</p><p class="fine-print">${esc(entry.sentence)}</p></div><div class="parent-actions"><button type="button" data-toggle="${entry.word}">${hidden ? 'Restore' : 'Hide'} ${esc(entry.word)}</button>${custom ? `<button type="button" data-edit="${entry.word}">Edit ${esc(entry.word)}</button><button type="button" data-delete="${entry.word}">Delete ${esc(entry.word)}</button>` : ''}</div></li>`;
    };
    app.innerHTML = `<section class="parent-editor"><p><button id="parent-done" class="text-button">← Back to practice</button></p><span class="eyebrow">PARENT EDITOR</span><h1 tabindex="-1">${esc(list.title)}</h1><p>Changes stay in this browser. Supplied words can be hidden and restored. Only custom words can be edited or deleted. Saved learning progress is kept.</p><p role="status" id="editor-status">${esc(message || edits.error || '')}</p>
    <form id="custom-word-form" class="parent-form"><h2>${editing ? 'Edit custom word' : 'Add a custom word'}</h2><label for="custom-word">Word</label><input id="custom-word" name="word" required minlength="2" maxlength="40" pattern="[A-Za-z]{2,40}" value="${esc(editing?.word || '')}" autocomplete="off" autocapitalize="none" spellcheck="false"><p class="fine-print">2–40 English letters. A changed spelling starts its own learning record.</p><label for="custom-definition">Meaning</label><textarea id="custom-definition" name="definition" required maxlength="400">${esc(editing?.definition || '')}</textarea><label for="custom-sentence">Example sentence (optional)</label><textarea id="custom-sentence" name="sentence" maxlength="400">${esc(editing?.sentence || '')}</textarea><p class="fine-print">The tutor generates simple spelling choices and a final-letter gap. Check your meaning and spelling carefully; they are not automatically fact-checked.</p><button class="primary" type="submit" ${edits.error ? 'disabled' : ''}>${editing ? 'Save custom word' : 'Add word'}</button>${editing ? '<button type="button" id="cancel-custom">Cancel edit</button>' : ''}</form>
    <h2>Supplied words</h2><ul class="parent-words">${list.words.map(entry => row(entry, false)).join('')}</ul><h2>Custom words</h2><ul class="parent-words">${edits.custom.filter(entry => !entry.deleted).map(entry => row(entry, true)).join('') || '<li>No custom words yet.</li>'}</ul></section>`;
    app.querySelector('#parent-done').addEventListener('click', onDone);
    if (edits.error) app.querySelectorAll('[data-toggle], [data-edit], [data-delete]').forEach(button => { button.disabled = true; });
    function commit(next, message, focusSelector) {
      if (!saveEdits(storage, list, next)) {
        app.querySelector('#editor-status').textContent = 'The change could not be saved. Nothing was changed. Check browser storage or reopen the editor if another tab changed this list.';
        return;
      }
      edits = next; editing = null; render(message);
      app.querySelector(focusSelector || '#custom-word')?.focus();
    }
    app.querySelector('#custom-word-form').addEventListener('submit', event => {
      event.preventDefault();
      try {
        const entry = customEntry(app.querySelector('#custom-word').value, app.querySelector('#custom-definition').value, app.querySelector('#custom-sentence').value);
        if (entry.word !== editing?.word && [...list.words, ...edits.custom.filter(item => !item.deleted)].some(item => item.word === entry.word)) throw new Error('That word is already in this list. Restore it if it is hidden.');
        const custom = edits.custom.filter(item => item.word !== entry.word).map(item => editing && item.word === editing.word ? { ...item, deleted: true } : item);
        custom.push({ ...entry, deleted: false });
        commit({ ...edits, custom, hidden: edits.hidden.filter(word => word !== entry.word) }, `${entry.word} saved.`, '#custom-word');
      } catch (error) { app.querySelector('#editor-status').textContent = error.message; }
    });
    app.querySelector('#cancel-custom')?.addEventListener('click', () => { editing = null; render(); app.querySelector('#custom-word').focus(); });
    app.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', () => {
      const word = button.dataset.toggle;
      const hidden = edits.hidden.includes(word) ? edits.hidden.filter(item => item !== word) : [...edits.hidden, word];
      commit({ ...edits, hidden }, `${word} ${hidden.includes(word) ? 'hidden from' : 'restored to'} practice.`, `[data-toggle="${word}"]`);
    }));
    app.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => {
      editing = edits.custom.find(item => item.word === button.dataset.edit); render(); app.querySelector('#custom-definition').focus();
    }));
    app.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => {
      const word = button.dataset.delete;
      commit({ ...edits, custom: edits.custom.map(item => item.word === word ? { ...item, deleted: true } : item) }, `${word} deleted. Its learning history is kept if you add it again.`);
    }));
  }
  render();
  app.querySelector('h1').focus();
}
