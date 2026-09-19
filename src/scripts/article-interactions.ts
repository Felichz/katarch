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

  // ── The full-screen lens stage ──
  // One shared overlay: click opens it with the diagram fitted to the screen,
  // lens active, scroll locked; Esc / backdrop click returns to the article.
  const stage = document.querySelector<HTMLElement>('[data-lens-stage]');
  const plate = stage?.querySelector<HTMLElement>('[data-lens-plate]') ?? null;
  const stageImg = stage?.querySelector<HTMLImageElement>('[data-lens-img]') ?? null;
  const stageLens = stage?.querySelector<HTMLElement>('[data-lens-lens]') ?? null;
  const stagePill = stage?.querySelector<HTMLElement>('[data-lens-pill]') ?? null;
  const stageClose = stage?.querySelector<HTMLElement>('[data-lens-close]') ?? null;
  let stageOpener: HTMLElement | null = null;
  let stageOpen = false;
  let stageZoom = 1;
  let stageLast: MouseEvent | null = null;

  const HINT_OFF = isES ? 'clic para activar la lupa' : 'click to enable the lens';
  const HINT_ON = isES
    ? 'scroll para zoom · clic para desactivar la lupa'
    : 'scroll to zoom · click to disable the lens';

  const paintStage = (e: MouseEvent) => {
    if (!stageImg || !stageLens || !plate) return;
    stageLast = e;
    const rect = stageImg.getBoundingClientRect();
    const plateRect = plate.getBoundingClientRect();
    const lensW = Math.max(LENS_MIN_WIDTH, rect.width * 0.5);
    const lensH = LENS_MIN_WIDTH;
    const halfW = lensW / 2;
    const halfH = lensH / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    stageLens.style.width = `${lensW}px`;
    stageLens.style.height = `${lensH}px`;
    if (stagePill) {
      stagePill.textContent = HINT_ON;
      stagePill.style.left = `${e.clientX - plateRect.left}px`;
      stagePill.style.top = `${e.clientY - plateRect.top + halfH + 10}px`;
      stagePill.hidden = false;
    }
    if (!stageImg.complete || !stageImg.naturalWidth) return;
    const scale = (stageImg.naturalWidth / rect.width) * stageZoom;
    stageLens.hidden = false;
    stageLens.style.left = `${e.clientX - plateRect.left - halfW}px`;
    stageLens.style.top = `${e.clientY - plateRect.top - halfH}px`;
    stageLens.style.backgroundImage = `url("${stageImg.currentSrc || stageImg.src}")`;
    stageLens.style.backgroundSize = `${stageImg.naturalWidth * stageZoom}px ${stageImg.naturalHeight * stageZoom}px`;
    stageLens.style.backgroundPosition = `${halfW - x * scale}px ${halfH - y * scale}px`;
  };

  const closeStage = () => {
    if (!stage || !stageOpen) return;
    stageOpen = false;
    stageZoom = 1;
    stage.hidden = true;
    if (stageLens) stageLens.hidden = true;
    if (stagePill) stagePill.hidden = true;
    unlockScroll();
    stageOpener?.focus?.();
    stageOpener = null;
  };

  const openStage = (srcImg: HTMLImageElement, opener: HTMLElement) => {
    if (!stage || !stageImg) return;
    stageOpener = opener;
    stageImg.src = srcImg.currentSrc || srcImg.src;
    stageImg.alt = srcImg.alt;
    // Reserve the diagram's box before the bytes arrive (an unsized img
    // collapses to a sliver): inline style beats the author `width: auto`,
    // pre-scaled to fit the viewport caps exactly as the CSS would.
    const nw = srcImg.naturalWidth || 1200;
    const nh = srcImg.naturalHeight || 800;
    const k = Math.min(
      (window.innerHeight - Math.round(window.innerHeight * 0.16)) / nh,
      (window.innerWidth - 64) / nw,
      1,
    );
    stageImg.style.width = `${Math.round(nw * k)}px`;
    stageImg.style.height = `${Math.round(nh * k)}px`;
    stageOpen = true;
    stageZoom = 1;
    if (stageLens) stageLens.hidden = true;
    if (stagePill) stagePill.hidden = true;
    stage.hidden = false;
    lockScroll();
    stageClose?.focus();
    stageImg.decode().catch(() => {});
  };

  if (stage && plate && stageImg) {
    plate.addEventListener('mousemove', paintStage);
    plate.addEventListener('mouseleave', () => {
      if (stagePill) stagePill.hidden = true;
    });
    plate.addEventListener('click', () => {
      stageLast = null;
    });
    // While the stage is open, the wheel zooms the lens instead of the page
    stage.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        stageZoom = Math.min(6, Math.max(0.5, stageZoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        if (stageLast) paintStage(stageLast);
      },
      { passive: false },
    );
    // Backdrop click closes; clicks on the plate belong to the lens toggle
    stage.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('[data-lens-plate]')) closeStage();
    });
  }
  stageClose?.addEventListener('click', closeStage);

  // ── Inline figures: hover hint, click opens the stage ──
  for (const zoom of document.querySelectorAll<HTMLElement>('[data-figure-zoom]')) {
    const img = zoom.querySelector('img');
    const hint = zoom.querySelector<HTMLElement>('.figure-lens-hint');
    if (!img || !hint) continue;

    const showHint = (e: MouseEvent) => {
      const rect = img.getBoundingClientRect();
      const zoomRect = zoom.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      hint.style.left = `${e.clientX - zoomRect.left}px`;
      hint.style.top = `${e.clientY - zoomRect.top + 24}px`;
      hint.hidden = false;
    };
    zoom.addEventListener('mouseenter', () => {
      // Warm up lazy images so the stage opens with pixels ready.
      if (!img.complete) img.decode().catch(() => {});
    });
    zoom.addEventListener('mousemove', showHint);
    zoom.addEventListener('mouseleave', () => {
      hint.hidden = true;
    });
    zoom.addEventListener('click', () => {
      hint.hidden = true;
      openStage(img, zoom);
    });
  }

  // Esc closes the stage before anything else
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && stageOpen) closeStage();
    },
    true,
  );
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
      // Open by default; only an explicit collapse ('0') keeps it shut.
      setTocExpanded(localStorage.getItem(TOC_KEY) !== '0');
    } catch {
      setTocExpanded(true);
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
