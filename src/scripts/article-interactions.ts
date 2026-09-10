/**
 * Shared article interactions — used identically by the ES and EN editions.
 *
 * - Concept chips, inline decision cards, map entries and ADR references
 *   open native <dialog> modals (ESC + backdrop close for free).
 * - Every open modal locks page scroll (the bug the author reported).
 * - Focus is trapped inside the dialog by the browser, restored on close.
 * - Figures open in a lightbox dialog.
 * - TOC highlights the section currently in view.
 */

const ADR_TO_DECISION: Record<string, string> = {};
// Build adr -> decision id map from the modal shells themselves
for (const dlg of document.querySelectorAll<HTMLElement>('[data-decision-modal]')) {
  const id = dlg.dataset.decisionModal!;
  for (const link of dlg.querySelectorAll<HTMLAnchorElement>('.adr-link')) {
    const m = link.textContent?.match(/ADR\s*(\d+)/i);
    if (m) ADR_TO_DECISION[m[1].padStart(3, '0')] = id;
  }
}

let openTrigger: HTMLElement | null = null;

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

  // ADR references -> mapped decision modal
  const adr = target.closest<HTMLElement>('.adr-ref');
  if (adr?.dataset.adr) {
    const decisionId = ADR_TO_DECISION[adr.dataset.adr];
    if (decisionId) {
      openDialog(`decision-${decisionId}`, adr);
    } else {
      window.open(
        `https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/${adr.dataset.adr}%20`,
        '_blank',
        'noopener',
      );
    }
    return;
  }

  // Decision openers (inline cards + map entries)
  const opener = target.closest<HTMLElement>('[data-decision]');
  if (opener?.dataset.decision) {
    openDialog(`decision-${opener.dataset.decision}`, opener);
    return;
  }

  // Figure lightbox
  const fig = target.closest<HTMLElement>('[data-lightbox]');
  if (fig && !target.closest('figcaption')) {
    const src = fig.dataset.src;
    if (!src) return;
    const img = document.getElementById('lightbox-img') as HTMLImageElement | null;
    const cap = document.getElementById('lightbox-caption');
    const figImg = fig.querySelector('img');
    if (img) {
      img.src = src;
      img.alt = figImg?.alt ?? '';
    }
    if (cap) cap.textContent = fig.dataset.caption ?? '';
    openDialog('lightbox', fig);
  }
});

// Keyboard: Enter/Space on non-button interactive elements
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return;
  if (el.classList.contains('concept-chip') || el.hasAttribute('data-lightbox')) {
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
