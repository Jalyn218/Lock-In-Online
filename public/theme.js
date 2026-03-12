// ── THEME TOGGLE ──
const themes = [
  'dark', 'ember', 'ivory',
  'clear-dark', 'slate', 'clear-light',
  'rose', 'rose-light', 'ocean',
  'sand', 'moss', 'noir',
  'lavender', 'crimson'
];

const labels = {
  'dark':        '🕯 Ember',
  'ember':       '🤍 Ivory',
  'ivory':       '◼ Clear Dark',
  'clear-dark':  '🔷 Slate',
  'slate':       '☀ Clear Light',
  'clear-light': '🌸 Rose',
  'rose':        '🌷 Rose Light',
  'rose-light':  '🌊 Ocean',
  'ocean':       '🏜 Sand',
  'sand':        '🌿 Moss',
  'moss':        '⬛ Noir',
  'noir':        '💜 Lavender',
  'lavender':    '🔴 Crimson',
  'crimson':     '🕯 Dark',
};

// theme.js — inject button into every page automatically
const topBar = document.querySelector('.top-bar');
if (topBar) {
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.className = 'theme-btn';
  topBar.insertBefore(btn, topBar.querySelector('.live-badge'));
}

// then the rest of your theme JS below...
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.textContent = labels[savedTheme];

  themeBtn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'dark';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    applyTheme(next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = labels[next];
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? '' : theme);
}