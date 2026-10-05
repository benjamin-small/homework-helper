import { gapChoices, gapParts } from './engine.js';

export function gapMarkup(entry, method, options = null) {
  const { before, after } = gapParts(entry);
  const context = `Missing letters between ${before || 'the start'} and ${after || 'the end'}`;
  if (method === 'type') return `
    <label class="input-label" for="spelling-input">Missing letters</label>
    <div class="gap-word" role="group" aria-label="Word with missing letters"><span>${before}</span><input id="spelling-input" class="gap-input" aria-label="${context}" maxlength="40" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" required><span>${after}</span></div>
    <p class="fine-print" id="input-help">You’re ready to type. Fill in the empty space without tiles.</p>`;
  return `
    <p class="input-label" id="gap-label">Choose the missing letters</p>
    <div class="gap-word" role="group" aria-label="Word with missing letters"><span>${before}</span><button type="button" id="gap-drop" class="gap-drop" aria-label="Empty gap: ${context}" aria-describedby="input-help">?</button><span>${after}</span></div>
    <p class="fine-print" id="input-help">Drag a tile into the gap, or tap a tile to choose it. Then check your spelling.</p>
    <div class="letter-options" role="group" aria-label="Missing-letter choices">${(options || gapChoices(entry)).map(letters => `<button type="button" class="letter-tile" data-letters="${letters}" aria-pressed="false">${letters}</button>`).join('')}</div>
    <p class="tile-status" id="tile-status" role="status" aria-live="polite">Two correct tile answers for this word unlock typing.</p>`;
}

// Pointer events support mouse, pen, and touch; native buttons also support
// tap/click, Enter, and Space. Selecting a tile never submits an answer.
export function mountGapChoices(root, onChange, initialValue = '') {
  const drop = root.querySelector('#gap-drop');
  const tiles = [...root.querySelectorAll('.letter-tile')];
  const status = root.querySelector('#tile-status');
  const initialLabel = drop.getAttribute('aria-label');
  const controller = new AbortController();
  const { signal } = controller;
  let drag = null;
  let ghost = null;
  let suppressClick = false;

  function select(value) {
    if (drop.disabled) return;
    drop.textContent = value || '?';
    drop.classList.toggle('filled', Boolean(value));
    drop.setAttribute('aria-label', value ? `Selected letters: ${value}. Activate to clear the gap.` : initialLabel);
    for (const tile of tiles) tile.setAttribute('aria-pressed', String(tile.dataset.letters === value));
    status.textContent = value ? `${value} placed in the gap. You can change it before checking.` : 'Gap cleared. Choose another tile.';
    onChange(value);
  }
  function inside(event) {
    const box = drop.getBoundingClientRect();
    return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
  }
  function cleanupDrag() {
    const previous = drag;
    drag = null;
    ghost?.remove(); ghost = null;
    drop.classList.remove('drag-over');
    previous?.tile.classList.remove('dragging');
    if (previous?.tile.hasPointerCapture(previous.pointerId)) previous.tile.releasePointerCapture(previous.pointerId);
  }
  drop.addEventListener('click', () => select(''), { signal });
  for (const tile of tiles) {
    tile.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      select(tile.dataset.letters);
    }, { signal });
    tile.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || tile.disabled) return;
      suppressClick = false;
      drag = { tile, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      tile.setPointerCapture(event.pointerId);
    }, { signal });
    tile.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId || drag.tile !== tile) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 7) return;
      drag.moved = true;
      event.preventDefault();
      if (!ghost) {
        ghost = document.createElement('span');
        ghost.className = 'letter-ghost';
        ghost.textContent = tile.dataset.letters;
        ghost.setAttribute('aria-hidden', 'true');
        document.body.append(ghost);
        tile.classList.add('dragging');
      }
      ghost.style.left = `${event.clientX}px`;
      ghost.style.top = `${event.clientY}px`;
      drop.classList.toggle('drag-over', inside(event));
    }, { signal });
    tile.addEventListener('pointerup', event => {
      if (!drag || drag.pointerId !== event.pointerId || drag.tile !== tile) return;
      const moved = drag.moved;
      const dropped = moved && inside(event);
      suppressClick = moved;
      cleanupDrag();
      if (dropped) select(tile.dataset.letters);
    }, { signal });
    for (const eventName of ['pointercancel', 'lostpointercapture']) {
      tile.addEventListener(eventName, () => { if (drag?.tile === tile) { suppressClick = true; cleanupDrag(); } }, { signal });
    }
    tile.addEventListener('keydown', event => {
      if (event.key === 'Escape') { suppressClick = Boolean(drag?.moved); cleanupDrag(); }
      if (event.key === 'Enter' || event.key === ' ') suppressClick = false;
    }, { signal });
  }
  if (initialValue) select(initialValue);
  return () => { cleanupDrag(); controller.abort(); };
}
