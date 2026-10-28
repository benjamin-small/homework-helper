import { ACTIVITY_PREFIX, combineMinutes, rollups, summarize } from './activity.js';

export function showTracker() {
  const app = document.querySelector('#app');
  const number = value => value === null ? '—' : value.toFixed(2);
  const duration = ms => `${(ms / 60000).toFixed(2)} min`;
  document.querySelector('#progress-button').hidden = true;
  document.querySelector('#sound-button').hidden = true;
  document.querySelector('#save-status').textContent = 'Activity stays on this browser';
  app.innerHTML = `<section class="tracker"><span class="eyebrow">ACTIVITY TRACKER</span><h1>Practice in this browser</h1>
    <p>Active time and submitted answers, starting when tracking was added. Shared browsers combine everyone’s activity.</p>
    <p><a href="./">Back to practice</a></p><p id="tracker-notice" role="status"></p>
    <div id="tracker-totals" class="tracker-totals"></div>
    <label for="tracker-period">Roll up by</label> <select id="tracker-period"><option value="day">Day</option><option value="week">Week (Monday start)</option><option value="month">Month</option></select>
    <h2>Activity rollups</h2><div class="tracker-table" tabindex="0" role="region" aria-label="Activity rollups table"><table><thead><tr><th scope="col">Period starting</th><th scope="col">Active time</th><th scope="col">Answers</th><th scope="col">Correct</th><th scope="col">Answers / min</th></tr></thead><tbody id="tracker-rollups"></tbody></table></div>
    <h2>Latest active minutes</h2><p>Up to 60 recent minutes with activity, using this device’s local time.</p><div class="tracker-table" tabindex="0" role="region" aria-label="Recent minutes table"><table><thead><tr><th scope="col">Minute starting</th><th scope="col">Active time</th><th scope="col">Answers</th><th scope="col">Answers / min</th></tr></thead><tbody id="tracker-minutes"></tbody></table></div>
    <p class="fine-print">Active time counts while the practice page is visible and focused, until 60 seconds after the last interaction. Hidden, unfocused, and idle time is excluded. Opening this dashboard does not count. Correct and incorrect submissions count once; skips and reviewing old answers do not. Rate = submitted answers ÷ active minutes, weighted across the entire period. A short interval can produce a high rate; this measures activity, not learning or mastery. Times use this device’s timezone.</p>
    <p class="fine-print">No names, typed answers, or words are recorded here. Data stays in this browser and can disappear if site data is cleared. Other devices and browser profiles have separate records. Updates every five seconds.</p></section>`;
  function render() {
    const records = [];
    let failed = false;
    try {
      const storage = window.localStorage;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(ACTIVITY_PREFIX)) {
          try { records.push(JSON.parse(storage.getItem(key))); } catch { failed = true; }
        }
      }
    } catch { failed = true; }
    const minutes = combineMinutes(records);
    const total = summarize(minutes);
    document.querySelector('#tracker-notice').textContent = failed ? 'Some activity could not be read. These totals may be incomplete.' : Object.keys(minutes).length ? '' : 'No activity recorded yet. Use the practice page in this browser to get started.';
    document.querySelector('#tracker-totals').innerHTML = `<div><strong>${duration(total.activeMs)}</strong><span>Active time</span></div><div><strong>${total.answers}</strong><span>Submitted answers</span></div><div><strong>${number(total.perMinute)}</strong><span>Answers per active minute</span></div>`;
    document.querySelector('#tracker-rollups').innerHTML = rollups(minutes, document.querySelector('#tracker-period').value).map(row => `<tr><th scope="row">${row.date}</th><td>${duration(row.activeMs)}</td><td>${row.answers}</td><td>${row.correct}</td><td>${number(row.perMinute)}</td></tr>`).join('');
    document.querySelector('#tracker-minutes').innerHTML = Object.entries(minutes).sort(([a], [b]) => Number(b) - Number(a)).slice(0, 60).map(([time, entry]) => {
      const row = summarize({ [time]: entry });
      return `<tr><th scope="row">${new Date(Number(time)).toLocaleString()}</th><td>${duration(row.activeMs)}</td><td>${row.answers}</td><td>${number(row.perMinute)}</td></tr>`;
    }).join('');
  }
  document.querySelector('#tracker-period').addEventListener('change', render);
  window.addEventListener('storage', render);
  window.setInterval(render, 5000);
  render();
}
