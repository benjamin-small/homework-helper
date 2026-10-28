import { startApp } from './app.js';
import { LISTS, DEFAULT_LIST_ID } from './lists.js';
import { showTracker } from './tracker.js';

if (new URLSearchParams(window.location.search).get('page') === 'tracker') showTracker();
else startApp(LISTS, DEFAULT_LIST_ID);
