/**
 * Shared article interactions — used identically by the ES and EN editions.
 *
 * - Concept chips and original-doc references open native <dialog> modals
 *   (ESC + backdrop close for free). Figures and decisions are inline: the
 *   lens magnifier attaches to every [data-figure-zoom] container, and the
 *   decision map links scroll to the inline decision cards.
 * - Every open modal locks page scroll (the bug the author reported).
 * - Focus is trapped inside the dialog by the browser, restored on close.
 * - TOC highlights the section currently in view.
 */

let openTrigger: HTMLElement | null = null;

// ── Original-doc language state: one shared state for every doc modal ──
// Persisted in a cookie (katarch-doc-lang=es|en, 1 year). Default follows the
// page edition until the reader toggles.
type DocLang = 'es' | 'en';
const DOC_LANG_COOKIE = 'katarch-doc-lang';

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string) {
  try {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    /* cookies unavailable: state stays per-page */
  }
}

function getDocLang(): DocLang {
  const c = readCookie(DOC_LANG_COOKIE);
  if (c === 'es' || c === 'en') return c;
  return document.documentElement.lang === 'es' ? 'es' : 'en';
}

function applyDocLang(lang: DocLang) {
  document.querySelectorAll<HTMLDivElement>('[data-doc-content-es]').forEach((el) => {
    el.hidden = lang !== 'es';
  });
  document.querySelectorAll<HTMLDivElement>('[data-doc-content-en]').forEach((el) => {
    el.hidden = lang !== 'en';
  });
  document.querySelectorAll<HTMLElement>('[data-doc-title-es]').forEach((el) => {
    el.hidden = lang !== 'es';
  });
  document.querySelectorAll<HTMLElement>('[data-doc-title-en]').forEach((el) => {
    el.hidden = lang !== 'en';
  });
  document.querySelectorAll<HTMLElement>('[data-doc-note]').forEach((el) => {
    el.hidden = lang !== 'es';
  });
  document.querySelectorAll<HTMLButtonElement>('[data-doc-lang-toggle]').forEach((b) => {
    b.textContent = lang === 'es' ? 'Ver original en inglés' : 'Ver en español';
  });
}

applyDocLang(getDocLang());

function lockScroll() {
  const sb = document.body.style.getPropertyValue('scrollbar-gutter');
  if (!sb) document.body.style.setProperty('scrollbar-gutter', 'stable');
  const sw = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (sw > 0) document.body.style.paddingRight = `${sw}px`;
}

function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function openDialog(id: string, trigger: HTMLElement) {
  const dlg = document.getElementById(id) as HTMLDialogElement | null;
  if (!dlg) return;
  openTrigger = trigger;
  lockScroll();
  dlg.showModal();
}

function closeDialog(dlg: HTMLDialogElement) {
  dlg.close();
}

// Global click delegation
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // Close buttons
  if (target.closest('[data-close-modal]')) {
    const dlg = target.closest('dialog');
    if (dlg) closeDialog(dlg);
    return;
  }

  // Backdrop click closes (native dialog backdrop clicks report target === dialog)
  if (target instanceof HTMLDialogElement) {
    const rect = target.getBoundingClientRect();
    const inside = target.querySelector('.modal-card')?.getBoundingClientRect();
    if (
      inside &&
      (e.clientX < inside.left ||
        e.clientX > inside.right ||
        e.clientY < inside.top ||
        e.clientY > inside.bottom)
    ) {
      closeDialog(target);
      return;
    }
  }

  // Concept chips
  const chip = target.closest<HTMLElement>('.concept-chip');
  if (chip?.dataset.concept) {
    openDialog(`concept-${chip.dataset.concept}`, chip);
    return;
  }

  // Figure reading guides and ADR references are plain links/inline content
  // now (guides render under each figure; ADR mentions link to GitHub), so
  // no interception is needed for them.

  // Original-doc references -> doc viewer modal
  const docRef = target.closest<HTMLElement>('.doc-ref');
  if (docRef?.dataset.doc) {
    const dlg = document.querySelector(
      `dialog[data-doc-dialog="${docRef.dataset.doc}"]`,
    ) as HTMLDialogElement | null;
    if (dlg) {
      openTrigger = docRef;
      lockScroll();
      dlg.showModal();
    }
    return;
  }

  // Doc language toggle: shared state across ALL doc modals, persisted in a cookie
  const langToggle = target.closest<HTMLElement>('[data-doc-lang-toggle]');
  if (langToggle) {
    const next: DocLang = getDocLang() === 'es' ? 'en' : 'es';
    writeCookie(DOC_LANG_COOKIE, next);
    applyDocLang(next);
    return;
  }
});

// Keyboard: Enter/Space on non-button interactive elements
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return;
  if (el.classList.contains('concept-chip') || el.classList.contains('doc-ref')) {
    e.preventDefault();
    el.click();
  }
});

