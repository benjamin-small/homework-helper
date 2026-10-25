import week7 from './lists/week-7.js';
import week8 from './lists/week-8.js';
import week9 from './lists/week-9.js';
import week10 from './lists/week-10.js';
import week11 from './lists/week-11.js';

// Keep IDs stable: they identify saved progress, independently of display titles.
// Append new lists here in the order they are added, including non-weekly lists.
export const LISTS = [week7, week8, week9, week10, week11].reverse();
export const DEFAULT_LIST_ID = LISTS[0].id;
