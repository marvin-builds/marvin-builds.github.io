// Core interactions (spec §5–§15): culture and the wipe, language, scheme, stations, the technology filter, e-mail,
// anchors, the light field and the command palette. No dependencies; motion.ts adds the optional motion.
import { COMMANDS, UI } from '../i18n/ui';
import { assembleAddress } from '../lib/email';
import { readout, type Lang, type StationLike } from '../lib/experience';
import { filterCommands, groupCommands } from '../lib/palette';
import { shortcutLabel } from '../lib/shortcut';
import { motion, motionOff, motionOn } from './motion';

type Culture = 'professional' | 'personal';
type Scheme = 'light' | 'dark' | 'auto';

const html = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string | null) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const mqDark = matchMedia('(prefers-color-scheme: dark)');
const mqFine = matchMedia('(pointer: fine)');
const mqWide = matchMedia('(min-width: 1100px)');
const rm = () => mqReduce.matches;
const lang = (): Lang => (html.lang === 'de' ? 'de' : 'en');
const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || '';

/* ---------------- technology filter: a panel on wide screens, a collapsed disclosure on narrow ones ---------------- */
const skills = $<HTMLDetailsElement>('#skills');
const syncSkills = () => { skills.open = mqWide.matches; };
mqWide.addEventListener('change', syncSkills);
skills.addEventListener('toggle', () => { if (mqWide.matches && !skills.open) skills.open = true; });

/* ---------------- stations: expand in place ---------------- */
$('#stations').addEventListener('click', (e) => {
  const b = (e.target as Element).closest('button.st-head');
  if (!b) return;
  const li = b.closest('.station')!, open = !li.classList.contains('open');
  li.classList.toggle('open', open);
  b.setAttribute('aria-expanded', String(open));
  setTimeout(() => motion.refresh(), 520);
});

const stationData = (li: HTMLElement): StationLike => ({
  id: li.dataset.id!, org: li.dataset.org!, from: li.dataset.from!, to: li.dataset.to || null, tech: [],
});

let active: string | null = null;
function setSkill(k: string | null) {
  active = k;
  $$('#skill-list button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.skill === k)));
  const hits: StationLike[] = [];
  $$('.station').forEach((li) => {
    const m = !!k && li.dataset.skills!.split(' ').includes(k);
    li.classList.toggle('lit', m);
    li.classList.toggle('dim', !!k && !m);
    $$('.st-tech [data-k]', li).forEach((s) => s.classList.toggle('hit', s.dataset.k === k));
    if (m) hits.push(stationData(li));
  });
  const out = $('#skill-out');
  const btn = k ? $(`#skill-list [data-skill="${k}"]`) : null;
  const label = btn ? (lang() === 'de' ? btn.dataset.labelDe! : btn.dataset.labelEn!) : '';
  $('#skills-on').textContent = k ? `: ${label}` : '';
  out.textContent = '';
  if (!k) return;
  out.append(readout(label, hits, lang()));
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.id = 'skill-clear';
  clear.textContent = UI.experience.clear[lang()];
  clear.onclick = () => { setSkill(null); btn?.focus(); };
  out.append(clear);
}
$('#skill-list').addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLElement>('button[data-skill]');
  if (b) setSkill(active === b.dataset.skill ? null : b.dataset.skill!);
});

