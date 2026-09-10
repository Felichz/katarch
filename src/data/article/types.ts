export type Block =
  | { type: 'p'; html: string }
  | { type: 'h3'; html: string }
  | { type: 'list'; items: string[] }
  | { type: 'cards'; cols?: 2 | 3; cards: { title: string; tag?: string; html: string }[] }
  | { type: 'figure'; src: string; alt: string; caption: string }
  | { type: 'stats'; items: { value: string; label: string }[] }
  | { type: 'callout'; tone: 'emerald' | 'amber' | 'slate'; title: string; html: string }
  | { type: 'contextDiagram' }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'decisionMap' }
  | { type: 'decision'; id: string }
  | { type: 'spacer' };

export interface Section {
  id: string;
  phase: string;
  title: string;
  blocks: Block[];
}

export interface ArticleContent {
  lang: 'es' | 'en';
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroParagraphs: string[];
  heroMeta: { label: string; value: string }[];
  tocTitle: string;
  sections: Section[];
  closing: { title: string; paragraphs: string[] };
}
