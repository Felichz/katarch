/**
 * Shared article interactions — used identically by the ES and EN editions.
 *
 * Runs under Astro's ClientRouter (the ES/EN switch swaps the page without a
 * reload), so bindings are split in two layers:
 * - document-level delegation (clicks, keys, swap scroll memory): bound once,
 *   they survive page swaps because `document` and `window` persist;
 * - element-level bindings (lens, TOC, dialog observers, doc language):
 *   re-bound on every `astro:page-load` against the freshly swapped DOM.
 *
 * The scroll position is saved before a swap and restored right after, so
 * switching language keeps the reader exactly where they were.
 */

let openTrigger: HTMLElement | null = null;
let savedScrollY = 0;
// Reader position saved as "section id + offset inside it" rather than a raw
// pixel offset: the ES and EN editions have different text lengths, so the
// same narrative point sits at a different absolute offset in each.
let savedAnchor: { id: string; offset: number } | null = null;

// ── Original-doc language state ──
// The English edition always shows the original document: no cookie, no
// toggle. The Spanish edition defaults to the translation and the reader's
// choice (cookie katarch-doc-lang, 1 year) is shared across every doc modal.
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
  // English article: modals are English, period. Spanish article: the
  // reader's toggle choice (cookie) applies, defaulting to the translation.
  if (document.documentElement.lang !== 'es') return 'en';
  return readCookie(DOC_LANG_COOKIE) === 'en' ? 'en' : 'es';
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

function onDocClick(e: MouseEvent) {
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

  // Figure reading guides and ADR references are inline content and doc-modal
  // openers now: figures render their guide below, ADR mentions open their
  // doc-modal card, so no interception is needed for them.

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
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return;
  if (el.classList.contains('concept-chip') || el.classList.contains('doc-ref')) {
    e.preventDefault();
    el.click();
  }
}

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

// ── Lens magnifier on inline diagrams ──
// Disabled by default: hovering shows a hint, the first click enables the
// lens (fetching the lazy image if needed), the next click disables it.
// The lens shows the image at 100% of its original scale around the cursor
// and spans at least half the diagram's displayed width.
const LENS_MIN_WIDTH = 340; // px floor, so narrow-viewport diagrams keep a usable lens

function bindLens() {
  const isES = document.documentElement.lang !== 'en';
  const HINT_OFF = isES ? 'clic para activar la lupa' : 'click to enable the lens';
  const HINT_ON = isES ? 'clic para desactivar la lupa' : 'click to disable the lens';

  for (const zoom of document.querySelectorAll<HTMLElement>('[data-figure-zoom]')) {
    const img = zoom.querySelector('img');
    const lens = zoom.querySelector<HTMLElement>('.figure-lens');
    const hint = zoom.querySelector<HTMLElement>('.figure-lens-hint');
    if (!img || !lens) continue;
    let lensOn = false;
    let lastEvent: MouseEvent | null = null;

    const paint = (e: MouseEvent) => {
      lastEvent = e;
      const rect = img.getBoundingClientRect();
      const zoomRect = zoom.getBoundingClientRect();
      const lensW = Math.max(LENS_MIN_WIDTH, rect.width * 0.5); // width: >= 50% of the diagram
      const lensH = LENS_MIN_WIDTH; // height stays fixed
      const halfW = lensW / 2;
      const halfH = lensH / 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      lens.style.width = `${lensW}px`;
      lens.style.height = `${lensH}px`;
      if (hint) {
        hint.textContent = lensOn ? HINT_ON : HINT_OFF;
        hint.style.left = `${e.clientX - zoomRect.left}px`;
        hint.style.top = `${e.clientY - zoomRect.top + halfH + 10}px`;
        hint.hidden = false;
      }
      // The lens needs the real pixels: a lazy image that has not been
      // fetched yet simply shows no lens until the click triggers decode().
      if (!lensOn || !img.complete || !img.naturalWidth) {
        lens.hidden = true;
        return;
      }
      const scale = img.naturalWidth / rect.width;
      lens.hidden = false;
      lens.style.left = `${e.clientX - zoomRect.left - halfW}px`;
      lens.style.top = `${e.clientY - zoomRect.top - halfH}px`;
      lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
      lens.style.backgroundSize = `${img.naturalWidth}px ${img.naturalHeight}px`;
      lens.style.backgroundPosition = `${halfW - x * scale}px ${halfH - y * scale}px`;
    };

    zoom.addEventListener('mouseenter', () => {
      // Warm up lazy images: by the time the reader clicks, pixels are ready.
      if (!img.complete) img.decode().catch(() => {});
    });
    zoom.addEventListener('mousemove', paint);
    zoom.addEventListener('mouseleave', () => {
      lens.hidden = true;
      if (hint) hint.hidden = true;
    });
    zoom.addEventListener('click', () => {
      lensOn = !lensOn;
      if (!img.complete) img.decode().catch(() => {});
      if (lastEvent) paint(lastEvent);
      else if (!lensOn) lens.hidden = true;
    });
  }
}

// ── TOC rail: expand/collapse (persisted), dot tooltips, active section ──
const TOC_KEY = 'katarch-toc-expanded';

function bindToc() {
  const tocCard = document.querySelector<HTMLElement>('[data-toc-card]');
  const tocFull = document.querySelector<HTMLElement>('[data-toc-full]');
  const tocTooltip = document.querySelector<HTMLElement>('[data-toc-tooltip]');

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
}

// ── Per-page bindings: run on initial load and after every view-transiton swap ──
function bindPage() {
  openTrigger = null;
  applyDocLang(getDocLang());
  bindLens();
  bindToc();
  for (const dlg of document.querySelectorAll('dialog')) {
    dialogObserver.observe(dlg, { attributes: true, attributeFilter: ['open'] });
  }
}

// ── Document-level bindings: bound exactly once; `window` survives swaps ──
const w = window as typeof window & { __katarchBound?: boolean };
if (!w.__katarchBound) {
  w.__katarchBound = true;
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKeydown);
  document.addEventListener('astro:before-swap', () => {
    savedScrollY = window.scrollY;
    savedAnchor = null;
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.bottom > 0) {
        savedAnchor = { id: s.id, offset: r.top };
        break;
      }
    }
  });
  document.addEventListener('astro:after-swap', () => {
    // Astro scrolls to the top as part of the swap; put the reader back at the
    // same narrative point (same section id in both editions).
    if (savedAnchor) {
      const el = document.getElementById(savedAnchor.id);
      if (el) {
        const r = el.getBoundingClientRect();
        window.scrollTo({
          top: Math.max(0, window.scrollY + r.top - savedAnchor.offset),
          behavior: 'instant',
        });
        return;
      }
    }
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  });
}

document.addEventListener('astro:page-load', bindPage);
