// Optional motion (spec §10, §16): smooth scroll, parallax and the intro. GSAP, ScrollTrigger and Lenis are imported
// only when motion is allowed, so reduced-motion visitors never download them.
import type Lenis from 'lenis';

type Gsap = typeof import('gsap').gsap;
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger;

let lenis: Lenis | null = null;
let gsap: Gsap | null = null;
let scrollTrigger: ST | null = null;
let ctx: gsap.Context | null = null;
let tick: ((t: number) => void) | null = null;

export const motion = {
  get lenis() {
    return lenis;
  },
  refresh() {
    scrollTrigger?.refresh();
  },
  stop() {
    lenis?.stop();
  },
  start() {
    lenis?.start();
  },
};

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

export async function motionOn(intro: boolean) {
  const html = document.documentElement;
  try {
    const [g, st, l] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
    if (html.classList.contains('rm')) return; // the preference changed while loading
    gsap = g.gsap;
    scrollTrigger = st.ScrollTrigger;
    gsap.registerPlugin(scrollTrigger);
    lenis = new l.default({ lerp: 0.1, anchors: false });
    lenis.on('scroll', scrollTrigger.update);
    tick = (t) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const G = gsap;
    ctx = G.context(() => {
      G.matchMedia().add('(min-width: 768px)', () => {
        // back plane: the photograph drifts slower than the page
        G.to('.hero .band .img', { y: () => innerHeight * 0.08, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        // slot B drifts slightly against the page, its credit with it; C stays put (anchored to the ground)
        $$('.clearing .img').forEach((el) => G.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: el.closest('.clearing'), start: 'top bottom', end: 'bottom top', scrub: true } }));
        const cr = $('.clearing .credit');
        if (cr) {
          const drift = () => cr.parentElement!.offsetHeight * 0.04;
          G.fromTo(cr, { y: () => -drift() }, { y: () => drift(), ease: 'none',
            scrollTrigger: { trigger: '.clearing', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        }
      });
    });
    if (intro) runIntro();
  } finally {
    html.classList.remove('intro');
  }
}

function runIntro() {
  const G = gsap!;
  const lines = $$('.name .ln > span');
  G.set(lines, { yPercent: 110 });
  document.documentElement.classList.remove('intro');
  G.fromTo('.hero .band .plane', { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'scale' });
  G.to(lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.1, clearProps: 'transform' });
}

export function motionOff() {
  ctx?.revert();
  ctx = null;
  if (tick) gsap?.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  document.documentElement.classList.remove('intro');
}
