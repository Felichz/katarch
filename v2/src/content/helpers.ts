/** Inline concept term: opens the concept drawer. */
export const c = (id: string, text: string) =>
  `<a class="concept-chip" data-concept="${id}" role="button" tabindex="0">${text}</a>`;

const FILE_ICON =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';

/** Inline citation: opens an original ArchColider document. */
export const doc = (id: string, label = 'doc original') =>
  `<button class="doc-ref" data-doc="${id}" type="button">${FILE_ICON}${label}</button>`;

/** Message tokens in prose, colored with the diagram alphabet. */
export const cmd = (t: string) => `<span class="tok tok--cmd">${t}</span>`;
export const evt = (t: string) => `<span class="tok tok--evt">${t}</span>`;