// Restore scroll + focus when any dialog closes.
// Some embedded webviews never fire the dialog 'close' event, so watch the
// `open` attribute directly — engine-independent.
const dialogObserver = new MutationObserver(() => {
  if (!document.querySelector('dialog[open]')) {
    unlockScroll();
    openTrigger?.focus?.();
    openTrigger = null;
  }
});
for (const dlg of document.querySelectorAll('dialog')) {
  dialogObserver.observe(dlg, { attributes: true, attributeFilter: ['open'] });
}

// Lens magnifier on figure-guide diagrams: shows the image at 100% of its
// original scale around the cursor. Skipped when the diagram already fits
// at 1:1 (the lens would add nothing).
const LENS_RADIUS = 170;
for (const zoom of document.querySelectorAll<HTMLElement>('[data-figure-zoom]')) {
  const img = zoom.querySelector('img');
  const lens = zoom.querySelector<HTMLElement>('.figure-lens');
  const hint = zoom.querySelector<HTMLElement>('.figure-lens-hint');
  if (!img || !lens) continue;
  lens.style.width = `${LENS_RADIUS * 2}px`;
  lens.style.height = `${LENS_RADIUS * 2}px`;
  let lensOff = false;

  const move = (e: MouseEvent) => {
    const rect = img.getBoundingClientRect();
    const zoomRect = zoom.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    const scale = img.naturalWidth / rect.width;
    if (!Number.isFinite(scale) || scale <= 1.05) {
      lens.hidden = true;
      if (hint) hint.hidden = true;
      return;
    }
    if (hint) {
      hint.style.left = `${e.clientX - zoomRect.left}px`;
      hint.style.top = `${e.clientY - zoomRect.top + LENS_RADIUS + 10}px`;
      hint.hidden = false;
    }
    if (lensOff) {
      lens.hidden = true;
      return;
    }
    lens.hidden = false;
    lens.style.left = `${e.clientX - zoomRect.left - LENS_RADIUS}px`;
    lens.style.top = `${e.clientY - zoomRect.top - LENS_RADIUS}px`;
    lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    lens.style.backgroundSize = `${img.naturalWidth}px ${img.naturalHeight}px`;
    lens.style.backgroundPosition = `${LENS_RADIUS - x * scale}px ${LENS_RADIUS - y * scale}px`;
  };
  zoom.addEventListener('mouseenter', move);
  zoom.addEventListener('mousemove', move);
  zoom.addEventListener('click', () => {
    lensOff = !lensOff;
    if (lensOff) lens.hidden = true;
  });
  zoom.addEventListener('mouseleave', () => {
    lens.hidden = true;
    if (hint) hint.hidden = true;
  });
}

// TOC rail: expand/collapse (persisted), dot tooltips, active section
const tocCard = document.querySelector<HTMLElement>('[data-toc-card]');
const tocFull = document.querySelector<HTMLElement>('[data-toc-full]');
const tocTooltip = document.querySelector<HTMLElement>('[data-toc-tooltip]');
const TOC_KEY = 'katarch-toc-expanded';

function setTocExpanded(expanded: boolean) {
  if (!tocCard || !tocFull) return;
  if (expanded) {
    tocCard.setAttribute('data-expanded', '');
    tocFull.hidden = false;
  } else {
    tocCard.removeAttribute('data-expanded');
    tocFull.hidden = true;
  }
  try {
    localStorage.setItem(TOC_KEY, expanded ? '1' : '0');
  } catch {
    /* storage unavailable */
  }
}

if (tocCard) {
  try {
    setTocExpanded(localStorage.getItem(TOC_KEY) === '1');
  } catch {
    /* default collapsed */
  }
  tocCard.querySelector('[data-toc-expand]')?.addEventListener('click', () =>
    setTocExpanded(true),
  );
  tocCard.querySelector('[data-toc-collapse]')?.addEventListener('click', () =>
    setTocExpanded(false),
  );
}

if (tocTooltip) {
  for (const dot of document.querySelectorAll<HTMLElement>('.toc-dot')) {
    dot.addEventListener('mouseenter', () => {
      const label = dot.dataset.tooltip ?? '';
      if (!label) return;
      tocTooltip.textContent = label;
      tocTooltip.hidden = false;
      const r = dot.getBoundingClientRect();
      tocTooltip.style.left = `${r.right + 10}px`;
      tocTooltip.style.top = `${r.top + r.height / 2}px`;
    });
    dot.addEventListener('mouseleave', () => {
      tocTooltip.hidden = true;
    });
  }
}

// Active section highlighting (rail dots + expanded items)
const tocLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('[data-toc]'),
);
if (tocLinks.length > 0 && 'IntersectionObserver' in window) {
  const visible = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) visible.add(id);
        else visible.delete(id);
      }
      const activeId = tocLinks.find((l) => visible.has(l.dataset.toc!))?.dataset.toc;
      tocLinks.forEach((l) =>
        l.classList.toggle('active', l.dataset.toc === activeId),
      );
    },
    { rootMargin: '-15% 0px -70% 0px' },
  );
  document.querySelectorAll('[data-section]').forEach((s) => io.observe(s));
}
