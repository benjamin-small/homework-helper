// Horizontal intent must win over scrolling, small taps, and slow text selection.
export function swipeDirection(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (end.time - start.time > 900 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return null;
  return dx > 0 ? 'back' : 'forward';
}

export function mountQuestionSwipes(card, onSwipe, onStart) {
  const controller = new AbortController();
  const { signal } = controller;
  let start = null;
  card.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { start = null; return; }
    if (event.button !== 0 || event.target.closest('button,input,select,textarea,a,summary,[contenteditable],.letter-options,.gap-word')) return;
    start = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp };
    card.setPointerCapture(event.pointerId);
    onStart();
  }, { signal });
  card.addEventListener('pointerup', event => {
    const previous = start;
    start = null;
    if (!previous || previous.id !== event.pointerId) return;
    const direction = swipeDirection(previous, { x: event.clientX, y: event.clientY, time: event.timeStamp });
    if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    if (direction) onSwipe(direction);
  }, { signal });
  for (const name of ['pointercancel', 'lostpointercapture']) card.addEventListener(name, () => { start = null; }, { signal });
  return () => {
    if (start && card.hasPointerCapture(start.id)) card.releasePointerCapture(start.id);
    start = null;
    controller.abort();
  };
}

export function captureQuestionCard(card) {
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  return { clone: card.cloneNode(true), box: card.getBoundingClientRect() };
}

export function slideQuestionCards(previous, card, direction) {
  if (!previous || !card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const layer = document.createElement('div');
  layer.className = 'question-transition-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  const outgoing = previous.clone;
  // Visual clones must not label or describe controls on the incoming card.
  const attributes = ['id', 'name', 'for', 'aria-labelledby', 'aria-describedby', 'autofocus'];
  for (const element of [outgoing, ...outgoing.querySelectorAll(attributes.map(attribute => `[${attribute}]`).join(','))]) {
    for (const attribute of attributes) element.removeAttribute(attribute);
  }
  Object.assign(outgoing.style, { position: 'absolute', top: `${previous.box.top}px`, left: `${previous.box.left}px`, width: `${previous.box.width}px`, margin: '0' });
  layer.append(outgoing);
  document.body.append(layer);
  const sign = direction === 'back' ? -1 : 1;
  const distance = window.innerWidth;
  const options = { duration: 220, easing: 'cubic-bezier(.22,.7,.25,1)' };
  card.classList.add('question-sliding');
  const exit = outgoing.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${-sign * distance}px)`, opacity: 0 }], options);
  const enter = card.animate([{ transform: `translateX(${sign * distance}px)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], options);
  function stop() {
    exit.cancel(); enter.cancel(); layer.remove(); card.classList.remove('question-sliding');
  }
  Promise.allSettled([exit.finished, enter.finished]).then(stop);
  return stop;
}