/* ---------------- culture, language, scheme ---------------- */
function sync() {
  const l = lang();
  $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
  $$('[data-set-culture]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setCulture === html.dataset.culture)));
  $('#lang-group').setAttribute('aria-label', UI.lang.label[l]);
  $('#culture-ctl').setAttribute('aria-label', UI.culture.label[l]);
  $('#scheme-ctl').setAttribute('aria-label', UI.scheme.label[l]);
  $('#nav').setAttribute('aria-label', UI.nav.label[l]);
  const pb = $('#open-palette');
  pb.setAttribute('aria-label', UI.palette.open[l]);
  pb.title = UI.palette.title[l];
  $('#kbd-hint').textContent = shortcutLabel(platform, l);
  $$<HTMLImageElement>('img[data-alt-en]').forEach((i) => { i.alt = (l === 'de' ? i.dataset.altDe : i.dataset.altEn)!; });
  const q = $<HTMLInputElement>('#pal-q');
  q.placeholder = UI.palette.placeholder[l];
  q.setAttribute('aria-label', UI.palette.search[l]);
  html.classList.toggle('dark', html.dataset.scheme === 'dark' || (html.dataset.scheme !== 'light' && mqDark.matches));
  // night until a choice is stored; 'auto' follows the system, and the switch shows the scheme in effect
  const dark = html.classList.contains('dark');
  $$('[data-set-scheme]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.setScheme === 'dark') === dark)));
  if (active) setSkill(active);
  measureYears();
}

function measureYears() {
  // kept as a multiple of the numerals' size, so the column grows with them while a resize is still running
  const st = $('#stations');
  st.style.removeProperty('--yw');
  const w = Math.max(...$$('.st-years', st).map((e) => { const r = document.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect().width; }));
  const f = parseFloat(getComputedStyle($('.st-years', st)).fontSize);
  if (w > 0 && f > 0) st.style.setProperty('--yw', `calc(var(--yf) * ${((w + 4) / f).toFixed(3)})`);
}
let tYears = 0;
addEventListener('resize', () => { clearTimeout(tYears); tYears = window.setTimeout(measureYears, 120); });

/* the chosen tone is counted as an anonymous GoatCounter event (named in the footer colophon) */
const countTone = (c: Culture) =>
  (window as Window & { goatcounter?: { count?: (o: { path: string; title: string; event: boolean }) => void } }).goatcounter?.count?.({
    path: `tone-${c}`, title: `Tone: ${c}`, event: true,
  });

function apply(c: Culture) {
  countTone(c);
  delete html.dataset.hover;
  html.dataset.culture = c;
  html.dataset.answered = 'true';
  store.set('mm-culture', c);
  sync();
  measureBrand();
}

function themeTo(c: Culture, fromGate = false) {
  if (c === html.dataset.culture && html.dataset.answered === 'true') return;
  const focusCtl = () => { if (fromGate) $(`#culture-ctl [data-set-culture="${c}"]`).focus({ preventScroll: true }); };
  if (!document.startViewTransition) { apply(c); focusCtl(); motion.refresh(); return; }
  // decode the target culture's hero photograph first (max 400ms), so the new snapshot never shows an empty band
  const img = $<HTMLImageElement>(c === 'personal' ? '.hero .ph-per img' : '.hero .ph-pro img');
  const ready = img?.decode ? img.decode().catch(() => {}) : Promise.resolve();
  Promise.race([ready, new Promise((r) => setTimeout(r, 400))]).then(() => runWipe(c, fromGate, focusCtl));
}

function runWipe(c: Culture, fromGate: boolean, focusCtl: () => void) {
  const mode = rm() ? 'vt-fade' : 'vt-wipe';
  const morph = fromGate && mode === 'vt-wipe';
  const pick = $(`.pick[data-pick="${c}"]`), twin = $(`#culture-ctl [data-set-culture="${c}"]`);
  motion.stop();
  html.classList.add(mode);
  if (morph) { html.classList.add('vt-gate'); pick.style.viewTransitionName = 'pick'; }
  const t = document.startViewTransition(() => {
    apply(c);
    focusCtl();
    if (morph) { pick.style.viewTransitionName = ''; if (twin.offsetParent) twin.style.viewTransitionName = 'pick'; }
  });
  t.finished.finally(() => {
    html.classList.remove(mode, 'vt-gate');
    twin.style.viewTransitionName = '';
    motion.start();
    motion.refresh();
  });
}
$$('.pick').forEach((b) => b.addEventListener('click', () => themeTo(b.dataset.pick as Culture, true)));
$$('[data-set-culture]').forEach((b) => b.addEventListener('click', () => themeTo(b.dataset.setCulture as Culture)));

function setLang(l: Lang) {
  html.lang = l;
  document.title = document.querySelector('title')!.dataset[l]!;
  store.set('mm-lang', l);
  sync();
}
$$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang as Lang)));

/* day / night: 'light' | 'dark' stores the choice; 'auto' follows the system */
function setScheme(s: Scheme) {
  const change = () => { store.set('mm-scheme', s); if (s !== 'auto') html.dataset.scheme = s; else delete html.dataset.scheme; sync(); };
  const before = html.classList.contains('dark'), after = s === 'auto' ? mqDark.matches : s === 'dark';
  if (before === after || !document.startViewTransition || rm()) { change(); return; }
  html.classList.add('vt-scheme');
  document.startViewTransition(change).finished.finally(() => html.classList.remove('vt-scheme'));
}
$$('[data-set-scheme]').forEach((b) => b.addEventListener('click', () => setScheme(b.dataset.setScheme as Scheme)));
mqDark.addEventListener('change', sync);

/* magnetic pull on the two answers only (fine pointer, motion allowed) */
const gate = $('#gate');
gate.addEventListener('pointermove', (e) => {
  if (!mqFine.matches || rm()) return;
  $$('.pick', gate).forEach((b) => {
    const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), reach = 80 + r.width / 2;
    const k = d < reach ? 1 - d / reach : 0;
    b.style.translate = `${(dx / (d || 1)) * 6 * k}px ${(dy / (d || 1)) * 6 * k}px`;
  });
});
gate.addEventListener('pointerleave', () => $$('.pick', gate).forEach((b) => { b.style.translate = ''; }));
/* hovering an answer tints the lamp with the culture it leads to; apply() clears it, so the lamp eases back */
$$('.pick', gate).forEach((b) => {
  b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') html.dataset.hover = b.dataset.pick; });
  b.addEventListener('pointerleave', () => { delete html.dataset.hover; });
});

