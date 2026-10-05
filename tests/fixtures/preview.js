import { startApp } from '../../src/app.js';
import { LISTS } from '../../src/lists.js';
import sample from './sample-list.js';

// Accessible only via the local development server, never included in dist/.
startApp([sample, ...LISTS]);
