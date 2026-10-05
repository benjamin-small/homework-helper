import week7 from '../../src/lists/week-7.js';

// Local testing only: overlap, unfamiliar gap letters, a long title, no bonuses.
export default {
  id: 'local-sample',
  title: 'Local sample · A longer vocabulary list title for small screens',
  description: 'For testing only. This sample is not published.',
  words: [
    week7.words.find(entry => entry.word === 'machine'),
    { word: 'pizza', definition: 'A baked dish with a flat bread base and toppings.', misspellings: ['piza', 'pizsa'], pattern: 'pi[zz]a', gapDistractors: ['z', 'zs'], hint: 'Use two z letters.', sentence: 'We shared a pizza.' },
    { word: 'cat', definition: 'A small pet that meows.', misspellings: ['kat', 'catt'], pattern: '[c]at', gapDistractors: ['k', 'ck'], hint: 'Start with c.', sentence: 'The cat sat by the window.' },
  ],
};