/* ---------------- e-mail: assembled on demand, never in the HTML ---------------- */
const revealBtn = $('#reveal-mail');
const parts: string[] = JSON.parse(revealBtn.dataset.parts!);
const mailText: Record<'copy' | 'copied' | 'status' | 'fallback', { en: string; de: string }> = JSON.parse(revealBtn.dataset.strings!);
const mail = () => assembleAddress(parts);
function revealMail(focus: boolean) {
  const line = $('#mail-line');
  const a = document.createElement('a');
  a.id = 'mail-link';
  a.href = `mailto:${mail()}`;
  a.textContent = mail();
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy';
  copy.id = 'copy-mail';
  copy.textContent = mailText.copy[lang()];
  copy.addEventListener('click', copyMail);
  line.replaceChildren(a, copy);
  if (focus) a.focus();
}
let tCopy = 0;
async function copyMail() {
  if (!document.getElementById('mail-link')) revealMail(false);
  const btn = $('#copy-mail');
  try {
    await navigator.clipboard.writeText(mail());
    btn.textContent = mailText.copied[lang()];
    $('#mail-status').textContent = mailText.status[lang()];
  } catch {
    btn.textContent = mailText.fallback[lang()];
  }
  clearTimeout(tCopy);
  tCopy = window.setTimeout(() => { const b = document.getElementById('copy-mail'); if (b) b.textContent = mailText.copy[lang()]; }, 1800);
}
revealBtn.addEventListener('click', () => revealMail(true));

/* ---------------- anchors that keep focus (through Lenis when it runs) ---------------- */
function scrollToEl(el: HTMLElement) {
  const top = el.id === 'top', off = parseInt(getComputedStyle(html).scrollPaddingTop) || 80;
  const lenis = motion.lenis;
  if (lenis) lenis.scrollTo(top ? 0 : el, { offset: top ? 0 : -off, duration: 1.1 });
  else window.scrollTo({ top: top ? 0 : el.getBoundingClientRect().top + scrollY - off, behavior: rm() ? 'auto' : 'smooth' });
  (top ? $('#main') : el).focus({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a[href^="#"]');
  if (!a) return;
  const el = document.getElementById(a.getAttribute('href')!.slice(1));
  if (!el) return;
  e.preventDefault();
  scrollToEl(el);
  history.replaceState(null, '', a.getAttribute('href'));
});

/* ---------------- header: the brand fades in once the name has scrolled away ---------------- */
const nameEl = $('.name');
const measureBrand = () =>
  html.style.setProperty('--bw', `${$('.brand').offsetWidth + (parseFloat(getComputedStyle($('.site-header')).columnGap) || 24)}px`);
const onScroll = () => html.classList.toggle('scrolled', nameEl.getBoundingClientRect().bottom < 72);
addEventListener('scroll', onScroll, { passive: true });

/* ---------------- light field: the cursor is the lamp ---------------- */
/* One layer. It follows a fine pointer (rAF, lerp .08); after IDLE ms without movement, or when the pointer leaves
   the window, it fades out where it is. The next movement re-places it at the pointer while invisible and fades in. */
const light = $('.light'), IDLE = 2800;
let lx = 0, ly = 0, tx = 0, ty = 0, raf = 0, idle = 0;
const put = () => { light.style.setProperty('--lx', `${lx.toFixed(1)}px`); light.style.setProperty('--ly', `${ly.toFixed(1)}px`); };
function step() {
  lx += (tx - lx) * 0.08;
  ly += (ty - ly) * 0.08;
  put();
  raf = Math.abs(tx - lx) + Math.abs(ty - ly) > 0.6 ? requestAnimationFrame(step) : 0;
}
function lampOff() { clearTimeout(idle); light.classList.remove('on'); }
function lampAt(x: number, y: number) {
  tx = x;
  ty = y;
  if (!light.classList.contains('on')) { lx = x; ly = y; put(); cancelAnimationFrame(raf); raf = 0; light.classList.add('on'); }
  else if (!raf) raf = requestAnimationFrame(step);
  clearTimeout(idle);
  idle = window.setTimeout(lampOff, IDLE);
}
addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && mqFine.matches && !rm()) lampAt(e.clientX, e.clientY); }, { passive: true });
document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) lampOff(); });
addEventListener('blur', lampOff);
/* keyboard: focusing a station lights it the same way (one lamp, no second layer) */
$('#stations').addEventListener('focusin', (e) => {
  const t = e.target as HTMLElement;
  if (!mqFine.matches || rm() || !t.matches(':focus-visible')) return;
  const r = t.getBoundingClientRect();
  lampAt(r.left + Math.min(r.width * 0.3, 280), r.top + r.height / 2);
});

