import { textFor } from './text.js';

const root = document.documentElement;

function store(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

function paint() {
  const t = textFor(root.lang);
  document.title = t.page_title;
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t[el.dataset.t]; });
  document.querySelectorAll('[data-t-alt]').forEach((el) => { el.alt = t[el.dataset.tAlt]; });
  document.querySelectorAll('[data-t-label]').forEach((el) => { el.setAttribute('aria-label', t[el.dataset.tLabel]); });
  document.getElementById('lang').lang = root.lang === 'es' ? 'en' : 'es';
  document.getElementById('theme').textContent = root.dataset.theme === 'dark' ? t.toggle_theme_light : t.toggle_theme_dark;
}

document.getElementById('lang').addEventListener('click', () => {
  root.lang = root.lang === 'es' ? 'en' : 'es';
  store('plumb-lang', root.lang);
  paint();
});

document.getElementById('theme').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  store('plumb-theme', root.dataset.theme);
  paint();
});

if (root.lang !== 'es') root.lang = 'en';
if (root.dataset.theme !== 'dark') root.dataset.theme = 'light';
paint();

const lines = [
  ['t-muted', '$ flake-verdict --pipeline 2948453748'],
  ['', '  async confirmation   passed 3/10 re-runs'],
  ['t-fail', '  verdict: flaky (async-wait)'],
  ['t-muted', '→ triage-flow, a GitLab Duo flow started by the pipeline event'],
  ['', '  opened !10  Fix flaky test: async confirmation'],
  ['t-muted', '$ fix-proof !10 --repeat-each=50'],
  ['t-ok', '  50/50 passed'],
  ['t-muted', '$ merge-gate'],
  ['t-ok', '  merged !10 · red to note in 9 min 47 s, no human']
];
const term = document.getElementById('term');
const caret = document.createElement('span');
caret.className = 'caret';
caret.textContent = ' ';
term.append(caret);

function line(cls) {
  const s = document.createElement('span');
  if (cls) s.className = cls;
  term.insertBefore(s, caret);
  return s;
}

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lines.forEach(([cls, text]) => { line(cls).textContent = text + '\n'; });
} else {
  let i = 0;
  const next = () => {
    if (i >= lines.length) return;
    const [cls, text] = lines[i++];
    const s = line(cls);
    let j = 0;
    const type = () => {
      s.textContent = text.slice(0, ++j);
      if (j < text.length) return setTimeout(type, 18);
      s.textContent += '\n';
      setTimeout(next, 350);
    };
    type();
  };
  next();
}