/* ---------------- motion preference ---------------- */
function applyMotion(first = false) {
  html.classList.toggle('rm', rm());
  if (rm()) { motionOff(); lampOff(); } else void motionOn(first && html.classList.contains('intro'));
}
mqReduce.addEventListener('change', () => applyMotion());

/* ---------------- command palette ---------------- */
const pal = $<HTMLDialogElement>('#palette'), q = $<HTMLInputElement>('#pal-q'), list = $('#pal-list');
const go = (id: string) => () => scrollToEl(document.getElementById(id)!);
const ACTIONS: Record<(typeof COMMANDS)[number]['id'], () => void> = {
  'go-top': go('top'), 'go-experience': go('experience'), 'go-how': go('how'), 'go-contact': go('contact'),
  'tone-pro': () => themeTo('professional'), 'tone-per': () => themeTo('personal'),
  'scheme-light': () => setScheme('light'), 'scheme-dark': () => setScheme('dark'), 'scheme-auto': () => setScheme('auto'),
  'lang-de': () => setLang('de'), 'lang-en': () => setLang('en'),
  'copy-mail': () => { go('contact')(); void copyMail(); },
  'open-github': () => window.open($<HTMLAnchorElement>('.reach a[href^="https://github.com"]').href, '_blank', 'noopener'),
};
let sel = 0, shown: (typeof COMMANDS)[number][] = [...COMMANDS], back: HTMLElement | null = null;
function renderPal() {
  const l = lang();
  shown = filterCommands([...COMMANDS], q.value, l);
  sel = Math.min(sel, Math.max(0, shown.length - 1));
  list.replaceChildren();
  groupCommands(shown, l).forEach((g, j) => {
    const li = document.createElement('li');
    li.className = 'grp';
    li.setAttribute('role', 'group');
    li.setAttribute('aria-labelledby', `gh-${j}`);
    const h = document.createElement('span');
    h.className = 'gh';
    h.id = `gh-${j}`;
    h.textContent = g.header;
    const ul = document.createElement('ul');
    ul.setAttribute('role', 'none');
    for (const c of g.items) {
      const k = shown.indexOf(c);
      const o = document.createElement('li');
      o.setAttribute('role', 'option');
      o.id = `opt-${k}`;
      o.dataset.i = String(k);
      o.setAttribute('aria-selected', String(k === sel));
      o.textContent = c.name[l];
      ul.append(o);
    }
    li.append(h, ul);
    list.append(li);
  });
  if (shown.length) {
    q.setAttribute('aria-activedescendant', `opt-${sel}`);
    document.getElementById(`opt-${sel}`)!.scrollIntoView({ block: 'nearest' });
  } else {
    const none = document.createElement('li');
    none.className = 'none';
    none.setAttribute('role', 'option');
    none.setAttribute('aria-disabled', 'true');
    none.setAttribute('aria-selected', 'false');
    none.textContent = UI.palette.none[l];
    list.append(none);
    q.removeAttribute('aria-activedescendant');
  }
}
function openPal() {
  back = document.activeElement as HTMLElement | null;
  q.value = '';
  sel = 0;
  renderPal();
  pal.showModal();
  q.focus();
  motion.stop();
}
function run(k: number) {
  const c = shown[k];
  if (!c) return;
  back = null;
  pal.close();
  ACTIONS[c.id]();
}
pal.addEventListener('close', () => { motion.start(); if (back && document.contains(back)) back.focus({ preventScroll: true }); });
q.addEventListener('input', () => { sel = 0; renderPal(); });
q.addEventListener('keydown', (e) => {
  if (!shown.length) return;
  if (e.key === 'ArrowDown') { sel = (sel + 1) % shown.length; renderPal(); e.preventDefault(); }
  if (e.key === 'ArrowUp') { sel = (sel - 1 + shown.length) % shown.length; renderPal(); e.preventDefault(); }
  if (e.key === 'Enter') { e.preventDefault(); run(sel); }
});
list.addEventListener('click', (e) => { const li = (e.target as Element).closest<HTMLElement>('li[data-i]'); if (li) run(+li.dataset.i!); });
pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
$('#open-palette').addEventListener('click', openPal);
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (pal.open) pal.close(); else openPal(); }
  else if (e.key === 'Escape' && active && !pal.open) setSkill(null);
});

/* ---------------- start ---------------- */
syncSkills();
sync();
measureBrand();
onScroll();
applyMotion(true);
(document.fonts?.ready ?? Promise.resolve()).then(() => { measureYears(); measureBrand(); });
setTimeout(() => html.classList.remove('intro'), 2500); // safety: never leave the name hidden
